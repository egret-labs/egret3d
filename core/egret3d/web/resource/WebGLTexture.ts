/**
 * @internal
 */
type GlobalWeblGLTexture = WebGLTexture;

namespace egret3d.webgl {
    /**
     * @internal
     */
    export class WebGLTexture extends Texture {
        public webGLTexture: GlobalWeblGLTexture | null = null;

        public dispose() {
            if (super.dispose()) {
                if (this.webGLTexture !== null) {
                    const webgl = WebGLRenderState.webgl!;
                    webgl.deleteTexture(this.webGLTexture);
                }

                this.webGLTexture = null;

                return true;
            }

            return false;
        }

        public update(mask: TextureNeedUpdate) {
            const needUpdate = this._needUpdate & mask;

            if (needUpdate !== 0) {
                const webgl = WebGLRenderState.webgl!;
                const extension = this._glTFTexture!.extensions.paper!;

                if ((needUpdate & TextureNeedUpdate.Image) !== 0) {
                    const image = this._image!;
                    const sampler = this._sampler!;
                    const format = extension.format !== undefined ? extension.format : gltf.TextureFormat.RGBA;
                    const dataType = extension.type !== undefined ? extension.type : gltf.ComponentType.UnsignedByte;
                    // const isMutilyLayers = extension.layers !== undefined && extension.layers > 1; // TODO

                    let textureType: gltf.TextureType;
                    let uploadType: gltf.TextureType;

                    if (extension.depth !== undefined && extension.depth > 1) {
                        textureType = gltf.TextureType.Texture3D;
                        uploadType = textureType;
                    }
                    else if (extension.faces !== undefined && extension.faces > 1) {
                        textureType = gltf.TextureType.TextureCube;
                        uploadType = gltf.TextureType.TextureCubeStart;
                    }
                    else if (extension.height! > 1) {
                        textureType = gltf.TextureType.Texture2D;
                        uploadType = textureType;
                    }
                    else {
                        textureType = gltf.TextureType.Texture1D;
                        uploadType = textureType;
                    }

                    this.type = textureType;

                    if (this.webGLTexture === null) {
                        this.webGLTexture = webgl.createTexture();
                    }

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

                }

                if ((needUpdate & TextureNeedUpdate.Levels) !== 0) {
                    if (extension.levels === 0) {
                        webgl.generateMipmap(this.type);
                    }
                }

                this._disposeImageSource();
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
    }
    // Retargeting.
    egret3d.Texture = WebGLTexture;
}
