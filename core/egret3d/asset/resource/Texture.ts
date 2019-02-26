namespace egret3d {
    /**
     * 
     */
    export interface CreateTextureParameters extends gltf.Sampler, GLTFTextureExtension {
        /**
         * 纹理数据源。
         */
        source?: gltf.ImageSource | ArrayBufferView | null;
    }
    /**
     * 基础纹理资源。
     * - 纹理资源的基类。
     */
    export abstract class BaseTexture extends GLTFAsset {
        protected static _createConfig(createTextureParameters: CreateTextureParameters) {
            const config = this.createConfig();
            config.images = [{}];
            config.samplers = [{}];
            config.textures = [{ sampler: 0, source: 0, extensions: { paper: {} } }];
            //
            const gltfTexture = config.textures![0] as GLTFTexture;
            const image = config.images![gltfTexture.source!];
            const sampler = config.samplers![gltfTexture.sampler!];
            const extension = gltfTexture.extensions.paper;
            //
            const {
                wrapS, wrapT,
                magFilter, minFilter,

                source, width, height,
                premultiplyAlpha, flipY,
                anisotropy,
                format, type,
                unpackAlignment,
                encoding,
                //
                depth, layers, faces, levels,
                //
                depthBuffer = true, stencilBuffer = false,
            } = createTextureParameters as CreateTextureParameters;
            //
            sampler.wrapS = wrapS;
            sampler.wrapT = wrapT;
            sampler.magFilter = magFilter;
            sampler.minFilter = minFilter;

            extension.premultiplyAlpha = premultiplyAlpha;
            extension.flipY = flipY;

            extension.width = width; // TODO min size
            extension.height = height; // TODO min size
            extension.anisotropy = anisotropy;

            extension.format = format;
            extension.type = type;
            extension.unpackAlignment = unpackAlignment;
            extension.encoding = encoding;

            extension.depth = depth;
            extension.layers = layers;
            extension.faces = faces;
            extension.levels = levels;

            extension.depthBuffer = depthBuffer;
            extension.stencilBuffer = stencilBuffer;
            //
            

            return config;
        }

        public type: gltf.TextureType = gltf.TextureType.Texture2D;

        protected _sourceDirty: boolean = true;
        protected _levels: uint = 0;
        protected _gltfTexture: GLTFTexture = null!;
        protected _image: gltf.Image = null!;
        protected _sampler: gltf.Sampler = null!;

        private _formatLevelsAndSampler() {
            const sampler = this._sampler;
            let levels = this._gltfTexture.extensions.paper.levels;

            if (!this.isPowerOfTwo) {
                if (levels !== undefined && levels !== 1) {
                    levels = this._gltfTexture.extensions.paper.levels = 1;
                }

                if (sampler.wrapS !== gltf.TextureWrappingMode.ClampToEdge || sampler.wrapT !== gltf.TextureWrappingMode.ClampToEdge) {
                    // console.warn('Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to gltf.TextureWrap.CLAMP_TO_EDGE.');
                    sampler.wrapS = gltf.TextureWrappingMode.ClampToEdge;
                    sampler.wrapT = gltf.TextureWrappingMode.ClampToEdge;
                }
            }
            else {
                if (!sampler.wrapS) {
                    sampler.wrapS = gltf.TextureWrappingMode.Repeat;
                }

                if (!sampler.wrapT) {
                    sampler.wrapT = gltf.TextureWrappingMode.Repeat;
                }
            }

            if (!sampler.magFilter) {
                sampler.magFilter = gltf.TextureFilter.Nearest;
            }

            if (levels === undefined || levels === 1) {
                if (sampler.minFilter === gltf.TextureFilter.LinearMipMapLinear || sampler.minFilter === gltf.TextureFilter.NearestMipMapLinear) {
                    sampler.minFilter = gltf.TextureFilter.Linear;
                }
                else if (!sampler.minFilter || sampler.minFilter === gltf.TextureFilter.NearestMipmapNearest || sampler.minFilter === gltf.TextureFilter.LinearMipmapNearest) {
                    sampler.minFilter = gltf.TextureFilter.Nearest;
                }
            }
            else {
                if (sampler.minFilter === gltf.TextureFilter.Linear) {
                    sampler.minFilter = gltf.TextureFilter.LinearMipMapLinear;
                }
                else if (!sampler.minFilter || sampler.minFilter === gltf.TextureFilter.Nearest) {
                    sampler.minFilter = gltf.TextureFilter.NearestMipmapNearest;
                }
            }
        }
        /**
         * @internal
         */
        public initialize(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null) {
            super.initialize(name, config, buffers);

            const gltfTexture = this._gltfTexture = this.config.textures![0] as GLTFTexture;
            this._image = this.config.images![gltfTexture.source!];
            this._sampler = this.config.samplers![gltfTexture.sampler!];
            //
            this._formatLevelsAndSampler();
        }
        /**
         * @internal
         */
        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            this._gltfTexture = null!;
            this._image = null!;
            this._sampler = null!;

            return true;
        }
        /**
         * @internal
         */
        public bindTexture(index: uint): this {
            return this;
        }
        /**
         * 
         */
        public setLiner(value: boolean): this {
            const sampler = this._sampler;
            const levels = this._gltfTexture.extensions.paper.levels;

            sampler.magFilter = value ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;

            if (levels === undefined || levels === 1) {
                sampler.minFilter = value ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;
            }
            else {
                sampler.minFilter = value ? gltf.TextureFilter.LinearMipMapLinear : gltf.TextureFilter.NearestMipmapNearest;
            }

            this._formatLevelsAndSampler();

            return this;
        }
        /**
         * 
         */
        public setRepeat(value: boolean): this {
            const sampler = this._sampler;
            sampler.wrapS = sampler.wrapT = value ? gltf.TextureWrappingMode.Repeat : gltf.TextureWrappingMode.ClampToEdge;

            this._formatLevelsAndSampler();

            return this;
        }
        /**
         * 
         */
        public setMipmap(value: boolean): this {
            this._gltfTexture.extensions.paper.levels = value ? 0 : 1;
            this._formatLevelsAndSampler();

            return this;
        }
        /**
         * 
         */
        public get isPowerOfTwo(): boolean {
            return math.isPowerOfTwo(this.width) && math.isPowerOfTwo(this.height);
        }
        /**
         * 
         */
        public get format(): gltf.TextureFormat {
            return this._gltfTexture.extensions.paper.format || gltf.TextureFormat.RGBA;
        }
        /**
         * 
         */
        public get levels(): uint {
            if (this._levels > 0) {
                return this._levels;
            }

            const { levels, width, height } = this._gltfTexture.extensions.paper;

            if (levels === 0) {
                return this._levels = Math.log(Math.max(width!, height!)) * Math.LOG2E;
            }
            else if (!levels) {
                return 1.0;
            }

            return levels;
        }
        /**
         * 
         */
        public get width(): uint {
            return this._gltfTexture.extensions.paper.width!;
        }
        /**
         * 
         */
        public get height(): uint {
            return this._gltfTexture.extensions.paper.height!;
        }
        // /**
        //  * 
        //  */
        // public get memory(): uint {
        //     let k = 0;

        //     switch (this.format) {
        //         case gltf.TextureFormat.RGB:
        //         case gltf.TextureFormat.Luminance:
        //             k = 3;
        //             break;

        //         case gltf.TextureFormat.RGBA:
        //             k = 4;
        //             break;
        //     }

        //     if (this._gltfTexture.extensions.paper.mipmap) {
        //         k *= 2;
        //     }

        //     return this.width * this.height * k;
        // }
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
        /**
         * 
         * @param parameters 
         */
        public static create(parameters: CreateTextureParameters): Texture;
        /**
         * @private
         */
        public static create(name: string, config: GLTF, buffers?: ReadonlyArray<ArrayBufferView>): Texture;
        public static create(parametersOrName: CreateTextureParameters | string, config?: GLTF, buffers?: ReadonlyArray<ArrayBufferView>) {
            let name: string;
            let texture: Texture;

            let source;
            if (typeof parametersOrName === "string") {
                name = parametersOrName;
            }
            else {
                config = this._createConfig(parametersOrName as CreateTextureParameters);
                name = (parametersOrName as CreateTextureParameters).name || "";

                if (ArrayBuffer.isView(parametersOrName.source)) {
                    buffers = [parametersOrName.source];
                }
                source = parametersOrName.source;
            }

            const gltfTexture = config!.textures![0] as GLTFTexture;
            const image = config!.images![gltfTexture.source!];
            const extension = gltfTexture.extensions.paper;
            // const source = image.uri as gltf.ImageSource;
            if (source) {
                if (ArrayBuffer.isView(source)) {
                    (config as any).buffers = [];
                    (config as any).buffers[0] = { byteLength: source.byteLength };
                    image.bufferView = 0;
                }
                else {
                    image.uri = source; // 兼容
                    extension.width = source.width;
                    extension.height = source.height;
                }
            }
            else if (image.uri) {
                const imageSource = image.uri as gltf.ImageSource;
                extension.width = imageSource.width;
                extension.height = imageSource.height;
            }

            // Retargeting.
            texture = new egret3d.Texture();
            texture.initialize(name, config!, buffers || null);

            return texture;
        }
        /**
         * 
         */
        public static createColorTexture(name: string, r: number, g: number, b: number): Texture {
            const texture = Texture.create({
                name, source: new Uint8Array([r, g, b, 255, r, g, b, 255, r, g, b, 255, r, g, b, 255]), width: 2, height: 2,
                wrapS: gltf.TextureWrappingMode.ClampToEdge, wrapT: gltf.TextureWrappingMode.ClampToEdge,
                magFilter: gltf.TextureFilter.Linear, minFilter: gltf.TextureFilter.Linear
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
                wrapS: gltf.TextureWrappingMode.Repeat, wrapT: gltf.TextureWrappingMode.Repeat,
                magFilter: gltf.TextureFilter.Linear, minFilter: gltf.TextureFilter.LinearMipMapLinear,
                levels: 0,
                anisotropy: 4,
            });

            return texture;
        }
        /**
         * 
         * @param source 
         */
        public uploadTexture(source?: gltf.ImageSource): this {
            this._sourceDirty = true;
            this._image.uri = source;

            return this;
        }
    }
}
