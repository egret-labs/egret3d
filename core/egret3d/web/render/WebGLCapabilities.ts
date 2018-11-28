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

    function _getToneMappingFunction(toneMapping: ToneMapping) {
        var toneMappingName;
        switch (toneMapping) {
            case ToneMapping.LinearToneMapping:
                toneMappingName = 'Linear';
                break;
            case ToneMapping.ReinhardToneMapping:
                toneMappingName = 'Reinhard';
                break;
            case ToneMapping.Uncharted2ToneMapping:
                toneMappingName = 'Uncharted2';
                break;
            case ToneMapping.CineonToneMapping:
                toneMappingName = 'OptimizedCineon';
                break;
            default:
                throw new Error('unsupported toneMapping: ' + toneMapping);
        }

        return 'vec3 toneMapping( vec3 color ) { return ' + toneMappingName + 'ToneMapping( color ); }';
    }

    function _getCommonExtensions(capabilities: WebGLCapabilities) {
        let extensions = "";
        if (capabilities.oes_standard_derivatives) {
            extensions += "#extension GL_OES_standard_derivatives : enable \n";
        }

        return extensions;
    }

    function _getCommonDefines(capabilities: WebGLCapabilities) {
        let defines = "";
        defines += "precision " + capabilities.maxPrecision + " float; \n";
        defines += "precision " + capabilities.maxPrecision + " int; \n";

        return defines;
    }

    function _replace(_match: string, include: string) {
        if (!(include in egret3d.ShaderChunk)) {
            throw new Error(`Can not resolve #include <${include}>`);
        }

        return _parseIncludes((egret3d.ShaderChunk as any)[include]);
    }

    function _filterEmptyLine(string: string) {
        return string !== '';
    }

    function _parseIncludes(string: string): string {
        return string.replace(_pattern, _replace);
    }

    function _unrollLoops(string: string) {
        const pattern = /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;
        function replace(match: string, start: string, end: string, snippet: string) {
            var unroll = '';
            for (var i = parseInt(start); i < parseInt(end); i++) {
                unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]');
            }
            return unroll;
        }

        return string.replace(pattern, replace);
    }

    function _prefixVertex(customDefines: string) {
        const prefixContext = [
            WebGLCapabilities.commonDefines,
            customDefines,
            ShaderChunk.common_vert_def,
            '\n'
        ].filter(_filterEmptyLine).join('\n');

        return prefixContext;
    }

    function _prefixFragment(customDefines: string) {
        const prefixContext = [
            WebGLCapabilities.commonExtensions,
            WebGLCapabilities.commonDefines,
            customDefines,
            ShaderChunk.common_frag_def,
            WebGLCapabilities.toneMapping === ToneMapping.None ? '' : '#define TONE_MAPPING',
            WebGLCapabilities.toneMapping === ToneMapping.None ? '' : ShaderChunk.tonemapping_pars_fragment,
            WebGLCapabilities.toneMapping === ToneMapping.None ? '' : _getToneMappingFunction(WebGLCapabilities.toneMapping),
            '\n'
        ].filter(_filterEmptyLine).join('\n');

        return prefixContext;

    }

    function _getWebGLShader(type: number, webgl: WebGLRenderingContext, gltfShader: gltf.Shader, defines: string) {
        const shader = webgl.createShader(type)!;
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

    function _extractAttributes(webgl: WebGLRenderingContext, program: GlProgram, technique: gltf.Technique) {
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

    function _extractUniforms(webgl: WebGLRenderingContext, program: GlProgram, technique: gltf.Technique) {
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
    export enum ToneMapping {
        None = 0,
        LinearToneMapping = 1,
        ReinhardToneMapping = 2,
        Uncharted2ToneMapping = 3,
        CineonToneMapping = 4,
    }

    /**
     * 内置提供的全局Attribute
     * @internal
     */
    export const globalAttributeSemantic: { [key: string]: gltf.AttributeSemanticType } = {
        "corner": gltf.AttributeSemanticType._CORNER,
        "position": gltf.AttributeSemanticType.POSITION,
        "normal": gltf.AttributeSemanticType.NORMAL,
        "uv": gltf.AttributeSemanticType.TEXCOORD_0,
        "uv2": gltf.AttributeSemanticType.TEXCOORD_1,
        "color": gltf.AttributeSemanticType.COLOR_0,

        // "morphTarget0": gltf.AttributeSemanticType.MORPHTARGET_0,
        // "morphTarget1": gltf.AttributeSemanticType.MORPHTARGET_1,
        // "morphTarget2": gltf.AttributeSemanticType.MORPHTARGET_2,
        // "morphTarget3": gltf.AttributeSemanticType.MORPHTARGET_3,
        // "morphTarget4": gltf.AttributeSemanticType.MORPHTARGET_4,
        // "morphTarget5": gltf.AttributeSemanticType.MORPHTARGET_5,
        // "morphTarget6": gltf.AttributeSemanticType.MORPHTARGET_6,
        // "morphTarget7": gltf.AttributeSemanticType.MORPHTARGET_7,
        // "morphNormal0": gltf.AttributeSemanticType.MORPHNORMAL_0,
        // "morphNormal1": gltf.AttributeSemanticType.MORPHNORMAL_1,
        // "morphNormal2": gltf.AttributeSemanticType.MORPHNORMAL_2,
        // "morphNormal3": gltf.AttributeSemanticType.MORPHNORMAL_3,

        "skinIndex": gltf.AttributeSemanticType.JOINTS_0,
        "skinWeight": gltf.AttributeSemanticType.WEIGHTS_0,

        "startPosition": gltf.AttributeSemanticType._START_POSITION,
        "startVelocity": gltf.AttributeSemanticType._START_VELOCITY,
        "startColor": gltf.AttributeSemanticType._START_COLOR,
        "startSize": gltf.AttributeSemanticType._START_SIZE,
        "startRotation": gltf.AttributeSemanticType._START_ROTATION,
        "time": gltf.AttributeSemanticType._TIME,
        "random0": gltf.AttributeSemanticType._RANDOM0,
        "random1": gltf.AttributeSemanticType._RANDOM1,
        "startWorldPosition": gltf.AttributeSemanticType._WORLD_POSITION,
        "startWorldRotation": gltf.AttributeSemanticType._WORLD_ROTATION,

        "lineDistance": gltf.AttributeSemanticType._INSTANCE_DISTANCE,
        "instanceStart": gltf.AttributeSemanticType._INSTANCE_START,
        "instanceEnd": gltf.AttributeSemanticType._INSTANCE_END,
        "instanceColorStart": gltf.AttributeSemanticType._INSTANCE_COLOR_START,
        "instanceColorEnd": gltf.AttributeSemanticType._INSTANCE_COLOR_END,
        "instanceDistanceStart": gltf.AttributeSemanticType._INSTANCE_DISTANCE_START,
        "instanceDistanceEnd": gltf.AttributeSemanticType._INSTANCE_DISTANCE_END,
    }

    /**
     * 内置提供的全局Uniform
     * @internal
     */
    export const globalUniformSemantic: { [key: string]: gltf.UniformSemanticType } = {
        "modelMatrix": gltf.UniformSemanticType.MODEL,
        "modelViewMatrix": gltf.UniformSemanticType.MODELVIEW,
        "projectionMatrix": gltf.UniformSemanticType.PROJECTION,
        "viewMatrix": gltf.UniformSemanticType.VIEW,
        "normalMatrix": gltf.UniformSemanticType.MODELVIEWINVERSE,
        "modelViewProjectionMatrix": gltf.UniformSemanticType.MODELVIEWPROJECTION,
        "viewProjectionMatrix": gltf.UniformSemanticType._VIEWPROJECTION,
        "cameraPosition": gltf.UniformSemanticType._CAMERA_POS,
        "cameraForward": gltf.UniformSemanticType._CAMERA_FORWARD,
        "cameraUp": gltf.UniformSemanticType._CAMERA_UP,
        "ambientLightColor": gltf.UniformSemanticType._AMBIENTLIGHTCOLOR,
        "directionalLights[0]": gltf.UniformSemanticType._DIRECTLIGHTS,
        "pointLights[0]": gltf.UniformSemanticType._POINTLIGHTS,
        "spotLights[0]": gltf.UniformSemanticType._SPOTLIGHTS,
        "boneMatrices[0]": gltf.UniformSemanticType.JOINTMATRIX,

        "directionalShadowMatrix[0]": gltf.UniformSemanticType._DIRECTIONSHADOWMAT,
        "spotShadowMatrix[0]": gltf.UniformSemanticType._SPOTSHADOWMAT,
        "pointShadowMatrix[0]": gltf.UniformSemanticType._POINTSHADOWMAT,
        "directionalShadowMap[0]": gltf.UniformSemanticType._DIRECTIONSHADOWMAP,
        "spotShadowMap[0]": gltf.UniformSemanticType._SPOTSHADOWMAP,
        "pointShadowMap[0]": gltf.UniformSemanticType._POINTSHADOWMAP,
        "lightMap": gltf.UniformSemanticType._LIGHTMAPTEX,
        "lightMapIntensity": gltf.UniformSemanticType._LIGHTMAPINTENSITY,
        "lightMapScaleOffset": gltf.UniformSemanticType._LIGHTMAP_SCALE_OFFSET,

        "referencePosition": gltf.UniformSemanticType._REFERENCEPOSITION,
        "nearDistance": gltf.UniformSemanticType._NEARDICTANCE,
        "farDistance": gltf.UniformSemanticType._FARDISTANCE,

        "fogColor": gltf.UniformSemanticType._FOG_COLOR,
        "fogDensity": gltf.UniformSemanticType._FOG_DENSITY,
        "fogNear": gltf.UniformSemanticType._FOG_NEAR,
        "fogFar": gltf.UniformSemanticType._FOG_FAR,

        "toneMappingExposure": gltf.UniformSemanticType._TONE_MAPPING_EXPOSURE,
        "toneMappingWhitePoint": gltf.UniformSemanticType._TONE_MAPPING_WHITE_POINT,
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
        public static commonExtensions: string = "";
        public static commonDefines: string = "";

        //全局设置
        public static toneMapping: ToneMapping = ToneMapping.None;
        public static toneMappingExposure: number = 1.0;
        public static toneMappingWhitePoint: number = 1.0;

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

        public initialize(config: RunEgretOptions) {
            super.initialize();

            WebGLCapabilities.canvas = config.canvas!;
            WebGLCapabilities.webgl = config.webgl!;
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
            //TODO
            WebGLCapabilities.commonExtensions = _getCommonExtensions(this);
            WebGLCapabilities.commonDefines = _getCommonDefines(this);

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
        public readonly viewPort: Rectangle = Rectangle.create();
        public renderTarget: BaseRenderTarget | null = null;

        public render: (camera: Camera, material?: Material) => void = null!;
        public draw: (drawCall: DrawCall) => void = null!;

        private readonly _stateEnables: ReadonlyArray<gltf.EnableState> = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST]; // TODO
        private readonly _programs: { [key: string]: GlProgram } = {};
        private readonly _vsShaders: { [key: string]: WebGLShader } = {};
        private readonly _fsShaders: { [key: string]: WebGLShader } = {};
        private readonly _cacheStateEnable: { [key: string]: boolean | undefined } = {};
        private _cacheProgram: GlProgram | null = null;
        private _cacheState: gltf.States | null = null;

        private _getWebGLProgram(vs: gltf.Shader, fs: gltf.Shader, customDefines: string) {
            const webgl = WebGLCapabilities.webgl!;
            const program = webgl.createProgram()!;

            let key = vs.name + customDefines;
            let vertexShader = this._vsShaders[key];
            if (!vertexShader) {
                const prefixVertex = _prefixVertex(customDefines);
                vertexShader = _getWebGLShader(webgl.VERTEX_SHADER, webgl, vs, prefixVertex)!;
                this._vsShaders[key] = vertexShader;
            }

            key = fs.name + customDefines;
            let fragmentShader = this._fsShaders[key];
            if (!fragmentShader) {
                const prefixFragment = _prefixFragment(customDefines);
                fragmentShader = _getWebGLShader(webgl.FRAGMENT_SHADER, webgl, fs, prefixFragment)!;
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

        public initialize(renderSystem: IRenderSystem) {
            super.initialize();

            if (renderSystem) {
                this.render = renderSystem.render.bind(renderSystem);
                this.draw = renderSystem.draw.bind(renderSystem);
            }
        }

        public updateViewport(viewport: Readonly<Rectangle>, target: BaseRenderTarget | null) { // TODO
            const webgl = WebGLCapabilities.webgl!;
            let w: number;
            let h: number;

            this.viewPort.copy(viewport);
            this.renderTarget = target;

            if (target) {
                w = target.width;
                h = target.height;
                target.use();
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

        public clearState() {
            for (const key in this._cacheStateEnable) {
                delete this._cacheStateEnable[key];
            }

            this._cacheProgram = null;
            this._cacheState = null;
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
                    _extractAttributes(webgl, program, technique);
                    _extractUniforms(webgl, program, technique);
                    _extractTextureUnits(program);
                }
            }

            if (technique.program !== program.id) {
                technique.program = program.id;
            }

            return program;
        }

        public clearBuffer(bufferBit: gltf.BufferMask, clearColor?: Readonly<IColor>) {
            const webgl = WebGLCapabilities.webgl!;

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

        public copyFramebufferToTexture(screenPostion: Vector2, target: ITexture, level: number = 0) {
            const webgl = WebGLCapabilities.webgl!;
            webgl.activeTexture(webgl.TEXTURE0);
            webgl.bindTexture(webgl.TEXTURE_2D, target.texture);
            webgl.copyTexImage2D(webgl.TEXTURE_2D, level, target.format, screenPostion.x, screenPostion.y, target.width, target.height, 0);//TODO
        }
    }
}