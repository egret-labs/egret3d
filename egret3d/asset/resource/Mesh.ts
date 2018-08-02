namespace egret3d {
    const helpVec3_1: Vector3 = new Vector3();
    const helpVec3_2: Vector3 = new Vector3();
    const helpVec3_3: Vector3 = new Vector3();
    const helpVec3_4: Vector3 = new Vector3();
    const helpVec3_5: Vector3 = new Vector3();
    const helpVec3_6: Vector3 = new Vector3();
    const helpVec3_7: Vector3 = new Vector3();
    // const helpVec3_8: Vector3 = new Vector3();

    const _attributes: gltf.MeshAttributeType[] = [
        gltf.MeshAttributeType.POSITION,
        gltf.MeshAttributeType.NORMAL,
        gltf.MeshAttributeType.TANGENT,
        gltf.MeshAttributeType.COLOR_0,
        gltf.MeshAttributeType.TEXCOORD_0,
    ];
    /**
     * Mesh.
     * @version egret3D 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 网格模型。
     * - 所有子网格的 attributes 必须生成在连续的 buffer 上，并且保持一致。
     * @version egret3D 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Mesh extends GLTFAsset {
        /**
         * @internal
         */
        public readonly ibos: WebGLBuffer[] = [];
        /**
         * @internal
         */
        public vbo: WebGLBuffer | null = null;

        protected _drawMode: gltf.DrawMode = gltf.DrawMode.Static;
        protected _vertexCount: number = 0;
        protected readonly _attributeNames: string[] = [];
        protected readonly _customAttributeTypes: { [key: string]: gltf.AccessorType } = {};
        protected _glTFMesh: gltf.Mesh | null = null;

        public constructor(
            vertexCount: number, indexCount: number,
            attributeNames: gltf.MeshAttribute[] = _attributes, attributeTypes: { [key: string]: gltf.AccessorType } | null = null,
            drawMode: gltf.DrawMode = gltf.DrawMode.Static
        ) {
            super();

            if (vertexCount > 0) { // Custom.
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

                for (const attributeName of attributeNames) { // Create
                    const attributeType = hasCustomAttributeType ? this._customAttributeTypes[attributeName] || this.getMeshAttributeType(attributeName) : this.getMeshAttributeType(attributeName);
                    const byteOffset = vertexBufferView.byteLength;
                    vertexBufferView.byteLength += vertexCount * this.getAccessorTypeCount(attributeType) * Float32Array.BYTES_PER_ELEMENT;
                    attributes[attributeName] = accessors!.length;
                    accessors!.push({
                        bufferView: 0,
                        byteOffset: byteOffset,
                        count: vertexCount,
                        normalized: attributeName === gltf.MeshAttributeType.NORMAL || attributeName === gltf.MeshAttributeType.TANGENT,
                        componentType: gltf.ComponentType.Float,
                        type: attributeType,
                    });
                }

                buffer.byteLength = vertexBufferView.byteLength;
                this.buffers[0] = new Float32Array(vertexBufferView.byteLength / Float32Array.BYTES_PER_ELEMENT);

                if (indexCount >= 0) { // Indices.
                    this.addSubMesh(indexCount, 0);
                }

                this._drawMode = drawMode;

                this.initialize();
            }
        }

        public dispose() {
            if (this._isBuiltin) {
                return;
            }

            const webgl = WebGLCapabilities.webgl;

            for (const ibo of this.ibos) {
                webgl.deleteBuffer(ibo);
            }

            if (this.vbo) {
                webgl.deleteBuffer(this.vbo);
            }

            super.dispose();

            this.ibos.length = 0;
            this.vbo = null;
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
                const b = this.createTypeArrayFromBufferView(bufferViewB, gltf.ComponentType.UnsignedInt);

                for (let i = 0, l = a.length; i < l; ++i) {
                    b[i] = a[i];
                }
            }

            return value;
        }

        public initialize() {
            if (this._glTFMesh) {
                return;
            }

            this._glTFMesh = this.config.meshes![0];

            const accessor = this.getAccessor(this._glTFMesh.primitives[0].attributes.POSITION!);
            this._vertexCount = accessor.count;

            for (const k in this._glTFMesh.primitives[0].attributes) {
                this._attributeNames.push(k);
            }
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

        public getVertices(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.POSITION, offset, count) as Float32Array;
        }

        public getUVs(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TEXCOORD_0, offset, count) as Float32Array;
        }

        public getColors(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.COLOR_0, offset, count) as Float32Array | null;
        }

        public getNormals(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.NORMAL, offset, count) as Float32Array | null;
        }

        public getTangents(offset: number = 0, count: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TANGENT, offset, count) as Float32Array | null;
        }

        public getAttributes(attributeType: gltf.MeshAttribute, offset: number = 0, count: number = 0) {
            const accessorIndex = this._glTFMesh!.primitives[0].attributes[attributeType];
            if (accessorIndex === undefined) {
                return null;
            }

            return this.createTypeArrayFromAccessor(this.getAccessor(accessorIndex), offset, count);
        }

        public setAttributes(attributeType: gltf.MeshAttribute, value: Readonly<ArrayLike<number>>, offset: number = 0, count: number = 0) {
            const target = this.getAttributes(attributeType, offset, count);
            if (target) {
                for (let i = 0, l = Math.min(value.length, target.length); i < l; i++) {
                    target[i] = value[i];
                }
            }

            return target;
        }

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

        public setIndices(value: Readonly<ArrayLike<number>>, subMeshIndex: number = 0) {
            const target = this.getIndices(subMeshIndex);
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
        public uploadSubVertexBuffer(uploadAttributes: gltf.MeshAttribute | (gltf.MeshAttribute[]), offset: number = 0, count: number = 0) {
            if (!this.vbo) {
                return;
            }

            const webgl = WebGLCapabilities.webgl;
            const { attributes } = this._glTFMesh!.primitives[0];

            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);

            if (Array.isArray(uploadAttributes)) {
                for (const attributeName of uploadAttributes) {
                    const accessorIndex = attributes[attributeName];
                    if (accessorIndex !== undefined) {
                        const accessor = this.getAccessor(accessorIndex);
                        const bufferOffset = this.getBufferOffset(accessor);
                        const subVertexBuffer = this.createTypeArrayFromAccessor(accessor, offset, count);
                        webgl.bufferSubData(webgl.ARRAY_BUFFER, bufferOffset, subVertexBuffer);
                    }
                    else {
                        console.warn("Error arguments.");
                    }
                }
            }
            else {
                const accessorIndex = attributes[uploadAttributes];
                if (accessorIndex !== undefined) {
                    const accessor = this.getAccessor(accessorIndex);
                    const bufferOffset = this.getBufferOffset(accessor);
                    const subVertexBuffer = this.createTypeArrayFromAccessor(accessor);
                    webgl.bufferSubData(webgl.ARRAY_BUFFER, bufferOffset, subVertexBuffer);
                }
                else {
                    console.warn("Error arguments.");
                }
            }
        }
        /**
         * 
         */
        public uploadSubIndexBuffer(subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh!.primitives.length) {
                if (!this.vbo) {
                    return;
                }

                const webgl = WebGLCapabilities.webgl;
                const primitive = this._glTFMesh!.primitives[subMeshIndex];

                if (primitive.indices !== undefined) {
                    const accessor = this.getAccessor(primitive.indices);
                    const subIndexBuffer = this.createTypeArrayFromAccessor(accessor);
                    const ibo = this.ibos[subMeshIndex];
                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                    webgl.bufferSubData(webgl.ELEMENT_ARRAY_BUFFER, 0, subIndexBuffer);
                }
                else {
                    console.warn("Error arguments.");
                }
            }
            else {
                console.warn("Error arguments.");
            }
        }
        /**
         * @internal
         */
        public createVBOAndIBOs() {
            const vertexBufferViewAccessor = this.getAccessor(this._glTFMesh!.primitives[0].attributes.POSITION!);
            const vertexBuffer = this.createTypeArrayFromBufferView(this.getBufferView(vertexBufferViewAccessor), gltf.ComponentType.Float);
            const webgl = WebGLCapabilities.webgl;
            const vbo = webgl.createBuffer();

            if (vbo) {
                this.vbo = vbo;

                const attributeNames: gltf.MeshAttribute[] = [];
                for (const k in this._glTFMesh!.primitives[0].attributes) {
                    attributeNames.push(k);
                }

                let subMeshIndex = 0;
                for (const primitive of this._glTFMesh!.primitives) {
                    if (primitive.indices !== undefined) {
                        if (this.ibos.length === subMeshIndex) {
                            const ibo = webgl.createBuffer();
                            if (ibo) {
                                this.ibos.push(ibo);
                                webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                                webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, this.getBufferLength(this.getAccessor(primitive.indices)), this.drawMode);
                                this.uploadSubIndexBuffer(subMeshIndex);
                            }
                            else {
                                console.error("Create webgl element buffer error.");
                            }
                        }
                        else {
                            console.error("Error arguments.");
                        }
                    }
                    else if (this.ibos.length > 0) {
                        console.error("Error arguments.");
                    }

                    subMeshIndex++;
                }

                webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);
                webgl.bufferData(webgl.ARRAY_BUFFER, vertexBuffer.byteLength, this.drawMode);
                this.uploadSubVertexBuffer(attributeNames);
            }
            else {
                console.error("Create webgl buffer error.");
            }
        }
        /**
         * 检测射线碰撞
         * @param ray 射线
         * @param matrix 所在transform的矩阵
         * 
         */
        public intersects(ray: Ray, matrix: Matrix) {
            let pickInfo: PickInfo | null = null; // TODO
            let subMeshIndex = 0;

            for (const primitive of this._glTFMesh!.primitives) {
                if (
                    primitive.mode === gltf.MeshPrimitiveMode.Lines ||
                    primitive.mode === gltf.MeshPrimitiveMode.LineLoop ||
                    primitive.mode === gltf.MeshPrimitiveMode.LineStrip
                ) {
                }
                else {
                    if (primitive.indices === undefined) {
                        // 不使用index TODO
                    }
                    else { // TODO primitive mode
                        const indices = this.getIndices(subMeshIndex);
                        if (indices) {
                            const t0 = helpVec3_1;
                            const t1 = helpVec3_2;
                            const t2 = helpVec3_3;
                            const vertices = this.getVertices(subMeshIndex);

                            for (let i = 0; i < indices.length; i += 3) {
                                const p0 = helpVec3_4;
                                const p1 = helpVec3_5;
                                const p2 = helpVec3_6;
                                let index = indices[i] * 3;
                                Vector3.set(vertices[index], vertices[index + 1], vertices[index + 2], p0);
                                index = indices[i + 1] * 3;
                                Vector3.set(vertices[index], vertices[index + 1], vertices[index + 2], p1);
                                index = indices[i + 2] * 3;
                                Vector3.set(vertices[index], vertices[index + 1], vertices[index + 2], p2);

                                Matrix.transformVector3(p0, matrix, t0);
                                Matrix.transformVector3(p1, matrix, t1);
                                Matrix.transformVector3(p2, matrix, t2);

                                const result = ray.intersectsTriangle(t0, t1, t2);
                                if (result) {
                                    if (result.distance < 0) {
                                        continue;
                                    }

                                    if (!pickInfo || pickInfo.distance > result.distance) {
                                        pickInfo = result;
                                        pickInfo.triangleIndex = i / 3;
                                        pickInfo.subMeshIndex = i;
                                        const tdir = helpVec3_7;
                                        Vector3.copy(ray.direction, tdir);
                                        Vector3.scale(tdir, result.distance);
                                        Vector3.add(ray.origin, tdir, pickInfo.position);
                                    }
                                }
                            }
                        }
                    }
                }

                subMeshIndex++;
            }

            return pickInfo;
        }
        /**
         * 
         */
        public get drawMode() {
            return this._drawMode;
        }
        public set drawMode(value: gltf.DrawMode) {
            if (this.vbo) {
                console.warn("Cannot change draw mode after the mesh has been rendered.");
                return;
            }

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