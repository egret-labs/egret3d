namespace egret3d {

    export class WebGLKit {
        private static _programMap: { [key: string]: GlProgram } = {};
        private static _vsShaderMap: { [key: string]: WebGLShader } = {};
        private static _fsShaderMap: { [key: string]: WebGLShader } = {};
        private static _constDefines: string;
        private static _cacheProgram: WebGLProgram;

        private static _parseIncludes(string) {
            const pattern = /#include +<([\w\d.]+)>/g;
            //
            function replace(match, include) {
                const replace = egret3d.ShaderChunk[include];
                if (replace === undefined) {
                    throw new Error('Can not resolve #include <' + include + '>');
                }

                return WebGLKit._parseIncludes(replace);
            }
            //
            return string.replace(pattern, replace);
        }

        private static _createConstDefines(): string {
            let defines = "precision " + this.capabilities.maxPrecision + " float; \n";
            defines += "precision " + this.capabilities.maxPrecision + " int; \n";
            // defines += '#extension GL_OES_standard_derivatives : enable \n';

            return defines;
        }

        private static _getWebGLShader(type: number, gl: WebGLRenderingContext, info: ShaderInfo, defines: string): WebGLShader {
            let shader = gl.createShader(type);
            //
            gl.shaderSource(shader, this._constDefines + defines + this._parseIncludes(info.src));
            gl.compileShader(shader);
            let parameter = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!parameter) {
                if (confirm("shader compile:" + info.name + " " + type + " error! ->" + gl.getShaderInfoLog(shader) + "\n" + ". did you want see the code?")) {
                    gl.deleteShader(shader);
                    alert(info.src);
                }
                return null;
            }

            return shader;
        }

        private static _getWebGLProgram(gl: WebGLRenderingContext, vs: ShaderInfo, fs: ShaderInfo, defines: string): WebGLProgram {
            let program = gl.createProgram();

            let key = vs.name + defines;
            let vertexShader = this._vsShaderMap[key];
            if (!vertexShader) {
                vertexShader = this._getWebGLShader(gl.VERTEX_SHADER, gl, vs, defines);
                this._vsShaderMap[key] = vertexShader;
            }

            key = fs.name + defines;
            let fragmentShader = this._fsShaderMap[key];
            if (!fragmentShader) {
                fragmentShader = this._getWebGLShader(gl.FRAGMENT_SHADER, gl, fs, defines);
                this._fsShaderMap[key] = fragmentShader;
            }

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            gl.linkProgram(program);

            let parameter = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!parameter) {
                alert("program compile: " + vs.name + "_" + fs.name + " error! ->" + gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }

            return program;
        }

        /**
         * extract attributes
         */
        private static _extractAttributes(gl: WebGLRenderingContext, program: GlProgram, technique: gltf.Technique) {
            const webglProgram = program.program;
            const totalAttributes = gl.getProgramParameter(webglProgram, gl.ACTIVE_ATTRIBUTES);
            //
            const attributes:{ [key: string]: WebGLActiveAttribute } = {};
            for (var i = 0; i < totalAttributes; i++) {
                var attribData = gl.getActiveAttrib(webglProgram, i);
                const location = gl.getAttribLocation(webglProgram, attribData.name);
                attributes[attribData.name] = { type: attribData.type, size: attribData.size, location };
            }
            program.attributes = attributes;
        }

        /**
         * extract uniforms
         */
        private static _extractUniforms(gl: WebGLRenderingContext, program: GlProgram, technique: gltf.Technique) {
            const webglProgram = program.program;
            const totalUniforms = gl.getProgramParameter(webglProgram, gl.ACTIVE_UNIFORMS);
            //
            const uniforms: { [key: string]: WebGLActiveUniform } = {};
            for (var i = 0; i < totalUniforms; i++) {
                const uniformData = gl.getActiveUniform(webglProgram, i);
                const location = gl.getUniformLocation(webglProgram, uniformData.name);

                uniforms[uniformData.name] = { type: uniformData.type, size: uniformData.size, location };
            }
            program.uniforms = uniforms;
        }
        private static _allocAttributes(program: GlProgram, technique: gltf.Technique) {
            const attributes = program.attributes;
            for (const name in technique.attributes) {
                const attribute = technique.attributes[name];
                if (attributes[name]) {
                    attribute.extensions.paper.enable = true;
                    attribute.extensions.paper.location = attributes[name].location;
                }
                else {
                    attribute.extensions.paper.enable = false;
                }
            }
        }
        private static _allocUniforms(program: GlProgram, technique: gltf.Technique) {
            const uniforms = program.uniforms;
            for (const name in technique.uniforms) {
                const uniform = technique.uniforms[name];
                if (uniforms[name]) {
                    if (uniforms[name].type !== uniform.type) {
                        console.error("Uniform类型不匹配 着色器中类型:" + uniforms[name].type + " 文件中类型:" + uniform.type);
                    }
                    uniform.count = uniforms[name].size;
                    uniform.extensions.paper.enable = true;
                    uniform.extensions.paper.location = uniforms[name].location;
                }
                else {
                    uniform.extensions.paper.enable = false;
                    uniform.extensions.paper.location = null;
                }
            }
        }
        /**
         * allocTexUnits
         */
        private static _allocTexUnits(program: GlProgram, technique: gltf.Technique) {
            const activeUniforms = program.uniforms;
            let samplerArrayKeys: string[] = [];
            let samplerKeys: string[] = [];
            //排序
            for (let key in activeUniforms) {
                const uniform = activeUniforms[key];
                if (uniform.type == gltf.UniformType.SAMPLER_2D || uniform.type == gltf.UniformType.SAMPLER_CUBE) {
                    if (key.indexOf("[") > -1) {
                        samplerArrayKeys.push(key);
                    }
                    else {
                        samplerKeys.push(key);
                    }
                }
            }

            const uniforms = technique.uniforms;
            const allKeys = samplerKeys.concat(samplerArrayKeys);
            let unitNumber: number = 0;
            for (const key of allKeys) {
                const uniform = uniforms[key];
                if (uniform && (uniform.type === gltf.UniformType.SAMPLER_2D || uniform.type === gltf.UniformType.SAMPLER_CUBE)) {
                    if (!uniform.extensions.paper.textureUnits) {
                        uniform.extensions.paper.textureUnits = [];
                    }
                    const textureUnits = uniform.extensions.paper.textureUnits;
                    const count = uniform.count ? uniform.count : 1;
                    if (activeUniforms[key].size !== count) {
                        console.error("贴图数量不匹配:" + key);
                    }
                    for (let i = 0; i < count; i++) {
                        textureUnits.push(unitNumber++);
                    }
                }
                else {
                    console.error(technique.name + " technique缺少Uniform定义:" + key);
                }
            }
        }

        public static getProgram(context: RenderContext, material: Material, technique: gltf.Technique, defines: string) {
            const shader = material.getShader();
            const name = shader.vertShader.name + "_" + shader.fragShader.name + "_" + defines;
            let program = this._programMap[name];
            const webgl = this.webgl;
            if (!program) {
                const webglProgram = this._getWebGLProgram(webgl, shader.vertShader, shader.fragShader, defines);
                program = new GlProgram(webglProgram);
                this._programMap[name] = program;
                this._extractAttributes(webgl, program, technique);
                this._extractUniforms(webgl, program, technique);
            }
            //
            if (technique.program !== program) {
                technique.program = program;
                this._allocAttributes(program, technique);
                this._allocUniforms(program, technique);
                this._allocTexUnits(program, technique);
            }
            return program;
        }
        public static useProgram(program: WebGLProgram) {
            if (this._cacheProgram !== program) {
                this._cacheProgram = program;
                this.webgl.useProgram(program);
                return true;
            }

            return false;
        }
        public static zWrite(value: boolean) {
            this.webgl.depthMask(value);
        }
        public static zTest(value: boolean) {
            let webgl = this.webgl;
            if (value) {
                webgl.enable(webgl.DEPTH_TEST);
            } else {
                webgl.disable(webgl.DEPTH_TEST);
            }
        }
        public static resetState() {
            // this._activeTextureIndex = -1;
            // this._showFace = undefined;
            // this._zWrite = undefined;
            // this._zTest = undefined;
            // this._zTestMethod = undefined;
            // this._blend = undefined;
            // this._program = undefined;
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

            if (!this.webgl) {
                this.webgl = webgl;

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
                //必须在this.capabilities.initialize之后
                this._constDefines = this._createConstDefines();
            }
        }
    }
}