namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLRenderTexture extends RenderTexture {
        public webGLTexture: GlobalWeblGLTexture | null = null;
        public frameBuffer: WebGLFramebuffer | null = null;
        public renderBuffer: WebGLRenderbuffer | null = null;

        public dispose() {
            if (super.dispose()) {
                const webgl = WebGLRenderState.webgl!;

                if (this.webGLTexture !== null) {
                    webgl.deleteTexture(this.webGLTexture);
                }

                if (this.frameBuffer !== null) {
                    webgl.deleteFramebuffer(this.frameBuffer);
                }

                if (this.renderBuffer !== null) {
                    webgl.deleteRenderbuffer(this.renderBuffer);
                }

                this.type = gltf.TextureType.Texture2D;

                this.webGLTexture = null;
                this.frameBuffer = null;
                this.renderBuffer = null;

                return true;
            }

            return false;
        }

        public update(mask: TextureNeedUpdate) {
            const needUpdate = this._needUpdate & mask;

            if (needUpdate !== 0) {
                const webgl = WebGLRenderState.webgl!;
                const extension = this._glTFTexture!.extensions.paper!;
                const width = extension.width!;
                const height = extension.height!;

                if ((needUpdate & TextureNeedUpdate.Image) !== 0) {
                    let textureType: gltf.TextureType;
                    let uploadType: gltf.TextureType;
                    const sampler = this._sampler!;
                    const format = extension.format !== undefined ? extension.format : gltf.TextureFormat.RGBA;
                    const dataType = extension.type !== undefined ? extension.type : gltf.ComponentType.UnsignedByte;

                    if (extension.depth !== undefined && extension.depth > 1) {
                        textureType = gltf.TextureType.Texture3D;
                        uploadType = textureType;
                    }
                    else if (extension.faces !== undefined && extension.faces > 1) {
                        textureType = gltf.TextureType.TextureCube;
                        uploadType = gltf.TextureType.TextureCubeStart;
                    }
                    else if (extension.height! > 0) {
                        textureType = gltf.TextureType.Texture2D;
                        uploadType = textureType;
                    }
                    else {
                        textureType = gltf.TextureType.Texture1D;
                        uploadType = textureType;
                    }

                    this.type = textureType;

                    if (this.webGLTexture === null) {
                        this.webGLTexture = webgl.createTexture()!;
                    }

                    webgl.bindTexture(textureType, this.webGLTexture);
                    webgl.pixelStorei(gltf.WebGL.UNPACK_ALIGNMENT, extension.unpackAlignment || gltf.TextureAlignment.Four);
                    webgl.pixelStorei(gltf.WebGL.UNPACK_FLIP_Y_WEBGL, extension.flipY || 0);
                    webgl.pixelStorei(gltf.WebGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, extension.premultiplyAlpha || 0);
                    setTexturexParameters(textureType, sampler, extension.anisotropy || 1);
                    webgl.texImage2D(uploadType, 0, format, width, height, 0, format, dataType, null);
                }

                if ((needUpdate & TextureNeedUpdate.Levels) !== 0) {
                    if (extension.levels === 0) {
                        webgl.generateMipmap(this.type);
                    }
                }

                if ((needUpdate & TextureNeedUpdate.Buffer) !== 0) {
                    const depthBuffer = extension.depthBuffer || false;
                    const stencilBuffer = extension.stencilBuffer || false;

                    if (this.frameBuffer === null) {
                        this.frameBuffer = webgl.createFramebuffer()!;
                    }

                    webgl.bindTexture(this.type, this.webGLTexture);
                    webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, this.frameBuffer);
                    webgl.framebufferTexture2D(gltf.WebGL.FrameBuffer, gltf.WebGL.COLOR_ATTACHMENT0, this.type, this.webGLTexture, 0);

                    if (depthBuffer || stencilBuffer) {
                        if (!this.renderBuffer) {
                            this.renderBuffer = webgl.createRenderbuffer()!;
                        }

                        webgl.bindRenderbuffer(gltf.WebGL.RenderBuffer, this.renderBuffer);

                        if (depthBuffer && stencilBuffer) {
                            webgl.renderbufferStorage(gltf.WebGL.RenderBuffer, gltf.WebGL.DEPTH_STENCIL, width, height);
                            webgl.framebufferRenderbuffer(gltf.WebGL.FrameBuffer, gltf.WebGL.DEPTH_STENCIL_ATTACHMENT, gltf.WebGL.RenderBuffer, this.renderBuffer);
                        }
                        else if (depthBuffer) {
                            webgl.renderbufferStorage(gltf.WebGL.RenderBuffer, gltf.WebGL.DEPTH_COMPONENT16, width, height);
                            webgl.framebufferRenderbuffer(gltf.WebGL.FrameBuffer, gltf.WebGL.DEPTH_ATTACHMENT, gltf.WebGL.RenderBuffer, this.renderBuffer);
                        }
                        else {
                            webgl.renderbufferStorage(gltf.WebGL.RenderBuffer, gltf.TextureFormat.RGBA4, width, height);
                        }
                    }

                    // webgl.bindTexture(this.type, null);
                    // webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, null);
                    // webgl.bindRenderbuffer(gltf.WebGL.RenderBuffer, null);
                }
            }

            super.update(mask);
        }

        public bindTexture(index: uint) {
            const webgl = WebGLRenderState.webgl!;
            this.update(TextureNeedUpdate.Image | TextureNeedUpdate.Levels);
            webgl.activeTexture(gltf.TextureType.Texture2DStart + index);
            webgl.bindTexture(this.type, this.webGLTexture);

            return this;
        }

        public activateTexture() {
            const webgl = WebGLRenderState.webgl!;
            this.update(TextureNeedUpdate.Image | TextureNeedUpdate.Buffer | TextureNeedUpdate.Levels);
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, this.frameBuffer);

            if (this.renderBuffer !== null) {
                webgl.bindRenderbuffer(gltf.WebGL.RenderBuffer, this.renderBuffer);
            }

            return this;
        }
    }
    // Retargetting.
    egret3d.RenderTexture = WebGLRenderTexture;
}
