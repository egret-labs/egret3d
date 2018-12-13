namespace egret3d {
    /**
     * 
     */
    export interface CreateTextureParameters extends gltf.Sampler, GLTFEgretTextureExtension {
        /**
         * 纹理数据源。
         */
        source?: ArrayBufferView | gltf.ImageSource | null;
    }
    /**
     * 基础纹理资源。
     * - 纹理资源的基类。
     */
    export abstract class BaseTexture extends GLTFAsset {
        protected static _createConfig(createTextureParameters: CreateTextureParameters) {
            const config = this.createConfig();
            config.images = [{}];
            config.samplers = [{
                magFilter: gltf.TextureFilter.Nearest, minFilter: gltf.TextureFilter.Nearest,
                wrapS: gltf.TextureWrappingMode.Repeat, wrapT: gltf.TextureWrappingMode.Repeat,
            }];
            config.textures = [{ sampler: 0, source: 0, extensions: { paper: {} } }];
            //
            const gltfTexture = config.textures![0] as GLTFTexture;
            const image = config.images![gltfTexture.source!];
            const sampler = config.samplers![gltfTexture.sampler!];
            const extension = gltfTexture.extensions.paper;
            //
            const {
                source, width = 0, height = 0,
                mipmap = false, premultiplyAlpha = 0, flipY = 0,
                anisotropy = 1,
                format = gltf.TextureFormat.RGBA, type = gltf.TextureDataType.UNSIGNED_BYTE,
                wrapS = gltf.TextureWrappingMode.Repeat, wrapT = gltf.TextureWrappingMode.Repeat,
                magFilter = gltf.TextureFilter.Nearest, minFilter = gltf.TextureFilter.Nearest,
                unpackAlignment = gltf.TextureAlignment.Four,
                //
                depthBuffer = false, stencilBuffer = false,
            } = createTextureParameters as CreateTextureParameters;
            //
            sampler.wrapS = wrapS;
            sampler.wrapT = wrapT;
            sampler.magFilter = magFilter;
            sampler.minFilter = minFilter;

            extension.width = width;
            extension.height = height;
            extension.anisotropy = anisotropy;

            extension.mipmap = mipmap;
            extension.premultiplyAlpha = premultiplyAlpha;
            extension.flipY = flipY;

            extension.depthBuffer = depthBuffer;
            extension.stencilBuffer = stencilBuffer;

            extension.format = format;
            extension.type = type;
            extension.unpackAlignment = unpackAlignment;
            //
            if (ArrayBuffer.isView(source)) {
                image.uri = source;
            }
            else if (source) {
                image.uri = source;
                extension.width = source.width;
                extension.height = source.height;
            }

            return config;
        }

        protected _gltfTexture: GLTFTexture = null!;
        protected _image: gltf.Image = null!;
        protected _sampler: gltf.Sampler = null!;
        /**
         * @internal
         */
        public setupTexture(index: uint): void { }

        public initialize() {
            super.initialize();

            const gltfTexture = this._gltfTexture = this.config.textures![0] as GLTFTexture;
            this._image = this.config.images![gltfTexture.source!];
            this._sampler = this.config.samplers![gltfTexture.sampler!];
        }
        /**
         * 
         */
        public setLiner(linear: boolean): this {
            const sampler = this._sampler;

            if (this._gltfTexture.extensions.paper.mipmap) {
                sampler.magFilter = linear ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;
                sampler.minFilter = linear ? gltf.TextureFilter.LinearMipMapLinear : gltf.TextureFilter.MearestMipmapNearest;
            }
            else {
                sampler.magFilter = linear ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;
                sampler.minFilter = linear ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;
            }

            return this;
        }
        /**
         * 
         */
        public setRepeat(repeat: boolean): this {
            const sampler = this._sampler;
            sampler.wrapS = sampler.wrapT = repeat ? gltf.TextureWrappingMode.Repeat : gltf.TextureWrappingMode.ClampToEdge;

            return this;
        }
        /**
         * 
         */
        public get width(): uint {
            return this._gltfTexture!.extensions.paper!.width!;
        }
        /**
         * 
         */
        public get height(): uint {
            return this._gltfTexture!.extensions.paper!.height!;
        }
        /**
         * 
         */
        public get format(): gltf.TextureFormat {
            return this._gltfTexture!.extensions.paper!.format!;
        }
        /**
         * 
         */
        public get sampler(): gltf.Sampler {
            return this._sampler;
        }
        /**
         * 
         */
        public get gltfTexture(): GLTFTexture {
            return this._gltfTexture;
        }
    }
    /**
     * 纹理资源。
     */
    export class Texture extends BaseTexture {
        public static create(parameters: CreateTextureParameters): Texture;
        public static create(source: GLTF, name: string): Texture;
        public static create(parametersOrSource: CreateTextureParameters | GLTF, name?: string) {
            let config: GLTF;
            let texture: Texture;

            if (parametersOrSource.hasOwnProperty("asset")) {
                config = parametersOrSource as GLTF;
            }
            else {
                config = this._createConfig(parametersOrSource as CreateTextureParameters);
                name = (parametersOrSource as CreateTextureParameters).name || "";
            }

            // Retargeting.
            texture = new egret3d.Texture(config, name!);
            texture.initialize();

            return texture;
        }
        /**
         * 
         */
        public static createColorTexture(name: string, r: number, g: number, b: number): Texture {
            const texture = Texture.create({
                name, source: new Uint8Array([r, g, b, 255]), width: 1, height: 1,
                // mipmap: true,
                wrapS: gltf.TextureWrappingMode.ClampToEdge, wrapT: gltf.TextureWrappingMode.ClampToEdge,
                magFilter: gltf.TextureFilter.Linear, minFilter: gltf.TextureFilter.LinearMipMapLinear
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

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const seek = (y * width + x) * 4;
                    const bool = ((x - width * 0.5) * (y - height * 0.5)) > 0;
                    source[seek] = source[seek + 1] = source[seek + 2] = bool ? 0 : 255;
                    source[seek + 3] = 255;
                }
            }

            const texture = Texture.create({
                name, source, width, height,
                mipmap: true,
                wrapS: gltf.TextureWrappingMode.Repeat, wrapT: gltf.TextureWrappingMode.Repeat,
                magFilter: gltf.TextureFilter.Linear, minFilter: gltf.TextureFilter.LinearMipMapLinear
            });

            return texture;
        }
    }
}
