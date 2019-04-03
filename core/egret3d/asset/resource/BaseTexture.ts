namespace egret3d {
    /**
     * 
     */
    export interface CreateTextureParameters extends GLTFTextureExtension {
        name?: string;
        image?: gltf.Image;
        sampler?: gltf.Sampler;
        source?: ArrayBufferView | gltf.ImageSource | (ArrayBufferView | gltf.ImageSource)[];
    }
    /**
     * 
     */
    export const enum TextureNeedUpdate {
        Image = 0x1,
        Buffer = 0x10,
        Levels = 0x100,

        All = Image | Buffer | Levels,
    }
    /**
     * 
     */
    export const enum FilterMode {
        Point = 0,
        Bilinear = 1,
        Trilinear = 2
    }
    /**
     * 基础纹理资源。
     * - 全部纹理资源的基类。
     */
    export abstract class BaseTexture extends GLTFAsset implements paper.INeedUpdate {

        protected static _createConfig(createTextureParameters: CreateTextureParameters) {
            if (createTextureParameters.image === undefined) {
                createTextureParameters.image = {};
            }

            if (createTextureParameters.sampler === undefined) {
                createTextureParameters.sampler = {};
            }
            //
            const {
                extras,
            } = createTextureParameters.image!;
            //
            const {
                wrapS, wrapT,
                magFilter, minFilter,
            } = createTextureParameters.sampler!;
            //
            const {
                source,
                width, height,
                premultiplyAlpha, flipY,
                anisotropy,
                format, type,
                unpackAlignment,
                encoding,
                //
                depth, layers, faces, levels,
                //
                depthBuffer = true, stencilBuffer = false,
            } = createTextureParameters;
            // Create glTF.
            const config = this.createConfig();
            const [image] = config.images = [{}] as gltf.Image[];
            const [sampler] = config.samplers = [{ wrapS, wrapT, magFilter, minFilter }] as gltf.Sampler[];
            const [gltfTexture] = config.textures = [{
                sampler: 0, source: 0, extensions: {
                    paper: {
                        width, height,
                        premultiplyAlpha, flipY,
                        anisotropy,
                        format, type,
                        unpackAlignment,
                        encoding,
                        //
                        depth, layers, faces, levels,
                        //
                        depthBuffer, stencilBuffer,
                    }
                }
            }] as GLTFTexture[];
            // Set image.
            if (source !== undefined) {
                if (Array.isArray(source)) { // Cube.
                    if (source.length > 0) {
                        let index = 0;
                        config.buffers = [];
                        config.bufferViews = [];
                        image.bufferView = [];

                        for (const eachSource of source) {
                            if (ArrayBuffer.isView(eachSource)) { // 使用 Buffer 动态创建纹理。
                                config.buffers.push({
                                    byteLength: eachSource.byteLength,
                                    extras: { data: eachSource }
                                });
                                config.bufferViews.push({
                                    buffer: index,
                                    byteLength: eachSource.byteLength,
                                });
                                image.bufferView.push(index++);
                            }
                            else { // 使用 ImageData 动态创建纹理。
                                image.extras = { data: (source as gltf.ImageSource[]).concat() };
                                break;
                            }
                        }
                    }
                    else {

                    }
                }
                else if (ArrayBuffer.isView(source)) { // 使用 Buffer 动态创建纹理。
                    config.buffers = [{
                        byteLength: source.byteLength,
                        extras: { data: source }
                    }];
                    config.bufferViews = [{
                        buffer: 0,
                        byteLength: source.byteLength,
                    }];
                    image.bufferView = 0;
                }
                else { // 使用 ImageData 动态创建纹理。
                    image.extras = { data: source };
                }
            }

            return config;
        }
        /**
         * 缓存的更新标记。
         */
        protected _needUpdate: uint = TextureNeedUpdate.All;
        /**
         * 缓存的 glTF Texture 。
         */
        protected _glTFTexture: GLTFTexture | null = null;
        /**
         * 缓存的 glTF Image 。
         */
        protected _image: gltf.Image | null = null;
        /**
         * 缓存的 glTF Sampler 。
         */
        protected _sampler: gltf.Sampler | null = null;

        protected _disposeImageSource() {
            const image = this._image;

            if (image !== null && image.extras !== undefined) {
                // WX bug，清除多余显存占用，导致的问题就是纹理的图片不支持共享，不支持动态修改属性。
                if (Array.isArray(image.extras.data)) {
                    for (const imageSource of image.extras.data) {
                        (imageSource as HTMLImageElement).src = "";
                    }
                }
                else {
                    (image.extras.data as HTMLImageElement).src = "";
                }
            }
        }

        private _formatLevelsAndSampler() {
            const gltfTexture = this._glTFTexture!;
            const sampler = this._sampler!;
            let { levels } = gltfTexture.extensions.paper;

            if (!this.isPowerOfTwo) {
                if (levels !== undefined && levels !== 1) {
                    levels = gltfTexture.extensions.paper.levels = 1;
                }

                sampler.wrapS = gltf.TextureWrappingMode.ClampToEdge;
                sampler.wrapT = gltf.TextureWrappingMode.ClampToEdge;
            }

            if (levels === undefined || levels === 1) { // 不生成 mipmap 。
                if (sampler.minFilter === gltf.TextureFilter.LinearMipMapLinear || sampler.minFilter === gltf.TextureFilter.NearestMipMapLinear) {
                    sampler.minFilter = gltf.TextureFilter.Linear;
                }
                else if (sampler.minFilter === gltf.TextureFilter.NearestMipmapNearest || sampler.minFilter === gltf.TextureFilter.LinearMipmapNearest) {
                    sampler.minFilter = gltf.TextureFilter.Nearest;
                }
            }
            else {
                if (sampler.minFilter === gltf.TextureFilter.Linear) {
                    sampler.minFilter = gltf.TextureFilter.LinearMipMapLinear;
                }
                else if (sampler.minFilter === undefined || sampler.minFilter === gltf.TextureFilter.Nearest) {
                    sampler.minFilter = gltf.TextureFilter.NearestMipmapNearest;
                }
            }
        }
        /**
         * @internal
         */
        public initialize(name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null) {
            super.initialize(name, config, buffers);

            const gltfTexture = this._glTFTexture = this.config.textures![0] as GLTFTexture;
            this._image = this.config.images![gltfTexture.source!];
            this._sampler = this.config.samplers![gltfTexture.sampler!];
            gltfTexture.extras = { type: gltf.TextureType.Texture2D, levels: 0 };

            this._formatLevelsAndSampler();
        }
        /**
         * @interfnal
         */
        public dispose() {
            if (super.dispose()) {
                this._needUpdate = TextureNeedUpdate.All;
                this._glTFTexture = null;
                this._image = null;
                this._sampler = null;

                return true;
            }

            return false;
        }

        public needUpdate(mask: TextureNeedUpdate): void {
            this._needUpdate |= mask;

            if ((mask & TextureNeedUpdate.Levels) !== 0) {
                this._glTFTexture!.extras!.levels = 0;
            }
        }

        public update(mask: TextureNeedUpdate): void {
            this._needUpdate &= ~mask;
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
        public setLiner(value: FilterMode): this;
        /**
         * @deprecated
         */
        public setLiner(value: boolean): this;
        public setLiner(value: boolean | FilterMode): this {
            const sampler = this._sampler!;
            const { levels } = this._glTFTexture!.extensions.paper;
            const filterMode = typeof (value) === "boolean" ? (value ? FilterMode.Bilinear : FilterMode.Point) : value;

            sampler.magFilter = value ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;

            if (levels === undefined || levels === 1) {
                sampler.minFilter = value ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;
            }
            else if (filterMode === FilterMode.Point) {
                sampler.minFilter = gltf.TextureFilter.NearestMipmapNearest;
            }
            else if (filterMode === FilterMode.Bilinear) {
                sampler.minFilter = gltf.TextureFilter.LinearMipmapNearest;
            }
            else if (filterMode === FilterMode.Trilinear) {
                sampler.minFilter = gltf.TextureFilter.LinearMipMapLinear;
            }

            this._formatLevelsAndSampler();
            this.needUpdate(TextureNeedUpdate.Image | TextureNeedUpdate.Buffer | TextureNeedUpdate.Levels);

            return this;
        }
        /**
         * 
         */
        public setRepeat(value: boolean): this {
            const sampler = this._sampler!;
            sampler.wrapS = sampler.wrapT = value ? gltf.TextureWrappingMode.Repeat : gltf.TextureWrappingMode.ClampToEdge;
            this._formatLevelsAndSampler();
            this.needUpdate(TextureNeedUpdate.Image | TextureNeedUpdate.Buffer | TextureNeedUpdate.Levels);

            return this;
        }
        /**
         * 
         */
        public setMipmap(value: boolean): this {
            this._glTFTexture!.extensions.paper.levels = value ? 0 : 1;
            this._formatLevelsAndSampler();
            this.needUpdate(TextureNeedUpdate.Levels);

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
        public get levels(): uint {
            const { extensions, extras } = this._glTFTexture!;

            if (extras!.levels > 0) {
                return extras!.levels;
            }

            const { levels, width, height } = extensions.paper;

            if (levels === undefined) {
                return 1.0;
            }
            else if (levels === 0) {
                return extras!.levels = Math.log(Math.max(width!, height!)) * Math.LOG2E;
            }

            return levels;
        }
        /**
         * 
         */
        public get format(): gltf.TextureFormat {
            const { format } = this._glTFTexture!.extensions.paper;

            return format !== undefined ? format : gltf.TextureFormat.RGBA;
        }
        /**
         * 
         */
        public get width(): uint {
            return this._glTFTexture!.extensions.paper.width!;
        }
        /**
         * 
         */
        public get height(): uint {
            return this._glTFTexture!.extensions.paper.height!;
        }
        /**
         * 
         */
        public get sampler(): gltf.Sampler {
            return this._sampler!;
        }
        /**
         * 
         */
        public get gltfTexture(): GLTFTexture {
            return this._glTFTexture!;
        }
    }
}
