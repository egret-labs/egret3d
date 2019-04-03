namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLMesh extends Mesh {

        private _bindVAO(primitive: gltf.MeshPrimitive) {
            const webgl = WebGLRenderState.webgl!;
            const primitiveExtras = primitive.extras!;

            if (primitiveExtras.vao === null && renderState.vertexArrayObject !== null) {
                const vao = webgl.createVertexArray();

                if (vao !== null) {
                    primitiveExtras.vao = vao;
                }
                else {
                    console.error("Create webgl vertex array error.");
                }
            }

            if (primitiveExtras.vao !== null) {
                webgl.bindVertexArray(primitiveExtras.vao);

                return true;
            }

            return false;
        }

        public update(mask: MeshNeedUpdate, subMeshIndex: uint = 0) {
            let needUpdate = this._needUpdate & mask;
            const webgl = WebGLRenderState.webgl!;
            const glTFMesh = this._glTFMesh!;
            const glTFMeshExtras = glTFMesh.extras!;
            const primitive = glTFMesh!.primitives[subMeshIndex];
            const primitiveExtras = primitive.extras!;
            let bindVAO = false;

            if ((needUpdate & MeshNeedUpdate.VertexBuffer) !== 0) {
                bindVAO = this._bindVAO(primitive);

                if (glTFMeshExtras.vbo === null) {
                    const vbo = webgl.createBuffer();

                    if (vbo !== null) {
                        glTFMeshExtras.vbo = vbo;
                    }
                    else {
                        console.error("Create webgl array buffer error.");
                    }
                }

                if (glTFMeshExtras.vbo !== null) {
                    const attributes = this._attributes!;

                    let byteLength = 0;
                    const attributeNames = [] as (gltf.AttributeSemantics | string)[];

                    for (const k in attributes) {
                        byteLength += this.getAccessorByteLength(this.getAccessor(attributes[k]));
                        attributeNames.push(k);
                    }

                    webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, glTFMeshExtras.vbo);
                    webgl.bufferData(gltf.BufferViewTarget.ArrayBuffer, byteLength, glTFMeshExtras.drawMode);
                    this.uploadVertexBuffer(attributeNames);
                }
            }

            needUpdate = primitiveExtras.needUpdate;

            if ((needUpdate & MeshNeedUpdate.IndexBuffer) !== 0 && primitive.indices !== undefined) {
                if (!bindVAO) {
                    bindVAO = this._bindVAO(primitive);
                }

                if (primitiveExtras.ibo === null) {
                    const ibo = webgl.createBuffer();

                    if (ibo !== null) {
                        primitiveExtras.ibo = ibo;
                    }
                    else {
                        console.error("Create webgl array element buffer error.");
                    }
                }

                if (primitiveExtras.ibo !== null) {
                    webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, primitiveExtras.ibo);
                    webgl.bufferData(gltf.BufferViewTarget.ElementArrayBuffer, this.getAccessorByteLength(this.getAccessor(primitive.indices)), glTFMeshExtras.drawMode);
                    this.uploadSubIndexBuffer(subMeshIndex);
                }
            }

            if ((needUpdate & MeshNeedUpdate.VertexArray) !== 0) {
                if (!bindVAO) {
                    bindVAO = this._bindVAO(primitive);
                }

                if (bindVAO) {
                    if (primitiveExtras.program !== null) {
                        webgl.bindBuffer(gltf.BufferViewTarget.ArrayBuffer, glTFMeshExtras.vbo);
                        webgl.bindBuffer(gltf.BufferViewTarget.ElementArrayBuffer, primitiveExtras.ibo);
                        renderState.updateVertexAttributes(this, subMeshIndex);
                    }

                    webgl.bindVertexArray(null);
                }
            }

            super.update(mask, subMeshIndex);
        }

        public onReferenceCountChange(isZero: boolean) {
            if (isZero) {
                const webgl = WebGLRenderState.webgl!;
                const glTFMesh = this._glTFMesh!;
                const { primitives, extras } = glTFMesh;

                if (extras!.vbo !== null) {
                    webgl.deleteBuffer(extras!.vbo);
                    extras!.vbo = null;
                }

                for (const { extras } of primitives) {
                    extras!.program = null;

                    if (extras!.vao !== null) {
                        webgl.deleteVertexArray(extras!.vao!);
                        extras!.vao = null;
                    }

                    if (extras!.ibo !== null) {
                        webgl.deleteBuffer(extras!.ibo);
                        extras!.ibo = null;
                    }
                }

                this.needUpdate(MeshNeedUpdate.VertexArray | MeshNeedUpdate.VertexBuffer | MeshNeedUpdate.IndexBuffer, -1);

                return true;
            }

            return false;
        }

        public uploadVertexBuffer<T extends gltf.AttributeSemantics | string>(uploadAttributes: T | ReadonlyArray<T> | null = null, offset: uint = 0, count: uint = 0): void {
            const webgl = WebGLRenderState.webgl!;
            const attributes = this._attributes!;
            const { attributeOffsets, vbo } = this._glTFMesh!.extras!;

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

        public uploadSubIndexBuffer(subMeshIndex: uint = 0, offset: uint = 0, count: uint = 0) {
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
