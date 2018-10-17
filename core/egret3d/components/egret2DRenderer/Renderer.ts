//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module egret.web {
    /**
     * @internal
     */
    export class Renderer {

        private static _instance: Renderer;
        public static getInstance(context: WebGLRenderingContext): Renderer {
            if (!this._instance) {
                this._instance = new Renderer(context);
            }
            return this._instance;
        }

        private projectionX: number;
        private projectionY: number;

        private drawCmdManager: egret.web.WebGLDrawCmdManager;
        private vao: egret.web.WebGLVertexArrayObject;
        private vertexBuffer;
        private indexBuffer;

        private egretWebGLRenderContext: WebGLRenderContext;

        private constructor(private context: WebGLRenderingContext) {
            let egretWebGLRenderContext = this.egretWebGLRenderContext = egret.web.WebGLRenderContext.getInstance(0, 0);
            egretWebGLRenderContext.setContext(context);

            this.drawCmdManager = egretWebGLRenderContext.drawCmdManager;
            this.vao = egretWebGLRenderContext.vao;
            // egretWebGLRenderContext.drawFunc = this.$drawWebGL.bind(this);
            egretWebGLRenderContext.$drawWebGL = this.$drawWebGL.bind(this);
            egret.sys.RenderBuffer = egret.web.WebGLRenderBuffer;
            egret.sys.systemRenderer = new egret.web.WebGLRenderer();
            egret.sys.canvasRenderer = new egret.CanvasRenderer();
            egret.sys.customHitTestBuffer = new egret.web.WebGLRenderBuffer(3, 3);
            egret.sys.canvasHitTestBuffer = new egret.web.CanvasRenderBuffer(3, 3);
            egret.Capabilities['$renderMode'] = "webgl";

            this.vertexBuffer = context.createBuffer();
            this.indexBuffer = context.createBuffer();

            // app.addEventListener("beforeRender", function() {
            //     egret.ticker.update();
            // }, this);
        }

        public beforeRender() {
            let gl = this.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
            gl.disable(gl.STENCIL_TEST);
            gl.colorMask(true, true, true, true);
            this.setBlendMode("source-over");

            // 目前只使用0号材质单元，默认开启
            gl.activeTexture(gl.TEXTURE0);
            this.currentProgram = null;
        }
        /**
         * @internal
         */
        public _activatedBuffer: WebGLRenderBuffer;
        public $drawWebGL() {
            if (this.drawCmdManager.drawDataLen == 0) {
                return;
            }

            this.uploadVerticesArray(this.vao.getVertices());

            // 有mesh，则使用indicesForMesh
            if (this.vao.isMesh()) {
                this.uploadIndicesArray(this.vao.getMeshIndices());
            }

            let length = this.drawCmdManager.drawDataLen;
            let offset = 0;
            for (let i = 0; i < length; i++) {
                let data = this.drawCmdManager.drawData[i];
                if (!data) {
                    continue;
                }
                offset = this.drawData(data, offset);
                // 计算draw call
                if (data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                    this._activatedBuffer = data.buffer;
                    this.egretWebGLRenderContext.activatedBuffer = data.buffer;
                }
                if (data.type == DRAWABLE_TYPE.TEXTURE || data.type == DRAWABLE_TYPE.PUSH_MASK || data.type == DRAWABLE_TYPE.POP_MASK) {
                    if (this._activatedBuffer && this._activatedBuffer.$computeDrawCall) {
                        this._activatedBuffer.$drawCalls++;
                    }
                }
            }

            // 切换回默认indices
            if (this.vao.isMesh()) {
                this.uploadIndicesArray(this.vao.getIndices());
            }

            // 清空数据
            this.drawCmdManager.clear();
            this.vao.clear();
        }

        /**
         * 执行绘制命令
         */
        private drawData(data: any, offset: number) {
            if (!data) {
                return;
            }

            let gl = this.context;
            let program: EgretWebGLProgram;
            let filter = data.filter;

            switch (data.type) {
                case DRAWABLE_TYPE.TEXTURE:
                    if (filter) {
                        if (filter.type === "custom") {
                            program = EgretWebGLProgram.getProgram(gl, filter.$vertexSrc, filter.$fragmentSrc, filter.$shaderKey);
                        } else if (filter.type === "colorTransform") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.colorTransform_frag, "colorTransform");
                        } else if (filter.type === "blurX") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.blur_frag, "blur");
                        } else if (filter.type === "blurY") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.blur_frag, "blur");
                        } else if (filter.type === "glow") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.glow_frag, "glow");
                        }
                    } else {
                        program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.texture_frag, "texture");
                    }

                    this.activeProgram(gl, program);
                    this.syncUniforms(program, filter, data);

                    offset += this.drawTextureElements(data, offset);
                    break;
                case DRAWABLE_TYPE.PUSH_MASK:

                    program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.primitive_frag, "primitive");
                    this.activeProgram(gl, program);
                    this.syncUniforms(program, filter, data);

                    offset += this.drawPushMaskElements(data, offset);
                    break;
                case DRAWABLE_TYPE.POP_MASK:

                    program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.primitive_frag, "primitive");
                    this.activeProgram(gl, program);
                    this.syncUniforms(program, filter, data);

                    offset += this.drawPopMaskElements(data, offset);
                    break;
                case DRAWABLE_TYPE.BLEND:
                    this.setBlendMode(data.value);
                    break;
                case DRAWABLE_TYPE.RESIZE_TARGET:
                    data.buffer.rootRenderTarget.resize(data.width, data.height);
                    this.onResize(data.width, data.height);
                    break;
                case DRAWABLE_TYPE.CLEAR_COLOR:
                    if (this._activatedBuffer) {
                        let target = this._activatedBuffer.rootRenderTarget;
                        if (target.width != 0 || target.height != 0) {
                            target.clear(true);
                        }
                    }
                    break;
                case DRAWABLE_TYPE.ACT_BUFFER:
                    this.activateBuffer(data.buffer, data.width, data.height);
                    break;
                case DRAWABLE_TYPE.ENABLE_SCISSOR:
                    let buffer = this._activatedBuffer;
                    if (buffer) {
                        if (buffer.rootRenderTarget) {
                            buffer.rootRenderTarget.enabledStencil();
                        }
                        buffer.enableScissor(data.x, data.y, data.width, data.height);
                    }
                    break;
                case DRAWABLE_TYPE.DISABLE_SCISSOR:
                    buffer = this._activatedBuffer;
                    if (buffer) {
                        buffer.disableScissor();
                    }
                    break;
                default:
                    break;
            }

            return offset;
        }

        private currentProgram: EgretWebGLProgram;
        private activeProgram(gl: WebGLRenderingContext, program: EgretWebGLProgram): void {
            if (program != this.currentProgram) {
                gl.useProgram(program.id);

                // 目前所有attribute buffer的绑定方法都是一致的
                let attribute = program.attributes;

                for (let key in attribute) {
                    if (key === "aVertexPosition") {
                        gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 4 * 4, 0);
                        gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                    }
                    else if (key === "aTextureCoord") {
                        gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.UNSIGNED_SHORT, true, 4 * 4, 2 * 4);
                        gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                    }
                    else if (key === "aColor") {
                        gl.vertexAttribPointer(attribute["aColor"].location, 1, gl.FLOAT, false, 4 * 4, 3 * 4);
                        gl.enableVertexAttribArray(attribute["aColor"].location);
                    }
                    //===== particle begin =====
                    else if (key === "aParticlePosition") {
                        gl.vertexAttribPointer(attribute["aParticlePosition"].location, 2, gl.FLOAT, false, 22 * 4, 0);
                        gl.enableVertexAttribArray(attribute["aParticlePosition"].location);
                    }
                    else if (key === "aParticleTextureCoord") {
                        gl.vertexAttribPointer(attribute["aParticleTextureCoord"].location, 2, gl.FLOAT, false, 22 * 4, 2 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleTextureCoord"].location);
                    }
                    else if (key === "aParticleScale") {
                        gl.vertexAttribPointer(attribute["aParticleScale"].location, 2, gl.FLOAT, false, 22 * 4, 4 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleScale"].location);
                    }
                    else if (key === "aParticleRotation") {
                        gl.vertexAttribPointer(attribute["aParticleRotation"].location, 2, gl.FLOAT, false, 22 * 4, 6 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleRotation"].location);
                    }
                    else if (key === "aParticleRed") {
                        gl.vertexAttribPointer(attribute["aParticleRed"].location, 2, gl.FLOAT, false, 22 * 4, 8 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleRed"].location);
                    }
                    else if (key === "aParticleGreen") {
                        gl.vertexAttribPointer(attribute["aParticleGreen"].location, 2, gl.FLOAT, false, 22 * 4, 10 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleGreen"].location);
                    }
                    else if (key === "aParticleBlue") {
                        gl.vertexAttribPointer(attribute["aParticleBlue"].location, 2, gl.FLOAT, false, 22 * 4, 12 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleBlue"].location);
                    }
                    else if (key === "aParticleAlpha") {
                        gl.vertexAttribPointer(attribute["aParticleAlpha"].location, 2, gl.FLOAT, false, 22 * 4, 14 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleAlpha"].location);
                    }
                    else if (key === "aParticleEmitRotation") {
                        gl.vertexAttribPointer(attribute["aParticleEmitRotation"].location, 2, gl.FLOAT, false, 22 * 4, 16 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleEmitRotation"].location);
                    }
                    else if (key === "aParticleEmitRadius") {
                        gl.vertexAttribPointer(attribute["aParticleEmitRadius"].location, 2, gl.FLOAT, false, 22 * 4, 18 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleEmitRadius"].location);
                    }
                    else if (key === "aParticleTime") {
                        gl.vertexAttribPointer(attribute["aParticleTime"].location, 2, gl.FLOAT, false, 22 * 4, 20 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleTime"].location);
                    }
                    //===== particle end =====
                }

                this.currentProgram = program;
            }
        }

        private syncUniforms(program: EgretWebGLProgram, filter: Filter, data): void {
            let uniforms = program.uniforms;
            for (let key in uniforms) {
                if (key === "projectionVector") {
                    uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                }
                else if (key === "uTextureSize") {
                    uniforms[key].setValue({ x: data.textureWidth, y: data.textureHeight });
                }
                else if (key === "uSampler") {

                }
                else if (key === "uGlobalMatrix") {
                    uniforms[key].setValue([data.a, data.c, data.tx, data.b, data.d, data.ty, 0, 0, 1]);
                }
                else if (key === "uGlobalAlpha") {
                    uniforms[key].setValue(data.alpha);
                }
                else {
                    let value = filter.$uniforms[key];
                    if (value !== undefined) {
                        uniforms[key].setValue(value);
                    } else {
                        // egret.warn("filter custom: uniform " + key + " not defined!");
                    }
                }
            }
        }

        /**
         * 画texture
         **/
        private drawTextureElements(data: any, offset: number): number {
            let gl = this.context;
            if (data.texture.isCancas) {
                (gl as any).wxBindCanvasTexture(gl.TEXTURE_2D, data.texture);
            }
            else {
                gl.bindTexture(gl.TEXTURE_2D, data.texture);
            }

            let size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        private bindIndices: boolean;
        /**
         * 启用RenderBuffer
         */
        private activateBuffer(buffer: WebGLRenderBuffer, width: number, height: number): void {

            buffer.rootRenderTarget.activate();

            if (!this.bindIndices) {
                this.uploadIndicesArray(this.vao.getIndices());
            }

            buffer.restoreStencil();

            buffer.restoreScissor();

            this.onResize(width, height);
        }

        public onResize(width: number, height: number): void {
            this.projectionX = width / 2;
            this.projectionY = -height / 2;
            if (this.context) {
                this.context.viewport(0, 0, width, height);
            }
        }

        /**
         * 上传顶点数据
         */
        private uploadVerticesArray(array: any): void {
            let gl = this.context;
            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
        }

        /**
         * 上传索引数据
         */
        private uploadIndicesArray(array: any): void {
            let gl = this.context;
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
            this.bindIndices = true;
        }

        /**
         * 画push mask
         **/
        private drawPushMaskElements(data: any, offset: number): number {
            let gl = this.context;

            let size = data.count * 3;

            let buffer = this._activatedBuffer;
            if (buffer) {
                if (buffer.rootRenderTarget) {
                    buffer.rootRenderTarget.enabledStencil();
                }
                if (buffer.stencilHandleCount == 0) {
                    buffer.enableStencil();
                    gl.clear(gl.STENCIL_BUFFER_BIT);// clear
                }

                let level = buffer.stencilHandleCount;
                buffer.stencilHandleCount++;

                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

                // gl.bindTexture(gl.TEXTURE_2D, null);
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            }

            return size;
        }

        /**
         * 画pop mask
         **/
        private drawPopMaskElements(data: any, offset: number) {
            let gl = this.context;

            let size = data.count * 3;

            let buffer = this._activatedBuffer;
            if (buffer) {
                buffer.stencilHandleCount--;

                if (buffer.stencilHandleCount == 0) {
                    buffer.disableStencil();// skip this draw
                } else {
                    let level = buffer.stencilHandleCount;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

                    // gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                }
            }

            return size;
        }

        /**
         * 设置混色
         */
        private setBlendMode(value: string): void {
            let gl = this.context;
            let blendModeWebGL = Renderer.blendModesForGL[value];
            if (blendModeWebGL) {
                gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
            }
        }

        public static blendModesForGL: any = null;

        public static initBlendMode(): void {
            Renderer.blendModesForGL = {};
            Renderer.blendModesForGL["source-over"] = [1, 771];
            Renderer.blendModesForGL["lighter"] = [1, 1];
            Renderer.blendModesForGL["lighter-in"] = [770, 771];
            Renderer.blendModesForGL["destination-out"] = [0, 771];
            Renderer.blendModesForGL["destination-in"] = [0, 770];
        }
    }

    Renderer.initBlendMode();
}