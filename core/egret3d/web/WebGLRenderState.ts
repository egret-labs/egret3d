namespace egret3d.web {
    const _pattern = /#include +<([\w\d.]+)>/g;

    function _replace(_match: string, include: string) {
        if (!(include in ShaderChunk)) {
            throw new Error(`Can not resolve #include <${include}>`);
        }

        return _parseIncludes((ShaderChunk as any)[include]);
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
    /**
     * @internal
     */
    export class WebGLRenderState extends RenderState {
        private readonly _stateEnables: ReadonlyArray<gltf.EnableState> = [gltf.EnableState.BLEND, gltf.EnableState.CULL_FACE, gltf.EnableState.DEPTH_TEST]; // TODO
        private readonly _programs: { [key: string]: WebGLProgramBinder } = {};
        private readonly _vsShaders: { [key: string]: WebGLShader } = {};
        private readonly _fsShaders: { [key: string]: WebGLShader } = {};
        private readonly _cacheStateEnable: { [key: string]: boolean | undefined } = {};
        private _cacheProgram: WebGLProgramBinder | null = null;
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

        public copyFramebufferToTexture(screenPostion: Vector2, target: Texture, level: number = 0) {
            const webgl = WebGLCapabilities.webgl!;
            webgl.activeTexture(webgl.TEXTURE0);
            webgl.bindTexture(webgl.TEXTURE_2D, target._source);
            webgl.copyTexImage2D(webgl.TEXTURE_2D, level, target.format, screenPostion.x, screenPostion.y, target.width, target.height, 0);//TODO
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

        public useProgram(program: WebGLProgramBinder) {
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
                    program = new WebGLProgramBinder(webglProgram);
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
    }
    // Retarget.
    egret3d.RenderState = WebGLRenderState;
}