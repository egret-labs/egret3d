namespace egret3d {
    export interface ITexture {//TODO 数据不完整
        texture: WebGLTexture;
        width: number;
        height: number;
        mipmap: boolean;
        format: gltf.TextureFormat;
        dispose(): void;
        caclByteLength(): number;
    }

    export abstract class GLTexture extends egret3d.Texture implements ITexture {
        /**
         * @internal
         */
        public _texture: WebGLTexture;
        protected _width: number;
        protected _height: number;
        protected _format: gltf.TextureFormat;
        protected _mipmap: boolean;

        public constructor(name: string = "", width: number = 0, height: number = 0, format: gltf.TextureFormat = gltf.TextureFormat.RGBA, mipmap: boolean = false) {
            super(name);

            this._width = width;
            this._height = height;
            this._format = format;
            this._mipmap = mipmap;

            const webgl = WebGLCapabilities.webgl;
            if (webgl) {
                this._texture = webgl.createTexture()!;
            }
        }

        public get texture() {
            return this._texture;
        }
        public get width() {
            return this._width;
        }
        public get height() {
            return this._height;
        }
        public get mipmap() {
            return this._mipmap;
        }
        public get format() {
            return this._format;
        }
    }
    /**
     * 
     */
    export class GLTexture2D extends GLTexture {
        public static createColorTexture(name: string, r: number, g: number, b: number) {
            const mipmap = true;
            const linear = true;
            const width = 1;
            const height = 1;
            const data = new Uint8Array([r, g, b, 255]);
            const texture = new GLTexture2D(name, width, height, gltf.TextureFormat.RGBA);
            texture.uploadImage(data, mipmap, linear, true, false);

            return texture;
        }

        public static createGridTexture(name: string) {
            const mipmap = true;
            const linear = true;
            const width = 128;
            const height = 128;
            const data = new Uint8Array(width * height * 4);

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const seek = (y * width + x) * 4;
                    const bool = ((x - width * 0.5) * (y - height * 0.5)) > 0;
                    data[seek] = data[seek + 1] = data[seek + 2] = bool ? 0 : 255;
                    data[seek + 3] = 255;
                }
            }

            const texture = new GLTexture2D(name, width, height, gltf.TextureFormat.RGBA);
            texture.uploadImage(data, mipmap, linear, true, true);

            return texture;
        }
        //
        protected _reader: TextureReader;
        constructor(name: string = "", width: number = 0, height: number = 0, format: gltf.TextureFormat = gltf.TextureFormat.RGBA, mipmap: boolean = false) {
            super(name, width, height, format, mipmap);
        }

        uploadImage(img: HTMLImageElement | Uint8Array, mipmap: boolean, linear: boolean, premultiply: boolean = true, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false) {
            this._mipmap = mipmap;
            const webgl = WebGLCapabilities.webgl;

            if (!webgl) {
                return;
            }

            webgl.bindTexture(webgl.TEXTURE_2D, this._texture);
            webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply ? 1 : 0);
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 0);

            let formatGL = this._format;
            // if (this._format === TextureFormatEnum.RGB) {
            //     formatGL = webgl.RGB;
            // }
            // else if (this._format === TextureFormatEnum.Gray) {
            //     formatGL = webgl.LUMINANCE;
            // }
            //
            if (ArrayBuffer.isView(img)) {
                webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, this._width, this._height, 0, formatGL, webgl.UNSIGNED_BYTE, img);
            }
            else {
                webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, formatGL, webgl.UNSIGNED_BYTE, img);
            }

            if (mipmap) {
                webgl.generateMipmap(webgl.TEXTURE_2D);

                if (linear) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_LINEAR);
                }
                else {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST);
                }
            }
            else {
                if (linear) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
                }
                else {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
                }
            }

            // TEXTURE_MAX_ANISOTROPY_EXT TODO

            let wrap_s_param = webgl.CLAMP_TO_EDGE;
            let wrap_t_param = webgl.CLAMP_TO_EDGE;

            if (repeat) {
                wrap_s_param = mirroredU ? webgl.MIRRORED_REPEAT : webgl.REPEAT;
                wrap_t_param = mirroredV ? webgl.MIRRORED_REPEAT : webgl.REPEAT;
            }

            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, wrap_s_param);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, wrap_t_param);
        }

        caclByteLength(): number {
            let pixellen = 1;
            if (this._format === gltf.TextureFormat.RGBA) {
                pixellen = 4;
            }
            else if (this._format === gltf.TextureFormat.RGB) {
                pixellen = 3;
            }
            let len = this.width * this.height * pixellen;
            if (this._mipmap) {
                len = len * (1 - Math.pow(0.25, 10)) / 0.75;
            }
            return len;
        }

        dispose() {
            if (!super.dispose()) {
                return false;
            }

            if (this._texture !== null) {
                WebGLCapabilities.webgl!.deleteTexture(this._texture);
                this._texture = null!;
            }

            return true;
        }

        getReader(redOnly: boolean = false): TextureReader {
            if (this._reader !== null) {
                if (this._reader.gray !== redOnly) {
                    throw new Error("get param diff with this.reader");
                }
                return this._reader;
            }
            if (this._format !== gltf.TextureFormat.RGBA) {
                throw new Error("only rgba texture can read");
            }
            if (this._texture === null) {
                return null as any;
            }
            if (this._reader === null)
                this._reader = new TextureReader(this._texture, this._width, this._height, redOnly);

            return this._reader;
        }
    }

    export class TextureReader {
        public readonly gray: boolean;
        public readonly width: number;
        public readonly height: number;
        public readonly data: Uint8Array;

        constructor(texRGBA: WebGLTexture, width: number, height: number, gray: boolean = true) {
            this.gray = gray;
            this.width = width;
            this.height = height;

            const readData = new Uint8Array(this.width * this.height * 4);
            readData[0] = 2;

            const webgl = WebGLCapabilities.webgl;
            if (webgl) {
                const fbo = webgl.createFramebuffer();
                const fbold = webgl.getParameter(webgl.FRAMEBUFFER_BINDING);
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);
                webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, texRGBA, 0);

                webgl.readPixels(0, 0, this.width, this.height, webgl.RGBA, webgl.UNSIGNED_BYTE, readData);
                webgl.deleteFramebuffer(fbo);
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbold);
            }

            if (gray) {
                this.data = new Uint8Array(this.width * this.height);
                for (let i = 0; i < width * height; i++) {
                    this.data[i] = readData[i * 4];
                }
            }
            else {
                this.data = readData;
            }
        }

        getPixel(u: number, v: number): any {
            const x = (u * this.width) | 0;
            const y = (v * this.height) | 0;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return 0;
            }

            if (this.gray) {
                return this.data[y * this.width + x];
            }
            else {
                const i = (y * this.width + x) * 4;
                return Color.create(this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]);
            }
        }
    }

    /**
    * @deprecated
    */
    export const enum TextureFormatEnum {
        RGBA = 1, // WebGLRenderingContext.RGBA,
        RGB = 2, // WebGLRenderingContext.RGB,
        Gray = 3, // WebGLRenderingContext.LUMINANCE,
        PVRTC4_RGB = 4,
        PVRTC4_RGBA = 4,
        PVRTC2_RGB = 4,
        PVRTC2_RGBA = 4,
    }

    // export class WriteableTexture2D implements ITexture {
    //     public width: number = 0;
    //     public height: number = 0;
    //     public format: gltf.TextureFormat;
    //     public texture: WebGLTexture;

    //     constructor(format: gltf.TextureFormat = gltf.TextureFormat.RGBA, width: number, height: number, linear: boolean, premultiply: boolean = true, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false) {
    //         const webgl = WebGLCapabilities.webgl;
    //         if (!webgl) {
    //             return;
    //         }

    //         this.texture = webgl.createTexture()!;

    //         webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply ? 1 : 0);
    //         webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 0);

    //         webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
    //         this.format = format;
    //         let formatGL = format;

    //         // if (format === TextureFormatEnum.RGB) {
    //         //     formatGL = webgl.RGB;
    //         // }
    //         // else if (format === TextureFormatEnum.Gray) {
    //         //     formatGL = webgl.LUMINANCE;
    //         // }

    //         let data: Uint8Array = null as any;
    //         webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, width, height, 0, formatGL, webgl.UNSIGNED_BYTE, data);
    //         if (linear) {
    //             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
    //             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
    //         }
    //         else {
    //             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
    //             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
    //         }
    //         if (repeat) {
    //             if (mirroredU) {
    //                 webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.MIRRORED_REPEAT);
    //             }
    //             else {
    //                 webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.REPEAT);
    //             }

    //             if (mirroredV) {
    //                 webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.MIRRORED_REPEAT);
    //             }
    //             else {
    //                 webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.REPEAT);
    //             }
    //         } else {
    //             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
    //             webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
    //         }
    //     }

    //     dispose() {
    //         if (this.texture) {
    //             WebGLCapabilities.webgl!.deleteTexture(this.texture);
    //             this.texture = null as any;
    //         }
    //     }

    //     caclByteLength(): number {
    //         let pixellen = 1;
    //         if (this.format === gltf.TextureFormat.RGBA) {
    //             pixellen = 4;
    //         }
    //         else if (this.format === gltf.TextureFormat.RGB) {
    //             pixellen = 3;
    //         }
    //         const len = this.width * this.height * pixellen;
    //         return len;
    //     }
    // }
}