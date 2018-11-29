namespace egret3d {
    export abstract class BaseRenderTexture extends egret3d.BaseTexture {
        protected _mipmap: boolean = false;
        protected constructor(name: string, source: GLTF | ArrayBufferView | gltf.ImageSource | null,
            width: number, height: number,
            format?: gltf.TextureFormat, mipmap?: boolean,
            wrapS?: gltf.TextureWrap, wrapT?: gltf.TextureWrap,
            magFilter?: gltf.TextureFilter, minFilter?: gltf.TextureFilter,
            flipY?: boolean, premultiplyAlpha?: boolean, unpackAlignment?: gltf.TextureAlignment,
            type?: gltf.TextureDataType, anisotropy?: number,
            depth?: boolean, stencil?: boolean
        ) {
            super(name, source, width, height, format, mipmap, wrapS, wrapT, magFilter, minFilter, flipY, premultiplyAlpha, unpackAlignment, type, anisotropy);

            //
            const paperExtension = this._gltfTexture!.extensions.paper!;
            paperExtension.depthBuffer = depth || true;
            paperExtension.stencilBuffer = stencil || false;

            //
            this._mipmap = paperExtension.mipmap!;
        }

        public activateRenderTexture(index?: number): void { }
        public generateMipmap(): boolean { return false; }
    }

    export class RenderTexture extends egret3d.BaseRenderTexture {
        public static create(name: string, width: number, height: number, depth: boolean = false, stencil: boolean = false, mipmap: boolean = false, linear: boolean = false): RenderTexture {
            let magFilter = gltf.TextureFilter.LINEAR;
            let minFilter = gltf.TextureFilter.LINEAR;
            const wrapS = gltf.TextureWrap.CLAMP_TO_EDGE;
            const wrapT = gltf.TextureWrap.CLAMP_TO_EDGE;
            if (mipmap) {
                magFilter = linear ? gltf.TextureFilter.LINEAR : gltf.TextureFilter.NEAREST;
                minFilter = linear ? gltf.TextureFilter.LINEAR_MIPMAP_LINEAR : gltf.TextureFilter.NEAREST_MIPMAP_NEAREST;
            }
            else {
                magFilter = linear ? gltf.TextureFilter.LINEAR : gltf.TextureFilter.NEAREST;
                minFilter = linear ? gltf.TextureFilter.LINEAR : gltf.TextureFilter.NEAREST;
            }
            return new egret3d.RenderTexture(name, null, width, height, gltf.TextureFormat.RGBA, mipmap, wrapS, wrapT, magFilter, minFilter, false, false, undefined, undefined, undefined, depth, stencil);
        }
    }
}