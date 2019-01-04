namespace egret3d.webgl {
    /**
     * @internal
     */
    export interface IWebGLRenderTexture extends IWebGLTexture {
        frameBuffer: WebGLFramebuffer | null;
        renderBuffer: WebGLRenderbuffer | null;
    }
    /**
     * @internal
     */
    export class WebGLRenderTexture extends RenderTexture implements IWebGLRenderTexture {
        public webGLTexture: GlobalWeblGLTexture | null = null;
        public frameBuffer: WebGLFramebuffer | null = null;
        public renderBuffer: WebGLRenderbuffer | null = null;

        private _setupFrameBufferTexture(frameBuffer: WebGLFramebuffer, texture: GlobalWeblGLTexture, textureTarget: number, type: gltf.TextureDataType, width: number, height: number, format: gltf.TextureFormat, attachment: number): void {
            const webgl = WebGLRenderState.webgl!;

            webgl.texImage2D(textureTarget, 0, format, width, height, 0, format, type, null);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, frameBuffer);
            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, attachment, textureTarget, texture, 0);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
        }

        private _setupRenderBufferStorage(frameBuffer: WebGLFramebuffer, renderBuffer: WebGLRenderbuffer, depthBuffer: boolean, stencilBuffer: boolean, width: number, height: number): void {
            const webgl = WebGLRenderState.webgl!;
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, frameBuffer);
            //
            webgl.bindRenderbuffer(webgl.RENDERBUFFER, renderBuffer);
            if (depthBuffer && stencilBuffer) {
                webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_STENCIL, width, height);
                webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_STENCIL_ATTACHMENT, webgl.RENDERBUFFER, renderBuffer);
            }
            else if (depthBuffer) {
                webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, width, height);
                webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT, webgl.RENDERBUFFER, renderBuffer);
            }
            else {
                webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.RGBA4, width, height);
            }

            webgl.bindRenderbuffer(webgl.RENDERBUFFER, null);
            //
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
        }

        private _setupDepthRenderbuffer(frameBuffer: WebGLFramebuffer, renderBuffer: WebGLRenderbuffer, depthBuffer: boolean, stencilBuffer: boolean, width: number, height: number) {
            const webgl = WebGLRenderState.webgl!;
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, frameBuffer);
            this._setupRenderBufferStorage(frameBuffer, renderBuffer, depthBuffer, stencilBuffer, width, height);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
        }

        private _setupRenderTexture(): void {
            const sampler = this._sampler;
            const paperExtension = this._gltfTexture!.extensions.paper!;
            const width = paperExtension.width!;
            const height = paperExtension.height!;
            const format = paperExtension.format!;
            const depth = paperExtension.depthBuffer!;
            const stencil = paperExtension.stencilBuffer!;
            //
            const webgl = WebGLRenderState.webgl!;

            if (!this.frameBuffer) {
                this.frameBuffer = webgl.createFramebuffer()!;
            }

            if (!this.webGLTexture) { // TODO 创建与 buffer 分离。
                this.webGLTexture = webgl.createTexture()!;
            }

            webgl.bindTexture(webgl.TEXTURE_2D, this.webGLTexture);

            const isPowerTwo = isPowerOfTwo(width, height);
            setTexturexParameters(isPowerTwo, sampler, paperExtension.anisotropy || 1);
            this._setupFrameBufferTexture(this.frameBuffer, this.webGLTexture, webgl.TEXTURE_2D, gltf.TextureDataType.UNSIGNED_BYTE, width, height, format, webgl.COLOR_ATTACHMENT0);

            const minFilter = sampler.minFilter!;
            const canGenerateMipmap = isPowerTwo && minFilter !== gltf.TextureFilter.Nearest && minFilter !== gltf.TextureFilter.Linear;
            if (canGenerateMipmap) {
                webgl.generateMipmap(webgl.TEXTURE_2D);
            }

            webgl.bindTexture(webgl.TEXTURE_2D, null);

            if (depth || stencil) {
                if (!this.renderBuffer) {
                    this.renderBuffer = webgl.createRenderbuffer()!;
                }
                this._setupDepthRenderbuffer(this.frameBuffer, this.renderBuffer, depth, stencil, width, height);
            }
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

        public activateRenderTexture() {
            if (!this.webGLTexture) { // TODO 引用计数的问题
                this._setupRenderTexture();
            }

            const webgl = WebGLRenderState.webgl!;
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.frameBuffer);
        }

        public generateMipmap(): boolean {
            if (this._mipmap) {
                const webgl = WebGLRenderState.webgl!;
                webgl.bindTexture(webgl.TEXTURE_2D, this.webGLTexture);
                webgl.generateMipmap(webgl.TEXTURE_2D);
                webgl.bindTexture(webgl.TEXTURE_2D, null);

                return true;
            }

            return false;
        }
    }
    // Retargetting.
    egret3d.RenderTexture = WebGLRenderTexture;
}