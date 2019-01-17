namespace egret3d {
    function _filterEmptyLine(string: string) {
        return string !== "";
    }
    /**
     * 全局渲染状态组件。
     */
    export class RenderState extends paper.SingletonComponent {
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

        public logarithmicDepthBuffer: boolean = false;

        public toneMapping: ToneMapping = ToneMapping.LinearToneMapping;
        public toneMappingExposure: number = 1.0;
        public toneMappingWhitePoint: number = 1.0;

        public gammaFactor: number = 2.0;
        public gammaInput: boolean = false;
        public gammaOutput: boolean = false;

        public commonExtensions: string = "";
        public vertexExtensions: string = "";
        public fragmentExtensions: string = "";
        public commonDefines: string = "";
        public vertexDefines: string = "";
        public fragmentDefines: string = "";
        /**
         * @internal
         */
        public castShadows: boolean = false;
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

        protected _getCommonExtensions() {
            // fragmentExtensions.
            let extensions = "";

            if (this.standardDerivativesEnabled) {
                extensions += "#extension GL_OES_standard_derivatives : enable \n";
            }

            if (this.fragDepthEnabled) {
                extensions += "#extension GL_EXT_frag_depth : enable \n";
            }

            this.fragmentExtensions = extensions;
        }

        protected _getCommonDefines() {
            // commonDefines.
            let defines = "";
            defines += "precision " + this.maxPrecision + " float; \n";
            defines += "precision " + this.maxPrecision + " int; \n";
            this.commonDefines = defines;
            // fragmentDefines
            defines = "";

            if (this.toneMapping !== ToneMapping.None) {
                defines += "#define TONE_MAPPING \n";
                defines += ShaderChunk.tonemapping_pars_fragment + " \n";
                defines += this._getToneMappingFunction(this.toneMapping) + " \n";
            }

            defines += "#define GAMMA_FACTOR " + (this.gammaFactor > 0.0 ? this.gammaFactor : 1.0) + "\n";
            defines += ShaderChunk.encodings_pars_fragment;
            defines += this._getTexelEncodingFunction("linearToOutputTexel", this.gammaOutput ? TextureEncoding.GammaEncoding : TextureEncoding.LinearEncoding) + " \n";

            if (this.logarithmicDepthBuffer) {
                defines += "#define USE_LOGDEPTHBUF \n";
                if (this.fragDepthEnabled) {
                    defines += "#define USE_LOGDEPTHBUF_EXT \n";
                }
            }

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

        protected _getTexelEncodingFunction(functionName: string, encoding: TextureEncoding = TextureEncoding.LinearEncoding) {
            const components = this._getEncodingComponents(encoding);
            return 'vec4 ' + functionName + '( vec4 value ) { return LinearTo' + components[0] + components[1] + '; }';
        }

        protected _getTexelDecodingFunction(functionName: string, encoding: TextureEncoding = TextureEncoding.LinearEncoding) {
            const finialEncoding = (this.gammaInput && encoding === TextureEncoding.LinearEncoding) ? TextureEncoding.GammaEncoding : encoding;
            const components = this._getEncodingComponents(finialEncoding);
            return 'vec4 ' + functionName + '( vec4 value ) { return ' + components[0] + 'ToLinear' + components[1] + '; }';
        }
        /**
         * @internal
         */
        public _updateTextureDefine(mapName: string, texture: BaseTexture | null, defines: Defines | null = null) {
            defines = defines || this.defines;

            const mapNameDefine = (egret3d as any).ShaderTextureDefine[mapName];//TODO
            defines.removeDefine(mapNameDefine);
            defines.removeDefine(ShaderDefine.FLIP_V);
            //
            if (texture) {
                defines.addDefine(mapNameDefine);

                if (texture instanceof RenderTexture) {
                    defines.addDefine(ShaderDefine.FLIP_V);
                }
            }

            const decodingFunName = (egret3d as any).TextureDecodingFunction[mapName]; // TODO
            if (decodingFunName) {
                defines.removeDefineByName(decodingFunName);

                if (texture) {
                    const decodingCode = this._getTexelDecodingFunction(decodingFunName, texture.gltfTexture.extensions.paper.encoding);
                    const define = defines.addDefine(decodingCode)!;
                    define.isCode = true;
                    define.name = decodingFunName;
                    define.type = DefineLocation.Fragment;
                }
            }
            //
            if (mapName === ShaderUniformName.EnvMap) {
                const nameA = "envMapA";
                const nameB = "envMapB";

                defines.removeDefineByName(nameA);
                defines.removeDefineByName(nameB);

                if (texture) {
                    const { mapping } = texture.gltfTexture.extensions.paper;
                    let typeDefine = ShaderDefine.ENVMAP_TYPE_CUBE;
                    let blendDefine = ShaderDefine.ENVMAP_BLENDING_MULTIPLY; // TODO
                    let define: Define;

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

                    define = defines.addDefine(typeDefine)!;
                    define.type = DefineLocation.Fragment;
                    define.name = nameA;
                    define = defines.addDefine(blendDefine)!;
                    define.type = DefineLocation.Fragment;
                    define.name = nameB;
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
        /**
         * @internal
         */
        public initialize(config?: any) {
            super.initialize();

            (renderState as RenderState) = this;
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

        // public setGamma(factor: number, input: boolean, output: boolean) {
        //     factor = (factor > 1.0 ? factor : 1.0);

        //     const nameA = "GammaA";
        //     const nameB = "GammaB";

        //     this.defines.removeDefine(ShaderDefine.GAMMA_FACTOR, this._gammaFactor);
        //     this.defines.removeDefineByName(nameA);
        //     this.defines.removeDefineByName(nameB);

        //     let define = this.defines.addDefine(ShaderDefine.GAMMA_FACTOR, factor)!;
        //     define.type = DefineLocation.Fragment;
        //     define = this.defines.addDefine(ShaderChunk.encodings_pars_fragment)!;
        //     define.name = nameA;
        //     define.isCode = true;
        //     define.type = DefineLocation.Fragment;
        //     define = this.defines.addDefine(this._getTexelEncodingFunction("linearToOutputTexel", output ? TextureEncoding.GammaEncoding : TextureEncoding.LinearEncoding))!;
        //     define.name = nameB;
        //     define.isCode = true;
        //     define.type = DefineLocation.Fragment;

        //     this._gammaFactor = factor;
        //     this._gammaInput = input;
        //     this._gammaOutput = output;

        //     return this;
        // }

        // public setToneMapping(toneMapping: ToneMapping, exposure: number = 1.0, whitePoint: number = 1.0) {
        //     if (this._toneMapping !== toneMapping) {
        //         const nameA = "ToneMappingA";
        //         const nameB = "ToneMappingB";

        //         this.defines.removeDefine(ShaderDefine.TONE_MAPPING);
        //         this.defines.removeDefineByName(nameA);
        //         this.defines.removeDefineByName(nameB);

        //         let define = this.defines.addDefine(ShaderDefine.TONE_MAPPING)!;
        //         define.type = DefineLocation.Fragment;
        //         define = this.defines.addDefine(ShaderChunk.tonemapping_pars_fragment)!;
        //         define.name = nameA;
        //         define.isCode = true;
        //         define.type = DefineLocation.Fragment;
        //         define = this.defines.addDefine(this._getToneMappingFunction(toneMapping))!;
        //         define.name = nameB;
        //         define.isCode = true;
        //         define.type = DefineLocation.Fragment;
        //     }

        //     this._toneMapping = toneMapping;
        //     this.toneMappingExposure = exposure;
        //     this.toneMappingWhitePoint = whitePoint;

        //     return this;
        // }
    }
    /**
     * 全局渲染状态组件实例。
     */
    export const renderState: RenderState = null!;
}