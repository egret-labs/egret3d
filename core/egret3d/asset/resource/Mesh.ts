namespace egret3d {
    /**
     * 
     */
    export const enum MeshNeedUpdate {
        BoundingBox = 0b1,
        DrawMode = 0b10,
        VertexArray = 0b100,
        VertexBuffer = 0b1000,
        IndexBuffer = 0b10000,

        All = BoundingBox | DrawMode | VertexArray | VertexBuffer | IndexBuffer,
        None = 0,
    }
    // TODO 运行时DrawCall排序优化使用
    let _hashCode: uint = 0;
    const _helpRaycastInfo = RaycastInfo.create();
    const _attributeNames: gltf.AttributeSemantics[] = [
        gltf.AttributeSemantics.POSITION,
        gltf.AttributeSemantics.NORMAL,
        gltf.AttributeSemantics.TEXCOORD_0,
    ];
    /**
     * 网格资源。
     * - 一个网格资源最大支持 65536 个顶点。
     * - 子网格顶点属性是共享的。
     * - 仅允许第一个 [gltf.MeshPrimitive](gltf.MeshPrimitive) 可以不使用顶点索引。
     * - 暂不支持交错。
     */
    export class Mesh extends GLTFAsset implements paper.INeedUpdate, IRaycast {

        private static _createConfig() {
            const config = this.createConfig();
            config.buffers = [];
            config.bufferViews = [];
            config.accessors = [];
            config.meshes = [{
                primitives: [{ attributes: {}, material: 0 }],
            }] as GLTFMesh[];

            return config;
        }
        /**
         * 创建一个网格。
         * @param vertexCount
         * @param indexCount
         * @param attributeNames 
         * @param attributeTypes 
         */
        public static create(
            vertexCount: uint, indexCount: uint,
            attributeNames?: ReadonlyArray<gltf.AttributeSemantics | string> | Readonly<gltf.AttributeAccessorTypes> | null
        ): Mesh;
        /**
         * 加载一个网格。
         * @private
         */
        public static create(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView>): Mesh;
        public static create(
            vertexCountOrName: uint | string, indexCountOrConfig: uint | GLTF = 0,
            attributeNamesOrBuffers: ReadonlyArray<gltf.AttributeSemantics | string> | Readonly<gltf.AttributeAccessorTypes> | null | ReadonlyArray<ArrayBufferView> = null
        ) {
            // Retargeting.
            const mesh = new egret3d.Mesh();

            if (typeof vertexCountOrName === "number") { // 运行时创建的网格资源。
                const indexCount = indexCountOrConfig as uint;
                const attributes = attributeNamesOrBuffers !== null ? attributeNamesOrBuffers as ReadonlyArray<gltf.AttributeSemantics | string> | Readonly<gltf.AttributeAccessorTypes> : _attributeNames;
                mesh.initialize("", this._createConfig(), null, vertexCountOrName);
                // Add attributes.
                if (Array.isArray(attributes)) {
                    for (const attributeName of attributes) {
                        mesh.addAttribute(attributeName, GLTFAsset.getMeshAttributeType(attributeName));
                    }
                }
                else {
                    for (const attributeName in attributes) {
                        let attributeType = (attributes as Readonly<gltf.AttributeAccessorTypes>)[attributeName];

                        if (attributeType.length === 0) {
                            attributeType = GLTFAsset.getMeshAttributeType(attributeName);
                        }

                        mesh.addAttribute(attributeName, attributeType);
                    }
                }
                // Add indices.
                if (indexCount > 0) {
                    mesh.addSubMesh(indexCount, 0);
                }
            }
            else {
                mesh.initialize(vertexCountOrName, indexCountOrConfig as GLTF, attributeNamesOrBuffers as ArrayBufferView[]);
            }

            return mesh;
        }
        /**
         * 缓存的更新标记。
         */
        protected _needUpdate: MeshNeedUpdate = MeshNeedUpdate.All;
        /**
         * 缓存的顶点包围盒。
         */
        protected readonly _boundingBox: egret3d.Box = egret3d.Box.create();
        /**
         * 缓存的 glTF 网格。
         * - 用于快速访问。
         */
        protected _glTFMesh: GLTFMesh | null = null;
        /**
         * 缓存的 glTF 属性。
         * - 用于快速访问，并防止移除子网格后，没有属性数据源。
         */
        protected _attributes: { [key: string]: gltf.Index } | null = null;
        /**
         * 缓存的骨骼绑定逆矩阵。
         * - 仅在蒙皮网格中存在。
         */
        protected _inverseBindMatrices: ArrayBufferView | null = null;
        /**
         * TODO
         */
        protected _boneIndices: { [key: string]: uint } | null = null;
        /**
         * @internal
         */
        public readonly _id: uint = _hashCode++;

        private _removeBufferByAccessor(accessorIndex: uint) {
            const { buffers, bufferViews, accessors } = this.config;
            const attributes = this._attributes!;
            const { primitives } = this._glTFMesh!;
            const bufferViewIndex = accessors![accessorIndex].bufferView!;
            const bufferIndex = bufferViews![bufferViewIndex].buffer;

            if (bufferIndex !== 0) { // buffer 为 0， 意味着这是一个导入资源，导入资源的子网格不可被删除。
                const accessor = accessors![accessorIndex];
                // Update GLTFIndex.
                for (const bufferView of bufferViews!) {
                    if (bufferView.buffer > bufferIndex) {
                        bufferView.buffer--;
                    }
                }

                for (const accessor of accessors!) {
                    if (accessor.bufferView! > bufferViewIndex) {
                        accessor.bufferView!--;
                    }
                }

                for (const k in attributes!) {
                    if (attributes[k] > accessorIndex) {
                        attributes[k]--;
                    }
                }

                for (const primitive of primitives) {
                    if (primitive.indices !== undefined && primitive.indices > accessorIndex) {
                        primitive.indices--;
                    }
                }

                // Remove link.
                buffers!.splice(bufferIndex, 1);
                bufferViews!.splice(bufferViewIndex, 1);
                accessors!.splice(accessorIndex, 1);

                return accessor;
            }

            return null;
        }
        /**
         * @ignore
         */
        public initialize(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null, vertexCount: uint = 0) {
            super.initialize(name, config, buffers);

            const glTFMesh = this._glTFMesh = config.meshes![0] as GLTFMesh;
            const attributes = this._attributes = glTFMesh.primitives[0].attributes as { [key: string]: gltf.Index };
            glTFMesh.extras = {
                drawMode: gltf.DrawMode.Static,
                vertexCount: vertexCount,
                wireframeIndex: -1,
                attributeTypes: {},
                attributeOffsets: {},
                vbo: null
            };

            if (vertexCount === 0) { // 加载的资源。
                glTFMesh.extras.vertexCount = this.getAccessor(attributes.POSITION !== undefined ? attributes.POSITION : 0).count;

                let bufferOffset = 0;

                for (const k in attributes) {
                    glTFMesh.extras.attributeOffsets[k] = bufferOffset;
                    bufferOffset += this.getAccessorByteLength(this.getAccessor(attributes[k]));
                }
            }

            for (const primitive of glTFMesh.primitives) {
                primitive.attributes = attributes;
                primitive.extras = { needUpdate: MeshNeedUpdate.All, program: null, vaos: null, ibo: null, draw: null };
            }
        }
        /**
         * @interfnal
         */
        public dispose() {
            if (super.dispose()) {
                this._needUpdate = MeshNeedUpdate.All;
                this._boundingBox.clear();
                this._glTFMesh = null;
                this._attributes = null;
                this._inverseBindMatrices = null;
                this._boneIndices = null;

                return true;
            }

            return false;
        }
        /**
         * @deprecated
         */
        public clone(): this {
            const glTFMesh = this._glTFMesh!;
            const { wireframeIndex, attributeTypes } = glTFMesh.extras!;
            const attributesNameAndTypes = {} as gltf.AttributeAccessorTypes;

            for (const k in this._attributes!) {
                if (k in attributeTypes) {
                    attributesNameAndTypes[k] = attributeTypes[k];
                }
                else {
                    attributesNameAndTypes[k] = "";
                }
            }
            // Clone mesh.
            const value = Mesh.create(this.vertexCount, 0, attributesNameAndTypes) as this;
            value.glTFMesh.extras!.wireframeIndex = wireframeIndex;
            // Copy subMeshes.
            for (const primitive of glTFMesh.primitives) {
                if (primitive.indices !== undefined) {
                    const accessor = this.getAccessor(primitive.indices);
                    value.addSubMesh(accessor.count, primitive.material, primitive.mode);
                }
            }
            // Copy buffviews.
            let bufferViewIndex = 0;

            for (const bufferViewSource of this.config.bufferViews!) {
                const bufferViewTarget = value.config.bufferViews![bufferViewIndex++];
                const source = this.createTypeArrayFromBufferView(bufferViewSource, gltf.ComponentType.UnsignedInt) as Uint8Array;
                const target = value.createTypeArrayFromBufferView(bufferViewTarget, gltf.ComponentType.UnsignedInt) as Uint8Array;
                target.set(source);
            }

            return value;
        }
        /**
         * @ignore
         */
        public needUpdate(mask: MeshNeedUpdate, subMeshIndex: int = -1): void {
            this._needUpdate |= mask;

            if ((mask & (MeshNeedUpdate.VertexArray | MeshNeedUpdate.VertexBuffer)) !== 0) {
                const { primitives } = this._glTFMesh!;

                if (subMeshIndex < 0) {
                    for (const primitive of primitives) {
                        primitive.extras!.needUpdate |= mask;
                    }
                }
                else {
                    primitives[subMeshIndex].extras!.needUpdate |= mask;
                }
            }
        }
        /**
         * @ignore
         */
        public update(mask: MeshNeedUpdate, subMeshIndex: uint = 0): void {
            const needUpdate = this._needUpdate & mask;

            if ((needUpdate & MeshNeedUpdate.BoundingBox) !== 0) {
                const vertices = this.getVertices()!;
                const position = helpVector3E;
                const boundingBox = this._boundingBox;

                for (let i = 0, l = vertices.length; i < l; i += 3) {
                    boundingBox.add(position.fromArray(vertices, i));
                }
            }

            this._needUpdate &= ~mask;
            this._glTFMesh!.primitives[subMeshIndex].extras!.needUpdate &= ~mask;
        }
        /**
         * @ignore
         */
        public raycast(ray: Readonly<Ray>, raycastInfo: RaycastInfo | null = null, vertices: Float32Array | null = null) {
            if (vertices === null) {
                if (!this.boundingBox.raycast(ray)) {
                    return false;
                }

                vertices = this.getVertices()!;
            }

            const helpTriangleA = helpTriangleC;
            const helpTriangleB = helpTriangleD;
            const helpRaycastInfo = _helpRaycastInfo;
            let hit = false;
            let subMeshIndex = 0;

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
                        if (indices !== null) {
                            for (let i = 0, l = indices.length; i < l; i += 3) { //
                                helpTriangleA.fromArray(
                                    vertices,
                                    indices[i] * 3, indices[i + 1] * 3, indices[i + 2] * 3
                                );

                                if (raycastInfo !== null) {
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

                                        if (raycastInfo.normal !== null) {
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

                                if (raycastInfo !== null) {
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

                                            if (raycastInfo.normal !== null) {
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

            if (hit && raycastInfo!.normal !== null) {
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
         * 对该网格进行矩阵变换。
         * @param matrix 一个矩阵。
         * @param offset 
         * @param count 
         */
        public applyMatrix(matrix: Readonly<Matrix4>, offset: uint = 0, count: uint = 0): this {
            const helpVector3 = helpVector3E;
            const vertices = this.getVertices(offset, count)!;
            const normals = this.getNormals(offset, count);

            for (let i = 0, l = vertices.length; i < l; i += 3) {
                helpVector3.fromArray(vertices, i).applyMatrix(matrix).toArray(vertices, i);
            }

            if (normals !== null) {
                const normalMatrix = helpMatrix3C.getNormalMatrix(matrix).release();

                for (let i = 0, l = normals.length; i < l; i += 3) {
                    helpVector3.fromArray(normals, i).applyMatrix3(normalMatrix).normalize().toArray(normals, i);
                }
            }

            this.needUpdate(MeshNeedUpdate.BoundingBox);

            return this;
        }
        /**
         * 获取该网格指定的三角形数据。
         * @param triangleIndex 三角形索引。
         * @param output 被写入数据的三角形。
         * - 未设置则会创建一个。
         * @param vertices 
         */
        public getTriangle(triangleIndex: uint, output: Triangle | null = null, vertices: Float32Array | null = null): Triangle {
            if (output === null) {
                output = Triangle.create();
            }

            if (vertices === null) {
                vertices = this.getVertices()!;
            }

            const indices = this.getIndices();

            if (indices !== null) {
                const vertexOffset = triangleIndex * 3;
                output.fromArray(vertices, indices[vertexOffset + 0] * 3, indices[vertexOffset + 1] * 3, indices[vertexOffset + 2] * 3);
            }
            else {
                output.fromArray(vertices, triangleIndex * 9);
            }

            return output;
        }
        /**
         * 
         */
        public normalizeNormals(): this {
            const normals = this.getNormals();

            if (normals !== null) {
                const normal = helpVector3E;

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

            if (normals !== null) {
                const vertices = this.getVertices()!;
                const indices = this.getIndices();

                for (let i = 0, l = normals.length; i < l; i++) {
                    normals[i] = 0.0;
                }

                const triangle = helpTriangleC.release();
                const normal = helpVector3E;

                if (indices !== null) {
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
         * 为该网格添加一个新的顶点属性。
         * @param attributeName 顶点属性的名称。
         * @param attributeType 顶点属性的类型。
         */
        public addAttribute(attributeName: gltf.AttributeSemantics | string, attributeType: gltf.AccessorType | string, attributeVertexCount: uint = 0, divisor: uint = 0): Float32Array | null {
            const attributes = this._attributes!;

            if (!(attributeName in attributes)) {
                const { vertexCount, attributeTypes, attributeOffsets } = this._glTFMesh!.extras!;

                if (attributeVertexCount <= 0) {
                    attributeVertexCount = vertexCount;
                }

                const { buffers, bufferViews, accessors } = this.config;
                const typeCount = GLTFAsset.getAccessorTypeCount(attributeType);
                const viewLength = attributeVertexCount * typeCount;
                const byteLength = viewLength * Float32Array.BYTES_PER_ELEMENT;
                const bufferIndex = buffers!.length;
                const bufferViewIndex = bufferViews!.length;
                const accessorIndex = accessors!.length;
                const buffer = new Float32Array(viewLength);

                buffers![bufferIndex] = { byteLength: byteLength, extras: { data: buffer } };
                bufferViews![bufferViewIndex] = { buffer: bufferIndex, byteLength: byteLength, target: gltf.BufferViewTarget.ArrayBuffer };
                accessors![accessorIndex] = {
                    bufferView: bufferViewIndex,
                    count: attributeVertexCount, componentType: gltf.ComponentType.Float, type: attributeType as gltf.AccessorType,
                    normalized: attributeName === gltf.AttributeSemantics.NORMAL || attributeName === gltf.AttributeSemantics.TANGENT,
                    extras: { typeCount, divisor }
                };
                //
                let bufferOffset = 0;

                for (const k in attributes) {
                    bufferOffset += this.getAccessorByteLength(this.getAccessor(attributes[k]));
                }

                attributes[attributeName] = accessorIndex;
                attributeOffsets[attributeName] = bufferOffset;
                // 收集自定义属性的类型。
                if (GLTFAsset.getMeshAttributeType(attributeName) !== attributeType) {
                    attributeTypes[attributeName] = attributeType;
                }

                this.needUpdate(MeshNeedUpdate.VertexArray | MeshNeedUpdate.VertexBuffer, -1);

                return buffer;
            }

            return null;
        }
        /**
         * 从该网格中移除一个顶点属性。
         * @param attributeName 顶点属性的名称。
         */
        public removeAttribute(attributeName: gltf.AttributeSemantics | string): Float32Array | null {
            const attributes = this._attributes!;

            if (attributeName in attributes) {
                const accessorIndex = attributes[attributeName];
                const removeAccessor = this._removeBufferByAccessor(accessorIndex);

                if (removeAccessor !== null) {
                    const buffer = this.getBuffer(removeAccessor).extras!.data as Float32Array;
                    const { attributeOffsets } = this._glTFMesh!.extras!;
                    let bufferOffset = -1;

                    for (const k in attributeOffsets) {
                        if (k === attributeName) {
                            bufferOffset = attributeOffsets[k];
                        }
                        else if (bufferOffset >= 0) {
                            attributeOffsets[attributeName] -= bufferOffset;
                        }
                    }

                    delete attributes[attributeName];
                    delete attributeOffsets[attributeName];
                    this.needUpdate(MeshNeedUpdate.VertexArray | MeshNeedUpdate.VertexBuffer, -1);

                    return buffer;
                }
            }

            return null;
        }
        /**
         * 为该网格添加一个子网格。
         * @param indexCount - 索引的数量。
         * @param materialIndex - 使用的材质索引。
         * - 默认为 `0` ，材质列表中的第一个材质。
         * @param randerMode - 渲染的模式。
         * - 默认为 [gltf.MeshPrimitiveMode.Triangles](gltf.MeshPrimitiveMode.Triangles) 。
         */
        public addSubMesh(indexCount: uint, materialIndex: uint = 0, randerMode: gltf.MeshPrimitiveMode = gltf.MeshPrimitiveMode.Triangles): int {
            if (indexCount <= 0) {
                if (DEBUG) {
                    console.warn("invalid index count.");
                }

                return -1;
            }
            //
            const { buffers, bufferViews, accessors } = this.config;
            const byteLength = indexCount * Uint16Array.BYTES_PER_ELEMENT;
            const bufferIndex = buffers!.length;
            const bufferViewIndex = bufferViews!.length;
            const accessorIndex = accessors!.length;
            buffers![bufferIndex] = { byteLength: byteLength, extras: { data: new Uint16Array(indexCount) } };
            bufferViews![bufferViewIndex] = { buffer: bufferIndex, byteLength: byteLength, target: gltf.BufferViewTarget.ElementArrayBuffer };
            accessors![accessorIndex] = {
                bufferView: bufferIndex,
                count: indexCount, componentType: gltf.ComponentType.UnsignedShort, type: gltf.AccessorType.SCALAR,
                extras: { typeCount: 1, divisor: 0 },
            };
            // 如果第一个子网格没使用顶点索引，则此次添加行为其实是设置第一个子网格。
            const { primitives } = this._glTFMesh!;
            let subMeshIndex: uint;
            let primitive: gltf.MeshPrimitive;

            if (primitives[0].indices === undefined) {
                subMeshIndex = 0;
                primitive = primitives[subMeshIndex];
            }
            else {
                subMeshIndex = primitives.length;
                primitive = primitives[subMeshIndex] = {
                    attributes: this._attributes as any,
                    extras: { needUpdate: MeshNeedUpdate.All, program: null, vaos: null, ibo: null, draw: null },
                };
            }

            primitive.indices = accessorIndex;
            primitive.material = materialIndex;
            primitive.mode = randerMode;
            this.needUpdate(MeshNeedUpdate.VertexArray | MeshNeedUpdate.IndexBuffer, subMeshIndex);

            return subMeshIndex;
        }
        /**
         * 删除该网格的一个子网格。
         * - 仅能删除动态添加的子网格。
         * @param subMeshIndex 子网格索引。
         */
        public removeSubMesh(subMeshIndex: uint): boolean {
            const { primitives, extras } = this._glTFMesh!;
            const primitiveCount = primitives.length;

            if (subMeshIndex < primitiveCount) {
                const primitive = primitives[subMeshIndex];

                if (primitive.indices !== undefined) {
                    const removeAccessor = this._removeBufferByAccessor(primitive.indices);

                    if (removeAccessor !== null) {
                        primitives!.splice(subMeshIndex, 1);
                        this.needUpdate(MeshNeedUpdate.VertexArray | MeshNeedUpdate.IndexBuffer, subMeshIndex);

                        if (extras!.wireframeIndex === subMeshIndex) { // Update wireframe cache.
                            extras!.wireframeIndex = -1;
                        }

                        return true;
                    }
                }
            }

            return false;
        }
        /**
         * 为该网格添加线框子网格。
         * @param materialIndex 该子网格使用的材质索引。
         */
        public addWireframeSubMesh(materialIndex: uint): this {
            const { primitives, extras } = this._glTFMesh!;

            if (extras!.wireframeIndex < 0) {
                let index = 0;
                const wireframeIndices = [] as float[];

                for (const primitive of primitives) {
                    switch (primitive.mode) {
                        case gltf.MeshPrimitiveMode.Triangles:
                        default:
                            if (primitive.indices !== undefined) {
                                const indices = this.getIndices(index)!;

                                for (let i = 0, l = indices.length; i < l; i += 3) {
                                    const a = indices[i];
                                    const b = indices[i + 1];
                                    const c = indices[i + 2];
                                    wireframeIndices.push(a, b, b, c, c, a);
                                }
                            }
                            else {
                                for (let i = 0; i < extras!.vertexCount; i += 3) {
                                    const a = i;
                                    const b = i + 1;
                                    const c = i + 2;
                                    wireframeIndices.push(a, b, b, c, c, a);
                                }
                            }
                            break;

                        case gltf.MeshPrimitiveMode.TrianglesStrip:
                            // TODO
                            break;

                        case gltf.MeshPrimitiveMode.TrianglesFan:
                            // TODO
                            break;
                    }

                    index++;
                }

                if (wireframeIndices.length > 0) {
                    extras!.wireframeIndex = this.addSubMesh(wireframeIndices.length, materialIndex, gltf.MeshPrimitiveMode.Lines);
                    this.setIndices(wireframeIndices, extras!.wireframeIndex);
                }
            }

            return this;
        }
        /**
         * 删除该网格已添加的线框子网格。
         */
        public removeWireframeSubMesh(): this {
            const wireframeIndex = this._glTFMesh!.extras!.wireframeIndex;

            if (wireframeIndex >= 0) {
                this.removeSubMesh(wireframeIndex);
            }

            return this;
        }
        /**
         * 获取该网格顶点的指定属性数据。
         * @param attributeName 属性名。
         * @param offset 顶点偏移。
         * - 默认为 `0` ，从第一个点开始。
         * @param count 顶点数量。
         * - 默认为 `0` ，全部顶点。
         */
        public getAttribute(attributeName: gltf.AttributeSemantics | string, offset: uint = 0, count: uint = 0): Float32Array | null {
            if (attributeName in this._attributes!) {
                const accessor = this.getAccessor(this._attributes![attributeName]);

                // if (offset === 0 && count === 0) {
                //     return this.getBuffer(accessor).extras!.data as Float32Array;
                // }

                return this.createTypeArrayFromAccessor(accessor, offset, count) as Float32Array;
            }

            return null;
        }
        /**
         * 设置该网格指定的顶点属性数据片段。
         * - 该操作始终会写入合适的数据，而不会改变顶点属性长度。
         * @param attributeName 属性名。
         * @param value 属性数据。
         * @param offset 顶点偏移。
         * - 默认为 `0` ，从第一个点开始。
         * @param count 顶点数量。
         * - 默认为 `0` ，全部顶点。
         */
        public setAttribute(attributeName: gltf.AttributeSemantics | string, value: ReadonlyArray<float>, offset: uint = 0, count: uint = 0): Float32Array | null {
            const target = this.getAttribute(attributeName, offset, count);

            if (target !== null) {
                if (attributeName === gltf.AttributeSemantics.POSITION) {
                    this.needUpdate(MeshNeedUpdate.BoundingBox);
                }

                target.set(value);
            }

            return target;
        }
        /**
         * 获取该网格的顶点索引数据。
         * @param subMeshIndex 子网格索引。
         * - 默认为 `0` ，第一个子网格。
         */
        public getIndices(subMeshIndex: uint = 0, offset: uint = 0, count: uint = 0): Uint16Array | null { // TODO Uint32Array
            const { primitives } = this._glTFMesh!;

            if (0 <= subMeshIndex && subMeshIndex < primitives.length) {
                const accessorIndex = primitives[subMeshIndex].indices;

                if (accessorIndex !== undefined) {
                    const accessor = this.getAccessor(accessorIndex);

                    // if (offset === 0 && count === 0) {
                    //     return this.getBuffer(accessor).extras!.data as Float32Array;
                    // }

                    return this.createTypeArrayFromAccessor(accessor, offset, count) as Uint16Array;
                }

                return null;
            }

            console.warn("Error arguments.");

            return null;
        }
        /**
         * 设置该网格的顶点索引数据。
         * @param value 顶点索引数据。
         * @param subMeshIndex 子网格索引。
         * - 默认为 `0` ，第一个子网格。
         * @param offset 索引偏移。
         * - 默认为 `0`，从第一个索引开始。
         */
        public setIndices(value: ReadonlyArray<uint>, subMeshIndex: uint = 0, offset: uint = 0, count: uint = 0): Uint16Array | null {
            const target = this.getIndices(subMeshIndex, offset, count);

            if (target !== null) {
                target.set(value);
            }

            return target;
        }
        /**
         * 获取该网格顶点的位置属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getVertices(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttribute(gltf.AttributeSemantics.POSITION, offset, count);
        }
        /**
         * 获取该网格顶点的 UV 属性数据。
         * - u0, v0, u1, v1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getUVs(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttribute(gltf.AttributeSemantics.TEXCOORD_0, offset, count);
        }
        /**
         * 获取该网格顶点的颜色属性数据。
         * - r0, g0, b0, a0, r1, g1, b1, a1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getColors(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttribute(gltf.AttributeSemantics.COLOR_0, offset, count);
        }
        /**
         * 获取该网格顶点的法线属性数据。
         * - x0, y0, z0, x1, y1, z1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getNormals(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttribute(gltf.AttributeSemantics.NORMAL, offset, count);
        }
        /**
         * 获取该网格顶点的切线属性数据。
         * - x0, y0, z0, w0,  x1, y1, z1, w1, ...
         * @param offset 顶点偏移。（默认从第一个点开始）
         * @param count 顶点数。（默认全部顶点）
         */
        public getTangents(offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttribute(gltf.AttributeSemantics.TANGENT, offset, count);
        }
        /**
         * 当修改该网格的顶点属性后，调用此方法来更新顶点属性的缓冲区。
         * @param uploadAttributes 
         * @param offset 顶点偏移。（默认不偏移）
         * @param count 顶点总数。（默认全部顶点）
         */
        public uploadVertexBuffer<T extends gltf.AttributeSemantics | string>(uploadAttributes: T | ReadonlyArray<T> | null = null, offset: uint = 0, count: uint = 0): void { }
        /**
         * 当修改该网格的顶点索引后，调用此方法来更新顶点索引的缓冲区。
         * @param subMeshIndex 子网格索引。（默认第一个子网格）
         */
        public uploadSubIndexBuffer(subMeshIndex: uint = 0, offset: uint = 0, count: uint = 0): void { }
        /**
         * 该网格的渲染模式。
         */
        public get drawMode(): gltf.DrawMode {
            return this._glTFMesh!.extras!.drawMode;
        }
        public set drawMode(value: gltf.DrawMode) {
            this._glTFMesh!.extras!.drawMode = value;
            this.needUpdate(MeshNeedUpdate.DrawMode);
        }
        /**
         * 该网格的顶点总数。
         */
        public get vertexCount(): uint {
            return this._glTFMesh!.extras!.vertexCount;
        }
        /**
         * 该网格的子网格总数。
         */
        public get subMeshCount(): uint {
            return this._glTFMesh!.primitives.length;
        }
        /**
         * 该网格的顶点包围盒数据。
         */
        public get boundingBox(): Readonly<Box> {
            this.update(MeshNeedUpdate.BoundingBox);

            return this._boundingBox;
        }
        /**
         * 获取该网格的 glTF 网格数据。
         */
        public get glTFMesh(): GLTFMesh {
            return this._glTFMesh!;
        }
        /**
         * 该网格的全部顶点属性名称。
         */
        public get attributes(): Readonly<{ [key: string]: gltf.Index }> {
            return this._attributes!;
        }
        /**
         * @ignore
         */
        public get boneIndices(): Readonly<{ [key: string]: uint }> | null {
            const config = this.config;

            if (this._boneIndices === null && config.skins !== undefined) {
                const nodeIndices = this._boneIndices = {} as { [key: string]: uint };

                for (const joint of config.skins![0].joints) {
                    const node = config.nodes![joint];
                    nodeIndices[node.name!] = joint;
                }
            }

            return this._boneIndices;
        }
        /**
         * @ignore
         */
        public get inverseBindMatrices(): ArrayBufferView | null {
            const { config } = this;

            if (this._inverseBindMatrices === null && config.skins !== undefined) {
                // Mast be skinned mesh if has skin.
                // Skinned mesh mast has inverseBindMatrices.
                this._inverseBindMatrices = this.createTypeArrayFromAccessor(this.getAccessor(config.skins![0].inverseBindMatrices!));
            }

            return this._inverseBindMatrices;
        }

        /**
         * @deprecated
         */
        public getAttributes(attributeName: gltf.AttributeSemantics | string, offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.getAttribute(attributeName, offset, count);
        }
        /**
         * @deprecated
         */
        public setAttributes(attributeName: gltf.AttributeSemantics | string, value: ReadonlyArray<float>, offset: uint = 0, count: uint = 0): Float32Array | null {
            return this.setAttribute(attributeName, value, offset, count);
        }
    }
}
