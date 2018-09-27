namespace egret3d {
    const _helpVector3A = Vector3.create();
    const _helpVector3B = Vector3.create();
    const _helpVector3C = Vector3.create();
    const _helpMatrix = Matrix4.create();
    const _helpRaycastInfo = RaycastInfo.create();

    const _attributeNames: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.COLOR_0,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];
    /**
     * 网格基类。
     */
    export abstract class BaseMesh extends GLTFAsset implements egret3d.IRaycast {
        protected _drawMode: gltf.DrawMode = gltf.DrawMode.Static;
        protected _vertexCount: number = 0;
        protected readonly _attributeNames: string[] = [];
        protected readonly _customAttributeTypes: { [key: string]: gltf.AccessorType } = {};
        protected _glTFMesh: gltf.Mesh | null = null;
        private _helpVertices: Float32Array | null = null;
        /**
         * 请使用 `egret3d.Mesh.create()` 创建实例。
         * @see egret3d.Mesh.create()
         * @deprecated
         */
        public constructor(
            vertexCount: number, indexCount: number,
            attributeNames?: gltf.MeshAttribute[] | null, attributeTypes?: { [key: string]: gltf.AccessorType } | null,
            drawMode?: gltf.DrawMode
        )
        public constructor(config: GLTF, buffers: Uint32Array[], name: string)
        public constructor(
            vertexCountOrConfig: number | GLTF, indexCountOrBuffers?: number | Uint32Array[],
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

                if (indexCountOrBuffers as number > 0) { // Indices.
                    this.addSubMesh(indexCountOrBuffers as number, 0);
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
        /**
         * 
         */
        public clone() {
            const value = new Mesh(this.vertexCount, 0, this._attributeNames, this._customAttributeTypes, this.drawMode);

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
        public raycast(ray: Readonly<Ray>, raycastInfo?: RaycastInfo, boneMatrices?: Float32Array | null) {
            let subMeshIndex = 0;
            const p0 = _helpVector3A;
            const p1 = _helpVector3B;
            const p2 = _helpVector3C;
            const vertices = this.getVertices()!;
            const joints = boneMatrices ? this.getAttributes(gltf.MeshAttributeType.JOINTS_0) as Float32Array : null;
            const weights = boneMatrices ? this.getAttributes(gltf.MeshAttributeType.WEIGHTS_0) as Float32Array : null;
            let hit = false;

            for (const primitive of this._glTFMesh!.primitives) {
                const indices = primitive.indices !== undefined ? this.getIndices(subMeshIndex)! : null;
                let castVertices = vertices;

                if (boneMatrices) {
                    if (!this._helpVertices) { // TODO clean
                        this._helpVertices = new Float32Array(vertices.length);
                    }

                    castVertices = this._helpVertices;

                    if (indices) {
                        for (const index of <any>indices as number[]) {
                            const vertexIndex = index * 3;
                            const jointIndex = index * 4;
                            p0.fromArray(vertices, vertexIndex);
                            p1
                                .set(0.0, 0.0, 0.0)
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 0] * 16), p0).multiplyScalar(weights![jointIndex + 0]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 1] * 16), p0).multiplyScalar(weights![jointIndex + 1]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 2] * 16), p0).multiplyScalar(weights![jointIndex + 2]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 3] * 16), p0).multiplyScalar(weights![jointIndex + 3]))
                                .toArray(castVertices, vertexIndex);
                        }
                    }
                    else {
                        let index = 0;
                        for (let i = 0, l = vertices.length; i < l; i += 3) {
                            const jointIndex = (index++) * 3;
                            p0.fromArray(vertices, i);
                            p1
                                .set(0.0, 0.0, 0.0)
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 0] * 16), p0).multiplyScalar(weights![jointIndex + 0]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 1] * 16), p0).multiplyScalar(weights![jointIndex + 1]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 2] * 16), p0).multiplyScalar(weights![jointIndex + 2]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints![jointIndex + 3] * 16), p0).multiplyScalar(weights![jointIndex + 3]))
                                .toArray(castVertices, i);
                        }
                    }
                }

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
                                p0.fromArray(castVertices, indices[i] * 3);
                                p1.fromArray(castVertices, indices[i + 1] * 3);
                                p2.fromArray(castVertices, indices[i + 2] * 3);

                                if (raycastInfo) {
                                    if (ray.intersectTriangle(p0, p1, p2, false, _helpRaycastInfo)) {
                                        if (!hit || raycastInfo.distance > _helpRaycastInfo.distance) {
                                            raycastInfo.subMeshIndex = subMeshIndex;
                                            raycastInfo.triangleIndex = i / 3; // TODO
                                            raycastInfo.distance = _helpRaycastInfo.distance;
                                            raycastInfo.position.copy(_helpRaycastInfo.position);
                                            raycastInfo.textureCoordA.copy(_helpRaycastInfo.textureCoordA);
                                            raycastInfo.textureCoordB.copy(_helpRaycastInfo.textureCoordB);
                                            hit = true;
                                        }
                                    }
                                }
                                else if (ray.intersectTriangle(p0, p1, p2)) {
                                    return true;
                                }
                            }
                        }
                        else {
                            for (let i = 0, l = castVertices.length; i < l; i += 9) { //
                                p0.fromArray(castVertices, i);
                                p1.fromArray(castVertices, i + 3);
                                p2.fromArray(castVertices, i + 6);

                                if (raycastInfo) {
                                    if (ray.intersectTriangle(p0, p1, p2, false, _helpRaycastInfo)) {
                                        if (!hit || raycastInfo.distance > _helpRaycastInfo.distance) {
                                            raycastInfo.subMeshIndex = subMeshIndex;
                                            raycastInfo.triangleIndex = i / 3; // TODO
                                            raycastInfo.distance = _helpRaycastInfo.distance;
                                            raycastInfo.position.copy(_helpRaycastInfo.position);
                                            raycastInfo.textureCoordA.copy(_helpRaycastInfo.textureCoordA);
                                            raycastInfo.textureCoordB.copy(_helpRaycastInfo.textureCoordB);
                                            hit = true;
                                        }
                                    }
                                }
                                else if (ray.intersectTriangle(p0, p1, p2)) {
                                    return true;
                                }
                            }
                        }
                        break;
                }

                subMeshIndex++;
            }

            return hit;
        }
        /**
         * 
         */
        public addSubMesh(indexCount: number, materialIndex: number = 0, randerMode?: gltf.MeshPrimitiveMode) {
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
        public getVertices(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.POSITION, offset, count) as Float32Array | null;
        }
        /**
         * 获取该网格顶点的 UV 属性数据。
         * - u0, v0, u1, v1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getUVs(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TEXCOORD_0, offset, count) as Float32Array | null;
        }
        /**
         * 获取该网格顶点的颜色属性数据。
         * - r0, g0, b0, a0, r1, g1, b1, a1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getColors(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.COLOR_0, offset, count) as Float32Array | null;
        }
        /**
         * 获取该网格顶点的法线属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getNormals(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.NORMAL, offset, count) as Float32Array | null;
        }
        /**
         * 获取该网格顶点的切线属性数据。
         * - x0, y0, z0, w0,  x1, y1, z1, w1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getTangents(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TANGENT, offset, count) as Float32Array | null;
        }
        /**
         * 获取该网格顶点的指定属性数据。
         * @param attributeType 属性名。
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点总数。（默认全部顶点）
         */
        public getAttributes(attributeType: gltf.MeshAttribute, offset: number = 0, count: number = 0) {
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
        public setAttributes(attributeType: gltf.MeshAttribute, value: Readonly<ArrayLike<number>>, offset: number = 0) {
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
        public getIndices(subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh!.primitives.length) {
                const accessorIndex = this._glTFMesh!.primitives[subMeshIndex].indices;
                if (accessorIndex === undefined) {
                    return null;
                }

                return this.createTypeArrayFromAccessor(this.getAccessor(accessorIndex)) as Uint16Array;
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
        public setIndices(value: Readonly<ArrayLike<number>>, subMeshIndex: number = 0, offset: number = 0) {
            const target = this.getIndices(subMeshIndex);
            if (target) {
                for (let i = 0, l = Math.min(value.length, target.length); i < l; i++) {
                    target[i] = value[offset + i];
                }
            }

            return target;
        }
        /**
         * 创建顶点和顶点索引缓冲区。
         * @internal TODO 应是引擎层可见。
         */
        public abstract _createBuffer(): void;
        /**
         * 当修改该网格的顶点属性后，调用此方法来更新顶点属性的缓冲区。
         * @param uploadAttributes 
         * @param offset 顶点偏移。（默认不偏移）
         * @param count 顶点总数。（默认全部顶点）
         */
        public abstract uploadVertexBuffer(uploadAttributes?: gltf.MeshAttribute | (gltf.MeshAttribute[]), offset?: number, count?: number): void;
        /**
         * 当修改该网格的顶点索引后，调用此方法来更新顶点索引的缓冲区。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         */
        public abstract uploadSubIndexBuffer(subMeshIndex?: number): void;
        /**
         * 该网格的渲染模式。
         */
        public get drawMode() {
            return this._drawMode;
        }
        public set drawMode(value: gltf.DrawMode) {
            this._drawMode = value;
        }
        /**
         * 该网格的子网格总数。
         */
        public get subMeshCount() {
            return this._glTFMesh!.primitives.length;
        }
        /**
         * 该网格的顶点总数。
         */
        public get vertexCount() {
            return this._vertexCount;
        }
        /**
         * 该网格的全部顶点属性名称。
         */
        public get attributeNames(): ReadonlyArray<string> {
            return this._attributeNames;
        }
        /**
         * 获取该网格的 glTF mesh 数据。
         */
        public get glTFMesh() {
            return this._glTFMesh!;
        }
    }
}