namespace egret3d {
    export const enum TextureFormatEnum {
        RGBA = 1, // WebGLRenderingContext.RGBA,
        RGB = 2, // WebGLRenderingContext.RGB,
        Gray = 3, // WebGLRenderingContext.LUMINANCE,
        PVRTC4_RGB = 4,
        PVRTC4_RGBA = 4,
        PVRTC2_RGB = 4,
        PVRTC2_RGBA = 4,
    }

    export interface IRenderTarget extends BaseTexture {
        use(): void;
    }

    /**
     * 纹理资源。
     */
    export abstract class BaseTexture extends paper.Asset {
        protected _width: number = 0;
        protected _height: number = 0;

        public get width() {
            return this._width;
        }
        public get height() {
            return this._height;
        }
    }
}
