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

            if (glTFMeshExtras.vao !== null) {
                webgl.bindVertexArray(glTFMeshExtras.vao);

                return true;
            }

            return false;
        }

        public update(mask: MeshNeedUpdate) {
            const needUpdate = this._needUpdate & mask;

            if (needUpdate !== 0) {
                const webgl = WebGLRenderState.webgl!;
                const glTFMesh = this._glTFMesh!;
                const glTFMeshExtras = glTFMesh.extras!;
                const attributes = this._attributes!;
                let bindVAO = false;

                if ((needUpdate & MeshNeedUpdate.VertexBuffer) !== 0) {
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

                        if (createBuffer) {
                            this.uploadVertexBuffer(attributeNames);
                        }
                    }
                }

                if ((needUpdate & MeshNeedUpdate.IndexBuffer) !== 0) {
                    let subMeshIndex = 0;

                    if (!bindVAO) {
                        bindVAO = this._bindVAO();
                    }

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

                                if (createBuffer) {
                                    this.uploadSubIndexBuffer(subMeshIndex);
                                }
                            }
                        }

                        subMeshIndex++;
                    }
                }

                if ((needUpdate & MeshNeedUpdate.VertexArray) !== 0) {
                    if (!bindVAO) {
                        bindVAO = this._bindVAO();
                    }

                    if (bindVAO) {
                        if (glTFMeshExtras.program !== null) {
                            renderState.updateVertexAttributes(this);
                        }

                        webgl.bindVertexArray(null);
                    }
                }
            }

            super.update(mask);
        }

        public onReferenceCountChange(isZero: boolean) {
            if (isZero) {
                const webgl = WebGLRenderState.webgl!;
                const glTFMesh = this._glTFMesh!;
                const { primitives, extras } = glTFMesh;
                extras!.program = null;

                if (extras!.vao !== null) {
                    webgl.deleteVertexArray(extras!.vao);
                    extras!.vao = null;
                }

                if (extras!.vbo !== null) {
                    webgl.deleteBuffer(extras!.vbo);
                    extras!.vbo = null;
                }

                for (const { extras } of primitives) {
                    if (extras!.ibo !== null) {
                        webgl.deleteBuffer(extras!.ibo);
                        extras!.ibo = null;
                    }
                }

                this.needUpdate(MeshNeedUpdate.VertexArray | MeshNeedUpdate.VertexBuffer | MeshNeedUpdate.IndexBuffer);

                return true;
            }

            return false;
        }

        public uploadVertexBuffer<T extends gltf.AttributeSemantics | string>(uploadAttributes: T | ReadonlyArray<T> | null = null, offset: uint = 0, count: uint = 0): void {
            const webgl = WebGLRenderState.webgl!;
            const attributes = this._attributes!;
            const attributeOffsets = this._glTFMesh!.extras!.attributeOffsets;
            const vbo = this._glTFMesh!.extras!.vbo;

            if (vbo === null) {
                return;
            }

            if (uploadAttributes !== null && !Array.isArray(uploadAttributes)) {
                uploadAttributes = [uploadAttributes as T];
            }

            webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, vbo);

            for (const attributeName in attributes) {
                const accessor = this.getAccessor(attributes[attributeName]);

                if (uploadAttributes === null || (uploadAttributes as T[]).indexOf(attributeName as T) >= 0) {
                    const subVertexBuffer = this.createTypeArrayFromAccessor(accessor, offset, count);
                    let bufferOffset = attributeOffsets[attributeName];

                    if (offset > 0) {
                        bufferOffset += offset * accessor.extras!.typeCount * GLTFAsset.getComponentTypeCount(accessor.componentType);
                    }

                    webgl.bufferSubData(gltf.BufferViewTarget.ArrayBuffer, bufferOffset, subVertexBuffer);
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
