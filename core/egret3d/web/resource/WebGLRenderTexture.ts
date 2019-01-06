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
        public type: gltf.TextureType = gltf.TextureType.Texture2D;
        public webGLTexture: GlobalWeblGLTexture | null = null;
        public frameBuffer: WebGLFramebuffer | null = null;
        public renderBuffer: WebGLRenderbuffer | null = null;

        private _setupFrameBufferTexture(frameBuffer: WebGLFramebuffer, texture: GlobalWeblGLTexture, textureTarget: number, type: gltf.TextureDataType, width: number, height: number, format: gltf.TextureFormat, attachment: number): void {
            const webgl = WebGLRenderState.webgl!;

            webgl.texImage2D(textureTarget, 0, format, width, height, 0, format, type, null);
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, frameBuffer);
            webgl.framebufferTexture2D(gltf.WebGL.FrameBuffer, attachment, textureTarget, texture, 0);
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, null);
        }

        private _setupRenderBufferStorage(frameBuffer: WebGLFramebuffer, renderBuffer: WebGLRenderbuffer, depthBuffer: boolean, stencilBuffer: boolean, width: number, height: number): void {
            const webgl = WebGLRenderState.webgl!;
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, frameBuffer);
            //
            webgl.bindRenderbuffer(gltf.WebGL.RenderBuffer, renderBuffer);
            if (depthBuffer && stencilBuffer) {
                webgl.renderbufferStorage(gltf.WebGL.RenderBuffer, gltf.WebGL.DEPTH_STENCIL, width, height);
                webgl.framebufferRenderbuffer(gltf.WebGL.FrameBuffer, gltf.WebGL.DEPTH_STENCIL_ATTACHMENT, gltf.WebGL.RenderBuffer, renderBuffer);
            }
            else if (depthBuffer) {
                webgl.renderbufferStorage(gltf.WebGL.RenderBuffer, gltf.WebGL.DEPTH_COMPONENT16, width, height);
                webgl.framebufferRenderbuffer(gltf.WebGL.FrameBuffer, gltf.WebGL.DEPTH_ATTACHMENT, gltf.WebGL.RenderBuffer, renderBuffer);
            }
            else {
                webgl.renderbufferStorage(gltf.WebGL.RenderBuffer, gltf.TextureFormat.RGBA4, width, height);
            }

            webgl.bindRenderbuffer(gltf.WebGL.RenderBuffer, null);
            //
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, null);
        }

        private _setupDepthRenderbuffer(frameBuffer: WebGLFramebuffer, renderBuffer: WebGLRenderbuffer, depthBuffer: boolean, stencilBuffer: boolean, width: number, height: number) {
            const webgl = WebGLRenderState.webgl!;
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, frameBuffer);
            this._setupRenderBufferStorage(frameBuffer, renderBuffer, depthBuffer, stencilBuffer, width, height);
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, null);
        }

        private _setupRenderTexture(): void {
            const webgl = WebGLRenderState.webgl!;

            let type: gltf.TextureType;
            let uploadType: gltf.TextureType;
            const sampler = this._sampler;
            const extension = this._gltfTexture!.extensions.paper!;
            const width = extension.width!;
            const height = extension.height!;
            const format = extension.format || gltf.TextureFormat.RGBA;
            const depth = extension.depthBuffer || false;
            const stencil = extension.stencilBuffer || false;

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

            if (!this.frameBuffer) {
                this.frameBuffer = webgl.createFramebuffer()!;
            }

            if (!this.webGLTexture) { // TODO 创建与 buffer 分离。
                this.webGLTexture = webgl.createTexture()!;
            }

            webgl.bindTexture(type, this.webGLTexture);

            setTexturexParameters(type, sampler, extension.anisotropy || 1);
            this._setupFrameBufferTexture(this.frameBuffer, this.webGLTexture, type, gltf.TextureDataType.UNSIGNED_BYTE, width, height, format, gltf.WebGL.COLOR_ATTACHMENT0);


            if (extension.layers === 0) {
                webgl.generateMipmap(type);
            }

            webgl.bindTexture(type, null);

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
            webgl.bindFramebuffer(gltf.WebGL.FrameBuffer, this.frameBuffer);
        }

        public generateMipmap(): boolean {
            if (this._gltfTexture.extensions.paper.levels === 0) {
                const webgl = WebGLRenderState.webgl!;
                webgl.bindTexture(this.type, this.webGLTexture);
                webgl.generateMipmap(this.type);
                webgl.bindTexture(this.type, null);

                return true;
            }

            return false;
        }
    }
    // Retargetting.
    egret3d.RenderTexture = WebGLRenderTexture;
}