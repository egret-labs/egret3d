namespace egret3d {
    //最大允许合并的顶点数，超过就是下一批次
    export const MAX_VERTEX_COUNT_PER_BUFFER: number = 50000;
    //
    const helpVec3_1: Vector3 = new Vector3();
    const helpVec3_2: Vector3 = new Vector3();
    const helpInverseMatrix: Matrix = new Matrix();
    //缓存已经校验过的对象，用于过滤
    const cacheInstances: string[] = [];

    let beforeCombineCount: number = 0;
    /**
     * 尝试对场景内所有静态对象合并
     */
    export function autoCombine(scene: paper.Scene): void {
        combine(scene.gameObjects);
    }
    /**
     * 尝试合并静态对象列表。
     * @param instances 
     * @param root 
     */
    export function combine(instances: ReadonlyArray<paper.GameObject>): void {
        cacheInstances.length = 0;
        beforeCombineCount = 0;
        const allCombines: { [key: string]: CombineInstance[] } = {};
        //1.通过材质填充合并列表
        for (const obj of instances) {
            _colletCombineInstance(obj, allCombines);
        }
        console.log("合并前:" + beforeCombineCount);
        let afterCombineCount = 0;
        //2.相同材质的合并
        for (const key in allCombines) {
            const combines = allCombines[key];
            for (const combine of combines) {
                _combineInstance(combine);
                afterCombineCount++;
            }
        }

        console.log("合并后:" + afterCombineCount + "节省:" + (beforeCombineCount - afterCombineCount));

        cacheInstances.length = 0;
    }
    /**
     * TODO(root暂时不支持)尝试合并静态对象列表，如果root有值，合并后可以操作root对象的transform，来实现整体移动，旋转，缩放；反之，相同材质列表的第一个对象为合并节点。
     * @param instances 
     * @param root 
     */
    function _colletCombineInstance(target: paper.GameObject, out: { [key: string]: CombineInstance[] }, root?: paper.GameObject) {
        //过滤重复的对象
        if (cacheInstances.indexOf(target.uuid) >= 0) {
            return;
        }

        cacheInstances.push(target.uuid);
        //
        for (const child of target.transform.children) {
            if (child) {
                _colletCombineInstance(child.gameObject, out, root);
            }
        }
        //不是静态的不考虑合并
        if (!target.isStatic) {
            return;
        }

        const meshFilter = target.getComponent(egret3d.MeshFilter);
        const meshRenderer = target.getComponent(egret3d.MeshRenderer);
        //合并条件判断
        if (!meshFilter || !meshFilter.mesh || !meshRenderer || !meshRenderer.materials || meshRenderer.materials.length < 1) {
            return;
        }

        beforeCombineCount++;
        const materials = meshRenderer.materials;
        const meshData = meshFilter.mesh;

        //合并筛选的条件:光照贴图_材质0_材质1... ：0_234_532...
        let key: string = meshRenderer.lightmapIndex + "_";
        materials.forEach(element => { key = key + "_" + element.uuid; });

        if (!out[key]) {
            out[key] = [];
            out[key].push(new CombineInstance());
        }

        const combines = out[key];
        //找相同材质合成列表的最后一个，如果最后一个顶点超过允许最大数了，就新建一个，下个批次处理
        let combine = combines[combines.length - 1];
        if (combine.vertexCount + meshData.vertexCount > MAX_VERTEX_COUNT_PER_BUFFER) {
            combine = new CombineInstance();
            out[key].push(combine);
        }
        //合并节点以传入的对象为优先，如果没有传入，那么以每种材质的第一个对象为准
        if (!combine.root) {
            combine.root = root ? root : target;
            combine.lightmapIndex = meshRenderer.lightmapIndex;
            combine.lightmapScaleOffset = meshRenderer.lightmapScaleOffset;
        }
        //适配最大格式
        const glTFAsset = meshData.glTFAsset;
        const primitives = meshData.glTFMesh.primitives;
        for (let i = 0; i < primitives.length; i++) {
            const primitive = primitives[i];
            for (const attStr in primitives[i].attributes) {
                const attrType = attStr as gltf.MeshAttributeType;
                if (!combine.meshAttribute[attrType]) {
                    combine.vertexBufferSize += GLTFAsset.getAccessorTypeCount(glTFAsset.getAccessor(primitive.attributes[attStr]).type);
                }
                combine.meshAttribute[attrType] = attrType;
            }

            combine.indexBufferTotalSize += glTFAsset.getBufferLength(glTFAsset.getAccessor(primitive.indices)) / Uint16Array.BYTES_PER_ELEMENT;
        }
        //
        combine.vertexCount += meshData.vertexCount;
        combine.instances.push(target);
    }
    /**
     * 合并拥有共享材质的渲染对象
     * @param combineInstance 
     */
    function _combineInstance(combineInstance: CombineInstance): void {
        const combineMesh = _combineMesh(combineInstance);
        const combineRoot = combineInstance.root;
        //把合成好的放入root中，重新绘制
        if (combineRoot) {
            const meshFilter = combineRoot.getComponent(MeshFilter);
            meshFilter.mesh = combineMesh;
        }
        // for(const instance of combineInstance.instances){
        //     const meshFilter = instance.getComponent(MeshFilter);
        //     meshFilter.mesh = combineMesh;
        // }
    }

    /**
     * 合并拥有共享材质的渲染对象
     * @param combineInstance 
     * @param root 
     */
    function _combineMesh(combineInstance: CombineInstance): Mesh {
        //
        egret3d.Matrix.inverse(combineInstance.root.transform.getWorldMatrix(), helpInverseMatrix);

        const meshAttribute = combineInstance.meshAttribute;
        const lightmapScaleOffset = combineInstance.lightmapScaleOffset;
        const newAttribute: gltf.MeshAttributeType[] = [];
        const tempIndexBuffers: number[][] = [];
        const tempVertexBuffers: { [key: string]: number[] } = {};

        for (const key in meshAttribute) {
            tempVertexBuffers[key] = [];
            newAttribute.push(key as gltf.MeshAttributeType);
        }
        //
        let startIndex = 0;
        let endIndex = 0;
        for (const instance of combineInstance.instances) {
            const meshFilter = instance.getComponent(egret3d.MeshFilter);
            const meshRenderer = instance.getComponent(egret3d.MeshRenderer);
            const worldMatrix = instance.transform.getWorldMatrix();
            const orginLightmapScaleOffset = meshRenderer.lightmapScaleOffset;
            const mesh = meshFilter.mesh;
            const glTFAsset = mesh.glTFAsset;

            const primitives = mesh.glTFMesh.primitives;
            const isSharedBuffer = mesh.isSharedBuffer;
            //共享一个的buffer，vbo只处理一个submesh就可以了
            let combineOnce = true;
            for (let i = 0; i < primitives.length; i++) {
                const primitive = primitives[i];
                if (combineOnce) {
                    combineOnce = !isSharedBuffer;
                    const orginVertexCount = mesh.getVertexCount(i);
                    const orginAttributes = primitives[i].attributes;
                    const positionBuffer = glTFAsset.createTypeArrayFromAccessor(glTFAsset.getAccessor(orginAttributes.POSITION)) as Float32Array;
                    //vertexBuffers
                    for (let j = 0; j < positionBuffer.length; j += 3) {
                        helpVec3_1.x = positionBuffer[j + 0];
                        helpVec3_1.y = positionBuffer[j + 1];
                        helpVec3_1.z = positionBuffer[j + 2];
                        //转换成世界坐标后在转换为合并节点的本地坐标
                        egret3d.Matrix.transformVector3(helpVec3_1, worldMatrix, helpVec3_2);
                        egret3d.Matrix.transformVector3(helpVec3_2, helpInverseMatrix, helpVec3_1);
                        //
                        tempVertexBuffers[gltf.MeshAttributeType.POSITION].push(helpVec3_1.x, helpVec3_1.y, helpVec3_1.z);
                    }
                    //
                    if (meshAttribute[gltf.MeshAttributeType.NORMAL]) {
                        if (orginAttributes.NORMAL) {
                            const normalBuffer = glTFAsset.createTypeArrayFromAccessor(glTFAsset.getAccessor(orginAttributes.NORMAL)) as Float32Array;
                            const target = tempVertexBuffers[gltf.MeshAttributeType.NORMAL];
                            const count = normalBuffer.length;
                            let startIndex = target.length;

                            target.length += count;
                            for (let j = 0; j < count; j += 3) {
                                helpVec3_1.x = normalBuffer[j + 0];
                                helpVec3_1.y = normalBuffer[j + 1];
                                helpVec3_1.z = normalBuffer[j + 2];

                                worldMatrix.transformNormal(helpVec3_1);
                                helpInverseMatrix.transformNormal(helpVec3_1);
                                helpVec3_1.normalize();
                                target[startIndex + j] = helpVec3_1.x;
                                target[startIndex + j + 1] = helpVec3_1.y;
                                target[startIndex + j + 2] = helpVec3_1.z;
                            }
                            // _copyAccessorBufferArray(glTFAsset, orginAttributes.NORMAL, tempVertexBuffers[gltf.MeshAttributeType.NORMAL]);
                        } else {
                            _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.NORMAL], orginVertexCount, [0, 0, 0]);
                        }
                    }
                    if (meshAttribute[gltf.MeshAttributeType.TANGENT]) {
                        if (orginAttributes.TANGENT) {
                            const tangentBuffer = glTFAsset.createTypeArrayFromAccessor(glTFAsset.getAccessor(orginAttributes.TANGENT)) as Float32Array;
                            const target = tempVertexBuffers[gltf.MeshAttributeType.TANGENT];
                            const count = tangentBuffer.length;
                            let startIndex = target.length;

                            target.length += count;
                            for (let j = 0; j < count; j += 3) {
                                helpVec3_1.x = tangentBuffer[j + 0];
                                helpVec3_1.y = tangentBuffer[j + 1];
                                helpVec3_1.z = tangentBuffer[j + 2];

                                worldMatrix.transformNormal(helpVec3_1);
                                helpInverseMatrix.transformNormal(helpVec3_1);
                                helpVec3_1.normalize();
                                
                                target[startIndex + j] = helpVec3_1.x;
                                target[startIndex + j + 1] = helpVec3_1.y;
                                target[startIndex + j + 2] = helpVec3_1.z;
                            }
                            // _copyAccessorBufferArray(glTFAsset, orginAttributes.TANGENT, tempVertexBuffers[gltf.MeshAttributeType.TANGENT]);
                        } else {
                            _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.TANGENT], orginVertexCount, [0, 0, 0, 1]);
                        }
                    }
                    if (meshAttribute[gltf.MeshAttributeType.COLOR_0]) {
                        if (orginAttributes.COLOR_0) {
                            _copyAccessorBufferArray(glTFAsset, orginAttributes.COLOR_0, tempVertexBuffers[gltf.MeshAttributeType.COLOR_0]);
                        } else {
                            _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.COLOR_0], orginVertexCount, [1, 1, 1, 1]);
                        }
                    }
                    if (meshAttribute[gltf.MeshAttributeType.TEXCOORD_0]) {
                        if (orginAttributes.TEXCOORD_0) {
                            _copyAccessorBufferArray(glTFAsset, orginAttributes.TEXCOORD_0, tempVertexBuffers[gltf.MeshAttributeType.TEXCOORD_0]);
                        } else {
                            _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.TEXCOORD_0], orginVertexCount, [0, 0]);
                        }
                    }
                    if (meshAttribute[gltf.MeshAttributeType.TEXCOORD_1]) {
                        if (combineInstance.lightmapIndex >= 0) {
                            //如果有lightmap,那么将被合并的uv1的坐标转换为root下的坐标,有可能uv1没有，那用uv0来算
                            const uvBuffer = orginAttributes.TEXCOORD_1 ?
                                glTFAsset.createTypeArrayFromAccessor(glTFAsset.getAccessor(orginAttributes.TEXCOORD_1)) as Float32Array :
                                glTFAsset.createTypeArrayFromAccessor(glTFAsset.getAccessor(orginAttributes.TEXCOORD_0)) as Float32Array;
                            //
                            for (let j = 0; j < uvBuffer.length; j += 2) {
                                let u = uvBuffer[j + 0];
                                let v = uvBuffer[j + 1];
                                u = ((u * orginLightmapScaleOffset[0] + orginLightmapScaleOffset[2]) - lightmapScaleOffset[2]) / lightmapScaleOffset[0];
                                v = ((v * orginLightmapScaleOffset[1] - orginLightmapScaleOffset[1] - orginLightmapScaleOffset[3]) + lightmapScaleOffset[3] + lightmapScaleOffset[1]) / lightmapScaleOffset[1];

                                tempVertexBuffers[gltf.MeshAttributeType.TEXCOORD_1].push(u, v);
                            }
                        } else {
                            if (orginAttributes.TEXCOORD_1) {
                                _copyAccessorBufferArray(glTFAsset, orginAttributes.TEXCOORD_1, tempVertexBuffers[gltf.MeshAttributeType.TEXCOORD_1]);
                            } else {
                                _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.TEXCOORD_1], orginVertexCount, [0, 0]);
                            }
                        }
                    }
                    if (meshAttribute[gltf.MeshAttributeType.JOINTS_0]) {
                        if (orginAttributes.JOINTS_0) {
                            _copyAccessorBufferArray(glTFAsset, orginAttributes.JOINTS_0, tempVertexBuffers[gltf.MeshAttributeType.JOINTS_0]);
                        } else {
                            _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.JOINTS_0], orginVertexCount, [0, 0, 0, 0]);
                        }
                    }
                    if (meshAttribute[gltf.MeshAttributeType.WEIGHTS_0]) {
                        if (orginAttributes.WEIGHTS_0) {
                            _copyAccessorBufferArray(glTFAsset, orginAttributes.WEIGHTS_0, tempVertexBuffers[gltf.MeshAttributeType.WEIGHTS_0]);
                        } else {
                            _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.WEIGHTS_0], orginVertexCount, [1, 0, 0, 0]);
                        }
                    }
                    if (meshAttribute[gltf.MeshAttributeType.COLOR_1]) {
                        if (orginAttributes.COLOR_1) {
                            _copyAccessorBufferArray(glTFAsset, orginAttributes.COLOR_1, tempVertexBuffers[gltf.MeshAttributeType.COLOR_1]);
                        } else {
                            _fillDefaultArray(tempVertexBuffers[gltf.MeshAttributeType.COLOR_1], orginVertexCount, [1, 1, 1, 1]);
                        }
                    }
                }

                const subIndexBuffer = glTFAsset.createTypeArrayFromAccessor(glTFAsset.getAccessor(primitive.indices)) as Uint16Array;
                // //indexBuffers
                if (!tempIndexBuffers[i]) {
                    tempIndexBuffers[i] = [];
                }
                for (let j = 0; j < subIndexBuffer.length; j++) {
                    const index = subIndexBuffer[j] + startIndex;
                    tempIndexBuffers[i].push(index);
                    endIndex = index > endIndex ? index : endIndex;
                }
            }
            startIndex = endIndex + 1;

            meshFilter.mesh = null;
        }

        const newVertexBuffers = new Float32Array(combineInstance.vertexBufferSize * combineInstance.vertexCount);
        const newIndexBuffers = new Uint16Array(combineInstance.indexBufferTotalSize);
        let iv = 0;
        for (const key in tempVertexBuffers) {
            const arr = tempVertexBuffers[key] as number[];
            for (const v of arr) {
                newVertexBuffers[iv++] = v;
            }
        }
        let ii = 0;
        for (const key in tempIndexBuffers) {
            const arr = tempIndexBuffers[key] as number[];
            for (const v of arr) {
                newIndexBuffers[ii++] = v;
            }
        }

        const combineMesh = new Mesh(newVertexBuffers, newIndexBuffers, tempIndexBuffers[0].length, newAttribute, MeshDrawMode.Static);
        let indicesCount = 0;
        for (let i = 0; i < tempIndexBuffers.length; i++) {
            const subLen = tempIndexBuffers[i].length;
            if (i > 0) {
                //第一个submesh在构造函数中已经添加，需要手动添加手续的
                combineMesh.addSubMesh(indicesCount, subLen, i);
                combineMesh.uploadSubIndexBuffer(i);
            }
            indicesCount += subLen;
        }

        return combineMesh;
    }

    function _copyAccessorBufferArray(gltf: GLTFAsset, accessor: number, target: number[]) {
        const buffer = gltf.createTypeArrayFromAccessor(gltf.getAccessor(accessor)) as Float32Array;
        const count = buffer.length;
        let startIndex = target.length;

        target.length += count;
        for (let i = 0; i < count; i++) {
            target[startIndex + i] = buffer[i];
        }
    }

    function _fillDefaultArray(target: number[], count: number, defaultValue: number[]) {
        let startIndex = target.length;
        const defaultValueCount = defaultValue.length;
        target.length += count * defaultValueCount;

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < defaultValueCount; j++) {
                target[startIndex++] = defaultValue[j];
            }
        }
    }

    class CombineInstance {
        public vertexCount: number = 0;
        public vertexBufferSize: number = 0;
        public indexBufferTotalSize: number = 0;
        public lightmapIndex: number = -1;
        public meshAttribute: { [key: string]: gltf.MeshAttributeType } = {};
        public root: paper.GameObject | null = null;
        public lightmapScaleOffset: Float32Array | null = null;
        public readonly instances: paper.GameObject[] = [];
    }
}