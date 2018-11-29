namespace egret3d.web {
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
    /**
     * 
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
     * @internal
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
}