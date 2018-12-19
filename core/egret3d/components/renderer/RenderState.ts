namespace egret3d {
    /**
     * @private
     */
    export enum ToneMapping {
        None = 0,
        LinearToneMapping = 1,
        ReinhardToneMapping = 2,
        Uncharted2ToneMapping = 3,
        CineonToneMapping = 4,
    }
    /**
     * 内置提供的全局 Attribute。
     * @private
     */
    export const globalAttributeSemantics: { [key: string]: gltf.AttributeSemantics } = {
        "position": gltf.AttributeSemantics.POSITION,
        "normal": gltf.AttributeSemantics.NORMAL,
        "uv": gltf.AttributeSemantics.TEXCOORD_0,
        "uv2": gltf.AttributeSemantics.TEXCOORD_1,
        "color": gltf.AttributeSemantics.COLOR_0,

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

        "skinIndex": gltf.AttributeSemantics.JOINTS_0,
        "skinWeight": gltf.AttributeSemantics.WEIGHTS_0,

        "corner": gltf.AttributeSemantics._CORNER,
        "startPosition": gltf.AttributeSemantics._START_POSITION,
        "startVelocity": gltf.AttributeSemantics._START_VELOCITY,
        "startColor": gltf.AttributeSemantics._START_COLOR,
        "startSize": gltf.AttributeSemantics._START_SIZE,
        "startRotation": gltf.AttributeSemantics._START_ROTATION,
        "time": gltf.AttributeSemantics._TIME,
        "random0": gltf.AttributeSemantics._RANDOM0,
        "random1": gltf.AttributeSemantics._RANDOM1,
        "startWorldPosition": gltf.AttributeSemantics._WORLD_POSITION,
        "startWorldRotation": gltf.AttributeSemantics._WORLD_ROTATION,

        "lineDistance": gltf.AttributeSemantics._INSTANCE_DISTANCE,
        "instanceStart": gltf.AttributeSemantics._INSTANCE_START,
        "instanceEnd": gltf.AttributeSemantics._INSTANCE_END,
        "instanceColorStart": gltf.AttributeSemantics._INSTANCE_COLOR_START,
        "instanceColorEnd": gltf.AttributeSemantics._INSTANCE_COLOR_END,
        "instanceDistanceStart": gltf.AttributeSemantics._INSTANCE_DISTANCE_START,
        "instanceDistanceEnd": gltf.AttributeSemantics._INSTANCE_DISTANCE_END,
    };
    /**
     * 内置提供的全局 Uniform。
     * @private
     */
    export const globalUniformSemantics: { [key: string]: gltf.UniformSemantics } = {
        "modelMatrix": gltf.UniformSemantics.MODEL,
        "modelViewMatrix": gltf.UniformSemantics.MODELVIEW,
        "projectionMatrix": gltf.UniformSemantics.PROJECTION,
        "viewMatrix": gltf.UniformSemantics.VIEW,
        "normalMatrix": gltf.UniformSemantics.MODELVIEWINVERSE,
        "modelViewProjectionMatrix": gltf.UniformSemantics.MODELVIEWPROJECTION,
        "viewProjectionMatrix": gltf.UniformSemantics._VIEWPROJECTION,
        "cameraPosition": gltf.UniformSemantics._CAMERA_POS,
        "cameraForward": gltf.UniformSemantics._CAMERA_FORWARD,
        "cameraUp": gltf.UniformSemantics._CAMERA_UP,
        "ambientLightColor": gltf.UniformSemantics._AMBIENTLIGHTCOLOR,
        "directionalLights[0]": gltf.UniformSemantics._DIRECTLIGHTS,
        "pointLights[0]": gltf.UniformSemantics._POINTLIGHTS,
        "spotLights[0]": gltf.UniformSemantics._SPOTLIGHTS,
        "boneMatrices[0]": gltf.UniformSemantics.JOINTMATRIX,

        "directionalShadowMatrix[0]": gltf.UniformSemantics._DIRECTIONSHADOWMAT,
        "spotShadowMatrix[0]": gltf.UniformSemantics._SPOTSHADOWMAT,
        "pointShadowMatrix[0]": gltf.UniformSemantics._POINTSHADOWMAT,
        "directionalShadowMap[0]": gltf.UniformSemantics._DIRECTIONSHADOWMAP,
        "spotShadowMap[0]": gltf.UniformSemantics._SPOTSHADOWMAP,
        "pointShadowMap[0]": gltf.UniformSemantics._POINTSHADOWMAP,
        "lightMap": gltf.UniformSemantics._LIGHTMAPTEX,
        "lightMapIntensity": gltf.UniformSemantics._LIGHTMAPINTENSITY,
        "lightMapScaleOffset": gltf.UniformSemantics._LIGHTMAP_SCALE_OFFSET,

        "referencePosition": gltf.UniformSemantics._REFERENCEPOSITION,
        "nearDistance": gltf.UniformSemantics._NEARDICTANCE,
        "farDistance": gltf.UniformSemantics._FARDISTANCE,

        "fogColor": gltf.UniformSemantics._FOG_COLOR,
        "fogDensity": gltf.UniformSemantics._FOG_DENSITY,
        "fogNear": gltf.UniformSemantics._FOG_NEAR,
        "fogFar": gltf.UniformSemantics._FOG_FAR,

        "toneMappingExposure": gltf.UniformSemantics._TONE_MAPPING_EXPOSURE,
        "toneMappingWhitePoint": gltf.UniformSemantics._TONE_MAPPING_WHITE_POINT,

        "logDepthBufFC": gltf.UniformSemantics._LOG_DEPTH_BUFFC,
    };

    function _filterEmptyLine(string: string) {
        return string !== "";
    }
    /**
     * 
     */
    export class RenderState extends paper.SingletonComponent {
        public version: number;
        public standardDerivativesEnabled: boolean;
        public textureFloatEnabled: boolean;
        public fragDepthEnabled: boolean;
        public textureFilterAnisotropicEnabled: EXT_texture_filter_anisotropic | null;
        public shaderTextureLODEnabled: any;

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
        public toneMapping: ToneMapping = ToneMapping.None;
        public toneMappingExposure: number = 1.0;
        public toneMappingWhitePoint: number = 1.0;

        public commonExtensions: string = "";
        public vertexExtensions: string = "";
        public fragmentExtensions: string = "";
        public commonDefines: string = "";
        public vertexDefines: string = "";
        public fragmentDefines: string = "";

        public readonly clearColor: Color = Color.create();
        public readonly viewPort: Rectangle = Rectangle.create();
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
            // fragmentDefines.
            defines = "";

            if (this.toneMapping !== ToneMapping.None) {
                defines += "#define TONE_MAPPING \n";
                defines += ShaderChunk.tonemapping_pars_fragment + " \n";
                defines += this._getToneMappingFunction(this.toneMapping);
            }

            if (this.logarithmicDepthBuffer) {
                defines += "#define USE_LOGDEPTHBUF \n";
                if (this.fragDepthEnabled) {
                    defines += "#define USE_LOGDEPTHBUF_EXT \n";
                }
            }

            this.fragmentDefines = defines;
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
                    throw new Error('unsupported toneMapping: ' + toneMapping);
            }

            return `vec3 toneMapping( vec3 color ) { return ${toneMappingName}ToneMapping( color ); } \n`;
        }

        public render: (camera: Camera, material?: Material) => void = null!;
        public draw: (drawCall: DrawCall) => void = null!;

        public initialize(config?: any) {
            super.initialize(config);

            (renderState as RenderState) = this;
        }

        public updateViewport(viewport: Readonly<Rectangle>, target: RenderTexture | null): void { }
        public clearBuffer(bufferBit: gltf.BufferMask, clearColor?: Readonly<IColor>): void { }
        public copyFramebufferToTexture(screenPostion: Vector2, target: BaseTexture, level: uint = 0): void { }
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
    }
    /**
     * 
     */
    export const renderState: RenderState = null!;
}