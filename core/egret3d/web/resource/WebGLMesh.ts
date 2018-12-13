namespace egret3d.web {
    /**
     * @internal
     */
    export class WebGLMesh extends Mesh {
        public readonly ibos: (WebGLBuffer | null)[] = [];
        public vbo: WebGLBuffer | null = null;

        public dispose() {
            if (!super.dispose()) {
                return false;
            }
            //
            const webgl = WebGLRenderState.webgl!;
            this.vbo && webgl.deleteBuffer(this.vbo);

            for (const ibo of this.ibos) {
                ibo && webgl.deleteBuffer(ibo);
            }
            //
            this.ibos.length = 0;
            this.vbo = null;

            return true;
        }

        public createBuffer() {
            const vertexBufferViewAccessor = this.getAccessor(this._glTFMesh!.primitives[0].attributes.POSITION || 0);
            const vertexBuffer = this.createTypeArrayFromBufferView(this.getBufferView(vertexBufferViewAccessor), gltf.ComponentType.Float);
            const webgl = WebGLRenderState.webgl!;
            const vbo = webgl.createBuffer();

            if (vbo) {
                this.vbo = vbo;

                const attributeNames: gltf.AttributeSemantics[] = [];
                for (const k in this._glTFMesh!.primitives[0].attributes) {
                    attributeNames.push(k as gltf.AttributeSemantics);
                }

                let subMeshIndex = 0;
                for (const primitive of this._glTFMesh!.primitives) {
                    if (primitive.indices !== undefined) {
                        const ibo = webgl.createBuffer();
                        if (ibo) {
                            this.ibos[subMeshIndex] = ibo;
                            webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, ibo);
                            webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, this.getBufferLength(this.getAccessor(primitive.indices)), this._drawMode);
                            this.uploadSubIndexBuffer(subMeshIndex);
                        }
                        else {
                            this.ibos[subMeshIndex] = null;
                            console.error("Create webgl element buffer error.");
                        }
                    }

                    subMeshIndex++;
                }

                webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);
                webgl.bufferData(webgl.ARRAY_BUFFER, vertexBuffer.byteLength, this._drawMode);
                this.uploadVertexBuffer(attributeNames);
            }
            else {
                console.error("Create webgl buffer error.");
            }
        }
        /**
         * 更新该网格的顶点缓存。
         * @param uploadAttributes 要更新的顶点属性名，可以为一个属性，或属性列表，或 `null` （更新所有属性）。
         * @param offset 更新顶点的偏移。 [0: 不偏移，N: 从 N + 1 个顶点开始] （默认：0）
         * @param count 更新顶点的总数。 [0: 所有顶点，N: N 个顶点] （默认：0）
         */
        public uploadVertexBuffer(uploadAttributes: gltf.AttributeSemantics | (gltf.AttributeSemantics[]) | null = null, offset: uint = 0, count: uint = 0) {
            if (!this.vbo) {
                return;
            }

            const { attributes } = this._glTFMesh!.primitives[0];
            const webgl = WebGLRenderState.webgl!;
            webgl.bindBuffer(webgl.ARRAY_BUFFER, this.vbo);

            if (!uploadAttributes) {
                uploadAttributes = [];
                for (const k in this._glTFMesh!.primitives[0].attributes) {
                    uploadAttributes.push(k as gltf.AttributeSemantics);
                }
            }

            if (Array.isArray(uploadAttributes)) {
                for (const attributeName of uploadAttributes) {
                    const accessorIndex = attributes[attributeName];
                    if (accessorIndex !== undefined) {
                        const accessor = this.getAccessor(accessorIndex);
                        let bufferOffset = this.getBufferOffset(accessor);
                        const subVertexBuffer = this.createTypeArrayFromAccessor(accessor, offset, count);
                        if (offset > 0) {
                            bufferOffset += offset * accessor.typeCount! * GLTFAsset.getComponentTypeCount(accessor.componentType);
                        }
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
         * 更新该网格的索引缓存。
         * @param subMeshIndex 
         */
        public uploadSubIndexBuffer(subMeshIndex: number = 0) {
            if (!this.vbo) {
                return;
            }

            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh!.primitives.length) {
                const primitive = this._glTFMesh!.primitives[subMeshIndex];

                if (primitive.indices !== undefined) {
                    const accessor = this.getAccessor(primitive.indices);
                    const subIndexBuffer = this.createTypeArrayFromAccessor(accessor);
                    const ibo = this.ibos[subMeshIndex];
                    const webgl = WebGLRenderState.webgl!;
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
    }
    // Retargeting.
    egret3d.Mesh = WebGLMesh;
}