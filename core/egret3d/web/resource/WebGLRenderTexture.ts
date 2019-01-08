namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLRenderTexture extends RenderTexture {
        public webGLTexture: GlobalWeblGLTexture | null = null;
        public frameBuffer: WebGLFramebuffer | null = null;
        public renderBuffer: WebGLRenderbuffer | null = null;

        private _uploadTexture() {
            const webgl = WebGLRenderState.webgl!;
            let type: gltf.TextureType;
            let uploadType: gltf.TextureType;
            const sampler = this._sampler;
            const extension = this._gltfTexture!.extensions.paper!;
            const width = extension.width!;
            const height = extension.height!;
            const format = extension.format || gltf.TextureFormat.RGBA;
            const dataType = extension.type || gltf.TextureDataType.UNSIGNED_BYTE;

            if (extension.depth !== undefined && extension.depth > 1) {
                type = gltf.TextureType.Texture3D;
                uploadType = type;
            }
            else if (extension.faces !== undefined && extension.faces > 1) {
                type = gltf.TextureType.TextureCube;
                uploadType = gltf.TextureType.TextureCubeStart;
            }
            else if (extension.height! > 1) {
                type = gltf.TextureType.Texture2D;
                uploadType = type;
            }
            else {
                type = gltf.TextureType.Texture1D;
                uploadType = type;
            }

            this.type = type;

            if (!this.webGLTexture) {
                this.webGLTexture = webgl.createTexture()!;
            }

            webgl.bindTexture(type, this.webGLTexture);
            setTexturexParameters(type, sampler, extension.anisotropy || 1);
            webgl.texImage2D(type, 0, format, width, height, 0, format, dataType, null);

            if (extension.layers === 0) {
                webgl.generateMipmap(type);
            }
        }

        private _uploadBuffer(): void {
            const webgl = WebGLRenderState.webgl!;
            const extension = this._gltfTexture!.extensions.paper!;
            const width = extension.width!;
            const height = extension.height!;
            const depthBuffer = extension.depthBuffer || false;
            const stencilBuffer = extension.stencilBuffer || false;

            if (!this.frameBuffer) {
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

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            const webgl = WebGLRenderState.webgl!;

            if (this.webGLTexture) {
                webgl.deleteTexture(this.webGLTexture);
            }

            if (this.frameBuffer) {
                webgl.deleteFramebuffer(this.frameBuffer);
            }

            if (this.renderBuffer) {
                webgl.deleteRenderbuffer(this.renderBuffer);
            }
            //
            this.webGLTexture = null;
            this.frameBuffer = null;
            this.renderBuffer = null;

            return true;
        }

        public bindTexture(index: uint) {
            if (this._sourceDirty) {
                this._uploadTexture();
                this._sourceDirty = false;
            }
            else {
                const webgl = WebGLRenderState.webgl!;
                webgl.activeTexture(gltf.TextureType.Texture2DStart + index);
                webgl.bindTexture(this.type, this.webGLTexture);
            }

            return this;
        }

        public activateTexture() {
            if (this._sourceDirty) {
                this._uploadTexture();
                this._sourceDirty = false;
            }

            if (this._bufferDirty) {
                this._uploadBuffer();
                this._bufferDirty = false;
            }
            else {
                const webgl = WebGLRenderState.webgl!;
                webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, this.frameBuffer);

                if (this.renderBuffer) {
                    webgl.bindRenderbuffer(gltf.WebGL.RenderBuffer, this.renderBuffer);
                }
            }

            return this;
        }

        public generateMipmap(): boolean {
            if (this._gltfTexture.extensions.paper.levels === 0) {
                const webgl = WebGLRenderState.webgl!;
                webgl.bindTexture(this.type, this.webGLTexture);
                webgl.generateMipmap(this.type);
                // webgl.bindTexture(this.type, null);

                return true;
            }

            return false;
        }
    }
    // Retargetting.
    egret3d.RenderTexture = WebGLRenderTexture;
}