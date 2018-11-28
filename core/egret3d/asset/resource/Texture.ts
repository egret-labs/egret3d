namespace egret3d {
    /**
     * 纹理资源。
     */
    export class Texture extends GLTFAsset {

        protected _gltfTexture: GLTFTexture | null = null;
        protected _image: gltf.Image;
        protected _sampler: gltf.Sampler;
        /**
         * @internal
         */
        public _dirty: boolean = false;

        /**
         * @internal
         */
        public constructor(name: string, bufferOrConfig: GLTF, width?: number, height?: number)
        public constructor(name: string, bufferOrConfig: ArrayBufferView | TexImageSource, width: number, height: number, format?: gltf.TextureFormat)
        public constructor(name: string, bufferOrConfig: GLTF | ArrayBufferView | TexImageSource, width: number, height: number,
            format?: gltf.TextureFormat, mipmap?: boolean, flipY?: boolean,
            premultiplyAlpha?: boolean, unpackAlignment?: gltf.TextureAlignment,
            wrapS?: gltf.TextureWrapS, wrapT?: gltf.TextureWrapT,
            mapFilter?: gltf.TextureMagFilter, minFilter?: gltf.TextureMinFilter,
            type?: gltf.TextureDataType, anisotropy?: number,
        ) {
            super(name);

            if (ArrayBuffer.isView(bufferOrConfig)) {
                this.config = GLTFAsset.createTextureConfig(); // TODO
            }
            else if (bufferOrConfig.hasOwnProperty("version")) {
                this.config = bufferOrConfig as GLTF;
            }
            else {
                this.config = GLTFAsset.createTextureConfig(); // TODO                
            }

            this._gltfTexture = this.config.textures![0] as GLTFTexture;
            const paperExtension = this._gltfTexture.extensions.paper!;
            // Sampler
            {
                this._sampler = this.config.samplers![this._gltfTexture.sampler as number];
                this._sampler.wrapS = wrapS || gltf.TextureWrapS.REPEAT;
                this._sampler.wrapT = wrapT || gltf.TextureWrapT.REPEAT;
                this._sampler.magFilter = mapFilter || gltf.TextureMagFilter.NEAREST;
                this._sampler.minFilter = minFilter || gltf.TextureMinFilter.NEAREST;
            }
            let w = width;
            let h = height;
            {
                this._image = this.config.images![this._gltfTexture.source as number];
                if (ArrayBuffer.isView(bufferOrConfig)) {
                    this._image.uri = bufferOrConfig;
                }
                else {
                    const img = bufferOrConfig as TexImageSource;
                    this._image.uri = img;
                    w = img.width;
                    h = img.height;
                }
            }
            paperExtension.width = width;
            paperExtension.height = height;

            paperExtension.format = format || gltf.TextureFormat.RGBA;
            paperExtension.premultiplyAlpha = premultiplyAlpha || false;
            paperExtension.unpackAlignment = unpackAlignment || gltf.TextureAlignment.Four;
            paperExtension.mipmap = mipmap || false;
            paperExtension.flipY = flipY || false;
            paperExtension.type = type || gltf.TextureDataType.UNSIGNED_BYTE;
            paperExtension.anisotropy = anisotropy || 1;

            this._dirty = true;
        }

        public uploadTexture(index: number): void { }

        public caclByteLength(): number {
            return 0;
        }

        public get gltfTexture(): GLTFTexture {
            return this._gltfTexture!;
        }
    }
}
