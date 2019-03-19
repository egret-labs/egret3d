/**
 * @internal
 */
type GlobalWeblGLTexture = WebGLTexture;

namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLTexture extends egret3d.Texture {
        public webGLTexture: GlobalWeblGLTexture | null = null;

        private _uploadTexture(index: uint) {
            const webgl = WebGLRenderState.webgl!;

            let textureType: gltf.TextureType;
            let uploadType: gltf.TextureType;
            const image = this._image;
            const sampler = this._sampler;
            const extension = this._gltfTexture!.extensions.paper!;
            const format = extension.format || gltf.TextureFormat.RGBA;
            const dataType = extension.type || gltf.ComponentType.UnsignedByte;
            // const isMutilyLayers = extension.layers !== undefined && extension.layers > 1; // TODO

            if (extension.depth !== undefined && extension.depth > 1) {
                textureType = gltf.TextureType.Texture3D;
                uploadType = textureType;
            }
            else if (extension.faces !== undefined && extension.faces > 1) {
                textureType = gltf.TextureType.TextureCube;
                uploadType = gltf.TextureType.TextureCubeStart;
            }
            else {
                textureType = gltf.TextureType.Texture2D;
                uploadType = textureType;
            }
            // else if (extension.height! > 1) { // TODO
            //     textureType = gltf.TextureType.Texture2D;
            //     uploadType = textureType;
            // }
            // else {
            //     textureType = gltf.TextureType.Texture1D;
            //     uploadType = textureType;
            // }

            this.type = textureType;
            if (!this.webGLTexture) {
                this.webGLTexture = webgl.createTexture();
            }

            webgl.activeTexture(gltf.TextureType.Texture2DStart + index);
            webgl.bindTexture(textureType, this.webGLTexture);
            webgl.pixelStorei(gltf.WebGL.UNPACK_ALIGNMENT, extension.unpackAlignment || gltf.TextureAlignment.Four);
            webgl.pixelStorei(gltf.WebGL.UNPACK_FLIP_Y_WEBGL, extension.flipY || 0);
            webgl.pixelStorei(gltf.WebGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, extension.premultiplyAlpha || 0);
            setTexturexParameters(textureType, sampler, extension.anisotropy || 1);

            if (image.uri !== undefined) {
                if (Array.isArray(image.uri)) {
                    let index = 0;

                    for (const uri of image.uri) {
                        webgl.texImage2D(uploadType + (index++), 0, format, format, dataType, uri as gltf.ImageSource);
                    }
                }
                else {
                    webgl.texImage2D(uploadType, 0, format, format, dataType, image.uri as gltf.ImageSource);
                }
            }
            else if (image.bufferView !== undefined) {
                const width = extension.width!;
                const height = extension.height!;
                const buffers = this.buffers;

                if (Array.isArray(image.bufferView)) {
                    let index = 0;

                    for (const bufferView of image.bufferView) {
                        webgl.texImage2D(uploadType + (index++), 0, format, width, height, 0, format, dataType, buffers[bufferView]);
                    }
                }
                else {
                    webgl.texImage2D(uploadType, 0, format, width, height, 0, format, dataType, buffers[image.bufferView]);
                }
            }

            if (extension.levels === 0) {
                webgl.generateMipmap(textureType);
            }

            if (image.uri && image.uri.hasOwnProperty("src")) {
                (image.uri as HTMLImageElement).src = ""; // wx
                delete image.uri;
            }

            return this;
        }

        public dispose() {
            const image = this._image;
            if (image && image.uri) {

                if (Array.isArray(image.uri)) {
                    for (const uri of image.uri) {
                        if (uri.hasOwnProperty("src")) {
                            (uri as HTMLImageElement).src = ""; // wx
                        }
                    }
                }
                else {
                    if (image.uri.hasOwnProperty("src")) {
                        (image.uri as HTMLImageElement).src = ""; // wx
                    }
                }

                delete image.uri;
            }

            if (!super.dispose()) {
                return false;
            }

            if (this.webGLTexture) {
                const webgl = WebGLRenderState.webgl!;
                webgl.deleteTexture(this.webGLTexture);
            }

            this.webGLTexture = null;

            return true;
        }

        public bindTexture(index: uint) {
            if (this._sourceDirty) {
                this._uploadTexture(index);
                this._sourceDirty = false;
            }
            else {
                const webgl = WebGLRenderState.webgl!;
                webgl.activeTexture(gltf.TextureType.Texture2DStart + index);
                webgl.bindTexture(this.type, this.webGLTexture);
            }

            return this;
        }
    }
    // Retargeting.
    egret3d.Texture = WebGLTexture;
}