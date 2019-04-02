namespace egret3d {
    //TODO 运行时DrawCall排序优化使用
    let _hashCode: uint = 0;
    const _helpTriangleA = Triangle.create();
    const _helpTriangleB = Triangle.create();
    const _helpRaycastInfo = RaycastInfo.create();

    const _attributeNames: gltf.AttributeSemantics[] = [
        gltf.AttributeSemantics.POSITION,
        gltf.AttributeSemantics.NORMAL,
        gltf.AttributeSemantics.TEXCOORD_0,
    ];
    /**
     * 网格资源。
     */
    export class Mesh extends GLTFAsset implements IRaycast {
        /**
         * 创建一个网格。
         * @param vertexCount 
         * @param indexCount 
         * @param attributeNames 
         * @param attributeTypes 
         */
        public static create(
            vertexCount: uint, indexCount: uint,
            attributeNames?: gltf.AttributeSemantics[] | null, attributeTypes?: { [key: string]: gltf.AccessorType } | null
        ): Mesh;
        /**
         * 加载一个网格。
         * @private 
         */
        public static create(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView>): Mesh;
        public static create(
            vertexCountOrName: uint | string, indexCountOrConfig?: uint | GLTF,
            attributeNamesOrBuffers?: gltf.AttributeSemantics[] | null | ReadonlyArray<ArrayBufferView>, attributeTypes?: { [key: string]: gltf.AccessorType } | null
        ) {
            let name: string;
            let config: GLTF;
            let buffers: ArrayBufferView[];
            let mesh: Mesh;
            let indexCount = 0;
            //
            if (typeof vertexCountOrName === "number") {
                indexCount = indexCountOrConfig as uint;
                //
                name = "";
                config = this._createConfig(
                    vertexCountOrName as uint, indexCount,
                    attributeNamesOrBuffers as any || _attributeNames, attributeTypes || null
                );
                buffers = [new Uint32Array(config.bufferViews![0].byteLength / Uint32Array.BYTES_PER_ELEMENT)];
            }
            else {
                name = vertexCountOrName;
                config = indexCountOrConfig as GLTF;
                buffers = attributeNamesOrBuffers as ArrayBufferView[];
            }
            // Retargeting.
            mesh = new egret3d.Mesh();
            mesh.initialize(name, config, buffers, attributeTypes || null);
            //
            if (indexCount > 0) {
                mesh.addSubMesh(indexCount, 0);
            }

            return mesh;
        }

        private static _createConfig(vertexCount: uint, indexCount: uint, attributeNames: gltf.AttributeSemantics[], attributeTypes: { [key: string]: gltf.AccessorType } | null) {
            const config = this.createConfig();
            config.buffers = [{ byteLength: 0 }];
            config.bufferViews = [{ buffer: 0, byteOffset: 0, byteLength: 0, target: gltf.BufferViewTarget.ArrayBuffer }]; // VBO
            config.accessors = [];
            config.meshes = [{
                primitives: [{ attributes: {} }],
                extensions: { paper: {} },
            }];
            //
            const buffer = config.buffers![0];
            const vertexBufferView = config.bufferViews![0];
            const { accessors } = config;
            const { attributes } = config.meshes![0].primitives[0];
            //
            for (const attributeName of attributeNames) {
                const attributeType = this._getMeshAttributeType(attributeName, attributeTypes);
                const byteOffset = vertexBufferView.byteLength;
                vertexBufferView.byteLength += vertexCount * GLTFAsset.getAccessorTypeCount(attributeType) * Float32Array.BYTES_PER_ELEMENT;
                attributes[attributeName] = accessors!.length;
                accessors!.push({
                    bufferView: 0,
                    byteOffset: byteOffset,
                    count: vertexCount,
                    normalized: attributeName === gltf.AttributeSemantics.NORMAL || attributeName === gltf.AttributeSemantics.TANGENT,
                    componentType: gltf.ComponentType.Float,
                    type: attributeType,
                });
            }

            buffer.byteLength = vertexBufferView.byteLength;
            //
            if (indexCount === 0) {
                config.meshes![0].primitives[0].material = 0;
            }

            return config;
        }

        private static _getMeshAttributeType(attributeName: gltf.AttributeSemantics, customAttributeTypes: { [key: string]: gltf.AccessorType } | null): gltf.AccessorType {
            if (customAttributeTypes && attributeName in customAttributeTypes) {
                return customAttributeTypes[attributeName];
            }

            switch (attributeName) {
                case gltf.AttributeSemantics.POSITION:
                case gltf.AttributeSemantics.NORMAL:
                    return gltf.AccessorType.VEC3;

                case gltf.AttributeSemantics.TEXCOORD_0:
                case gltf.AttributeSemantics.TEXCOORD_1:
                    return gltf.AccessorType.VEC2;

                case gltf.AttributeSemantics.TANGENT:
                case gltf.AttributeSemantics.COLOR_0:
                case gltf.AttributeSemantics.COLOR_1:
                case gltf.AttributeSemantics.JOINTS_0:
                case gltf.AttributeSemantics.WEIGHTS_0:
                    return gltf.AccessorType.VEC4;

                case gltf.AttributeSemantics._INSTANCED_MODEL:
                case gltf.AttributeSemantics._INSTANCED_MODEL_VIEW:
                    return gltf.AccessorType.MAT4;

                default:
                    throw new Error();
            }
        }

        protected _drawMode: gltf.DrawMode = gltf.DrawMode.Static;
        protected _vertexCount: uint = 0;
        protected _wireframeIndex: int = -1;
        protected readonly _attributeNames: gltf.AttributeSemantics[] = [];
        protected readonly _attributeTypes: { [key: string]: gltf.AccessorType } = {};
        protected _glTFMesh: gltf.Mesh = null!;
        protected _inverseBindMatrices: ArrayBufferView | null = null;
        protected _boneIndices: { [key: string]: uint } | null = null;
        /**
         * @internal
         */
        public readonly _id: uint = _hashCode++;

        public initialize(
            name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null,
            attributeTypes: { [key: string]: gltf.AccessorType } | null
        ) {
            super.initialize(name, config, buffers);

            const glTFMesh = this._glTFMesh = this.config.meshes![0];
            this._vertexCount = this.getAccessor(glTFMesh.primitives[0].attributes.POSITION || 0).count;

            for (const k in glTFMesh.primitives[0].attributes) {
                this._attributeNames.push(k as gltf.AttributeSemantics);
            }

            if (attributeTypes) {
                for (const k in attributeTypes) {
                    this._attributeTypes[k] = attributeTypes[k];
                }
            }

            this.updateAccessorTypeCount();
        }

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            for (const k in this._attributeTypes) {
                delete this._attributeTypes[k];
            }

            this._drawMode = gltf.DrawMode.Static;
            this._attributeNames.length = 0;
            // this._customAttributeTypes;
            this._glTFMesh = null!;
            this._inverseBindMatrices = null;
            this._boneIndices = null;

            return true;
        }
        /**
         * 克隆该网格。
         */
        public clone(): Mesh {
            // TODO
            const value = Mesh.create(this.vertexCount, 0, this._attributeNames, this._attributeTypes);
            value._drawMode = this._drawMode;

            for (const primitive of this._glTFMesh!.primitives) {
                if (primitive.indices !== undefined) {
                    const accessor = this.getAccessor(primitive.indices);
                    value.addSubMesh(accessor.count, primitive.material, primitive.mode);
                }
            }

            let index = 0;
            for (const bufferViewA of this.config.bufferViews!) {
                const bufferViewB = value.config.bufferViews![index++];
                const a = this.createTypeArrayFromBufferView(bufferViewA, gltf.ComponentType.UnsignedInt) as Uint8Array;
                const b = value.createTypeArrayFromBufferView(bufferViewB, gltf.ComponentType.UnsignedInt) as Uint8Array;

                for (let i = 0, l = a.length; i < l; ++i) {
                    b[i] = a[i];
                }
            }

            return value;
        }
        /**
         * 
         */
        public applyMatrix(matrix: Readonly<Matrix4>): this {
            const helpVector3 = Vector3.create().release();
            const vertices = this.getVertices()!;
            const normals = this.getNormals();

            for (let i = 0, l = vertices.length; i < l; i += 3) {
                helpVector3.fromArray(vertices, i).applyMatrix(matrix).toArray(vertices, i);
            }

            if (normals) {
                const normalMatrix = Matrix3.create().getNormalMatrix(matrix).release();

                for (let i = 0, l = normals.length; i < l; i += 3) {
                    helpVector3.fromArray(normals, i).applyMatrix3(normalMatrix).normalize().toArray(normals, i);
                }
            }

            return this;
        }
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
        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null, vertices: Float32Array | null = null) {
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
                byteLength: indexCount * Uint16Array.BYTES_PER_ELEMENT,
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
                typeCount: 1,
                componentType: gltf.ComponentType.UnsignedShort, type: gltf.AccessorType.SCALAR,
            });
            this.buffers[subMeshIndex + 1] = new Uint16Array(indexBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT);
            this.config.buffers![subMeshIndex + 1] = { byteLength: indexBufferView.byteLength };

            return primitives.length - 1;
        }
        /**
         * 为该网格添加线框子网格。
         * @param materialIndex 
         */
        public addWireframeSubMesh(materialIndex: uint): this {
            if (this._wireframeIndex < 0) {
                let index = 0;
                const wireframeIndices = [] as number[];

                for (const primitive of this._glTFMesh!.primitives) {
                    if (primitive.indices !== undefined) {
                        const indices = this.getIndices(index)!;

                        for (let i = 0, l = indices.length; i < l; i += 3) {
                            const a = indices[i + 0];
                            const b = indices[i + 1];
                            const c = indices[i + 2];
                            wireframeIndices.push(a, b, b, c, c, a);
                        }
                    }
                    else {
                        // TODO
                    }

                    index++;
                }

                if (wireframeIndices.length > 0) {
                    this._wireframeIndex = this.addSubMesh(wireframeIndices.length, materialIndex, gltf.MeshPrimitiveMode.Lines);
                    this.setIndices(wireframeIndices, this._wireframeIndex);
                }
            }

            return this;
        }
        /**
         * 删除该网格已添加的线框子网格。
         */
        public removeWireframeSubMesh(): this {
            if (this._wireframeIndex >= 0) {
                const { primitives } = this._glTFMesh!;
                const primitive = primitives[this._wireframeIndex];
                // TODO 添加线框后，不能再添加 submesh
                primitives.splice(this._wireframeIndex, 1);
                this.buffers.splice(primitive.indices!, 1);
                this._wireframeIndex = -1;
            }

            return this;
        }
        /**
         * 
         */
        public normalizeNormals(): this {
            const normals = this.getNormals();

            if (normals) {
                const normal = Vector3.create().release();

                for (let i = 0, l = normals.length; i < l; i += 3) {
                    normal.fromArray(normals, i).normalize().toArray(normals, i);
                }

                this.uploadVertexBuffer(gltf.AttributeSemantics.NORMAL);
            }

            return this;
        }
        /**
         * 
         */
        public computeVertexNormals(): this {
            const normals = this.getNormals();

            if (normals) {
                const vertices = this.getVertices()!;
                const indices = this.getIndices();

                for (let i = 0, l = normals.length; i < l; i++) {
                    normals[i] = 0.0;
                }

                const triangle = Triangle.create().release();
                const normal = Vector3.create().release();

                if (indices) {
                    for (var i = 0, l = indices.length; i < l; i += 3) {
                        const vA = indices[i + 0] * 3;
                        const vB = indices[i + 1] * 3;
                        const vC = indices[i + 2] * 3;
                        triangle.fromArray(vertices, vA, vB, vC);
                        triangle.getNormal(normal);

                        normals[vA] += normal.x;
                        normals[vA + 1] += normal.y;
                        normals[vA + 2] += normal.z;

                        normals[vB] += normal.x;
                        normals[vB + 1] += normal.y;
                        normals[vB + 2] += normal.z;

                        normals[vC] += normal.x;
                        normals[vC + 1] += normal.y;
                        normals[vC + 2] += normal.z;
                    }

                    this.normalizeNormals();
                }
                else {
                    for (let i = 0, l = vertices.length; i < i; i += 9) {
                        triangle.fromArray(vertices, i);
                        triangle.getNormal(normal);
                        normal.toArray(normals, i);
                        normal.toArray(normals, i + 3);
                        normal.toArray(normals, i + 6);
                    }

                    this.uploadVertexBuffer(gltf.AttributeSemantics.NORMAL);
                }
            }
            else {
                // TODO
            }

            return this;
        }
        /**
         * 获取该网格顶点的位置属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getVertices(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.AttributeSemantics.POSITION, offset, count);
        }
        /**
         * 获取该网格顶点的 UV 属性数据。
         * - u0, v0, u1, v1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getUVs(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.AttributeSemantics.TEXCOORD_0, offset, count);
        }
        /**
         * 获取该网格顶点的颜色属性数据。
         * - r0, g0, b0, a0, r1, g1, b1, a1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getColors(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.AttributeSemantics.COLOR_0, offset, count);
        }
        /**
         * 获取该网格顶点的法线属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getNormals(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.AttributeSemantics.NORMAL, offset, count);
        }
        /**
         * 获取该网格顶点的切线属性数据。
         * - x0, y0, z0, w0,  x1, y1, z1, w1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getTangents(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttributes(gltf.AttributeSemantics.TANGENT, offset, count);
        }
        /**
         * 获取该网格顶点的指定属性数据。
         * @param attributeType 属性名。
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点总数。（默认全部顶点）
         */
        public getAttributes(attributeType: gltf.AttributeSemantics, offset: uint = 0, count: uint = 0): Float32Array | Uint16Array | null {
            const accessorIndex = this._glTFMesh!.primitives[0].attributes[attributeType];
            if (accessorIndex === undefined) {
                return null;
            }

            return this.createTypeArrayFromAccessor(this.getAccessor(accessorIndex), offset, count) as any;
        }
        /**
         * 设置该网格指定的顶点属性数据。
         * @param attributeType 属性名。
         * @param value 属性数据。
         * @param offset 顶点偏移。（默认从第一个点开始）
         */
        public setAttributes(attributeType: gltf.AttributeSemantics, value: ReadonlyArray<number>, offset: uint = 0): Float32Array | Uint16Array | null {
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
        public getIndices(subMeshIndex: uint = 0): Uint16Array | null { // TODO Uint32Array
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh!.primitives.length) {
                const accessorIndex = this._glTFMesh!.primitives[subMeshIndex].indices;
                if (accessorIndex === undefined) {
                    return null;
                }

                return this.createTypeArrayFromAccessor(this.getAccessor(accessorIndex)) as any;
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
         * 获取该网格的 glTF 网格数据。
         */
        public get glTFMesh(): gltf.Mesh {
            return this._glTFMesh!;
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
        public get inverseBindMatrices(): ArrayBufferView | null {
            const config = this.config;
            if (!this._inverseBindMatrices && config.skins) {
                // Mast be skinned mesh if has skin.
                // Skinned mesh mast has inverseBindMatrices.
                this._inverseBindMatrices = this.createTypeArrayFromAccessor(this.getAccessor(config.skins![0].inverseBindMatrices!));
            }

            return this._inverseBindMatrices;
        }

        /**
         * 当修改该网格的顶点属性后，调用此方法来更新顶点属性的缓冲区。
         * @param uploadAttributes 
         * @param offset 顶点偏移。（默认不偏移）
         * @param count 顶点总数。（默认全部顶点）
         */
        public uploadVertexBuffer(uploadAttributes?: gltf.AttributeSemantics | (gltf.AttributeSemantics[]), offset?: uint, count?: uint): void { }
        /**
         * 当修改该网格的顶点索引后，调用此方法来更新顶点索引的缓冲区。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         */
        public uploadSubIndexBuffer(subMeshIndex?: uint, offset?: uint, count?: uint): void { }
    }
}