namespace egret3d {
    function _filterEmptyLine(string: string) {
        return string !== "";
    }
    /**
     * 全局渲染状态组件。
     */
    @paper.singleton
    export class RenderState extends paper.BaseComponent {
        /**
         * @internal
         */
        public readonly onGammaInputChanged: signals.Signal = new signals.Signal();

        public version: string;
        public standardDerivativesEnabled: boolean;
        public textureFloatEnabled: boolean;
        public fragDepthEnabled: boolean;
        public textureFilterAnisotropic: EXT_texture_filter_anisotropic | null;
        public shaderTextureLOD: any;

        public maxTextures: uint;
        public maxVertexTextures: uint;
        public maxTextureSize: uint;
        public maxCubemapSize: uint;
        public maxRenderBufferize: uint;
        public maxVertexUniformVectors: uint;
        public maxAnisotropy: uint;
        public maxBoneCount: uint = 24;
        public maxPrecision: string = "";

        public commonExtensions: string = "";
        public vertexExtensions: string = "";
        public fragmentExtensions: string = "";
        public commonDefines: string = "";
        public vertexDefines: string = "";
        public fragmentDefines: string = "";
        public readonly defines: Defines = new Defines();
        public readonly defaultCustomShaderChunks: Readonly<{ [key: string]: string }> = {
            custom_vertex: "",
            custom_begin_vertex: "",
            custom_end_vertex: "",
            custom_fragment: "",
            custom_begin_fragment: "",
            custom_end_fragment: "",
        };
        /**
         * 
         */
        public readonly caches = {
            useLightMap: false,
            castShadows: false,
            receiveShadows: false,
            cullingMask: paper.Layer.Nothing,
            attributeCount: 0,
            boneCount: 0,
            egret2DOrderCount: 0,
            clockBuffer: new Float32Array(4),
            skyBoxTexture: null as (BaseTexture | null),
        };
        public customShaderChunks: { [key: string]: string } | null = null;
        /**
         * 
         */
        public render: (camera: Camera, material?: Material, renderTarget?: RenderTexture) => void = null!;
        /**
         * 
         */
        public draw: (drawCall: DrawCall, material?: Material | null) => void = null!;//开发者一般不会手动调用,通常是后期渲染调用

        protected readonly _viewport: Rectangle = Rectangle.create();
        protected readonly _clearColor: Color = Color.create();
        protected readonly _colorMask: [boolean, boolean, boolean, boolean] = [true, true, true, true];
        protected _clearDepth: number = 1;
        protected _depthMask: boolean = true;
        protected _clearStencil: number = 1;
        protected _renderTarget: RenderTexture | null = null;

        private _logarithmicDepthBuffer: boolean = false;
        private _gammaInput: boolean = true; //
        private _gammaOutput: boolean = true; //
        private _gammaFactor: float = 1.0;
        private _toneMapping: ToneMapping = ToneMapping.None;
        // TODO move to caches
        protected readonly _stateEnables: ReadonlyArray<gltf.EnableState> = [gltf.EnableState.Blend, gltf.EnableState.CullFace, gltf.EnableState.DepthTest];
        protected readonly _cacheStateEnable: { [key: string]: boolean | undefined } = {};

        protected _getCommonExtensions() {
            let extensions = ""; // fragmentExtensions.

            if (this.standardDerivativesEnabled) {
                extensions += "#extension GL_OES_standard_derivatives : enable \n";
            }

            if (this.fragDepthEnabled) {
                extensions += "#extension GL_EXT_frag_depth : enable \n";
            }

            if (this.textureFloatEnabled) {
                extensions += "#extension GL_EXT_frag_depth : enable \n";
            }

            this.fragmentExtensions = extensions;
        }

        protected _getCommonDefines() {
            let defines = ""; // commonDefines.
            defines += "precision " + this.maxPrecision + " float; \n";
            defines += "precision " + this.maxPrecision + " int; \n";
            this.commonDefines = defines;

            defines = ""; // vertexDefines
            this.vertexDefines = defines;

            defines = ""; // fragmentDefines
            defines += ShaderChunk.encodings_pars_fragment + " \n";
            this.fragmentDefines = defines;
        }

        protected _getEncodingComponents(encoding: TextureEncoding) {
            switch (encoding) {
                case TextureEncoding.LinearEncoding:
                    return ['Linear', '( value )'];
                case TextureEncoding.sRGBEncoding:
                    return ['sRGB', '( value )'];
                case TextureEncoding.RGBEEncoding:
                    return ['RGBE', '( value )'];
                case TextureEncoding.RGBM7Encoding:
                    return ['RGBM', '( value, 7.0 )'];
                case TextureEncoding.RGBM16Encoding:
                    return ['RGBM', '( value, 16.0 )'];
                case TextureEncoding.RGBDEncoding:
                    return ['RGBD', '( value, 256.0 )'];
                case TextureEncoding.GammaEncoding:
                    return ['Gamma', '( value, float( GAMMA_FACTOR ) )'];
                default:
                    throw new Error('unsupported encoding: ' + encoding);

            }
        }

        protected _getToneMappingFunction(toneMapping: ToneMapping) {
            let toneMappingName = "";

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
                    throw new Error('Unsupported toneMapping: ' + toneMapping);
            }

            return `vec3 toneMapping( vec3 color ) { return ${toneMappingName}ToneMapping( color ); } \n`;
        }

        protected _getTexelEncodingFunction(functionName: string, encoding: TextureEncoding) {
            const components = this._getEncodingComponents(encoding);
            return 'vec4 ' + functionName + '( vec4 value ) { return LinearTo' + components[0] + components[1] + '; }';
        }

        protected _getTexelDecodingFunction(functionName: string, encoding: TextureEncoding) {
            const finialEncoding = (this._gammaInput && encoding === TextureEncoding.LinearEncoding) ? TextureEncoding.GammaEncoding : encoding;
            const components = this._getEncodingComponents(finialEncoding);
            return 'vec4 ' + functionName + '( vec4 value ) { return ' + components[0] + 'ToLinear' + components[1] + '; }';
        }
        protected _setViewport(value: Readonly<Rectangle>) { }
        protected _setRenderTarget(value: RenderTexture | null) { }
        protected _setColorMask(value: Readonly<[boolean, boolean, boolean, boolean]>) { }
        /**
         * @internal
         */
        public _updateDrawDefines(renderer: paper.BaseRenderer | null) {
            let useLightMap = false;
            let receiveShadows = false;
            let boneCount = 0;
            const defines = this.defines;
            const caches = this.caches;

            if (renderer) {
                useLightMap = renderer.constructor === MeshRenderer && (renderer as MeshRenderer).lightmapIndex >= 0;
                receiveShadows = caches.castShadows && renderer.receiveShadows;
                boneCount = renderer.constructor === SkinnedMeshRenderer ? Math.min(this.maxBoneCount, (renderer as SkinnedMeshRenderer).boneCount) : 0;
            }

            if (caches.useLightMap !== useLightMap) {
                if (useLightMap) {
                    defines.addDefine(ShaderDefine.USE_LIGHTMAP);
                }
                else {
                    defines.removeDefine(ShaderDefine.USE_LIGHTMAP);
                }

                caches.useLightMap = useLightMap;
            }

            if (caches.boneCount !== boneCount) {

                if (boneCount > 0) {
                    defines.addDefine(ShaderDefine.USE_SKINNING);

                    if (this.textureFloatEnabled) {
                        defines.addDefine(ShaderDefine.BONE_TEXTURE);
                    }
                    else {
                        defines.addDefine(ShaderDefine.MAX_BONES, boneCount);
                    }
                }
                else {
                    defines.removeDefine(ShaderDefine.USE_SKINNING);

                    if (this.textureFloatEnabled) {
                        defines.addDefine(ShaderDefine.BONE_TEXTURE);
                    }
                    else {
                        defines.removeDefine(ShaderDefine.MAX_BONES);
                    }
                }

                caches.boneCount = boneCount;
            }

            if (caches.receiveShadows !== receiveShadows) {
                if (receiveShadows) {
                    defines.addDefine(ShaderDefine.USE_SHADOWMAP);
                    defines.addDefine(ShaderDefine.SHADOWMAP_TYPE_PCF);
                }
                else {
                    defines.removeDefine(ShaderDefine.USE_SHADOWMAP);
                    defines.removeDefine(ShaderDefine.SHADOWMAP_TYPE_PCF);
                }

                caches.receiveShadows = receiveShadows;
            }
        }
        /**
         * @internal
         */
        public _updateTextureDefines(mapName: string, texture: BaseTexture | null, defines: Defines | null = null) {
            defines = defines || this.defines;
            //
            const mapNameDefine = (egret3d as any).ShaderTextureDefine[mapName];//TODO
            if (mapNameDefine) {
                if (texture) {
                    defines.addDefine(mapNameDefine);

                    if (texture instanceof RenderTexture) {
                        defines.addDefine(ShaderDefine.FLIP_V);
                    }
                    else {
                        defines.removeDefine(ShaderDefine.FLIP_V);
                    }
                }
                else {
                    defines.removeDefine(mapNameDefine);
                    defines.removeDefine(ShaderDefine.FLIP_V);
                }
            }
            //
            const decodingFunName = (egret3d as any).TextureDecodingFunction[mapName]; // TODO
            if (decodingFunName) {
                if (texture) {
                    const decodingCode = this._getTexelDecodingFunction(decodingFunName, texture.gltfTexture.extensions.paper.encoding || TextureEncoding.LinearEncoding);
                    const define = defines.addDefine(decodingFunName, decodingCode, ShaderDefineOrder.DecodingFun);
                    if (define) {
                        define.isCode = true;
                        define.type = DefineLocation.Fragment;
                    }
                }
                else {
                    defines.removeDefine(decodingFunName, true);
                }
            }
            //
            if (mapName === ShaderUniformName.EnvMap) {
                const nameA = "envMapA";
                const nameB = "envMapB";

                if (texture) {
                    const { mapping } = texture.gltfTexture.extensions.paper;
                    let typeDefine = ShaderDefine.ENVMAP_TYPE_CUBE;
                    const blendDefine = ShaderDefine.ENVMAP_BLENDING_MULTIPLY; // TODO
                    let define: Define | null;

                    switch (mapping) {
                        case TextureUVMapping.Cube:
                        default:
                            typeDefine = ShaderDefine.ENVMAP_TYPE_CUBE;
                            break;
                        case TextureUVMapping.CubeUV:
                            typeDefine = ShaderDefine.ENVMAP_TYPE_CUBE_UV;
                            break;
                        case TextureUVMapping.Equirectangular:
                            typeDefine = ShaderDefine.ENVMAP_TYPE_EQUIREC;
                            break;
                        case TextureUVMapping.Spherical:
                            typeDefine = ShaderDefine.ENVMAP_TYPE_SPHERE;
                            break;
                    }

                    define = defines.addDefine(nameA, typeDefine);
                    if (define) {
                        define.type = DefineLocation.Fragment;
                    }

                    define = defines.addDefine(nameB, blendDefine);
                    if (define) {
                        define.type = DefineLocation.Fragment;
                    }
                }
                else {
                    defines.removeDefine(nameA, true);
                    defines.removeDefine(nameB, true);
                }
            }
        }
        /**
         * @internal
         */
        public getPrefixVertex(defines: string) {
            const prefixContext = [
                this.commonExtensions,
                this.vertexExtensions,
                this.commonDefines,
                this.vertexDefines,
                defines,
                ShaderChunk.common_vert_def,
                "\n"
            ].filter(_filterEmptyLine).join("\n");

            return prefixContext;
        }
        /**
         * @internal
         */
        public getPrefixFragment(defines: string) {
            const prefixContext = [
                this.commonExtensions,
                this.fragmentExtensions,
                this.commonDefines,
                this.fragmentDefines,
                defines,
                ShaderChunk.common_frag_def,
                "\n"
            ].filter(_filterEmptyLine).join("\n");

            return prefixContext;
        }

        public initialize() {
            super.initialize();

            (renderState as RenderState) = this;
            //
            const options = paper.Application.options as egret3d.RunOptions;
            this.toneMapping = ToneMapping.LinearToneMapping;
            this.gammaFactor = 2.0;
            this.gammaInput = options.gammaInput !== undefined ? options.gammaInput : false;
            this.gammaOutput = false;
        }
        /**
         * 根据BufferMask清除缓存
         */
        public clearBuffer(bufferBit: gltf.BufferMask): void { }
        /**
         * 将像素复制到2D纹理图像中
         * TODO 微信上不可用
         */
        public copyFramebufferToTexture(screenPostion: Vector2, target: BaseTexture, level: uint = 0): void { }
        /**
         * 
         */
        public clearState() {
            for (const key in this._cacheStateEnable) {
                delete this._cacheStateEnable[key];
            }

            this._renderTarget = null;
        }
        /**
         * 设置视口
         */
        public get viewport(): Readonly<Rectangle> {
            return this._viewport;
        }
        public set viewport(value: Readonly<Rectangle>) {
            this._viewport.copy(value);

            this._setViewport(value);
        }
        /**
         * 指定清除的颜色值
         */
        public get clearColor(): Readonly<Color> {
            return this._clearColor;
        }
        public set clearColor(value: Readonly<Color>) {
            //TODO 2d,3d渲染状态不统一，这里先记录，统一后，可以做缓存
            if (this.premultipliedAlpha) {
                this._clearColor.set(value.r * value.a, value.g * value.a, value.b * value.a, value.a);
            }
            else {
                this._clearColor.copy(value);
            }
        }
        /**
         * 指定是否可以写入帧缓冲区中的各个颜色分量
         */
        public get colorMask(): Readonly<[boolean, boolean, boolean, boolean]> {
            return this._colorMask;
        }
        public set colorMask(value: Readonly<[boolean, boolean, boolean, boolean]>) {
            this._colorMask[0] = value[0];
            this._colorMask[1] = value[1];
            this._colorMask[2] = value[2];
            this._colorMask[3] = value[3];

            this._setColorMask(value);
        }
        /**
         * 指定清除的深度值
         */
        public get clearDepth(): number {
            return this._clearDepth;
        }
        public set clearDepth(value: number) {
            this._clearDepth = value;
        }
        /**
         * 指定写入模板缓存区的清除值
         */
        public get clearStencil(): number {
            return this._clearStencil;
        }
        public set clearStencil(value: number) {
            this._clearStencil = value;
        }
        /**
         * 指定要绑定的渲染目标
         */
        public get renderTarget(): RenderTexture | null {
            return this._renderTarget;
        }
        public set renderTarget(value: RenderTexture | null) {
            if (this._renderTarget !== value) {
                this._renderTarget = value;
                this._setRenderTarget(value);
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get logarithmicDepthBuffer(): boolean {
            return this._logarithmicDepthBuffer;
        }
        public set logarithmicDepthBuffer(value: boolean) {
            if (this._logarithmicDepthBuffer === value) {
                return;
            }

            const { defines, fragDepthEnabled } = this;

            if (value) {
                defines.addDefine(ShaderDefine.USE_LOGDEPTHBUF);

                if (fragDepthEnabled) {
                    defines.addDefine(ShaderDefine.USE_LOGDEPTHBUF_EXT);
                }
                else {
                    defines.removeDefine(ShaderDefine.USE_LOGDEPTHBUF_EXT);
                }
            }
            else {
                defines.removeDefine(ShaderDefine.USE_LOGDEPTHBUF);
                defines.removeDefine(ShaderDefine.USE_LOGDEPTHBUF_EXT);
            }
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get gammaInput(): boolean {
            return this._gammaInput;
        }
        public set gammaInput(value: boolean) {
            if (this._gammaInput === value) {
                return;
            }

            this._gammaInput = value;
            this._updateTextureDefines(ShaderUniformName.EnvMap, this.caches.skyBoxTexture);
            this.onGammaInputChanged.dispatch();
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get gammaOutput(): boolean {
            return this._gammaOutput;
        }
        public set gammaOutput(value: boolean) {
            if (this._gammaOutput === value) {
                return;
            }

            const define = this.defines.addDefine("Gamma", this._getTexelEncodingFunction("linearToOutputTexel", value ? TextureEncoding.GammaEncoding : TextureEncoding.LinearEncoding), ShaderDefineOrder.EncodingFun);
            if (define) {
                define.isCode = true;
                define.type = DefineLocation.Fragment;
            }

            this._gammaOutput = value;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { step: 0.1 })
        public get gammaFactor(): float {
            return this._gammaFactor;
        }
        public set gammaFactor(value: float) {
            if (value !== value || value < 1.0) {
                value = 1.0;
            }

            if (this._gammaFactor === value) {
                return;
            }

            const define = this.defines.addDefine(ShaderDefine.GAMMA_FACTOR, value, ShaderDefineOrder.GammaFactor);
            if (define) {
                define.type = DefineLocation.Fragment;
            }

            this._gammaFactor = value;
        }
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((egret3d as any).ToneMapping) }) // TODO
        public get toneMapping(): ToneMapping {
            return this._toneMapping;
        }
        public set toneMapping(value: ToneMapping) {
            if (this._toneMapping === value) {
                return;
            }

            const defineName = "ToneMapping";
            const { defines } = this;

            if (value === ToneMapping.None) {
                defines.removeDefine(ShaderDefine.TONE_MAPPING);
                defines.removeDefine(ShaderChunk.tonemapping_pars_fragment);
                defines.removeDefine(defineName);
            }
            else {
                let define = defines.addDefine(ShaderDefine.TONE_MAPPING);
                if (define) {
                    define.type = DefineLocation.Fragment;
                }

                define = defines.addDefine(ShaderChunk.tonemapping_pars_fragment);
                if (define) {
                    define.isCode = true;
                    define.type = DefineLocation.Fragment;
                }

                define = defines.addDefine(defineName, this._getToneMappingFunction(value));
                if (define) {
                    define.isCode = true;
                    define.type = DefineLocation.Fragment;
                }
            }

            this._toneMapping = value;
        }
        /**
         * 是否预乘
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public premultipliedAlpha: boolean = false;
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 10.0 })
        public toneMappingExposure: float = 1.0;
        /**
         * 
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 10.0 })
        public toneMappingWhitePoint: float = 1.0;
        /**
        * @deprecated
        */
        public updateViewport(viewport: Rectangle) { this.viewport = viewport; }
        /**
         * @deprecated
         */
        public updateRenderTarget(renderTarget: RenderTexture | null): void { this.renderTarget = renderTarget; }
    }
    /**
     * 全局渲染状态组件实例。
     */
    export const renderState: RenderState = null!;
}