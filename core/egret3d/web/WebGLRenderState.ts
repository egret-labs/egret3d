namespace egret3d.web {
    function _extractAttributes(webgl: WebGLRenderingContext, program: WebGLProgramBinder, technique: gltf.Technique) {
        const webglProgram = program.program;
        const attributes = program.attributes;
        const totalAttributes = webgl.getProgramParameter(webglProgram, webgl.ACTIVE_ATTRIBUTES);

        for (let i = 0; i < totalAttributes; i++) {
            const attribData = webgl.getActiveAttrib(webglProgram, i)!;
            const location = webgl.getAttribLocation(webglProgram, attribData.name);
            let semantic = "";
            if (!technique.attributes[attribData.name]) {
                semantic = globalAttributeSemantic[attribData.name];
                if (!semantic) {
                    console.error("未知Uniform定义：" + attribData.name);
                }
            }
            else {
                semantic = technique.attributes[attribData.name].semantic;
            }
            attributes.push({ name: attribData.name, type: attribData.type, size: attribData.size, location, semantic });
        }
    }

    function _extractUniforms(webgl: WebGLRenderingContext, program: WebGLProgramBinder, technique: gltf.Technique) {
        const webglProgram = program.program;
        const contextUniforms = program.contextUniforms;
        const uniforms = program.uniforms;
        const totalUniforms = webgl.getProgramParameter(webglProgram, webgl.ACTIVE_UNIFORMS);

        for (let i = 0; i < totalUniforms; i++) {
            const uniformData = webgl.getActiveUniform(webglProgram, i)!;
            const location = webgl.getUniformLocation(webglProgram, uniformData.name)!;
            const techniqueUniform = technique.uniforms[uniformData.name];

            let semantic: string | undefined = "";
            if (!techniqueUniform) {
                semantic = globalUniformSemantic[uniformData.name];
                if (!semantic) {
                    //不在自定义中，也不在全局Uniform中
                    console.error("未知Uniform定义：" + uniformData.name);
                }
            }
            else {
                semantic = techniqueUniform.semantic;
            }

            if (semantic) {
                contextUniforms.push({ name: uniformData.name, type: uniformData.type, size: uniformData.size, semantic, location });
            }
            else {
                uniforms.push({ name: uniformData.name, type: uniformData.type, size: uniformData.size, location });
            }
        }
    }

    function _extractTextureUnits(program: WebGLProgramBinder) {
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

    function _getMaxShaderPrecision(gl: WebGLRenderingContext, precision: "lowp" | "mediump" | "highp") {
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
    /**
     * @internal
     */
    export class WebGLRenderState extends RenderState {
        /**
         * @deprecated
         */
        public static canvas: HTMLCanvasElement | null = null;
        /**
         * @deprecated
         */
        public static webgl: WebGLRenderingContext | null = null;

        public version: number;

        public maxPrecision: string;
        public maxTextures: uint;
        public maxVertexTextures: uint;
        public maxTextureSize: uint;
        public maxCubemapSize: uint;
        public maxRenderBufferize: uint;
        public maxVertexUniformVectors: uint;
        public maxAnisotropy: uint;

        public standardDerivatives: boolean;
        public textureFloat: boolean;
        public anisotropyExt: EXT_texture_filter_anisotropic;
        public s3tc: WEBGL_compressed_texture_s3tc;
        public textureAnisotropicFilterExtension: EXT_texture_filter_anisotropic;
        public shaderTextureLOD: any;
        public oesStandardDerivatives: boolean;

        private readonly _stateEnables: ReadonlyArray<gltf.EnableState> = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST]; // TODO
        private readonly _programs: { [key: string]: WebGLProgramBinder } = {};
        private readonly _vsShaders: { [key: string]: WebGLShader } = {};
        private readonly _fsShaders: { [key: string]: WebGLShader } = {};
        private readonly _cacheStateEnable: { [key: string]: boolean | undefined } = {};
        private _cacheProgram: WebGLProgramBinder | null = null;
        private _cacheState: gltf.States | null = null;

        private _getWebGLShader(type: number, webgl: WebGLRenderingContext, gltfShader: gltf.Shader, defines: string) {
            const shader = webgl.createShader(type)!;
            let shaderContent = this._parseIncludes(gltfShader.uri!);
            shaderContent = this._unrollLoops(shaderContent);
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

        private _getWebGLProgram(vs: gltf.Shader, fs: gltf.Shader, customDefines: string) {
            const webgl = WebGLRenderState.webgl!;
            const program = webgl.createProgram()!;

            if (program) {
                let key = vs.name + customDefines;
                let vertexShader = this._vsShaders[key];
                if (!vertexShader) {
                    const prefixVertex = this._prefixVertex(customDefines);
                    vertexShader = this._getWebGLShader(webgl.VERTEX_SHADER, webgl, vs, prefixVertex)!;
                    if (vertexShader) {
                        this._vsShaders[key] = vertexShader;
                    }
                }

                key = fs.name + customDefines;
                let fragmentShader = this._fsShaders[key];
                if (!fragmentShader) {
                    const prefixFragment = this._prefixFragment(customDefines);
                    fragmentShader = this._getWebGLShader(webgl.FRAGMENT_SHADER, webgl, fs, prefixFragment)!;
                    if (fragmentShader) {
                        this._fsShaders[key] = fragmentShader;
                    }
                }

                if (vertexShader && fragmentShader) {
                    webgl.attachShader(program, vertexShader);
                    webgl.attachShader(program, fragmentShader);
                    webgl.linkProgram(program);

                    const parameter = webgl.getProgramParameter(program, webgl.LINK_STATUS);
                    if (parameter) {
                        return program;
                    }
                    else {
                        console.error("program compile: " + vs.name + "_" + fs.name + " error! ->" + webgl.getProgramInfoLog(program));
                        // alert("program compile: " + vs.name + "_" + fs.name + " error! ->" + webgl.getProgramInfoLog(program));
                        webgl.deleteProgram(program);
                    }
                }
            }

            return null;
        }
        protected _getCommonExtensions() {
            let extensions = "";
            if (this.oesStandardDerivatives) {
                extensions += "#extension GL_OES_standard_derivatives : enable \n";
            }

            return extensions;
        }

        protected _getCommonDefines() {
            let defines = "";
            defines += "precision " + this.maxPrecision + " float; \n";
            defines += "precision " + this.maxPrecision + " int; \n";

            return defines;
        }

        public initialize(config: { canvas: HTMLCanvasElement, webgl: WebGLRenderingContext }) {
            super.initialize();

            WebGLRenderState.canvas = config.canvas;
            WebGLRenderState.webgl = config.webgl;

            const webgl = WebGLRenderState.webgl;
            if (!webgl) {
                return;
            }

            const webglVersions = /^WebGL\ ([0-9])/.exec(webgl.getParameter(webgl.VERSION));
            this.version = webglVersions ? parseFloat(webglVersions[1]) : 1.0;
            //
            this.textureFloat = !!_getExtension(webgl, "OES_texture_float");
            this.anisotropyExt = _getExtension(webgl, "EXT_texture_filter_anisotropic");
            this.shaderTextureLOD = _getExtension(webgl, "EXT_shader_texture_lod");
            // use dfdx and dfdy must enable OES_standard_derivatives
            this.oesStandardDerivatives = !!_getExtension(webgl, "OES_standard_derivatives");
            //
            this.maxPrecision = _getMaxShaderPrecision(webgl, "highp");
            this.maxTextures = webgl.getParameter(webgl.MAX_TEXTURE_IMAGE_UNITS);
            this.maxVertexTextures = webgl.getParameter(webgl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            this.maxTextureSize = webgl.getParameter(webgl.MAX_TEXTURE_SIZE);
            this.maxCubemapSize = webgl.getParameter(webgl.MAX_CUBE_MAP_TEXTURE_SIZE);
            this.maxRenderBufferize = webgl.getParameter(webgl.MAX_RENDERBUFFER_SIZE);
            this.maxVertexUniformVectors = webgl.getParameter(webgl.MAX_VERTEX_UNIFORM_VECTORS);
            this.maxBoneCount = Math.floor((this.maxVertexUniformVectors - 20) / 4); // TODO
            this.maxAnisotropy = (this.anisotropyExt !== null) ? webgl.getParameter(this.anisotropyExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;

            this.commonExtensions = this._getCommonExtensions();
            this.commonDefines = this._getCommonDefines();

            console.info("WebGL version:", this.version);
            console.info("Maximum shader precision:", this.maxPrecision);
            console.info("Maximum texture count:", this.maxTextures);
            console.info("Maximum vertex texture count:", this.maxVertexTextures);
            console.info("Maximum texture size:", this.maxTextureSize);
            console.info("Maximum cube map texture size:", this.maxCubemapSize);
            console.info("Maximum render buffer size:", this.maxRenderBufferize);
            console.info("Maximum vertex uniform vectors:", this.maxVertexUniformVectors);
            console.info("Maximum GPU skinned bone count:", this.maxBoneCount);
        }

        public updateViewport(viewport: Readonly<Rectangle>, target: BaseRenderTexture | null) { // TODO
            const webgl = WebGLRenderState.webgl!;
            let w: number;
            let h: number;

            this.viewPort.copy(viewport);
            this.renderTarget = target;

            if (target) {
                w = target.width;
                h = target.height;
                // target.use();
                target.activateRenderTexture();
            }
            else {
                const stageViewport = stage.viewport;
                w = stageViewport.w;
                h = stageViewport.h;
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
            }

            webgl.viewport(w * viewport.x, h * (1.0 - viewport.y - viewport.h), w * viewport.w, h * viewport.h);
            webgl.depthRange(0.0, 1.0); // TODO
        }

        public clearBuffer(bufferBit: gltf.BufferMask, clearColor?: Readonly<IColor>) {
            const webgl = WebGLRenderState.webgl!;

            if (bufferBit & gltf.BufferMask.Depth) {
                webgl.depthMask(true);
                webgl.clearDepth(1.0);
            }

            if (bufferBit & gltf.BufferMask.Stencil) {
                webgl.clearStencil(1.0);
            }

            if ((bufferBit & gltf.BufferMask.Color) !== 0 && clearColor) {
                webgl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
            }

            webgl.clear(bufferBit);
        }

        public copyFramebufferToTexture(screenPostion: Vector2, target: BaseTexture, level: number = 0) {
            const webgl = WebGLRenderState.webgl!;
            if (target._dirty) {
                target.setupTexture(0);
            }
            else {
                webgl.activeTexture(webgl.TEXTURE0);
                webgl.bindTexture(webgl.TEXTURE_2D, (target as WebGLTexture).webglTexture);
            }

            webgl.copyTexImage2D(webgl.TEXTURE_2D, level, target.format, screenPostion.x, screenPostion.y, target.width, target.height, 0);//TODO
        }

        public updateState(state: gltf.States | null) {
            if (this._cacheState === state) {
                return;
            }
            this._cacheState = state;

            const webgl = WebGLRenderState.webgl!;
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

        public clearState() {
            for (const key in this._cacheStateEnable) {
                delete this._cacheStateEnable[key];
            }

            this._cacheProgram = null;
            this._cacheState = null;
        }

        public useProgram(program: WebGLProgramBinder) {
            if (this._cacheProgram !== program) {
                this._cacheProgram = program;
                WebGLRenderState.webgl!.useProgram(program.program);

                return true;
            }

            return false;
        }

        public getProgram(material: Material, technique: gltf.Technique, contextDefine: string) {
            const shader = material._shader;
            const extensions = shader.config.extensions!.KHR_techniques_webgl;
            const vertexShader = extensions!.shaders[0]; // TODO 顺序依赖
            const fragmentShader = extensions!.shaders[1]; // TODO 顺序依赖

            this.customShaderChunks = shader.customs; //

            const defines = contextDefine + material.shaderDefine;
            const name = vertexShader.name + "_" + fragmentShader.name + "_" + defines; // TODO材质标脏可以优化
            const webgl = WebGLRenderState.webgl!;
            let programBinder: WebGLProgramBinder | null = null;

            if (name in this._programs) {
                programBinder = this._programs[name]
            }
            else {
                const program = this._getWebGLProgram(vertexShader, fragmentShader, defines);
                if (program) {
                    this._programs[name] = programBinder = new WebGLProgramBinder(program);
                    _extractAttributes(webgl, programBinder, technique);
                    _extractUniforms(webgl, programBinder, technique);
                    _extractTextureUnits(programBinder);
                }
            }

            if (programBinder && technique.program !== programBinder.id) {
                technique.program = programBinder.id;
            }

            return programBinder;
        }
    }
    // Retarget.
    egret3d.RenderState = WebGLRenderState;
}