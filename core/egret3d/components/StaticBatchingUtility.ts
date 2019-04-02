namespace egret3d {
    //最大允许合并的顶点数，超过就是下一批次
    export const MAX_VERTEX_COUNT_PER_BUFFER: number = 50000;
    //
    const helpVec3_1 = Vector3.create();
    const helpInverseMatrix = Matrix4.create();
    //缓存已经校验过的对象，用于过滤
    const cacheUUIDs: string[] = [];

    let beforeCombineCount: number = 0;

    class CombineInstance {
        public verticesCount: number = 0;
        public indicesCount: number = 0;
        public lightmapIndex: number = -1;
        public primitiveIndices: number[] = [];
        public meshAttribute: { [key: string]: gltf.AttributeSemantics } = {};
        public root: paper.GameObject;
        public materials: (Material | null)[] = [];
        public readonly instances: paper.GameObject[] = [];
    }
    function _copyAccessorBuffer(mesh: Mesh, accessor: number, target: Float32Array, offset: number) {
        const buffer = mesh.createTypeArrayFromAccessor(mesh.getAccessor(accessor)) as Float32Array;
        const count = buffer.length;
        for (let i = 0; i < count; i++) {
            target[offset + i] = buffer[i];
        }
    }

    function _fillBuffer(target: Float32Array, offset: number, count: number, defaultValue: number[]) {
        const defaultValueCount = defaultValue.length;
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < defaultValueCount; j++) {
                target[offset++] = defaultValue[j];
            }
        }
    }
    /**
     * 尝试对场景内所有静态对象合并
     */
    export function combineScene(scene: paper.Scene): void {
        combine(scene.gameObjects);
    }
    /**
     * 尝试合并静态对象列表。
     * @param instances 
     * @param root 
     */
    export function combine(instances: ReadonlyArray<paper.GameObject>): void {
        cacheUUIDs.length = 0;
        beforeCombineCount = 0;
        const allCombines: { [key: string]: CombineInstance[] } = {};
        //1.通过材质填充合并列表
        for (const obj of instances) {
            _colletCombineInstance(obj, allCombines);
        }
        let afterCombineCount = 0;
        //2.相同材质的合并
        for (const key in allCombines) {
            const combines = allCombines[key];
            for (const combine of combines) {
                _combineInstance(combine);
                afterCombineCount++;
            }
        }

        console.log("combine", beforeCombineCount, "to", afterCombineCount, "save", beforeCombineCount - afterCombineCount);
        cacheUUIDs.length = 0;
    }
    /**
     * TODO(root暂时不支持)尝试合并静态对象列表，如果root有值，合并后可以操作root对象的transform，来实现整体移动，旋转，缩放；反之，相同材质列表的第一个对象为合并节点。
     * @param instances 
     * @param root 
     */
    function _colletCombineInstance(target: paper.GameObject, out: { [key: string]: CombineInstance[] }, root?: paper.GameObject) {
        //过滤重复的对象
        if (cacheUUIDs.indexOf(target.uuid) >= 0) {
            return;
        }

        cacheUUIDs.push(target.uuid);
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

        const meshFilter = target.getComponent(MeshFilter);
        const meshRenderer = target.getComponent(MeshRenderer);
        //合并条件判断
        if (!meshFilter || !meshFilter.mesh || !meshRenderer || !meshRenderer.materials || meshRenderer.materials.length < 1) {
            return;
        }

        beforeCombineCount++;
        const materials = meshRenderer.materials;
        const meshData = meshFilter.mesh;

        //合并筛选的条件:层级_光照贴图索引_材质0_材质1... ：256_0_234_532...
        let key: string = target.layer + "_" + meshRenderer.lightmapIndex + "_";
        materials.forEach(e => { key = key + "_" + e!.uuid; });

        if (!out[key]) {
            out[key] = [];
            out[key].push(new CombineInstance());
        }

        const combines = out[key];
        //找相同材质合成列表的最后一个，如果最后一个顶点超过允许最大数了，就新建一个，下个批次处理
        let combine = combines[combines.length - 1];
        if (combine.verticesCount + meshData.vertexCount > MAX_VERTEX_COUNT_PER_BUFFER) {
            combine = new CombineInstance();
            out[key].push(combine);
        }
        //合并节点以传入的对象为优先，如果没有传入，那么以每种材质的第一个对象为准
        if (!combine.root) {
            combine.root = root ? root : target;
            combine.lightmapIndex = meshRenderer.lightmapIndex;
            for (const mat of materials) {
                combine.materials.push(mat);
            }
        }
        //适配最大格式
        const primitives = meshData.glTFMesh.primitives;
        for (let i = 0; i < primitives.length; i++) {
            const primitive = primitives[i];
            for (const attStr in primitives[i].attributes) {
                const attrType = attStr as gltf.AttributeSemantics;
                if (!combine.meshAttribute[attrType]) {
                    combine.meshAttribute[attrType] = attrType;
                }
            }
            //
            if (!combine.primitiveIndices[i]) {
                combine.primitiveIndices[i] = 0;
            }
            const indicesCount = meshData.getAccessorByteLength(meshData.getAccessor(primitive.indices!)) / Uint16Array.BYTES_PER_ELEMENT;
            combine.primitiveIndices[i] += indicesCount;
            combine.indicesCount += indicesCount;
        }
        //
        combine.verticesCount += meshData.vertexCount;
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
        const meshFilter = combineRoot.getOrAddComponent(MeshFilter)!;
        meshFilter.mesh = combineMesh;
        const meshRenderer = combineRoot.getOrAddComponent(MeshRenderer);
        meshRenderer.materials = combineInstance.materials;
    }

    /**
     * 合并拥有共享材质的渲染对象
     * @param combineInstance 
     * @param root 
     */
    function _combineMesh(combineInstance: CombineInstance): Mesh {
        //
        const root = combineInstance.root;
        const meshAttribute = combineInstance.meshAttribute;
        const lightmapScaleOffset = (root.renderer as MeshRenderer).lightmapScaleOffset;
        const combineAttributes: gltf.AttributeSemantics[] = [];

        for (const key in meshAttribute) {
            combineAttributes.push(key as gltf.AttributeSemantics);
        }
        //
        const primitiveIndices = combineInstance.primitiveIndices;
        const combineMesh = Mesh.create(combineInstance.verticesCount, primitiveIndices[0], combineAttributes);
        combineMesh.drawMode = gltf.DrawMode.Dynamic;

        //
        for (let i = 1, l = primitiveIndices.length; i < l; i++) {
            const subLen = primitiveIndices[i];
            //第一个submesh在构造函数中已经添加，需要手动添加后续的
            combineMesh.addSubMesh(subLen, i);
        }

        const combinePosition = combineMesh.getVertices() as Float32Array;
        const combineNormal = combineMesh.getNormals() as Float32Array;
        const combineUV0 = combineMesh.getUVs() as Float32Array;
        const combineUV1 = combineMesh.getAttribute(gltf.AttributeSemantics.TEXCOORD_1) as Float32Array;
        const combineColor0 = combineMesh.getColors() as Float32Array;
        const combineJoint0 = combineMesh.getAttributes(gltf.AttributeSemantics.JOINTS_0) as Float32Array;
        const combineWeight0 = combineMesh.getAttributes(gltf.AttributeSemantics.WEIGHTS_0) as Float32Array;
        //
        helpInverseMatrix.copy(root.transform.worldToLocalMatrix);
        //
        let positonIndex = 0, normalIndex = 0, color0Index = 0, color1Index = 0, uv0Index = 0, uv1Index = 0, jointIndex = 0, weightIndex = 0, indexIndex = 0;
        let startIndex = 0;
        let endIndex = 0;
        for (const instance of combineInstance.instances) {
            const meshFilter = instance.getComponent(MeshFilter)!;
            const meshRenderer = instance.getComponent(MeshRenderer)!;
            const worldMatrix = instance.transform.localToWorldMatrix;
            const mesh = meshFilter.mesh!;
            const orginLightmapScaleOffset = meshRenderer.lightmapScaleOffset;

            const primitives = mesh.glTFMesh.primitives;
            //共享一个的buffer，vbo只处理一个submesh就可以了
            let combineOnce = true;
            for (let i = 0; i < primitives.length; i++) {
                const primitive = primitives[i];
                if (combineOnce) {
                    combineOnce = false;
                    const orginVertexCount = mesh.vertexCount;
                    const orginAttributes = primitives[i].attributes;
                    const positionBuffer = mesh.createTypeArrayFromAccessor(mesh.getAccessor(orginAttributes.POSITION!)) as Float32Array;
                    for (let j = 0, l = positionBuffer.length; j < l; j += 3) {
                        //转换成世界坐标后在转换为合并节点的本地坐标
                        helpVec3_1.fromArray(positionBuffer, j).applyMatrix(worldMatrix).applyMatrix(helpInverseMatrix);

                        combinePosition[positonIndex++] = helpVec3_1.x;
                        combinePosition[positonIndex++] = helpVec3_1.y;
                        combinePosition[positonIndex++] = helpVec3_1.z;
                    }
                    if (meshAttribute[gltf.AttributeSemantics.NORMAL]) {
                        if (orginAttributes.NORMAL) {
                            const normalBuffer = mesh.createTypeArrayFromAccessor(mesh.getAccessor(orginAttributes.NORMAL)) as Float32Array;
                            for (let j = 0, l = normalBuffer.length; j < l; j += 3) {
                                helpVec3_1.fromArray(normalBuffer, j).applyDirection(worldMatrix).applyDirection(helpInverseMatrix);

                                combineNormal[normalIndex++] = helpVec3_1.x;
                                combineNormal[normalIndex++] = helpVec3_1.y;
                                combineNormal[normalIndex++] = helpVec3_1.z;
                            }
                        } else {
                            _fillBuffer(combineNormal, normalIndex, orginVertexCount, [0, 0, 0]);
                            normalIndex += orginVertexCount * 3;
                        }
                    }
                    if (meshAttribute[gltf.AttributeSemantics.TEXCOORD_0]) {
                        if (orginAttributes.TEXCOORD_0) {
                            _copyAccessorBuffer(mesh, orginAttributes.TEXCOORD_0, combineUV0, uv0Index);
                        } else {
                            _fillBuffer(combineUV0, uv0Index, orginVertexCount, [0, 0]);
                        }
                        uv0Index += orginVertexCount * 2;
                    }
                    if (meshAttribute[gltf.AttributeSemantics.TEXCOORD_1]) {
                        if (combineInstance.lightmapIndex >= 0) {
                            //如果有lightmap,那么将被合并的uv1的坐标转换为root下的坐标,有可能uv1没有，那用uv0来算
                            const uvAccessor = orginAttributes.TEXCOORD_1 ? mesh.getAccessor(orginAttributes.TEXCOORD_1) : mesh.getAccessor(orginAttributes.TEXCOORD_0!);
                            const uvBuffer = mesh.createTypeArrayFromAccessor(uvAccessor) as Float32Array;
                            //
                            for (let j = 0, l = uvBuffer.length; j < l; j += 2) {
                                let u = uvBuffer[j + 0];
                                let v = uvBuffer[j + 1];
                                u = ((u * orginLightmapScaleOffset.x + orginLightmapScaleOffset.z) - lightmapScaleOffset.z) / lightmapScaleOffset.x;
                                v = ((v * orginLightmapScaleOffset.y - orginLightmapScaleOffset.y - orginLightmapScaleOffset.w) + lightmapScaleOffset.w + lightmapScaleOffset.x) / lightmapScaleOffset.x;

                                combineUV1[uv1Index++] = u;
                                combineUV1[uv1Index++] = v;
                            }
                        }
                        else {
                            if (orginAttributes.TEXCOORD_1 !== undefined) {
                                _copyAccessorBuffer(mesh, orginAttributes.TEXCOORD_1, combineUV1, uv1Index);
                            }
                            else {
                                _fillBuffer(combineUV1, uv1Index, orginVertexCount, [0, 0]);
                            }
                            uv1Index += orginVertexCount * 2;
                        }
                    }
                    if (meshAttribute[gltf.AttributeSemantics.COLOR_0]) {
                        if (orginAttributes.COLOR_0) {
                            _copyAccessorBuffer(mesh, orginAttributes.COLOR_0, combineColor0, color0Index);
                        } else {
                            _fillBuffer(combineColor0, color0Index, orginVertexCount, [1, 1, 1, 1]);
                        }
                        color0Index += orginVertexCount * 4;
                    }
                    if (meshAttribute[gltf.AttributeSemantics.COLOR_1]) {
                        if (orginAttributes.COLOR_1) {
                            _copyAccessorBuffer(mesh, orginAttributes.COLOR_1, combineColor0, color1Index);
                        } else {
                            _fillBuffer(combineColor0, color1Index, orginVertexCount, [1, 1, 1, 1]);
                        }
                        color1Index += orginVertexCount * 4;
                    }
                    if (meshAttribute[gltf.AttributeSemantics.JOINTS_0]) {
                        if (orginAttributes.JOINTS_0) {
                            _copyAccessorBuffer(mesh, orginAttributes.JOINTS_0, combineJoint0, jointIndex);
                        }
                        else {
                            _fillBuffer(combineJoint0, jointIndex, orginVertexCount, [0, 0, 0, 0]);
                        }
                        jointIndex += orginVertexCount * 4;
                    }
                    if (meshAttribute[gltf.AttributeSemantics.WEIGHTS_0]) {
                        if (orginAttributes.WEIGHTS_0) {
                            _copyAccessorBuffer(mesh, orginAttributes.WEIGHTS_0, combineWeight0, weightIndex);
                        } else {
                            _fillBuffer(combineWeight0, weightIndex, orginVertexCount, [1, 0, 0, 0]);
                        }
                        weightIndex += orginVertexCount * 4;
                    }
                }
                
                const combineIndices = combineMesh.getIndices(i) as Uint16Array;
                const indicesBuffer = mesh.createTypeArrayFromAccessor(mesh.getAccessor(primitive.indices!)) as Uint16Array;
                for (let j = 0, l = indicesBuffer.length; j < l; j++) {
                    const index = indicesBuffer[j] + startIndex;
                    combineIndices[indexIndex++] = index;
                    endIndex = index > endIndex ? index : endIndex;
                }
            }
            startIndex = endIndex + 1;

            meshFilter.mesh = null;
        }        

        return combineMesh;
    }


    /**
     * 尝试对场景内所有静态对象合并
     * @deprecated
     */
    export function autoCombine(scene: paper.Scene): void {
        combine(scene.gameObjects);
    }
}