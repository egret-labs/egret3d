namespace egret3d {
    /**
     * 
     */
    export interface CreateTextureParameters extends GLTFTextureExtension {
        name?: string;
        image?: gltf.Image;
        sampler?: gltf.Sampler;
        source?: ArrayBufferView | ArrayBufferView[];
    }
    /**
     * 
     */
    export const enum TextureNeedUpdate {
        Image = 0x1,
        Levels = 0x1,
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
     * - 纹理资源的基类。
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
            if (source !== undefined) { // 使用 Buffer 动态创建纹理。
                if (Array.isArray(source)) { // Cube.
                    if (source.length > 0) {
                        let index = 0;
                        config.buffers = [];
                        image.bufferView = [];

                        for (const buffer of source) {
                            config.buffers.push({
                                byteLength: buffer.byteLength,
                                extras: {
                                    data: buffer
                                },
                            });
                            image.bufferView.push(index++);
                        }
                    }
                }
                else { // Normal.
                    config.buffers = [{
                        byteLength: source.byteLength,
                        extras: {
                            data: source
                        },
                    }];
                    image.bufferView = 0;
                }
            }
            else if (extras !== undefined) { // 使用 ImageData 动态创建纹理。
                image.extras = { data: Array.isArray(extras.data) ? extras.data.concat() : extras.data };
            }

            return config;
        }

        public type: gltf.TextureType;

        protected _needUpdate: uint;
        protected _sourceDirty: boolean;
        protected _levels: uint = 0;
        protected _gltfTexture: GLTFTexture | null;
        protected _image: gltf.Image | null;
        protected _sampler: gltf.Sampler | null;

        protected _clear() {
            super._clear();

            this.type = gltf.TextureType.Texture2D;
            this._sourceDirty = true;
            this._levels = 0;
            this._gltfTexture = null;
            this._image = null;
            this._sampler = null;
        }

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

            if (levels === undefined || levels === 1) {//不生成mipmap
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
            if (super.dispose()) {
                this._disposeImageSource();

                return true;
            }

            return false;
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
        public setLiner(value: boolean | FilterMode): this {
            const sampler = this._sampler;
            const levels = this._gltfTexture.extensions.paper.levels;

            sampler.magFilter = value ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;
            const filterMode: FilterMode = typeof (value) === "boolean" ? (value ? FilterMode.Bilinear : FilterMode.Point) : value;

            if (levels === undefined || levels === 1) {
                sampler.minFilter = value ? gltf.TextureFilter.Linear : gltf.TextureFilter.Nearest;
            }
            else {
                if (filterMode === FilterMode.Point) {
                    sampler.minFilter = gltf.TextureFilter.NearestMipmapNearest;
                }
                else if (filterMode === FilterMode.Bilinear) {
                    sampler.minFilter = gltf.TextureFilter.LinearMipmapNearest;
                }
                else if (filterMode === FilterMode.Trilinear) {
                    sampler.minFilter = gltf.TextureFilter.LinearMipMapLinear;
                }
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
        public static createColorTexture(name: string, r: number, g: number, b: number): Texture {
            const texture = Texture.create({
                name, source: new Uint8Array([r, g, b, 255, r, g, b, 255, r, g, b, 255, r, g, b, 255]), width: 2, height: 2,
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
                levels: 0, anisotropy: 4,
                sampler: {
                    wrapS: gltf.TextureWrappingMode.Repeat, wrapT: gltf.TextureWrappingMode.Repeat,
                    magFilter: gltf.TextureFilter.Linear, minFilter: gltf.TextureFilter.LinearMipMapLinear,
                }
            });

            return texture;
        }
        /**
         * 
         * @param source 
         */
        public uploadTexture(source: ArrayBuffer | gltf.ImageSource | null = null): this {
            this._sourceDirty = true;

            const config = this.config;
            const image = this._image;
            const extension = (config.textures![0] as GLTFTexture).extensions.paper;

            if (source) {
                if (ArrayBuffer.isView(source)) {
                    config.buffers = [{ byteLength: source.byteLength, extras: { data: source } }];
                    image.bufferView = 0;
                }
                else {
                    image.uri = (source as gltf.ImageSource); // 兼容
                    extension.width = (source as gltf.ImageSource).width;
                    extension.height = (source as gltf.ImageSource).height;
                }
            }
            else {
                image.uri = source;

                if (source) {
                    extension.width = (source as gltf.ImageSource).width;
                    extension.height = (source as gltf.ImageSource).height;
                }
            }

            return this;
        }
    }
}
