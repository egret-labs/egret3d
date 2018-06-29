namespace egret3d {

    export class WebGLKit {


        private static _texNumber: number[] = null;
        private static _activeTextureIndex: number = -1;
        static activeTexture(index: number) {
            if (this._activeTextureIndex != index) {
                this.webgl.activeTexture(WebGLKit._texNumber[index]);
                this._activeTextureIndex = index;
            }
        }

        private static _showFace: ShowFaceStateEnum;
        private static _frontFaceCW: boolean = false;
        static showFace(value: ShowFaceStateEnum, frontFaceCW: boolean = false) {
            if (this._showFace != value || this._frontFaceCW != frontFaceCW) {
                let webgl = this.webgl;
                if (value == ShowFaceStateEnum.ALL) {
                    webgl.disable(webgl.CULL_FACE);
                } else {
                    let ccw = (value == ShowFaceStateEnum.CCW);
                    if (frontFaceCW) {
                        ccw = !ccw;
                    }
                    if (ccw) {
                        webgl.frontFace(webgl.CCW);
                    } else {
                        webgl.frontFace(webgl.CW);
                    }
                    webgl.cullFace(webgl.BACK);
                    webgl.enable(webgl.CULL_FACE);
                }

                this._showFace = value;
                this._frontFaceCW = frontFaceCW;
            }
        }

        private static _zWrite: boolean;
        static zWrite(value: boolean) {
            if (this._zWrite !== value) {
                this.webgl.depthMask(value);
                this._zWrite = value;
            }
        }

        private static _zTest: boolean;
        static zTest(value: boolean) {
            if (this._zTest !== value) {
                let webgl = this.webgl;
                if (value) {
                    webgl.enable(webgl.DEPTH_TEST);
                } else {
                    webgl.disable(webgl.DEPTH_TEST);
                }
                this._zTest = value;
            }
        }

        private static _zTestMethod: number;
        static zTestMethod(value: number) {
            if (this._zTestMethod !== value) {
                this.webgl.depthFunc(value);
                this._zTestMethod = value;
            }
        }

        private static _blend: boolean;
        static blend(value: boolean, equation: number, srcRGB: number, destRGB: number, srcAlpha: number, destAlpha: number) {
            let webgl = this.webgl;
            if (this._blend !== value) {
                value ? webgl.enable(webgl.BLEND) : webgl.disable(webgl.BLEND);
                this._blend = value;
            }
            if (value) {
                webgl.blendEquation(equation);
                // this.webgl.blendFunc(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA);
                webgl.blendFuncSeparate(srcRGB, destRGB, srcAlpha, destAlpha);
            }
        }

        private static _program: WebGLProgram;
        static useProgram(program: WebGLProgram): boolean {
            if (this._program != program) {
                this._program = program;
                this.webgl.useProgram(program);
                return true;
            }
            return false;
        }

        static setStates(drawPass: DrawPass, frontFaceCW: boolean = false) {

            WebGLKit.showFace(drawPass.state_showface, frontFaceCW);
            WebGLKit.zWrite(drawPass.state_zwrite);
            WebGLKit.zTest(drawPass.state_ztest);
            WebGLKit.blend(drawPass.state_blend, drawPass.state_blendEquation, drawPass.state_blendSrcRGB, drawPass.state_blendDestRGB, drawPass.state_blendSrcAlpha, drawPass.state_blendDestALpha);
            if (drawPass.state_ztest) {
                WebGLKit.zTestMethod(drawPass.state_ztest_method);
            }
        }

        static draw(context: RenderContext, material: Material, mesh: Mesh, subMeshIndex: number, basetype: string = "base", frontFaceCW: boolean = false) {
            if (!material) {
                return;
            }
            let shader = material.getShader();
            if (!shader) {
                return;
            }
            let drawPasses = shader.passes[basetype + context.drawtype];
            if (!drawPasses) {
                drawPasses = shader.passes["base" + context.drawtype];
            }
            if (!drawPasses) {
                return;
            }

            const webGL = this.webgl;

            for (let i = 0; i < drawPasses.length; i++) {
                let pass = drawPasses[i];
                let program: GlProgram = GlProgram.get(pass, context, material);
                this.setStates(pass, frontFaceCW);
                let force = WebGLKit.useProgram(program.program);
                program.uploadUniforms(material, context, force);
                program.bindAttributes(mesh, subMeshIndex, force);
                // MD Mesh
                // if (sm.useVertexIndex < 0) {
                //     if (sm.line) {
                //         WebGLKit.drawArrayLines(sm.start, sm.size);
                //     } else {
                //         WebGLKit.drawArrayTris(sm.start, sm.size);
                //     }
                // } else {
                //     if (sm.line) {
                //         WebGLKit.drawElementLines(sm.start, sm.size);
                //     } else {
                //         WebGLKit.drawElementTris(sm.start, sm.size);
                //     }
                // }

                const primitive = mesh.glTFMesh.primitives[subMeshIndex];
                const vertexAccessor = mesh.glTFAsset.getAccessor(primitive.attributes.POSITION);
                const bufferOffset = mesh.glTFAsset.getBufferOffset(vertexAccessor);

                if (primitive.indices !== undefined) {
                    const indexAccessor = mesh.glTFAsset.getAccessor(primitive.indices);
                    switch (primitive.mode) { // TODO
                        case gltf.MeshPrimitiveMode.Lines:
                            webGL.drawElements(webGL.LINES, indexAccessor.count, webGL.UNSIGNED_SHORT, bufferOffset);
                            break;

                        case gltf.MeshPrimitiveMode.Triangles:
                        default:
                            webGL.drawElements(webGL.TRIANGLES, indexAccessor.count, webGL.UNSIGNED_SHORT, bufferOffset);
                            break;
                    }
                }
                else {
                    switch (primitive.mode) {
                        case gltf.MeshPrimitiveMode.Lines:
                            webGL.drawArrays(webGL.LINES, bufferOffset, vertexAccessor.count);
                            break;

                        case gltf.MeshPrimitiveMode.LineLoop:
                            webGL.drawArrays(webGL.LINE_LOOP, bufferOffset, vertexAccessor.count);
                            break;

                        case gltf.MeshPrimitiveMode.LineStrip:
                            webGL.drawArrays(webGL.LINE_STRIP, bufferOffset, vertexAccessor.count);
                            break;

                        case gltf.MeshPrimitiveMode.Triangles:
                        default:
                            webGL.drawArrays(webGL.TRIANGLES, bufferOffset, vertexAccessor.count);
                            break;
                    }
                }
            }
        }

        static resetState() {
            this._activeTextureIndex = -1;
            this._showFace = undefined;
            this._zWrite = undefined;
            this._zTest = undefined;
            this._zTestMethod = undefined;
            this._blend = undefined;
            this._program = undefined;
            // ...
        }

        static webgl: WebGLRenderingContext;

        static FUNC_ADD: number;
        static FUNC_SUBTRACT: number;
        static FUNC_REVERSE_SUBTRACT: number;
        static ONE: number;
        static ZERO: number;
        static SRC_ALPHA: number;
        static SRC_COLOR: number;
        static ONE_MINUS_SRC_ALPHA: number;
        static ONE_MINUS_SRC_COLOR: number;
        static ONE_MINUS_DST_ALPHA: number;
        static ONE_MINUS_DST_COLOR: number;
        static LEQUAL: number;
        static EQUAL: number;
        static GEQUAL: number;
        static NOTEQUAL: number;
        static LESS: number;
        static GREATER: number;
        static ALWAYS: number;
        static NEVER: number;
        static capabilities: WebGLCapabilities = new WebGLCapabilities();


        static init(canvas: HTMLCanvasElement, options: RequiredRuntimeOptions): void {
            let webgl = <WebGLRenderingContext>canvas.getContext('webgl', options) ||
                <WebGLRenderingContext>canvas.getContext("experimental-webgl", options);

            if (WebGLKit._texNumber == null) {
                this.webgl = webgl;

                WebGLKit._texNumber = [];
                WebGLKit._texNumber.push(webgl.TEXTURE0);
                WebGLKit._texNumber.push(webgl.TEXTURE1);
                WebGLKit._texNumber.push(webgl.TEXTURE2);
                WebGLKit._texNumber.push(webgl.TEXTURE3);
                WebGLKit._texNumber.push(webgl.TEXTURE4);
                WebGLKit._texNumber.push(webgl.TEXTURE5);
                WebGLKit._texNumber.push(webgl.TEXTURE6);
                WebGLKit._texNumber.push(webgl.TEXTURE7);
                WebGLKit._texNumber.push(webgl.TEXTURE8);
                WebGLKit._texNumber.push(webgl.TEXTURE9);

                WebGLKit.LEQUAL = webgl.LEQUAL;
                WebGLKit.NEVER = webgl.NEVER;
                WebGLKit.EQUAL = webgl.EQUAL;
                WebGLKit.GEQUAL = webgl.GEQUAL;
                WebGLKit.NOTEQUAL = webgl.NOTEQUAL;
                WebGLKit.LESS = webgl.LESS;
                WebGLKit.GREATER = webgl.GREATER;
                WebGLKit.ALWAYS = webgl.ALWAYS;

                WebGLKit.FUNC_ADD = webgl.FUNC_ADD;
                WebGLKit.FUNC_SUBTRACT = webgl.FUNC_SUBTRACT;
                WebGLKit.FUNC_REVERSE_SUBTRACT = webgl.FUNC_REVERSE_SUBTRACT;

                WebGLKit.ONE = webgl.ONE;
                WebGLKit.ZERO = webgl.ZERO;
                WebGLKit.SRC_ALPHA = webgl.SRC_ALPHA;
                WebGLKit.SRC_COLOR = webgl.SRC_COLOR;
                WebGLKit.ONE_MINUS_SRC_ALPHA = webgl.ONE_MINUS_SRC_ALPHA;
                WebGLKit.ONE_MINUS_SRC_COLOR = webgl.ONE_MINUS_SRC_COLOR;
                WebGLKit.ONE_MINUS_DST_ALPHA = webgl.ONE_MINUS_DST_ALPHA;
                WebGLKit.ONE_MINUS_DST_COLOR = webgl.ONE_MINUS_DST_COLOR;

                this.capabilities.initialize(webgl);

            }
        }


    }
}