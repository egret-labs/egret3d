namespace egret3d {
    /**
     * 纹理资源。
     */
    export class Texture extends BaseTexture {
        /**
         * 
         * @param parameters 
         */
        public static create(parameters: CreateTextureParameters): Texture;
        /**
         * 加载纹理。
         * @private
         */
        public static create(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null): Texture;
        public static create(parametersOrName: CreateTextureParameters | string, config: GLTF | null = null, buffers: ReadonlyArray<ArrayBufferView> | null = null) {
            let name: string;

            if (typeof parametersOrName === "string") {
                name = parametersOrName;
            }
            else {
                config = this._createConfig(parametersOrName);
                name = parametersOrName.name !== undefined ? parametersOrName.name : "";
            }

            const gltfTexture = config!.textures![0] as GLTFTexture;
            const image = config!.images![gltfTexture.source!];

            if (image.extras !== undefined) {
                const extension = gltfTexture.extensions.paper;
                const imageSource = Array.isArray(image.extras.data) ? image.extras.data[0] : image.extras.data;
                extension.width = imageSource.width;
                extension.height = imageSource.height;
            }

            // Retargeting.
            const texture = new egret3d.Texture();
            texture.initialize(name, config!, buffers);

            return texture;
        }
        /**
         * 
         */
        public static createColorTexture(name: string, r: float, g: float, b: float): Texture {
            const texture = Texture.create({
                name, source: new Uint8Array([r, g, b, 255]), width: 1, height: 1,
                sampler: {
                    wrapS: gltf.TextureWrappingMode.ClampToEdge, wrapT: gltf.TextureWrappingMode.ClampToEdge,
                    magFilter: gltf.TextureFilter.Linear, minFilter: gltf.TextureFilter.Linear
                }
            });

            return texture;
        }
        /**
         * @internal
         */
        public static createGridTexture(name: string): Texture {
            const width = 128;
            const height = 128;
            const source = new Uint8Array(width * height * 4);

            for (let y = 0; y < height; ++y) {
                for (let x = 0; x < width; ++x) {
                    const seek = (y * width + x) * 4;
                    const bool = ((x - width * 0.5) * (y - height * 0.5)) > 0;
                    source[seek] = source[seek + 1] = source[seek + 2] = bool ? 0 : 255;
                    source[seek + 3] = 255;
                }
            }

            const texture = Texture.create({
                name, source, width, height,
                levels: 0, anisotropy: 4,
                sampler: {
                    magFilter: gltf.TextureFilter.Linear, minFilter: gltf.TextureFilter.LinearMipMapLinear,
                }
            });

            return texture;
        }
        /**
         * 
         * @param source 
         */
        public setSource(source: ArrayBufferView | gltf.ImageSource | null = null): this {
            const { config } = this;
            const image = this._image!;
            const extension = this._glTFTexture!.extensions.paper;

            if (source !== null) {
                if (ArrayBuffer.isView(source)) {
                    if (config.buffers === undefined) {
                        config.buffers = [];
                    }

                    if (config.bufferViews === undefined) {
                        config.bufferViews = [];
                    }

                    config.buffers[0] = { byteLength: source.byteLength, extras: { data: source } };
                    config.bufferViews[0] = { buffer: 0, byteLength: source.byteLength };
                    image.bufferView = 0;
                    delete image.extras;
                }
                else {
                    if (image.extras === undefined) {
                        image.extras = { data: source };
                    }
                    else {
                        image.extras.data = source;
                    }

                    extension.width = source.width;
                    extension.height = source.height;
                    delete config.buffers;
                    delete config.bufferViews;
                    delete image.bufferView;
                }

                this.needUpdate(TextureNeedUpdate.Image | TextureNeedUpdate.Levels);
            }

            return this;
        }
    }
}
