/**
 * @internal
 */
type GlobalWeblGLTexture = WebGLTexture;

namespace egret3d.web {
    /**
     * @internal
     */
    export interface IWebGLTexture {
        webglTexture: GlobalWeblGLTexture | null;
    }
    /**
     * @internal
     */
    export class WebGLTexture extends egret3d.Texture implements IWebGLTexture {
        public webglTexture: GlobalWeblGLTexture | null = null;
        public dirty: boolean = true;

        public setupTexture(index: uint) {
            if (!this._image || !this._image.uri) {
                return;
            }

            const webgl = WebGLRenderState.webgl!;
            if (!this.webglTexture) {
                this.webglTexture = webgl.createTexture();
            }

            const image = this._image;
            const sampler = this._sampler;
            const paperExtension = this._gltfTexture!.extensions.paper!;

            webgl.activeTexture(webgl.TEXTURE0 + index);
            webgl.bindTexture(webgl.TEXTURE_2D, this.webglTexture);
            webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, paperExtension.premultiplyAlpha!);
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, paperExtension.flipY!);
            webgl.pixelStorei(webgl.UNPACK_ALIGNMENT, paperExtension.unpackAlignment!);

            const isPowerTwo = isPowerOfTwo(paperExtension.width!, paperExtension.height!);
            setTexturexParameters(isPowerTwo, sampler);

            if (ArrayBuffer.isView(image.uri)) {
                webgl.texImage2D(webgl.TEXTURE_2D, 0, paperExtension.format!, paperExtension.width!, paperExtension.height!, 0, paperExtension.format!, paperExtension.type!, image.uri);
            }
            else {
                webgl.texImage2D(webgl.TEXTURE_2D, 0, paperExtension.format!, paperExtension.format!, webgl.UNSIGNED_BYTE, image.uri as gltf.ImageSource);
            }

            const minFilter = sampler.minFilter!;
            const canGenerateMipmap = isPowerTwo && minFilter !== gltf.TextureFilter.Nearest && minFilter !== gltf.TextureFilter.Linear;
            if (canGenerateMipmap) {
                webgl.generateMipmap(webgl.TEXTURE_2D);
            }

            this.dirty = false;
        }
    }
    // Retargeting.
    egret3d.Texture = WebGLTexture;
}