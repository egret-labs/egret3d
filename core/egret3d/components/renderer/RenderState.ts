namespace egret3d {
    function _filterEmptyLine(string: string) {
        return string !== "";
    }
    /**
     * 全局渲染状态组件。
     */
    @paper.singleton
    export class RenderState extends paper.BaseComponent {
        public version: number;
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

        public readonly clearColor: Color = Color.create();
        public readonly viewport: Rectangle = Rectangle.create();
        public readonly defines: Defines = new Defines();
        public readonly defaultCustomShaderChunks: Readonly<{ [key: string]: string }> = {
            custom_vertex: "",
            custom_begin_vertex: "",
            custom_end_vertex: "",
            custom_fragment: "",
            custom_begin_fragment: "",
            custom_end_fragment: "",
        };
        public renderTarget: RenderTexture | null = null;
        public customShaderChunks: { [key: string]: string } | null = null;
        /**
         * 
         */
        public render: (camera: Camera, material?: Material) => void = null!;
        /**
         * 
         */
        public draw: (drawCall: DrawCall, material?: Material | null) => void = null!;

        private _logarithmicDepthBuffer: boolean = false;
        private _gammaFactor: number = 1.0;
        private _gammaInput: boolean = false;
        private _gammaOutput: boolean = false;
        private _toneMapping: ToneMapping = ToneMapping.None;
        /**
         * @internal
         */
        public _toneMappingExposure: number = 1.0;
        /**
         * @internal
         */
        public _toneMappingWhitePoint: number = 1.0;
        /**
         * @internal
         */
        public _castShadows: boolean = false;

        protected _getCommonExtensions() {
            let extensions = ""; // fragmentExtensions.

            if (this.standardDerivativesEnabled) {
                extensions += "#extension GL_OES_standard_derivatives : enable \n";
            }

            if (this.fragDepthEnabled) {
                extensions += "#extension GL_EXT_frag_depth : enable \n";
            }

            this.fragmentExtensions = extensions;
        }

        protected _getCommonDefines() {
            let defines = ""; // commonDefines.
            defines += "precision " + this.maxPrecision + " float; \n";
            defines += "precision " + this.maxPrecision + " int; \n";
            this.commonDefines = defines;

            // defines = ""; // fragmentDefines
            // this.fragmentDefines = defines;
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

        protected _getTexelEncodingFunction(functionName: string, encoding: TextureEncoding = TextureEncoding.LinearEncoding) {
            const components = this._getEncodingComponents(encoding);
            return 'vec4 ' + functionName + '( vec4 value ) { return LinearTo' + components[0] + components[1] + '; }';
        }

        protected _getTexelDecodingFunction(functionName: string, encoding: TextureEncoding = TextureEncoding.LinearEncoding) {
            const finialEncoding = (this._gammaInput && encoding === TextureEncoding.LinearEncoding) ? TextureEncoding.GammaEncoding : encoding;
            const components = this._getEncodingComponents(finialEncoding);
            return 'vec4 ' + functionName + '( vec4 value ) { return ' + components[0] + 'ToLinear' + components[1] + '; }';
        }
        /**
         * @internal
         */
        public _updateTextureDefine(mapName: string, texture: BaseTexture | null, defines: Defines | null = null) {
            defines = defines || this.defines;
            const mapNameDefine = (egret3d as any).ShaderTextureDefine[mapName];//TODO
            //
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
            //
            const decodingFunName = (egret3d as any).TextureDecodingFunction[mapName]; // TODO
            if (decodingFunName) {
                if (texture) {
                    const decodingCode = this._getTexelDecodingFunction(decodingFunName, texture.gltfTexture.extensions.paper.encoding);
                    const define = defines.addDefine(decodingFunName, decodingCode);
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
                    let blendDefine = ShaderDefine.ENVMAP_BLENDING_MULTIPLY; // TODO
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

        public initialize(config?: any) {
            super.initialize();

            (renderState as RenderState) = this;
            //
            this.logarithmicDepthBuffer = true;
            this.setToneMapping(ToneMapping.LinearToneMapping, this._toneMappingExposure, this._toneMappingWhitePoint);
            this.setGamma(2.0, this._gammaInput, this._gammaOutput);
        }
        /**
         * 
         */
        public updateViewport(camera: Camera, target: RenderTexture | null): void { }
        /**
         * 
         */
        public clearBuffer(bufferBit: gltf.BufferMask, clearColor?: Readonly<IColor>): void { }
        /**
         * 
         */
        public copyFramebufferToTexture(screenPostion: Vector2, target: BaseTexture, level: uint = 0): void { }
        /**
         * 
         */
        public setGamma(factor: number, input: boolean, output: boolean): this {
            factor = (factor > 1.0 ? factor : 1.0);

            const nameA = "GammaA";
            const nameB = "GammaB";

            let define = this.defines.addDefine(ShaderDefine.GAMMA_FACTOR, factor, true);
            if (define) {
                define.type = DefineLocation.Fragment;
            }

            define = this.defines.addDefine(nameA, ShaderChunk.encodings_pars_fragment, true);
            if (define) {
                define.isCode = true;
                define.type = DefineLocation.Fragment;
            }

            define = this.defines.addDefine(nameB, this._getTexelEncodingFunction("linearToOutputTexel", output ? TextureEncoding.GammaEncoding : TextureEncoding.LinearEncoding), true);
            if (define) {
                define.isCode = true;
                define.type = DefineLocation.Fragment;
            }

            this._gammaFactor = factor;
            this._gammaInput = input;
            this._gammaOutput = output;

            return this;
        }
        /**
         * 
         */
        public setToneMapping(toneMapping: ToneMapping, exposure: number, whitePoint: number): this {
            const nameA = "ToneMappingA";
            const nameB = "ToneMappingB";

            if (this._toneMapping !== toneMapping) {
                let define = this.defines.addDefine(ShaderDefine.TONE_MAPPING);
                if (define) {
                    define.type = DefineLocation.Fragment;
                }

                define = this.defines.addDefine(nameA, ShaderChunk.tonemapping_pars_fragment, true);
                if (define) {
                    define.isCode = true;
                    define.type = DefineLocation.Fragment;
                }

                define = this.defines.addDefine(nameB, this._getToneMappingFunction(toneMapping), true);
                if (define) {
                    define.isCode = true;
                    define.type = DefineLocation.Fragment;
                }
            }

            this._toneMapping = toneMapping;
            this._toneMappingExposure = exposure;
            this._toneMappingWhitePoint = whitePoint;

            return this;
        }
        /**
         * 
         */
        public get logarithmicDepthBuffer(): boolean {
            return this._logarithmicDepthBuffer;
        }
        public set logarithmicDepthBuffer(value: boolean) {
            if (this._logarithmicDepthBuffer === value) {
                return;
            }

            if (value) {
                this.defines.addDefine(ShaderDefine.USE_LOGDEPTHBUF);

                if (this.fragDepthEnabled) {
                    this.defines.addDefine(ShaderDefine.USE_LOGDEPTHBUF_EXT);
                }
                else {
                    this.defines.removeDefine(ShaderDefine.USE_LOGDEPTHBUF_EXT);
                }
            }
            else {
                this.defines.removeDefine(ShaderDefine.USE_LOGDEPTHBUF);
                this.defines.removeDefine(ShaderDefine.USE_LOGDEPTHBUF_EXT);
            }
        }
    }
    /**
     * 全局渲染状态组件实例。
     */
    export const renderState: RenderState = null!;
}