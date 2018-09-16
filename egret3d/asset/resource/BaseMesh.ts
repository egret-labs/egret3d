namespace egret3d {
    const _helpVector3A = Vector3.create();
    const _helpVector3B = Vector3.create();
    const _helpVector3C = Vector3.create();
    const _helpMatrix = Matrix4.create();
    const _helpRay = Ray.create();

    const _attributeNames: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.COLOR_0,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];
    /**
     * 
     */
    export abstract class BaseMesh extends GLTFAsset {
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
         * TODO
         */
        public raycast(ray: Readonly<Ray>, worldMatrix: Readonly<Matrix4>, boneMatrices: Float32Array | null = null) {
            let subMeshIndex = 0;
            const p0 = _helpVector3A;
            const p1 = _helpVector3B;
            const p2 = _helpVector3C;
            const vertices = this.getVertices()!;
            const joints = boneMatrices ? this.getAttributes(gltf.MeshAttributeType.JOINTS_0)! as Float32Array : null;
            const weights = boneMatrices ? this.getAttributes(gltf.MeshAttributeType.WEIGHTS_0)! as Float32Array : null;
            let raycastInfo: RaycastInfo | null = null; // TODO

            _helpMatrix.inverse(worldMatrix);
            _helpRay.copy(ray);
            _helpRay.origin.applyMatrix(_helpMatrix);
            _helpRay.direction.applyDirection(_helpMatrix);

            for (const primitive of this._glTFMesh!.primitives) {
                const indices = primitive.indices !== undefined ? this.getIndices(subMeshIndex)! : null;
                let castRay = _helpRay;
                let castVertices = vertices;

                if (boneMatrices) {
                    if (!this._helpVertices) { // TODO clean
                        this._helpVertices = new Float32Array(vertices.length);
                    }

                    castRay = ray;
                    castVertices = this._helpVertices;

                    if (indices) {
                        for (const index of <any>indices as number[]) {
                            const vertexIndex = index * 3;
                            const jointIndex = index * 3;
                            p0.fromArray(vertices, vertexIndex);
                            p1
                                .set(0.0, 0.0, 0.0)
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 0] * 16), p0).multiplyScalar(weights[jointIndex + 0]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 1] * 16), p0).multiplyScalar(weights[jointIndex + 1]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 2] * 16), p0).multiplyScalar(weights[jointIndex + 2]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 3] * 16), p0).multiplyScalar(weights[jointIndex + 3]))
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
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 0] * 16), p0).multiplyScalar(weights[jointIndex + 0]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 1] * 16), p0).multiplyScalar(weights[jointIndex + 1]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 2] * 16), p0).multiplyScalar(weights[jointIndex + 2]))
                                .add(p2.applyMatrix(_helpMatrix.fromArray(boneMatrices, joints[jointIndex + 3] * 16), p0).multiplyScalar(weights[jointIndex + 3]))
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

                                const result = castRay.intersectTriangle(p0, p1, p2);
                                if (result) {
                                    if (result.distance < 0) {
                                        continue;
                                    }

                                    if (!raycastInfo || raycastInfo.distance > result.distance) {
                                        raycastInfo = result;
                                        raycastInfo.subMeshIndex = subMeshIndex;
                                        raycastInfo.triangleIndex = i / 3; // TODO
                                    }
                                }
                            }
                        }
                        else {
                            for (let i = 0, l = castVertices.length; i < l; i += 9) { //
                                p0.fromArray(castVertices, i);
                                p0.fromArray(castVertices, i + 3);
                                p0.fromArray(castVertices, i + 6);

                                const result = castRay.intersectTriangle(p0, p1, p2);
                                if (result) {
                                    if (result.distance < 0) {
                                        continue;
                                    }

                                    if (!raycastInfo || raycastInfo.distance > result.distance) {
                                        raycastInfo = result;
                                        raycastInfo.subMeshIndex = subMeshIndex;
                                        raycastInfo.triangleIndex = i / 3; // TODO
                                    }
                                }
                            }
                        }
                        break;
                }

                subMeshIndex++;
            }

            return raycastInfo;
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
                bufferView: 1, byteOffset: 0,
                count: indexCount,
                componentType: gltf.ComponentType.UnsignedShort, type: gltf.AccessorType.SCALAR,
            });
            this.buffers[subMeshIndex + 1] = new Uint16Array(indexBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT);
            this.config.buffers![subMeshIndex + 1] = { byteLength: indexBufferView.byteLength };

            return primitives.length - 1;
        }
        /**
         * 
         */
        public getVertices(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.POSITION, offset, count) as Float32Array | null;
        }
        /**
         * 
         */
        public getUVs(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TEXCOORD_0, offset, count) as Float32Array | null;
        }
        /**
         * 
         */
        public getColors(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.COLOR_0, offset, count) as Float32Array | null;
        }
        /**
         * 
         */
        public getNormals(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.NORMAL, offset, count) as Float32Array | null;
        }
        /**
         * 
         */
        public getTangents(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TANGENT, offset, count) as Float32Array | null;
        }
        /**
         * 
         */
        public getAttributes(attributeType: gltf.MeshAttribute, offset: number = 0, count: number = 0) {
            const accessorIndex = this._glTFMesh!.primitives[0].attributes[attributeType];
            if (accessorIndex === undefined) {
                return null;
            }

            return this.createTypeArrayFromAccessor(this.getAccessor(accessorIndex), offset, count);
        }
        /**
         * 
         */
        public setAttributes(attributeType: gltf.MeshAttribute, value: Readonly<ArrayLike<number>>, offset: number = 0, count: number = 0) {
            const target = this.getAttributes(attributeType, offset, count);
            if (target) {
                for (let i = 0, l = Math.min(value.length, target.length); i < l; i++) {
                    target[i] = value[i];
                }
            }

            return target;
        }
        /**
         * 
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
         * 
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
         * 绑定显存。
         */
        public abstract _createBuffer(): void;
        /**
         * 
         */
        public abstract uploadVertexBuffer(uploadAttributes?: gltf.MeshAttribute | (gltf.MeshAttribute[]), offset?: number, count?: number): void;
        /**
         * 
         */
        public abstract uploadSubIndexBuffer(subMeshIndex: number): void;
        /**
         * 
         */
        public get drawMode() {
            return this._drawMode;
        }
        public set drawMode(value: gltf.DrawMode) {
            this._drawMode = value;
        }
        /**
         * 获取子网格数量。
         */
        public get subMeshCount() {
            return this._glTFMesh!.primitives.length;
        }
        /**
         * 
         */
        public get vertexCount() {
            return this._vertexCount;
        }
        /**
         * 
         */
        public get attributeNames(): ReadonlyArray<string> {
            return this._attributeNames;
        }
        /**
         * 获取 glTFMesh 数据。
         */
        public get glTFMesh() {
            return this._glTFMesh!;
        }
    }
}