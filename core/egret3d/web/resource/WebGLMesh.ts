namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLMesh extends Mesh {
        public readonly ibos: (WebGLBuffer | null)[] = [];
        public vao: WebGLBuffer | null = null;
        public vbo: WebGLBuffer | null = null;
        public program: WebGLProgramBinder | null = null;

        public onReferenceCountChange(isZero: boolean) {
            if (isZero && this.vbo !== null) {
                const webgl = WebGLRenderState.webgl!;

                if (this.vao !== null) {
                    renderState.vertexArrayObject!.deleteVertexArrayOES(this.vao);
                }

                webgl.deleteBuffer(this.vbo);

                for (const ibo of this.ibos) {
                    ibo && webgl.deleteBuffer(ibo);
                }
                //
                this.ibos.length = 0;
                this.vao = null;
                this.vbo = null;
                this.program = null;

                return true;
            }

            return false;
        }

        public createBuffer() {
            const webgl = WebGLRenderState.webgl!;
            const primitives = this._glTFMesh!.primitives;
            const vertexArrayObject = renderState.vertexArrayObject;

            if (vertexArrayObject !== null) {
                const vao = vertexArrayObject.createVertexArrayOES();

                if (vao !== null) {
                    this.vao = vao;
                    vertexArrayObject.bindVertexArrayOES(vao);
                }
                else {
                    console.error("Create webgl vertex array object error.");
                }
            }

            const vbo = webgl.createBuffer();

            if (vbo !== null) {
                this.vbo = vbo;

                const attributeNames: gltf.AttributeSemantics[] = [];
                for (const k in this._attributes!) {
                    attributeNames.push(k as gltf.AttributeSemantics);
                }

                let subMeshIndex = 0;
                for (const primitive of primitives) {
                    if (primitive.indices !== undefined) {
                        const ibo = webgl.createBuffer();
                        if (ibo) {
                            this.ibos[subMeshIndex] = ibo;

                            webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, ibo);
                            webgl.bufferData(gltf.BufferViewTarget.ElementArrayBuffer, this.getBufferLength(this.getAccessor(primitive.indices)), this._drawMode);
                            this.uploadSubIndexBuffer(subMeshIndex);
                        }
                        else {
                            this.ibos[subMeshIndex] = null;
                            console.error("Create webgl array element buffer error.");
                        }
                    }

                    subMeshIndex++;
                }

                const vertexBufferViewAccessor = this.getAccessor(this._glTFMesh!.primitives[0].attributes.POSITION || 0);
                const vertexBuffer = this.createTypeArrayFromBufferView(this.getBufferView(vertexBufferViewAccessor), gltf.ComponentType.Float);
                webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, vbo);
                webgl.bufferData(gltf.BufferViewTarget.ArrayBuffer, vertexBuffer.byteLength, this._drawMode);
                this.uploadVertexBuffer(attributeNames);
            }
            else {
                console.error("Create webgl array buffer error.");
            }
        }

        public uploadVertexBuffer<T extends gltf.AttributeSemantics | string>(uploadAttributes: T | ReadonlyArray<T> | null = null, offset: uint = 0, count: uint = 0): void {
            if (this.vbo === null) {
                return;
            }

            const webgl = WebGLRenderState.webgl!;
            const attributes = this._attributes!;

            if (this.vao !== null) {
                renderState.vertexArrayObject!.bindVertexArrayOES(this.vao);
            }

            webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, this.vbo);

            if (uploadAttributes === null) {
                uploadAttributes = [];

                for (const k in this._attributes) {
                    (uploadAttributes as T[]).push(k as T);
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
                            bufferOffset += offset * accessor.extras!.typeCount * GLTFAsset.getComponentTypeCount(accessor.componentType);
                        }

                        webgl.bufferSubData(gltf.BufferViewTarget.ArrayBuffer, bufferOffset, subVertexBuffer);
                    }
                    else {
                        console.warn("Error arguments.");
                    }
                }
            }
            else {
                const accessorIndex = attributes[uploadAttributes as string];

                if (accessorIndex !== undefined) {
                    const accessor = this.getAccessor(accessorIndex);
                    let bufferOffset = this.getBufferOffset(accessor);

                    if (offset > 0) {
                        bufferOffset += offset * accessor.extras!.typeCount * GLTFAsset.getComponentTypeCount(accessor.componentType);
                    }

                    const subVertexBuffer = this.createTypeArrayFromAccessor(accessor);
                    webgl.bufferSubData(gltf.BufferViewTarget.ArrayBuffer, bufferOffset, subVertexBuffer);
                }
                else {
                    console.warn("Error arguments.");
                }
            }
        }

        public uploadSubIndexBuffer(subMeshIndex: number = 0, offset: uint = 0, count: uint = 0) {
            if (this.vbo === null) {
                return;
            }

            if (0 <= subMeshIndex && subMeshIndex < this._glTFMesh!.primitives.length) {
                const primitive = this._glTFMesh!.primitives[subMeshIndex];

                if (primitive.indices !== undefined) {
                    const accessor = this.getAccessor(primitive.indices);
                    const subIndexBuffer = this.createTypeArrayFromAccessor(accessor, offset, count);
                    const ibo = this.ibos[subMeshIndex];
                    const webgl = WebGLRenderState.webgl!;

                    if (this.vao !== null) {
                        renderState.vertexArrayObject!.bindVertexArrayOES(this.vao);
                    }

                    webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, ibo);
                    webgl.bufferSubData(gltf.BufferViewTarget.ElementArrayBuffer, 0, subIndexBuffer);
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
