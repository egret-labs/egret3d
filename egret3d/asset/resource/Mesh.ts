namespace egret3d {
    export const enum MeshDrawMode {
        Static = 1,
        Dynamic = 2,
        Stream = 3,
    }

    const helpVec3_1: Vector3 = new Vector3();
    const helpVec3_2: Vector3 = new Vector3();
    const helpVec3_3: Vector3 = new Vector3();
    const helpVec3_4: Vector3 = new Vector3();
    const helpVec3_5: Vector3 = new Vector3();
    const helpVec3_6: Vector3 = new Vector3();
    const helpVec3_7: Vector3 = new Vector3();
    // const helpVec3_8: Vector3 = new Vector3();

    /**
     * Mesh.
     * @version egret3D 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 网格模型。
     * @version egret3D 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Mesh extends paper.SerializableObject {
        /**
         * 
         */
        public vertexCount: number = 0;
        /**
         * true :所有subMesh公用一个buffer; false :每个subMesh使用单独的buffer
         * 
         */
        public isSharedBuffer: boolean = true;
        @paper.serializedField
        protected _drawMode: MeshDrawMode = MeshDrawMode.Static; // TODO
        /**
         * 
         */
        public _version: number = 0;
        @paper.serializedField
        protected _glTFMeshIndex: number = 0;
        @paper.serializedField
        protected _glTFAsset: GLTFAsset = null as any;
        protected _glTFMesh: gltf.Mesh = null as any;
        protected _vertexBuffer: Float32Array = null as any;

        /**
         * 暂时实现在这里，应该下放到 web，并将此方法抽象。
         */
        public readonly ibos: (WebGLBuffer | null)[] = [];
        public vbo: WebGLBuffer = null as any;
        protected _getDrawMode(mode: MeshDrawMode) {
            const webgl = WebGLKit.webgl;

            switch (mode) {
                case MeshDrawMode.Static:
                    return webgl.STATIC_DRAW;

                case MeshDrawMode.Dynamic:
                    return webgl.DYNAMIC_DRAW;

                case MeshDrawMode.Stream:
                    return webgl.STREAM_DRAW;
            }

            throw new Error();
        }

        protected _cacheVertexCount(): void {
            const primitives = this._glTFMesh.primitives;

            let isSameAccessor = true;
            let firstPosAccessor = primitives[0].attributes.POSITION;
            for (let i = 1; i < primitives.length; i++) {
                const posAccessor = primitives[i].attributes.POSITION;
                if (posAccessor !== firstPosAccessor) {
                    isSameAccessor = false;
                    break;
                }
            }

            this.vertexCount = 0;
            //
            if (isSameAccessor) {
                this.vertexCount = this.getVertexCount();
            } else {
                for (let i = 0; i < primitives.length; i++) {
                    this.vertexCount += this.getVertexCount(i);
                }
            }
        }

        public constructor(vertexCountOrVertices: number | Float32Array, indexCountOrIndices: number | Uint16Array | null, firstIndexCount: number, attributeNames: gltf.MeshAttributeType[], drawMode?: MeshDrawMode);
        public constructor(vertexCountOrVertices: number | Float32Array, indexCountOrIndices: number | Uint16Array | null, attributeNames: gltf.MeshAttributeType[], drawMode?: MeshDrawMode);
        public constructor(gltfAsset: GLTFAsset, gltfMeshIndex: number, drawMode?: MeshDrawMode);
        public constructor(...args: any[]) {
            super();

            if (args.length === 0) {
                return;
            }

            if ((args[0] instanceof GLTFAsset)) { // Shared mesh.
                this._drawMode = args[2] || MeshDrawMode.Static;
                this._glTFMeshIndex = args[1];
                this._glTFAsset = args[0];
            }
            else { // Custom mesh.
                const isSubIndexCountParameter = typeof args[2] === "number";
                this._drawMode = (isSubIndexCountParameter ? args[4] : args[3]) || MeshDrawMode.Static;

                // Create gltf asset.
                this._glTFAsset = GLTFAsset.createGLTFAsset();
                this._glTFAsset.config.buffers = [{ byteLength: 0 }];
                this._glTFAsset.config.bufferViews = [{ buffer: 0, byteOffset: 0, byteLength: 0, target: gltf.BufferViewTarget.ArrayBuffer }];
                this._glTFAsset.config.accessors = [];
                this._glTFMesh = { primitives: [{ attributes: { POSITION: 0 } }] };
                this._glTFAsset.config.meshes = [this._glTFMesh];
                //
                const attributeNames = (isSubIndexCountParameter ? args[3] : args[2]) as gltf.MeshAttributeType[];
                const buffer = this._glTFAsset.config.buffers[0];
                const vertexBufferView = this._glTFAsset.config.bufferViews[0];
                const accessors = this._glTFAsset.config.accessors as gltf.Accessor[];
                const primitive = this._glTFMesh.primitives[0];
                const { attributes } = primitive;

                { // Vertices.
                    const isVertexCountParameter = typeof args[0] === "number";
                    const vertexBuffer = isVertexCountParameter ? null : args[0] as Float32Array;
                    const count = isVertexCountParameter ? args[0] as number : this._getVertexCountFromBuffer(vertexBuffer as Float32Array, attributeNames);

                    for (const attributeName of attributeNames) { // Create
                        const type = GLTFAsset.getMeshAttributeType(attributeName);
                        const byteOffset = vertexBufferView.byteLength;
                        vertexBufferView.byteLength += count * GLTFAsset.getAccessorTypeCount(type) * Float32Array.BYTES_PER_ELEMENT;
                        attributes[attributeName] = accessors.length;
                        accessors.push({
                            bufferView: 0,
                            byteOffset,
                            count,
                            componentType: gltf.ComponentType.Float,
                            type,
                        });
                    }

                    buffer.byteLength = vertexBufferView.byteLength;

                    if (isVertexCountParameter) {
                        this._glTFAsset.buffers[0] = new Float32Array(vertexBufferView.byteLength);
                    }
                    else {
                        this._glTFAsset.buffers[0] = vertexBuffer as Float32Array;
                    }
                }

                if (args[1]) {
                    const isIndexCountParameter = typeof args[1] === "number";
                    const indexBuffer = isIndexCountParameter ? null : args[1] as Uint16Array;
                    const totalCount = isIndexCountParameter ? args[1] as number : (indexBuffer as Uint16Array).length;
                    const count = isSubIndexCountParameter ? args[2] as number : totalCount;
                    const indexBufferView = this._glTFAsset.config.bufferViews[1] = {
                        buffer: 1,
                        byteOffset: 0,
                        byteLength: totalCount * GLTFAsset.getAccessorTypeCount(gltf.AccessorType.SCALAR) * Uint16Array.BYTES_PER_ELEMENT,
                        target: gltf.BufferViewTarget.ElementArrayBuffer,
                    };
                    primitive.indices = accessors.length;
                    accessors.push({
                        bufferView: 1, byteOffset: 0, count: count,
                        componentType: gltf.ComponentType.UnsignedShort, type: gltf.AccessorType.SCALAR,
                    });

                    this._glTFAsset.config.buffers[1] = { byteLength: indexBufferView.byteLength };

                    if (isIndexCountParameter) {
                        this._glTFAsset.buffers[1] = new Uint16Array(indexBufferView.byteLength / Uint16Array.BYTES_PER_ELEMENT);
                    }
                    else {
                        this._glTFAsset.buffers[1] = indexBuffer as Uint16Array;
                    }
                }
            }

            this.initialize();
        }

        private _getVertexCountFromBuffer(vertexBuffer: Float32Array, attributeNames: gltf.MeshAttributeType[]) {
            let vertexPerCount = 0;

            for (const attributeName of attributeNames) {
                vertexPerCount += GLTFAsset.getAccessorTypeCount(GLTFAsset.getMeshAttributeType(attributeName));
            }

            return vertexBuffer.length / vertexPerCount;
        }

        /**
         * @inheritDoc
         */
        public serialize() {
            if (!this._glTFAsset.url) {
                return null;
            }

            const target = paper.serializeRC(this);
            target._glTFMeshIndex = this._glTFMeshIndex;
            target._glTFAsset = paper.serializeAsset(this._glTFAsset);

            return target;
        }

        /**
         * @inheritDoc
         */
        public deserialize(element: any) {
            this._glTFMeshIndex = (element._glTFMeshIndex);
            this._glTFAsset = paper.getDeserializedObject(element._glTFAsset) as GLTFAsset;

            this.initialize();
        }
        /**
         * @inheritDoc
         */
        public dispose() {
            const webgl = WebGLKit.webgl;

            if (this.vbo) {
                webgl.deleteBuffer(this.vbo);
            }

            for (const ibo of this.ibos) {
                webgl.deleteBuffer(ibo);
            }

            this.vbo = null;

            this._glTFAsset = null as any;
            this._glTFMesh = null as any;
            this._vertexBuffer = null as any;
        }
        /**
         * @inheritDoc
         */
        public caclByteLength() {
            return 0;
        }
        /**
         * 
         */
        public initialize(drawMode?: MeshDrawMode) {
            if (this._vertexBuffer) {
                // console.warn("The mesh instance bas been initialized.");
                return;
            }

            const config = this._glTFAsset.config;
            if (
                !config.buffers ||
                !config.bufferViews ||
                !config.accessors ||
                !config.meshes ||
                config.meshes.length <= this._glTFMeshIndex
            ) {
                console.error("Error glTF asset.");
                return;
            }

            this._drawMode = drawMode || MeshDrawMode.Static;
            this._glTFMesh = config.meshes[this._glTFMeshIndex];
            //
            const vertexBufferViewAccessor = this._glTFAsset.getAccessor(this._glTFMesh.primitives[0].attributes.POSITION);
            this._vertexBuffer = this._glTFAsset.createTypeArrayFromBufferView(this._glTFAsset.getBufferView(vertexBufferViewAccessor), gltf.ComponentType.Float) as any;
            this._cacheVertexCount();

            // 暂时实现在这里，应该下放到 web，并将此类抽象。
            const webgl = WebGLKit.webgl;
            const vbo = webgl.createBuffer();

            if (vbo) {
                this.vbo = vbo;
                webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);
                webgl.bufferData(webgl.ARRAY_BUFFER, this._vertexBuffer.byteLength, this._getDrawMode(this._drawMode));

                let subMeshIndex = 0;
                for (const primitive of this._glTFMesh.primitives) {
                    const attributeNames: gltf.MeshAttributeType[] = [];
                    for (const k in primitive.attributes) {
                        attributeNames.push(k as gltf.MeshAttributeType);
                    }

                    this.uploadSubVertexBuffer(attributeNames, subMeshIndex);

                    if (primitive.indices !== undefined) {
                        const accessor = this._glTFAsset.getAccessor(primitive.indices);
                        const ibo = webgl.createBuffer();

                        if (ibo) {
                            this.ibos.push(ibo);
                            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, this._glTFAsset.getBufferLength(accessor), this._getDrawMode(this._drawMode));
                            this.uploadSubIndexBuffer(subMeshIndex);
                        }
                        else {
                            this.ibos.push(null);
                            console.log("Create webgl element buffer error.");
                        }
                    }
                    else {
                        this.ibos.push(null);
                    }

                    subMeshIndex++;
                }
            }
            else {
                console.log("Create webgl buffer error.");
            }
        }

        public addSubMesh(indexOffset: number, indexCount: number, materialIndex: number = 0, sourceSubMeshIndex: number = 0) {
            if (0 <= sourceSubMeshIndex && sourceSubMeshIndex < this._glTFMesh.primitives.length) {
                const sourcePrimitive = this._glTFMesh.primitives[sourceSubMeshIndex];
                const sourceIndiceAccessor = this._glTFAsset.getAccessor(sourcePrimitive.indices || 0);

                const webgl = WebGLKit.webgl;
                const primitive = {
                    attributes: sourcePrimitive.attributes,
                    indices: this._glTFAsset.config.accessors.length,
                    material: materialIndex,
                };
                this._glTFMesh.primitives.push(primitive);

                this._glTFAsset.config.accessors.push(
                    {
                        bufferView: sourceIndiceAccessor.bufferView,
                        byteOffset: indexOffset * GLTFAsset.getComponentTypeCount(gltf.ComponentType.UnsignedShort) * GLTFAsset.getAccessorTypeCount(gltf.AccessorType.SCALAR),
                        count: indexCount,
                        componentType: gltf.ComponentType.UnsignedShort,
                        type: gltf.AccessorType.SCALAR,
                    }
                );

                const accessor = this._glTFAsset.getAccessor(primitive.indices);
                const ibo = webgl.createBuffer();

                if (ibo) {
                    this.ibos.push(ibo);
                    webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                    webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, this._glTFAsset.getBufferLength(accessor), this._getDrawMode(this._drawMode));
                }
                else {
                    this.ibos.push(null);
                    console.log("Create webgl element buffer error.");
                }

                return this._glTFMesh.primitives.length - 1;
            }

            console.warn("Error arguments.");

            return -1;
        }

        public getVertexCount(subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh.primitives.length) {
                const accessor = this._glTFAsset.getAccessor(this._glTFMesh.primitives[subMeshIndex].attributes.POSITION);
                return accessor.count;
            }

            console.warn("Error arguments.");

            return 0;
        }

        public getVertexPosition(vertexIndex: number, subMeshIndex: number = 0, result?: Vector3) {
            return this.getVertexAttribute(vertexIndex, gltf.MeshAttributeType.POSITION, subMeshIndex, result);
        }

        public setVertexPosition(vertexIndex: number, vertex: Vector3, subMeshIndex: number = 0) {
            this.setVertexAttribute(vertexIndex, gltf.MeshAttributeType.POSITION, subMeshIndex, vertex.x, vertex.y, vertex.z);
        }

        public getVertices(subMeshIndex: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.POSITION, subMeshIndex) as Float32Array;
        }

        public getUVs(subMeshIndex: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TEXCOORD_0, subMeshIndex) as Float32Array;
        }

        public getColors(subMeshIndex: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.COLOR_0, subMeshIndex) as Float32Array;
        }

        public getNormals(subMeshIndex: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.NORMAL, subMeshIndex) as Float32Array;
        }

        public getTangents(subMeshIndex: number = 0) {
            return this.getAttributes(gltf.MeshAttributeType.TANGENT, subMeshIndex) as Float32Array;
        }

        public getAttributes(attributeType: gltf.MeshAttributeType, subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh.primitives.length) {
                const accessorIndex = this._glTFMesh.primitives[subMeshIndex].attributes[attributeType] || 0;
                const accessor = this._glTFAsset.getAccessor(accessorIndex);

                return this._glTFAsset.createTypeArrayFromAccessor(accessor);
            }

            console.warn("Error arguments.");

            return null;
        }

        public getIndices(subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh.primitives.length) {
                const accessorIndex = this._glTFMesh.primitives[subMeshIndex].indices || 0;
                const accessor = this._glTFAsset.getAccessor(accessorIndex);

                return this._glTFAsset.createTypeArrayFromAccessor(accessor) as Uint16Array;
            }

            console.warn("Error arguments.");

            return null;
        }

        public getVertexAttribute<T extends (Vector4 | Vector3 | Vector2)>(vertexIndex: number, attributeType: gltf.MeshAttributeType, subMeshIndex: number = 0, result?: T) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh.primitives.length) {
                const attributeIndex = this._glTFMesh.primitives[subMeshIndex].attributes[attributeType];
                if (attributeIndex !== undefined) {
                    const accessor = this._glTFAsset.getAccessor(attributeIndex);
                    if (0 <= vertexIndex && vertexIndex < accessor.count) {
                        const offset = this._glTFAsset.getBufferOffset(accessor) / GLTFAsset.getComponentTypeCount(accessor.componentType) + vertexIndex * GLTFAsset.getAccessorTypeCount(accessor.type);

                        switch (accessor.type) {
                            case gltf.AccessorType.VEC2: {
                                if (!result) {
                                    result = new Vector2() as any;
                                }

                                (result as Vector2).x = this._vertexBuffer[offset];
                                (result as Vector2).y = this._vertexBuffer[offset + 1];
                                break;
                            }

                            case gltf.AccessorType.VEC3: {
                                if (!result) {
                                    result = new Vector3() as any;
                                }

                                (result as Vector3).x = this._vertexBuffer[offset];
                                (result as Vector3).y = this._vertexBuffer[offset + 1];
                                (result as Vector3).z = this._vertexBuffer[offset + 2];
                                break;
                            }

                            case gltf.AccessorType.VEC4: {
                                if (!result) {
                                    result = new Vector4() as any;
                                }

                                (result as Vector4).x = this._vertexBuffer[offset];
                                (result as Vector4).y = this._vertexBuffer[offset + 1];
                                (result as Vector4).z = this._vertexBuffer[offset + 2];
                                (result as Vector4).w = this._vertexBuffer[offset + 3];
                                break;
                            }
                        }

                        return result;
                    }
                }
            }

            console.warn("Error arguments.");

            return result;
        }

        public setVertexAttribute(vertexIndex: number, attributeType: gltf.MeshAttributeType, subMeshIndex: number, ...args: number[]) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh.primitives.length) {
                const attributeIndex = this._glTFMesh.primitives[subMeshIndex].attributes[attributeType];
                if (attributeIndex !== undefined) {
                    const accessor = this._glTFAsset.getAccessor(attributeIndex);
                    if (0 <= vertexIndex && vertexIndex < accessor.count) {
                        const offset = this._glTFAsset.getBufferOffset(accessor) / GLTFAsset.getComponentTypeCount(accessor.componentType) + vertexIndex * GLTFAsset.getAccessorTypeCount(accessor.type);

                        switch (accessor.type) {
                            case gltf.AccessorType.VEC2: {
                                this._vertexBuffer[offset] = args[0];
                                this._vertexBuffer[offset + 1] = args[1];
                                break;
                            }

                            case gltf.AccessorType.VEC3: {
                                this._vertexBuffer[offset] = args[0];
                                this._vertexBuffer[offset + 1] = args[1];
                                this._vertexBuffer[offset + 2] = args[2];
                                break;
                            }

                            case gltf.AccessorType.VEC4: {
                                this._vertexBuffer[offset] = args[0];
                                this._vertexBuffer[offset + 1] = args[1];
                                this._vertexBuffer[offset + 2] = args[2];
                                this._vertexBuffer[offset + 3] = args[3];
                                break;
                            }
                        }
                    }
                }
            }
            else {
                console.warn("Error arguments.");
            }
        }
        /**
         * 暂时实现在这里，应该下放到 web，并将此方法抽象。
         */
        public uploadSubVertexBuffer(uploadAttributes: gltf.MeshAttributeType | (gltf.MeshAttributeType[]), subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh.primitives.length) {
                const webgl = WebGLKit.webgl;
                const primitive = this._glTFMesh.primitives[subMeshIndex];
                const attributes = primitive.attributes;
                webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);

                if (typeof uploadAttributes === "string") {
                    const accessorIndex = attributes[uploadAttributes];
                    if (accessorIndex !== undefined) {
                        const accessor = this._glTFAsset.getAccessor(accessorIndex);
                        const bufferOffset = this._glTFAsset.getBufferOffset(accessor);
                        const subVertexBuffer = this._glTFAsset.createTypeArrayFromAccessor(accessor);
                        webgl.bufferSubData(webgl.ARRAY_BUFFER, bufferOffset, subVertexBuffer);
                    }
                    else {
                        console.warn("Error arguments.");
                    }
                }
                else {
                    for (const attributeName of uploadAttributes) {
                        const accessorIndex = attributes[attributeName];
                        if (accessorIndex !== undefined) {
                            const accessor = this._glTFAsset.getAccessor(accessorIndex);
                            const bufferOffset = this._glTFAsset.getBufferOffset(accessor);
                            const subVertexBuffer = this._glTFAsset.createTypeArrayFromAccessor(accessor);
                            webgl.bufferSubData(webgl.ARRAY_BUFFER, bufferOffset, subVertexBuffer);
                        }
                        else {
                            console.warn("Error arguments.");
                        }
                    }
                }

                this._version++;
            }
            else {
                console.warn("Error arguments.");
            }
        }
        /**
         * 暂时实现在这里，应该下放到 web，并将此方法抽象。
         */
        public uploadSubIndexBuffer(subMeshIndex: number = 0) {
            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh.primitives.length) {
                const webgl = WebGLKit.webgl;
                const primitive = this._glTFMesh.primitives[subMeshIndex];

                if (primitive.indices !== undefined) {
                    const accessor = this._glTFAsset.getAccessor(primitive.indices);
                    // const bufferOffset = this._glTFAsset.getBufferOffset(accessor);
                    const subIndexBuffer = this._glTFAsset.createTypeArrayFromAccessor(accessor);
                    const ibo = this.ibos[subMeshIndex];

                    if (ibo) {
                        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                        //ibo每个单独上传，偏移一直是0
                        webgl.bufferSubData(webgl.ELEMENT_ARRAY_BUFFER, 0, subIndexBuffer);
                        this._version++;
                    }
                    else {
                        console.error("Error webgl element buffer.");
                    }
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
         * 检测射线碰撞
         * @param ray 射线
         * @param matrix 所在transform的矩阵
         * 
         */
        public intersects(ray: Ray, matrix: Matrix) {
            let pickInfo: PickInfo | null = null; // TODO
            let subMeshIndex = 0;

            for (const primitive of this._glTFMesh.primitives) {
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
                        const indexAccessor = this._glTFAsset.getAccessor(primitive.indices);
                        const indexBufferOffset = this._glTFAsset.getBufferOffset(indexAccessor); // TODO
                        const t0 = helpVec3_1;
                        const t1 = helpVec3_2;
                        const t2 = helpVec3_3;

                        for (let i = 0; i < indexAccessor.count; i += 3) {
                            const p0 = this.getVertexPosition(indices[i], subMeshIndex, helpVec3_4) as Vector3;
                            const p1 = this.getVertexPosition(indices[i + 1], subMeshIndex, helpVec3_5) as Vector3;
                            const p2 = this.getVertexPosition(indices[i + 2], subMeshIndex, helpVec3_6) as Vector3;

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
                                    pickInfo.triangleIndex = (indexBufferOffset + i) / 3; // TODO
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

                subMeshIndex++;
            }

            return pickInfo;
        }
        /**
         * 获取子网格数量。
         */
        public get subMeshCount() {
            return this._glTFMesh.primitives.length;
        }
        /**
         * 获取 mesh 数据所属的 glTF 资源。
         */
        public get glTFAsset() {
            return this._glTFAsset;
        }
        /**
         * 获取 glTFMesh 数据。
         */
        public get glTFMesh() {
            return this._glTFMesh;
        }
        // /**
        //  * 所有顶点属性。
        //  */
        // public get vertexBuffer() {
        //     return this._vertexBuffer;
        // }
    }
}