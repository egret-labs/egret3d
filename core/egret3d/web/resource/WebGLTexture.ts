/**
 * @internal
 */
type GlobalWeblGLTexture = WebGLTexture;

namespace egret3d.webgl {
    /**
     * @internal
     */
    export interface IWebGLTexture {
        type: gltf.TextureType;
        webGLTexture: GlobalWeblGLTexture | null;
    }
    /**
     * @internal
     */
    export class WebGLTexture extends egret3d.Texture implements IWebGLTexture {
        public type: gltf.TextureType = gltf.TextureType.Texture2D;
        public webGLTexture: GlobalWeblGLTexture | null = null;

        public dispose() {
            const image = this._image;
            if (image && image.uri && image.uri.hasOwnProperty("src")) {
                (image.uri as HTMLImageElement).src = ""; // wx
                delete image.uri;
            }

            if (!super.dispose()) {
                return false;
            }

            if (this.webGLTexture) {
                const webgl = WebGLRenderState.webgl!;
                webgl.deleteTexture(this.webGLTexture);
                //
                this.webGLTexture = null;
            }

            return true;
        }

        public setupTexture(index: uint) {
            const webgl = WebGLRenderState.webgl!;

            let textureType: gltf.TextureType;
            const image = this._image;
            const sampler = this._sampler;
            const paperExtension = this._gltfTexture!.extensions.paper!;
            const mutilyLayers = paperExtension.layers !== undefined && paperExtension.layers > 1;

            if (paperExtension.depth !== undefined && paperExtension.depth > 1) {
                textureType = gltf.TextureType.Texture3D;
            }
            else if (paperExtension.faces !== undefined && paperExtension.faces > 1) {
                if (mutilyLayers) {
                    textureType = gltf.TextureType.TextureCubeArray;
                }
                else {
                    textureType = gltf.TextureType.TextureCube;
                }
            }
            else if (paperExtension.height! > 1) {
                if (mutilyLayers) {
                    textureType = gltf.TextureType.Texture2DArray;
                }
                else {
                    textureType = gltf.TextureType.Texture2D;
                }
            }
            else if (mutilyLayers) {
                textureType = gltf.TextureType.Texture1DArray;
            }
            else {
                textureType = gltf.TextureType.Texture1D;
            }

            this.type = textureType;
            this.webGLTexture = webgl.createTexture();
            webgl.activeTexture(gltf.TextureType.TextureZero + index);
            webgl.bindTexture(textureType, this.webGLTexture);
            webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, paperExtension.premultiplyAlpha!);
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, paperExtension.flipY!);
            webgl.pixelStorei(webgl.UNPACK_ALIGNMENT, paperExtension.unpackAlignment!);

            const isPowerTwo = isPowerOfTwo(paperExtension.width!, paperExtension.height!);
            setTexturexParameters(isPowerTwo, sampler, paperExtension.anisotropy || 1);

            if (image.uri !== undefined) {
                if (Array.isArray(image.uri)) {
                    let index = 0;

                    for (const uri of image.uri) {
                        webgl.texImage2D(textureType + (index++), 0, paperExtension.format!, paperExtension.format!, paperExtension.type!, uri as gltf.ImageSource);
                    }
                }
                else {
                    webgl.texImage2D(textureType, 0, paperExtension.format!, paperExtension.format!, paperExtension.type!, image.uri as gltf.ImageSource);
                }
            }
            else if (image.bufferView !== undefined) {
                if (Array.isArray(image.bufferView)) {
                    let index = 0;

                    for (const bufferView of image.bufferView) {
                        webgl.texImage2D(textureType + (index++), 0, paperExtension.format!, paperExtension.width!, paperExtension.height!, 0, paperExtension.format!, paperExtension.type!, this.buffers[bufferView]);
                    }
                }
                else {
                    webgl.texImage2D(textureType, 0, paperExtension.format!, paperExtension.width!, paperExtension.height!, 0, paperExtension.format!, paperExtension.type!, this.buffers[image.bufferView]);
                }
            }

            const minFilter = sampler.minFilter!;
            const canGenerateMipmap = isPowerTwo && minFilter !== gltf.TextureFilter.Nearest && minFilter !== gltf.TextureFilter.Linear;
            if (canGenerateMipmap) {
                webgl.generateMipmap(textureType);
            }

            if (image.uri && image.uri.hasOwnProperty("src")) {
                (image.uri as HTMLImageElement).src = ""; // wx
                delete image.uri;
            }
        }
    }
    // Retargeting.
    egret3d.Texture = WebGLTexture;
}