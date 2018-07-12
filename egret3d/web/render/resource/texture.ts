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


    export class TextureReader {
        public readonly gray: boolean;
        public readonly width: number;
        public readonly height: number;
        public readonly data: Uint8Array;

        constructor(webgl: WebGLRenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray: boolean = true) {
            this.gray = gray;
            this.width = width;
            this.height = height;

            let fbo = webgl.createFramebuffer();
            let fbold = webgl.getParameter(webgl.FRAMEBUFFER_BINDING);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);
            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D,
                texRGBA, 0);

            let readData = new Uint8Array(this.width * this.height * 4);
            readData[0] = 2;
            webgl.readPixels(0, 0, this.width, this.height, webgl.RGBA, webgl.UNSIGNED_BYTE,
                readData);
            webgl.deleteFramebuffer(fbo);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbold);

            if (gray) {
                this.data = new Uint8Array(this.width * this.height);
                for (let i = 0; i < width * height; i++) {
                    this.data[i] = readData[i * 4];
                }
            } else {
                this.data = readData;
            }
        }

        getPixel(u: number, v: number): any {
            let x = (u * this.width) | 0;
            let y = (v * this.height) | 0;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
            if (this.gray) {
                return this.data[y * this.width + x];
            }
            else {
                let i = (y * this.width + x) * 4;
                return new Color(this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]);
            }
        }
    }

    export interface ITexture {
        texture: WebGLTexture;
        width: number;
        height: number;
        isFrameBuffer(): boolean;
        dispose(webgl: WebGLRenderingContext);
        caclByteLength(): number;
    }

    export interface IRenderTarget extends ITexture {
        use(webgl: WebGLRenderingContext);
    }

    export class GlRenderTarget implements IRenderTarget {
        width: number;
        height: number;
        constructor(webgl: WebGLRenderingContext, width: number, height: number, depth: boolean = false, stencil: boolean = false) {
            this.width = width;
            this.height = height;
            this.fbo = webgl.createFramebuffer();
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
            if (depth || stencil) {
                this.renderbuffer = webgl.createRenderbuffer();
                webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
                if (depth && stencil) {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_STENCIL, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
                } else if (depth) {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);

                } else {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.STENCIL_INDEX8, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
                }
                webgl.bindRenderbuffer(webgl.RENDERBUFFER, null);
            }

            this.texture = webgl.createTexture();
            this.fbo["width"] = width;
            this.fbo["height"] = height;

            webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);

            webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, width, height, 0, webgl.RGBA, webgl.UNSIGNED_BYTE, null);

            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, this.texture, 0);
        }

        fbo: WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        texture: WebGLTexture;

        use(webgl: WebGLRenderingContext) {
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
            // webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
            // webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            //webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, this.texture, 0);
        }

        static useNull(webgl: WebGLRenderingContext) {
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);

        }

        dispose(webgl: WebGLRenderingContext) {
            //if (this.texture == null && this.img != null)
            //    this.disposeit = true;
            if (this.texture != null) {
                webgl.deleteFramebuffer(this.renderbuffer);
                this.renderbuffer = null;
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }

        caclByteLength(): number {
            //RGBA & no mipmap
            return this.width * this.height * 4;
        }

        isFrameBuffer(): boolean {
            return true;
        }
    }

    export class GlRenderTargetCube implements IRenderTarget {
        width: number;
        height: number;
        activeCubeFace: number = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
        constructor(webgl: WebGLRenderingContext, width: number, height: number, depth: boolean = false, stencil: boolean = false) {
            this.width = width;
            this.height = height;
            this.fbo = webgl.createFramebuffer();
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
            if (depth || stencil) {
                this.renderbuffer = webgl.createRenderbuffer();
                webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
                if (depth && stencil) {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_STENCIL, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
                } else if (depth) {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);

                } else {
                    webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.STENCIL_INDEX8, width, height);
                    webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.STENCIL_ATTACHMENT, webgl.RENDERBUFFER, this.renderbuffer);
                }
                webgl.bindRenderbuffer(webgl.RENDERBUFFER, null);
            }

            this.texture = webgl.createTexture();
            this.fbo["width"] = width;
            this.fbo["height"] = height;

            webgl.bindTexture(webgl.TEXTURE_CUBE_MAP, this.texture);
            webgl.texParameteri(webgl.TEXTURE_CUBE_MAP, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
            webgl.texParameteri(webgl.TEXTURE_CUBE_MAP, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);

            for (var i = 0; i < 6; i++) {
                webgl.texImage2D(webgl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, webgl.RGBA, width, height, 0, webgl.RGBA, webgl.UNSIGNED_BYTE, null);
            }

            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_CUBE_MAP_POSITIVE_X + this.activeCubeFace, this.texture, 0);
        }

        fbo: WebGLFramebuffer;
        renderbuffer: WebGLRenderbuffer;
        texture: WebGLTexture;

        use(webgl: WebGLRenderingContext) {
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, this.fbo);
            // webgl.bindRenderbuffer(webgl.RENDERBUFFER, this.renderbuffer);
            // webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_CUBE_MAP_POSITIVE_X + this.activeCubeFace, this.texture, 0);
        }

        static useNull(webgl: WebGLRenderingContext) {
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
        }

        dispose(webgl: WebGLRenderingContext) {
            //if (this.texture == null && this.img != null)
            //    this.disposeit = true;
            if (this.texture != null) {
                webgl.deleteFramebuffer(this.renderbuffer);
                this.renderbuffer = null;
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }

        caclByteLength(): number {
            //RGBA & no mipmap
            return this.width * this.height * 4;
        }

        isFrameBuffer(): boolean {
            return true;
        }
    }

    /**
     * 
     */
    export class GlTexture2D implements ITexture {

        constructor(webgl: WebGLRenderingContext, format: TextureFormatEnum = TextureFormatEnum.RGBA, mipmap: boolean = false, linear: boolean = true) {
            this.webgl = webgl;
            this.format = format;

            this.texture = webgl.createTexture();
        }

        uploadImage(img: HTMLImageElement, mipmap: boolean, linear: boolean, premultiply: boolean = true, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false): void {
            this.width = img.width;
            this.height = img.height;
            this.mipmap = mipmap;
            const webgl = this.webgl;
            webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply ? 1 : 0);
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 0);

            webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            let formatGL = webgl.RGBA;
            if (this.format == TextureFormatEnum.RGB) {
                formatGL = webgl.RGB;
            } else if (this.format == TextureFormatEnum.Gray) {
                formatGL = webgl.LUMINANCE;
            }
            webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, formatGL, webgl.UNSIGNED_BYTE, img);
            if (mipmap) {
                webgl.generateMipmap(webgl.TEXTURE_2D);

                if (linear) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_LINEAR);
                } else {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST);
                }
            } else {
                if (linear) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
                } else {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
                }
            }

            let wrap_s_param = webgl.CLAMP_TO_EDGE;
            let wrap_t_param = webgl.CLAMP_TO_EDGE;

            if (repeat) {
                wrap_s_param = mirroredU ? webgl.MIRRORED_REPEAT : webgl.REPEAT;
                wrap_t_param = mirroredV ? webgl.MIRRORED_REPEAT : webgl.REPEAT;
            }
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, wrap_s_param);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, wrap_t_param);
        }

        uploadByteArray(mipmap: boolean, linear: boolean, width: number, height: number, data: Uint8Array, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false): void {
            this.width = width;
            this.height = height;
            this.mipmap = mipmap;
            const webgl = this.webgl;
            webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 0);

            webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            let formatGL = webgl.RGBA;
            if (this.format == TextureFormatEnum.RGB) {
                formatGL = webgl.RGB;
            } else if (this.format == TextureFormatEnum.Gray) {
                formatGL = webgl.LUMINANCE;
            }
            webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, width, height, 0, formatGL, webgl.UNSIGNED_BYTE, data);
            if (mipmap) {
                webgl.generateMipmap(webgl.TEXTURE_2D);

                if (linear) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR_MIPMAP_LINEAR);
                } else {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST);
                }
            } else {
                if (linear) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
                }
                else {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);

                }
            }

            let wrap_s_param = webgl.CLAMP_TO_EDGE;
            let wrap_t_param = webgl.CLAMP_TO_EDGE;

            if (repeat) {
                wrap_s_param = mirroredU ? webgl.MIRRORED_REPEAT : webgl.REPEAT;
                wrap_t_param = mirroredV ? webgl.MIRRORED_REPEAT : webgl.REPEAT;
            }

            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, wrap_s_param);
            webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, wrap_t_param);
        }

        webgl: WebGLRenderingContext;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number = 0;
        height: number = 0;
        mipmap: boolean = false;

        caclByteLength(): number {
            let pixellen = 1;
            if (this.format == TextureFormatEnum.RGBA) {
                pixellen = 4;
            }
            else if (this.format == TextureFormatEnum.RGB) {
                pixellen = 3;
            }
            let len = this.width * this.height * pixellen;
            if (this.mipmap) {
                len = len * (1 - Math.pow(0.25, 10)) / 0.75;
            }
            return len;
        }

        reader: TextureReader;

        getReader(redOnly: boolean = false): TextureReader {
            if (this.reader != null) {
                if (this.reader.gray != redOnly)
                    throw new Error("get param diff with this.reader");
                return this.reader;
            }
            if (this.format != TextureFormatEnum.RGBA)
                throw new Error("only rgba texture can read");
            if (this.texture == null) return null;
            if (this.reader == null)
                this.reader = new TextureReader(this.webgl, this.texture, this.width, this.height, redOnly);

            return this.reader;
        }

        //disposeit: boolean = false;

        dispose(webgl: WebGLRenderingContext) {
            //if (this.texture == null && this.img != null) this.disposeit = true;

            if (this.texture != null) {
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }

        isFrameBuffer(): boolean {
            return false;
        }

        static createColorTexture(webgl: WebGLRenderingContext, r: number, g: number, b: number) {
            const mipmap = false;
            const linear = true;
            const width = 1;
            const height = 1;
            const texture = new GlTexture2D(webgl, TextureFormatEnum.RGBA, mipmap, linear);
            const data = new Uint8Array([r, g, b, 255]);
            texture.uploadByteArray(mipmap, linear, width, height, data);
            return texture;
        }

        static createGridTexture(webgl: WebGLRenderingContext) {
            const mipmap = false;
            const linear = true;
            const t = new GlTexture2D(webgl, TextureFormatEnum.RGBA, mipmap, linear);
            const width = 256;
            const height = 256;
            const data = new Uint8Array(width * width * 4);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const seek = (y * width + x) * 4;
                    const bool = ((x - width * 0.5) * (y - height * 0.5)) > 0
                    data[seek] = data[seek + 1] = data[seek + 2] = bool ? 0 : 255;
                    data[seek + 3] = 255;
                }
            }
            t.uploadByteArray(mipmap, linear, width, height, data);
            return t;
        }
    }


    export class WriteableTexture2D implements ITexture {
        constructor(webgl: WebGLRenderingContext, format: TextureFormatEnum = TextureFormatEnum.RGBA, width: number, height: number, linear: boolean, premultiply: boolean = true, repeat: boolean = false, mirroredU: boolean = false, mirroredV: boolean = false) {
            webgl = webgl;

            this.texture = webgl.createTexture();

            webgl.pixelStorei(webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiply ? 1 : 0);
            webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 0);

            webgl.bindTexture(webgl.TEXTURE_2D, this.texture);
            this.format = format;
            let formatGL = webgl.RGBA;

            if (format == TextureFormatEnum.RGB) {
                formatGL = webgl.RGB;
            } else if (format == TextureFormatEnum.Gray) {
                formatGL = webgl.LUMINANCE;
            }

            let data: Uint8Array = null;

            webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, width, height, 0, formatGL, webgl.UNSIGNED_BYTE, data);
            if (linear) {
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.LINEAR);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
            } else {
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
            }
            if (repeat) {
                if (mirroredU && mirroredV) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.MIRRORED_REPEAT);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.MIRRORED_REPEAT);
                } else if (mirroredU) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.MIRRORED_REPEAT);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.REPEAT);
                } else if (mirroredV) {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.REPEAT);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.MIRRORED_REPEAT);
                } else {
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.REPEAT);
                    webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.REPEAT);
                }
            } else {
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
                webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);
            }
        }

        isFrameBuffer(): boolean {
            return false;
        }

        webgl: WebGLRenderingContext;
        texture: WebGLTexture;
        format: TextureFormatEnum;
        width: number = 0;
        height: number = 0;

        dispose(webgl: WebGLRenderingContext) {
            if (this.texture != null) {
                webgl.deleteTexture(this.texture);
                this.texture = null;
            }
        }

        caclByteLength(): number {
            let pixellen = 1;
            if (this.format == TextureFormatEnum.RGBA) {
                pixellen = 4;
            } else if (this.format == TextureFormatEnum.RGB) {
                pixellen = 3;
            }
            let len = this.width * this.height * pixellen;
            return len;
        }
    }
}