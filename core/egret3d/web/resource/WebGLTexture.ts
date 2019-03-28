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
            let textureType: gltf.TextureType;
            let uploadType: gltf.TextureType;
            const webgl = WebGLRenderState.webgl!;
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

            if (image.extras !== undefined) {
                if (Array.isArray(image.extras.data)) {
                    let index = 0;

                    for (const imageSource of image.extras.data) {
                        webgl.texImage2D(uploadType + (index++), 0, format, format, dataType, imageSource);
                    }
                }
                else {
                    webgl.texImage2D(uploadType, 0, format, format, dataType, image.extras.data);
                }
            }
            else if (image.bufferView !== undefined) {
                const width = extension.width!;
                const height = extension.height!;
                const { buffers, bufferViews } = this.config;

                if (Array.isArray(image.bufferView)) {
                    let index = 0;

                    for (const bufferViewIndex of image.bufferView) {
                        const bufferView = bufferViews![bufferViewIndex];
                        const buffer = buffers![bufferView.buffer];
                        webgl.texImage2D(uploadType + (index++), 0, format, width, height, 0, format, dataType, buffer.extras!.data);
                    }
                }
                else {
                    const bufferView = bufferViews![image.bufferView];
                    const buffer = buffers![bufferView.buffer];
                    webgl.texImage2D(uploadType, 0, format, width, height, 0, format, dataType, buffer.extras!.data);
                }
            }

            if (extension.levels === 0) {
                webgl.generateMipmap(textureType);
            }

            this._disposeImageSource();

            return this;
        }

        public dispose() {
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
