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
     * 内置提供的全局Attribute
     * @private
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
    };
    /**
     * 内置提供的全局Uniform
     * @private
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

        "logDepthBufFC": gltf.UniformSemanticType._LOG_DEPTH_BUFFC,
    };

    const _patternA = /#include +<([\w\d.]+)>/g;
    const _patternB = /#pragma unroll_loop[\s]+?for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;

    function _loopReplace(match: string, start: string, end: string, snippet: string) {
        let unroll = "";
        for (var i = parseInt(start); i < parseInt(end); i++) {
            unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]');
        }

        return unroll;
    }

    function _replace(match: string, include: string): string {
        let flag = true;
        let chunk = "";

        if (include in ShaderChunk) {
            chunk = (ShaderChunk as any)[include];
        }
        else if (include in renderState.defaultCustomShaderChunks) {
            flag = false;
            chunk = (renderState.customShaderChunks && include in renderState.customShaderChunks) ? renderState.customShaderChunks[include] : "";
        }

        if (chunk) {
            return chunk.replace(_patternA, _replace);
        }

        if (flag) {
            console.error(`Can not resolve #include <${include}>`);
        }

        return "";
    }

    function _filterEmptyLine(string: string) {
        return string !== "";
    }
    /**
     * 
     */
    export class RenderState extends paper.SingletonComponent {
        public maxBoneCount: uint = 24;

        public toneMapping: ToneMapping = ToneMapping.None;
        public toneMappingExposure: number = 1.0;
        public toneMappingWhitePoint: number = 1.0;

        public logarithmicDepthBuffer: boolean = false;

        public commonExtensions: string = "";
        public commonDefines: string = "";

        public readonly clearColor: Color = Color.create();
        public readonly viewPort: Rectangle = Rectangle.create();
        public readonly defaultCustomShaderChunks: Readonly<{ [key: string]: string }> = {
            custom_vertex: "",
            custom_begin_vertex: "",
            custom_end_vertex: "",
            custom_fragment: "",
            custom_begin_fragment: "",
            custom_end_fragment: "",
        };
        public customShaderChunks: { [key: string]: string } | null = null;
        public renderTarget: RenderTexture | null = null;

        public render: (camera: Camera, material?: Material) => void = null!;
        public draw: (drawCall: DrawCall) => void = null!;

        protected _parseIncludes(string: string): string {
            return string.replace(_patternA, _replace);
        }

        protected _unrollLoops(string: string) {
            return string.replace(_patternB, _loopReplace);
        }

        protected _prefixVertex(customDefines: string) {
            const prefixContext = [
                this.commonDefines,
                customDefines,
                ShaderChunk.common_vert_def,
                '\n'
            ].filter(_filterEmptyLine).join('\n');

            return prefixContext;
        }

        protected _prefixFragment(customDefines: string) {
            const toneMappingNone = this.toneMapping === ToneMapping.None;
            const prefixContext = [
                this.commonExtensions,
                this.commonDefines,
                customDefines,
                ShaderChunk.common_frag_def,
                toneMappingNone ? '' : '#define TONE_MAPPING',
                toneMappingNone ? '' : ShaderChunk.tonemapping_pars_fragment,
                toneMappingNone ? '' : this._getToneMappingFunction(this.toneMapping),
                '\n'
            ].filter(_filterEmptyLine).join('\n');

            return prefixContext;
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

            return 'vec3 toneMapping( vec3 color ) { return ' + toneMappingName + 'ToneMapping( color ); }';
        }

        public initialize(config?: any) {
            super.initialize(config);

            (renderState as RenderState) = this;
        }

        public updateViewport(viewport: Readonly<Rectangle>, target: RenderTexture | null): void { }
        public clearBuffer(bufferBit: gltf.BufferMask, clearColor?: Readonly<IColor>): void { }
        public copyFramebufferToTexture(screenPostion: Vector2, target: Texture, level: number = 0): void { }
    }
    /**
     * 
     */
    export const renderState: RenderState = null!;
}