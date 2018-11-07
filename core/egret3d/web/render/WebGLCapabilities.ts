namespace egret3d {
    const _pattern = /#include +<([\w\d.]+)>/g;
    const _browserPrefixes = [
        "",
        "MOZ_",
        "OP_",
        "WEBKIT_",
    ];

    function _getExtension(gl: WebGLRenderingContext, name: string) {
        for (const prefixedName of _browserPrefixes) {
            const extension = gl.getExtension(prefixedName + name);
            if (extension) {
                return extension;
            }
        }

        return null;
    }

    function _getMaxShaderPrecision(gl: WebGLRenderingContext, precision: string = "highp") {
        if (precision === "highp") {
            if (
                gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT)!.precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)!.precision > 0
            ) {
                return "highp";
            }

            precision = "mediump";
        }

        if (precision === "mediump") {
            if (
                gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT)!.precision > 0 &&
                gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT)!.precision > 0
            ) {
                return "mediump";
            }
        }

        return "lowp";
    }

    function _getConstDefines(maxPrecision: string) {
        let defines = "#extension GL_OES_standard_derivatives : enable \n";
        defines += "precision " + maxPrecision + " float; \n";
        defines += "precision " + maxPrecision + " int; \n";

        return defines;
    }

    function _replace(_match: string, include: string) {
        if (!(include in egret3d.ShaderChunk)) {
            throw new Error(`Can not resolve #include <${include}>`);
        }

        return _parseIncludes((egret3d.ShaderChunk as any)[include]);
    }

    function _parseIncludes(string: string): string {
        return string.replace(_pattern, _replace);
    }

    function _unrollLoops(string) {
        var pattern = /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;
        function replace(match, start, end, snippet) {
            var unroll = '';
            for (var i = parseInt(start); i < parseInt(end); i++) {
                unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]');
            }
            return unroll;
        }

        return string.replace(pattern, replace);

    }

    function _getWebGLShader(type: number, webgl: WebGLRenderingContext, gltfShader: gltf.Shader, defines: string) {
        const shader = webgl.createShader(type);
        let shaderContent = _parseIncludes(gltfShader.uri!);
        shaderContent = _unrollLoops(shaderContent);
        webgl.shaderSource(shader, defines + shaderContent);
        webgl.compileShader(shader);

        const parameter = webgl.getShaderParameter(shader, webgl.COMPILE_STATUS);
        if (!parameter) {
            console.error("Shader compile:" + gltfShader.name + " error! ->" + webgl.getShaderInfoLog(shader) + "\n" + ". did you want see the code?");
            // if (confirm("Shader compile:" + gltfShader.name + " error! ->" + webgl.getShaderInfoLog(shader) + "\n" + ". did you want see the code?")) {
            //     alert(gltfShader.uri);
            // }

            webgl.deleteShader(shader);

            return null;
        }

        return shader;
    }

    function _extractAttributes(webgl: WebGLRenderingContext, program: GlProgram) {
        const webglProgram = program.program;
        const attributes = program.attributes;
        const totalAttributes = webgl.getProgramParameter(webglProgram, webgl.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < totalAttributes; i++) {
            const attribData = webgl.getActiveAttrib(webglProgram, i)!;
            const location = webgl.getAttribLocation(webglProgram, attribData.name);
            attributes.push({ name: attribData.name, type: attribData.type, size: attribData.size, location });
        }
    }

    function _extractUniforms(webgl: WebGLRenderingContext, program: GlProgram, technique: gltf.Technique) {
        const webglProgram = program.program;
        const contextUniforms = program.contextUniforms;
        const uniforms = program.uniforms;
        const totalUniforms = webgl.getProgramParameter(webglProgram, webgl.ACTIVE_UNIFORMS);

        for (let i = 0; i < totalUniforms; i++) {
            const uniformData = webgl.getActiveUniform(webglProgram, i)!;
            const techniqueUniform = technique.uniforms[uniformData.name];
            const location = webgl.getUniformLocation(webglProgram, uniformData.name)!;

            if (!techniqueUniform) {
                console.error("缺少Uniform定义：" + uniformData.name);
            }

            if (techniqueUniform.semantic) {
                contextUniforms.push({ name: uniformData.name, type: uniformData.type, size: uniformData.size, location });
            }
            else {
                uniforms.push({ name: uniformData.name, type: uniformData.type, size: uniformData.size, location });
            }
        }
    }

    function _extractTextureUnits(program: GlProgram) {
        const activeUniforms = program.contextUniforms.concat(program.uniforms);
        const samplerArrayKeys: string[] = [];
        const samplerKeys: string[] = [];
        //排序
        for (const uniform of activeUniforms) {
            const key = uniform.name;
            if (uniform.type === gltf.UniformType.SAMPLER_2D || uniform.type === gltf.UniformType.SAMPLER_CUBE) {
                if (key.indexOf("[") > -1) {
                    samplerArrayKeys.push(key);
                }
                else {
                    samplerKeys.push(key);
                }
            }
        }

        let textureUint = 0;
        const allKeys = samplerKeys.concat(samplerArrayKeys);

        for (const uniform of activeUniforms) {
            if (allKeys.indexOf(uniform.name) < 0) {
                continue;
            }

            if (!uniform.textureUnits) {
                uniform.textureUnits = [];
            }

            uniform.textureUnits.length = uniform.size;

            for (let i = 0; i < uniform.size; i++) {
                uniform.textureUnits[i] = textureUint++;
            }
        }
    }
    /**
     * @private
     */
    export class WebGLCapabilities extends paper.SingletonComponent {
        /**
         * @deprecated
         */
        public static canvas: HTMLCanvasElement | null = null;
        /**
         * @deprecated
         */
        public static webgl: WebGLRenderingContext | null = null;
        public static commonDefines: string = "";

        public version: number;

        public precision: string = "highp";

        public maxPrecision: string;

        public maxTextures: number;

        public maxVertexTextures: number;

        public maxTextureSize: number;

        public maxCubemapSize: number;

        public maxVertexUniformVectors: number;

        public floatTextures: boolean;

        public anisotropyExt: EXT_texture_filter_anisotropic;

        public shaderTextureLOD: any;

        public maxAnisotropy: number;

        public maxRenderTextureSize: number;
        public standardDerivatives: boolean;
        public s3tc: WEBGL_compressed_texture_s3tc;
        public textureFloat: boolean;
        public textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;

        public oes_standard_derivatives: boolean;
        public gl_oes_standard_derivatives: boolean;

        public initialize(config: RunEgretOptions) {
            super.initialize();

            WebGLCapabilities.canvas = config.canvas;
            WebGLCapabilities.webgl = config.webgl;
            const webgl = WebGLCapabilities.webgl;
            if (!webgl) {
                return;
            }

            this.version = parseFloat(/^WebGL\ ([0-9])/.exec(webgl.getParameter(webgl.VERSION))![1]);

            this.maxPrecision = _getMaxShaderPrecision(webgl, this.precision);

            this.maxTextures = webgl.getParameter(webgl.MAX_TEXTURE_IMAGE_UNITS);

            this.maxVertexTextures = webgl.getParameter(webgl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);

            this.maxTextureSize = webgl.getParameter(webgl.MAX_TEXTURE_SIZE);
            this.maxCubemapSize = webgl.getParameter(webgl.MAX_CUBE_MAP_TEXTURE_SIZE);

            this.maxVertexUniformVectors = webgl.getParameter(webgl.MAX_VERTEX_UNIFORM_VECTORS);

            this.floatTextures = !!_getExtension(webgl, "OES_texture_float");

            this.anisotropyExt = _getExtension(webgl, "EXT_texture_filter_anisotropic");

            this.shaderTextureLOD = _getExtension(webgl, "EXT_shader_texture_lod");

            this.maxAnisotropy = (this.anisotropyExt !== null) ? webgl.getParameter(this.anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;

            // use dfdx and dfdy must enable OES_standard_derivatives
            this.oes_standard_derivatives = !!_getExtension(webgl, "OES_standard_derivatives");
            // GL_OES_standard_derivatives
            this.gl_oes_standard_derivatives = !!_getExtension(webgl, "GL_OES_standard_derivatives");

            //TODO
            WebGLCapabilities.commonDefines = _getConstDefines(this.maxPrecision);

            SkinnedMeshRendererSystem.maxBoneCount = Math.floor((this.maxVertexUniformVectors - 20) / 4);

            console.info("WebGL version:", this.version);
            console.info("Maximum shader precision:", this.maxPrecision);
            console.info("Maximum texture count:", this.maxTextures);
            console.info("Maximum vertex texture count:", this.maxVertexTextures);
            console.info("Maximum texture size:", this.maxTextureSize);
            console.info("Maximum cube map texture size:", this.maxCubemapSize);
            console.info("Maximum vertex uniform vectors:", this.maxVertexUniformVectors);
            console.info("Maximum GPU skinned bone count:", SkinnedMeshRendererSystem.maxBoneCount);
        }
    }
    /**
     * @private
     */
    export class WebGLRenderState extends paper.SingletonComponent {
        public readonly clearColor: Color = Color.create();

        private readonly _stateEnables: ReadonlyArray<gltf.EnableState> = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST]; // TODO
        private readonly _programs: { [key: string]: GlProgram } = {};
        private readonly _vsShaders: { [key: string]: WebGLShader } = {};
        private readonly _fsShaders: { [key: string]: WebGLShader } = {};
        private readonly _cacheStateEnable: { [key: string]: boolean | undefined } = {};
        private _cacheProgram: GlProgram | null = null;
        private _cacheState: gltf.States | null = null;

        private _getWebGLProgram(vs: gltf.Shader, fs: gltf.Shader, customDefines: string) {
            const webgl = WebGLCapabilities.webgl!;
            const program = webgl.createProgram();

            let key = vs.name + customDefines;
            let vertexShader = this._vsShaders[key];
            if (!vertexShader) {
                vertexShader = _getWebGLShader(webgl.VERTEX_SHADER, webgl, vs, WebGLCapabilities.commonDefines + customDefines + ShaderChunk.common_vert_def)!;
                this._vsShaders[key] = vertexShader;
            }

            key = fs.name + customDefines;
            let fragmentShader = this._fsShaders[key];
            if (!fragmentShader) {
                fragmentShader = _getWebGLShader(webgl.FRAGMENT_SHADER, webgl, fs, WebGLCapabilities.commonDefines + customDefines + ShaderChunk.common_frag_def)!;
                this._fsShaders[key] = fragmentShader;
            }

            webgl.attachShader(program, vertexShader);
            webgl.attachShader(program, fragmentShader);
            webgl.linkProgram(program);

            const parameter = webgl.getProgramParameter(program, webgl.LINK_STATUS);
            if (!parameter) {
                console.error("program compile: " + vs.name + "_" + fs.name + " error! ->" + webgl.getProgramInfoLog(program));
                // alert("program compile: " + vs.name + "_" + fs.name + " error! ->" + webgl.getProgramInfoLog(program));
                webgl.deleteProgram(program);

                return null;
            }

            return program;
        }

        public clearState() {
            for (const key in this._cacheStateEnable) {
                delete this._cacheStateEnable[key];
            }

            this._cacheProgram = null;
            this._cacheState = null;
        }

        public updateState(state: gltf.States | null) {
            if (this._cacheState === state) {
                return;
            }
            this._cacheState = state;

            const webgl = WebGLCapabilities.webgl!;
            const stateEnables = this._stateEnables;
            const cacheStateEnable = this._cacheStateEnable;
            for (const e of stateEnables) {
                const b = state ? state.enable && state.enable.indexOf(e) >= 0 : false;
                if (cacheStateEnable[e] !== b) {
                    cacheStateEnable[e] = b;
                    b ? webgl.enable(e) : webgl.disable(e);
                }
            }
            // Functions.
            if (state) {
                const functions = state.functions;
                if (functions) {
                    for (const fun in functions) {
                        ((webgl as any)[fun] as Function).apply(webgl, functions[fun]);
                    }
                }
            }
        }

        public useProgram(program: GlProgram) {
            if (this._cacheProgram !== program) {
                this._cacheProgram = program;
                WebGLCapabilities.webgl!.useProgram(program.program);

                return true;
            }

            return false;
        }

        public getProgram(material: Material, technique: gltf.Technique, defines: string) {
            const shader = material._shader;
            const extensions = shader.config.extensions!.KHR_techniques_webgl;
            const vertexShader = extensions!.shaders[0];
            const fragShader = extensions!.shaders[1];
            const name = vertexShader.name + "_" + fragShader.name + "_" + defines;//TODO材质标脏可以优化
            const webgl = WebGLCapabilities.webgl!;
            let program = this._programs[name];

            if (!program) {
                const webglProgram = this._getWebGLProgram(vertexShader, fragShader, defines);
                if (webglProgram) {
                    program = new GlProgram(webglProgram);
                    this._programs[name] = program;
                    _extractAttributes(webgl, program);
                    _extractUniforms(webgl, program, technique);
                    _extractTextureUnits(program);
                }
            }

            if (technique.program !== program.id) {
                technique.program = program.id;
            }

            return program;
        }

        public clearBuffer(bufferBit: gltf.BufferBit, clearColor?: Readonly<IColor>) {
            const webgl = WebGLCapabilities.webgl!;

            if (bufferBit & gltf.BufferBit.DEPTH_BUFFER_BIT) {
                webgl.depthMask(true);
                webgl.clearDepth(1.0);
            }

            if (bufferBit & gltf.BufferBit.STENCIL_BUFFER_BIT) {
                webgl.clearStencil(1.0);
            }

            if ((bufferBit & gltf.BufferBit.COLOR_BUFFER_BIT) !== 0 && clearColor) {
                webgl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
            }

            webgl.clear(bufferBit);
        }
    }
}