namespace egret3d {
    const _helpTriangleA = Triangle.create();
    const _helpTriangleB = Triangle.create();
    const _helpRaycastInfo = RaycastInfo.create();

    const _attributeNames: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];
    /**
     * 
     */
    export const enum HumanoidMask {
        Head,
        Body,
        LeftArm,
        RightArm,
        LeftHand,
        RightHand,
        LeftLeg,
        RightLeg,
        LeftHandIK,
        RightHandIK,
        LeftFootIK,
        RightFootIK,
    }
    /**
     * 
     */
    export const enum HumanoidJoint {
        Heck = "H_Neck",
        Head = "H_Head",
        LeftEye = "H_LeftEye",
        RightEye = "H_RightEye",
        Jaw = "H_Jaw",

        Hips = "B_Hips",
        Spine = "B_Spine",
        Chest = "B_Chest",
        UpperChest = "B_UpperChest",

        LeftShoulder = "LA_Shoulder",
        LeftUpperArm = "LA_UpperArm",
        LeftLowerArm = "LA_LowerArm",
        LeftHand = "LA_Hand",

        RightShoulder = "RA_Shoulder",
        RightUpperArm = "RA_UpperArm",
        RightLowerArm = "RA_LowerArm",
        RightHand = "RA_Hand",

        LeftUpperLeg = "LL_UpperLeg",
        LeftLowerLeg = "LL_LowerLeg",
        LeftFoot = "LL_Foot",
        LeftToes = "LL_Toes",

        RightUpperLeg = "RL_UpperLeg",
        RightLowerLeg = "RL_LowerLeg",
        RightFoot = "RL_Foot",
        RightToes = "RL_Toes",

        LeftThumbProximal = "LH_ThumbProximal",
        LeftThumbIntermediate = "LH_ThumbIntermediate",
        LeftThumbDistal = "LH_ThumbDistal",
        LeftIndexProximal = "LH_IndexProximal",
        LeftIndexIntermediate = "LH_IndexIntermediate",
        LeftIndexDistal = "LH_IndexDistal",
        LeftMiddleProximal = "LH_MiddleProximal",
        LeftMiddleIntermediate = "LH_MiddleIntermediate",
        LeftMiddleDistal = "LH_MiddleDistal",
        LeftRingProximal = "LH_RingProximal",
        LeftRingIntermediate = "LH_RingIntermediate",
        LeftRingDistal = "LH_RingDistal",
        LeftLittleProximal = "LH_LittleProximal",
        LeftLittleIntermediate = "LH_LittleIntermediate",
        LeftLittleDistal = "LH_LittleDistal",

        RightThumbProximal = "RH_ThumbProximal",
        RightThumbIntermediate = "RH_ThumbIntermediate",
        RightThumbDistal = "RH_ThumbDistal",
        RightIndexProximal = "RH_IndexProximal",
        RightIndexIntermediate = "RH_IndexIntermediate",
        RightIndexDistal = "RH_IndexDistal",
        RightMiddleProximal = "RH_MiddleProximal",
        RightMiddleIntermediate = "RH_MiddleIntermediate",
        RightMiddleDistal = "RH_MiddleDistal",
        RightRingProximal = "RH_RingProximal",
        RightRingIntermediate = "RH_RingIntermediate",
        RightRingDistal = "RH_RingDistal",
        RightLittleProximal = "RH_LittleProximal",
        RightLittleIntermediate = "RH_LittleIntermediate",
        RightLittleDistal = "RH_LittleDistal",
    }
    /**
     * 网格资源。
     */
    export class Mesh extends GLTFAsset implements egret3d.IRaycast {
        /**
         * 创建一个网格。
         * @param vertexCount 
         * @param indexCount 
         * @param attributeNames 
         * @param attributeTypes 
         * @param drawMode 
         */
        public static create(
            vertexCount: number, indexCount: number,
            attributeNames?: gltf.MeshAttribute[] | null, attributeTypes?: { [key: string]: gltf.AccessorType } | null,
            drawMode?: gltf.DrawMode
        ): Mesh;
        public static create(config: GLTF, buffers: Uint32Array[], name: string): Mesh;
        public static create(
            vertexCountOrConfig: number | GLTF, indexCountOrBuffers?: number | Uint32Array[],
            attributeNamesOrName?: gltf.MeshAttribute[] | null | string, attributeTypes?: { [key: string]: gltf.AccessorType } | null,
            drawMode?: gltf.DrawMode
        ) {
            // Retarget.
            return new egret3d.Mesh(vertexCountOrConfig as any, indexCountOrBuffers as any, attributeNamesOrName as any, attributeTypes, drawMode);
        }

        protected _drawMode: gltf.DrawMode = gltf.DrawMode.Static;
        protected _vertexCount: uint = 0;
        protected readonly _attributeNames: string[] = [];
        protected readonly _customAttributeTypes: { [key: string]: gltf.AccessorType } = {};
        protected _glTFMesh: gltf.Mesh | null = null;
        protected _inverseBindMatrices: Float32Array | null = null;
        protected _boneIndices: { [key: string]: uint } | null = null;
        /**
         * 请使用 `egret3d.Mesh.create()` 创建实例。
         * @see egret3d.Mesh.create()
         */
        protected constructor(
            vertexCountOrConfig: uint | GLTF, indexCountOrBuffers?: uint | Uint32Array[],
            attributeNamesOrName?: gltf.MeshAttribute[] | null | string, attributeTypes?: { [key: string]: gltf.AccessorType } | null,
            drawMode?: gltf.DrawMode
        ) {
            super(typeof attributeNamesOrName === "string" ? attributeNamesOrName : "");

            if (typeof vertexCountOrConfig === "number") {
                vertexCountOrConfig = vertexCountOrConfig || 3;
                indexCountOrBuffers = indexCountOrBuffers || 0;

                this.config = GLTFAsset.createMeshConfig();
                //
                const buffer = this.config.buffers![0];
                const vertexBufferView = this.config.bufferViews![0];
                const { accessors } = this.config;
                const { attributes } = this.config.meshes![0].primitives[0];
                //
                let hasCustomAttributeType = false;

                if (attributeTypes) {
                    for (const k in attributeTypes) {
                        hasCustomAttributeType = true;
                        this._customAttributeTypes[k] = attributeTypes[k];
                    }
                }

                for (const attributeName of (attributeNamesOrName || _attributeNames) as string[]) { // Create
                    const attributeType = hasCustomAttributeType ? this._customAttributeTypes[attributeName] || this.getMeshAttributeType(attributeName) : this.getMeshAttributeType(attributeName);
                    const byteOffset = vertexBufferView.byteLength;
                    vertexBufferView.byteLength += vertexCountOrConfig * this.getAccessorTypeCount(attributeType) * Float32Array.BYTES_PER_ELEMENT;
                    attributes[attributeName] = accessors!.length;
                    accessors!.push({
                        bufferView: 0,
                        byteOffset: byteOffset,
                        count: vertexCountOrConfig,
                        normalized: attributeName === gltf.MeshAttributeType.NORMAL || attributeName === gltf.MeshAttributeType.TANGENT,
                        componentType: gltf.ComponentType.Float,
                        type: attributeType,
                    });
                }

                buffer.byteLength = vertexBufferView.byteLength;
                this.buffers[0] = new Float32Array(vertexBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);
                this._drawMode = drawMode || gltf.DrawMode.Static;

                if (indexCountOrBuffers as uint > 0) { // Indices.
                    this.addSubMesh(indexCountOrBuffers as uint, 0);
                }
                else {
                    this.config.meshes![0].primitives[0].material = 0;
                }
            }
            else {
                this.config = vertexCountOrConfig as GLTF;

                for (const buffer of indexCountOrBuffers as Uint32Array[]) {
                    this.buffers.push(buffer);
                }

                this.name = attributeNamesOrName as string;
            }

            this._glTFMesh = this.config.meshes![0];
            this._vertexCount = this.getAccessor(this._glTFMesh.primitives[0].attributes.POSITION || 0).count;

            for (const k in this._glTFMesh.primitives[0].attributes) {
                this._attributeNames.push(k);
            }
        }

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            this._drawMode = gltf.DrawMode.Static;
            this._attributeNames.length = 0;
            // this._customAttributeTypes TODO
            this._glTFMesh = null;
            this._inverseBindMatrices = null;
            this._boneIndices = null;

            return true;
        }
        /**
         * 克隆该网格。
         */
        public clone() {
            // TODO
            const value = Mesh.create(this.vertexCount, 0, this._attributeNames, this._customAttributeTypes, this.drawMode);

            for (const primitive of this._glTFMesh!.primitives) {
                if (primitive.indices !== undefined) {
                    const accessor = this.getAccessor(primitive.indices);
                    value.addSubMesh(accessor.count, primitive.material, primitive.mode);
                }
            }

            let index = 0;
            for (const bufferViewA of this.config.bufferViews!) {
                const bufferViewB = value.config.bufferViews![index++];
                const a = this.createTypeArrayFromBufferView(bufferViewA, gltf.ComponentType.UnsignedInt);
                const b = value.createTypeArrayFromBufferView(bufferViewB, gltf.ComponentType.UnsignedInt);

                for (let i = 0, l = a.length; i < l; ++i) {
                    b[i] = a[i];
                }
            }

            return value;
        }
        /**
         * TODO applyMatrix
         */
        /**
         * 
         */
        public getTriangle(triangleIndex: uint, out?: Triangle, vertices?: Float32Array | null): Triangle {
            if (!out) {
                out = Triangle.create();
            }

            const indices = this.getIndices();
            vertices = vertices || this.getVertices()!;

            if (indices) {
                const vertexOffset = triangleIndex * 3;
                out.fromArray(vertices, indices[vertexOffset + 0] * 3, indices[vertexOffset + 1] * 3, indices[vertexOffset + 2] * 3);
            }
            else {
                out.fromArray(vertices, triangleIndex * 9);
            }

            return out;
        }
        /**
         * 
         */
        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo, vertices?: Float32Array | null) {
            let subMeshIndex = 0;
            const helpTriangleA = _helpTriangleA;
            const helpTriangleB = _helpTriangleB;
            const helpRaycastInfo = _helpRaycastInfo;
            vertices = vertices || this.getVertices()!;
            let hit = false;

            for (const primitive of this._glTFMesh!.primitives) {
                const indices = primitive.indices !== undefined ? this.getIndices(subMeshIndex)! : null;

                switch (primitive.mode) { // TODO
                    case gltf.MeshPrimitiveMode.Points:
                        break;

                    case gltf.MeshPrimitiveMode.Lines:
                        break;

                    case gltf.MeshPrimitiveMode.LineLoop:
                        break;

                    case gltf.MeshPrimitiveMode.LineStrip:
                        break;

                    case gltf.MeshPrimitiveMode.TrianglesFan:
                        break;

                    case gltf.MeshPrimitiveMode.TrianglesStrip:
                        break;

                    case gltf.MeshPrimitiveMode.Triangles:
                    default:
                        if (indices) {
                            for (let i = 0, l = indices.length; i < l; i += 3) { //
                                helpTriangleA.fromArray(
                                    vertices,
                                    indices[i] * 3, indices[i + 1] * 3, indices[i + 2] * 3
                                );

                                if (raycastInfo) {
                                    helpRaycastInfo.backfaceCulling = raycastInfo.backfaceCulling;
                                    if (
                                        helpTriangleA.raycast(ray, helpRaycastInfo) &&
                                        (!hit || raycastInfo.distance > helpRaycastInfo.distance)
                                    ) {
                                        raycastInfo.subMeshIndex = subMeshIndex;
                                        raycastInfo.triangleIndex = i / 3;
                                        raycastInfo.distance = helpRaycastInfo.distance;
                                        raycastInfo.position.copy(helpRaycastInfo.position);
                                        raycastInfo.coord.copy(helpRaycastInfo.coord);
                                        // raycastInfo.textureCoordB.copy(helpRaycastInfo.textureCoordB); TODO
                                        hit = true;

                                        if (raycastInfo.normal) {
                                            helpTriangleB.copy(helpTriangleA);
                                        }

                                    }
                                }
                                else if (helpTriangleA.raycast(ray)) {
                                    return true;
                                }
                            }
                        }
                        else {
                            for (let i = 0, l = vertices.length; i < l; i += 9) { //
                                helpTriangleA.fromArray(vertices, i);

                                if (raycastInfo) {
                                    helpRaycastInfo.backfaceCulling = raycastInfo.backfaceCulling;
                                    if (helpTriangleA.raycast(ray, helpRaycastInfo)) {
                                        if (!hit || raycastInfo.distance > helpRaycastInfo.distance) {
                                            raycastInfo.subMeshIndex = subMeshIndex;
                                            raycastInfo.triangleIndex = i / 9;
                                            raycastInfo.distance = helpRaycastInfo.distance;
                                            raycastInfo.position.copy(helpRaycastInfo.position);
                                            raycastInfo.coord.copy(helpRaycastInfo.coord);
                                            // raycastInfo.textureCoordB.copy(helpRaycastInfo.textureCoordB); TODO
                                            hit = true;

                                            if (raycastInfo.normal) {
                                                helpTriangleB.copy(helpTriangleA);
                                            }
                                        }
                                    }
                                }
                                else if (helpTriangleA.raycast(ray)) {
                                    return true;
                                }
                            }
                        }
                        break;
                }

                subMeshIndex++;
            }

            if (hit && raycastInfo!.normal) {
                const normal = raycastInfo!.normal!;
                // const normals = this.getNormals();

                // if (normals) {
                //     // TODO 三顶点的法线插值。
                //     const indices = this.getIndices();

                //     if (indices) {
                //         normal.fromArray(normals, indices[raycastInfo!.triangleIndex * 3] * 3);
                //     }
                //     else {
                //         normal.fromArray(normals, raycastInfo!.triangleIndex * 9);
                //     }
                // }
                // else {
                helpTriangleB.getNormal(normal);
                // }
            }

            return hit;
        }
        /**
         * 
         */
        public addSubMesh(indexCount: uint, materialIndex: uint = 0, randerMode?: gltf.MeshPrimitiveMode): uint {
            const { accessors } = this.config;
            const primitives = this.config.meshes![0].primitives;
            const subMeshIndex = this.buffers.length === primitives.length + 1 ? primitives.length : 0;
            const indexBufferView = this.config.bufferViews![subMeshIndex + 1] = {
                buffer: subMeshIndex + 1,
                byteOffset: 0,
                byteLength: indexCount * this.getAccessorTypeCount(gltf.AccessorType.SCALAR) * Uint16Array.BYTES_PER_ELEMENT,
                target: gltf.BufferViewTarget.ElementArrayBuffer,
            };
            const primitive = primitives[subMeshIndex] = primitives[subMeshIndex] || {
                attributes: primitives[0].attributes,
            };

            primitive.indices = accessors!.length;
            primitive.material = materialIndex;
            primitive.mode = randerMode;
            accessors!.push({
                bufferView: subMeshIndex + 1, byteOffset: 0,
                count: indexCount,
                componentType: gltf.ComponentType.UnsignedShort, type: gltf.AccessorType.SCALAR,
            });
            this.buffers[subMeshIndex + 1] = new Uint16Array(indexBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT);
            this.config.buffers![subMeshIndex + 1] = { byteLength: indexBufferView.byteLength };

            return primitives.length - 1;
        }
        /**
         * 获取该网格顶点的位置属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getVertices(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.MeshAttributeType.POSITION, offset, count);
        }
        /**
         * 获取该网格顶点的 UV 属性数据。
         * - u0, v0, u1, v1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getUVs(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.MeshAttributeType.TEXCOORD_0, offset, count);
        }
        /**
         * 获取该网格顶点的颜色属性数据。
         * - r0, g0, b0, a0, r1, g1, b1, a1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getColors(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.MeshAttributeType.COLOR_0, offset, count);
        }
        /**
         * 获取该网格顶点的法线属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getNormals(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.MeshAttributeType.NORMAL, offset, count);
        }
        /**
         * 获取该网格顶点的切线属性数据。
         * - x0, y0, z0, w0,  x1, y1, z1, w1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getTangents(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.MeshAttributeType.TANGENT, offset, count);
        }
        /**
         * 获取该网格顶点的指定属性数据。
         * @param attributeType 属性名。
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点总数。（默认全部顶点）
         */
        public getAttributes(attributeType: gltf.MeshAttribute, offset: uint = 0, count: uint = 0): Float32Array | Uint16Array | null {
            const accessorIndex = this._glTFMesh!.primitives[0].attributes[attributeType];
            if (accessorIndex === undefined) {
                return null;
            }

            return this.createTypeArrayFromAccessor(this.getAccessor(accessorIndex), offset, count);
        }
        /**
         * 设置该网格指定的顶点属性数据。
         * @param attributeType 属性名。
         * @param value 属性数据。
         * @param offset 顶点偏移。（默认从第一个点开始）
         */
        public setAttributes(attributeType: gltf.MeshAttribute, value: ReadonlyArray<number>, offset: uint = 0): Float32Array | Uint16Array | null {
            const target = this.getAttributes(attributeType, offset);
            if (target) {
                for (let i = 0, l = Math.min(value.length, target.length); i < l; i++) {
                    target[i] = value[i];
                }
            }

            return target;
        }
        /**
         * 获取该网格的顶点索引数据。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         */
        public getIndices(subMeshIndex: uint = 0): Uint16Array | null {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh!.primitives.length) {
                const accessorIndex = this._glTFMesh!.primitives[subMeshIndex].indices;
                if (accessorIndex === undefined) {
                    return null;
                }

                return this.createTypeArrayFromAccessor(this.getAccessor(accessorIndex));
            }

            console.warn("Error arguments.");

            return null;
        }
        /**
         * 设置该网格的顶点索引数据。
         * @param value 顶点索引数据。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         * @param offset 索引偏移。（默认不偏移）
         */
        public setIndices(value: ReadonlyArray<uint>, subMeshIndex: uint = 0, offset: uint = 0): Uint16Array | null {
            const target = this.getIndices(subMeshIndex);
            if (target) {
                for (let i = 0, l = Math.min(value.length, target.length); i < l; i++) {
                    target[i] = value[offset + i];
                }
            }

            return target;
        }
        /**
         * 当修改该网格的顶点属性后，调用此方法来更新顶点属性的缓冲区。
         * @param uploadAttributes 
         * @param offset 顶点偏移。（默认不偏移）
         * @param count 顶点总数。（默认全部顶点）
         */
        public uploadVertexBuffer(uploadAttributes?: gltf.MeshAttribute | (gltf.MeshAttribute[]), offset?: uint, count?: uint): void { }
        /**
         * 当修改该网格的顶点索引后，调用此方法来更新顶点索引的缓冲区。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         */
        public uploadSubIndexBuffer(subMeshIndex?: uint): void { }
        /**
         * 该网格的渲染模式。
         */
        public get drawMode(): gltf.DrawMode {
            return this._drawMode;
        }
        public set drawMode(value: gltf.DrawMode) {
            this._drawMode = value;
        }
        /**
         * 该网格的子网格总数。
         */
        public get subMeshCount(): uint {
            return this._glTFMesh!.primitives.length;
        }
        /**
         * 该网格的顶点总数。
         */
        public get vertexCount(): uint {
            return this._vertexCount;
        }
        /**
         * 该网格的全部顶点属性名称。
         */
        public get attributeNames(): ReadonlyArray<string> {
            return this._attributeNames;
        }
        /**
         * @internal
         */
        public get boneIndices(): Readonly<{ [key: string]: uint }> | null {
            const config = this.config;
            if (!this._boneIndices && config.skins) {
                const nodeIndices = this._boneIndices = {} as { [key: string]: uint };
                for (const joint of config.skins![0].joints) {
                    const node = config.nodes![joint];
                    nodeIndices[node.name!] = joint;
                }
            }

            return this._boneIndices;
        }
        /**
         * @internal
         */
        public get inverseBindMatrices(): Float32Array | null {
            const config = this.config;
            if (!this._inverseBindMatrices && config.skins) {
                // Mast be skinned mesh if has skin.
                // Skinned mesh mast has inverseBindMatrices.
                this._inverseBindMatrices = this.createTypeArrayFromAccessor(this.getAccessor(config.skins![0].inverseBindMatrices!));
            }

            return this._inverseBindMatrices;
        }
        /**
         * 获取该网格的 glTF 网格数据。
         */
        public get glTFMesh(): gltf.Mesh {
            return this._glTFMesh!;
        }
    }
}