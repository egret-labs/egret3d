namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLMesh extends Mesh {
        private _bindVAO() {
            const webgl = WebGLRenderState.webgl!;
            const glTFMeshExtras = this._glTFMesh!.extras!;

            if (glTFMeshExtras.vao === null && renderState.vertexArrayObject !== null) {
                const vao = webgl.createVertexArray();

                if (vao !== null) {
                    glTFMeshExtras.vao = vao;
                }
                else {
                    console.error("Create webgl vertex array error.");
                }
            }

            if (glTFMeshExtras.vao) {
                webgl.bindVertexArray(glTFMeshExtras.vao);

                return true;
            }

            return false;
        }

        public update(mask: MeshNeedUpdate) {
            super.update(mask);

            if ((this._needUpdate & mask) !== 0) {
                const webgl = WebGLRenderState.webgl!;
                const glTFMesh = this._glTFMesh!;
                const glTFMeshExtras = glTFMesh.extras!;
                const attributes = this._attributes!;
                let bindVAO = false;

                if ((mask & MeshNeedUpdate.VertexBuffer) !== 0) {
                    let createBuffer = false;
                    bindVAO = this._bindVAO();

                    if (glTFMeshExtras.vbo === null) {
                        const vbo = webgl.createBuffer();

                        if (vbo !== null) {
                            glTFMeshExtras.vbo = vbo;
                            createBuffer = true;
                        }
                        else {
                            console.error("Create webgl array buffer error.");
                        }
                    }

                    if (glTFMeshExtras.vbo !== null) {
                        let byteLength = 0;
                        const attributeNames = [] as (gltf.AttributeSemantics | string)[];

                        for (const k in attributes) {
                            byteLength += this.getAccessorByteLength(this.getAccessor(attributes[k]));
                            attributeNames.push(k);
                        }

                        webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, glTFMeshExtras.vbo);
                        webgl.bufferData(gltf.BufferViewTarget.ArrayBuffer, byteLength, this._drawMode);
                        webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, null);

                        if (createBuffer) {
                            this.uploadVertexBuffer(attributeNames);
                        }
                    }
                }

                if ((mask & MeshNeedUpdate.IndexBuffer) !== 0) {
                    if (!bindVAO) {
                        bindVAO = this._bindVAO();
                    }

                    let subMeshIndex = 0;

                    for (const primitive of glTFMesh!.primitives) {
                        if (primitive.indices !== undefined) {
                            let createBuffer = false;

                            if (primitive.extras!.ibo === null) {
                                const ibo = webgl.createBuffer();

                                if (ibo !== null) {
                                    primitive.extras!.ibo = ibo;
                                    createBuffer = true;
                                }
                                else {
                                    console.error("Create webgl array element buffer error.");
                                }
                            }

                            if (primitive.extras!.ibo !== null) {
                                webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, primitive.extras!.ibo);
                                webgl.bufferData(gltf.BufferViewTarget.ElementArrayBuffer, this.getAccessorByteLength(this.getAccessor(primitive.indices)), this._drawMode);
                                webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, null);

                                if (createBuffer) {
                                    this.uploadSubIndexBuffer(subMeshIndex);
                                }
                            }
                        }

                        subMeshIndex++;
                    }
                }

                if ((mask & MeshNeedUpdate.VertexArray) !== 0) {
                    if (!bindVAO) {
                        bindVAO = this._bindVAO();
                    }

                    if (glTFMeshExtras.program !== null) {
                        renderState.updateVertexAttributes(this);
                    }
                }

                if (bindVAO) {
                    webgl.bindVertexArray(null);
                }

                this._needUpdate &= ~mask;
            }
        }

        public onReferenceCountChange(isZero: boolean) {
            if (isZero) {
                const webgl = WebGLRenderState.webgl!;
                const glTFMesh = this._glTFMesh!;
                const { primitives, extras } = glTFMesh;

                if (extras!.vao !== null) {
                    webgl.deleteVertexArray(extras!.vao);
                }

                if (extras!.vbo !== null) {
                    webgl.deleteBuffer(extras!.vbo);
                }

                for (const { extras } of primitives) {
                    if (extras!.ibo !== null) {
                        webgl.deleteBuffer(extras!.ibo);
                    }
                }

                return true;
            }

            return false;
        }

        public uploadVertexBuffer<T extends gltf.AttributeSemantics | string>(uploadAttributes: T | ReadonlyArray<T> | null = null, offset: uint = 0, count: uint = 0): void {
            const webgl = WebGLRenderState.webgl!;
            const attributes = this._attributes!;
            const vbo = this._glTFMesh!.extras!.vbo;

            if (vbo === null) {
                return;
            }

            webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, vbo);

            if (uploadAttributes === null) {
                uploadAttributes = [];

                for (const k in attributes) {
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
            else { // TODO 废弃单属性更新。
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
            const { primitives } = this._glTFMesh!;

            if (0 <= subMeshIndex && subMeshIndex < primitives.length) {
                const primitive = primitives[subMeshIndex];
                const ibo = primitive.extras!.ibo;

                if (primitive.extras!.ibo !== null) {
                    const webgl = WebGLRenderState.webgl!;
                    const accessor = this.getAccessor(primitive.indices!);
                    const subIndexBuffer = this.createTypeArrayFromAccessor(accessor, offset, count);

                    webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, ibo);
                    webgl.bufferSubData(gltf.BufferViewTarget.ElementArrayBuffer, offset, subIndexBuffer);
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
