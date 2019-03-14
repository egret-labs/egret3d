namespace egret3d {
    /**
     * Shader 通用宏定义。
     */
    export const enum ShaderDefine {
        //
        TONE_MAPPING = "TONE_MAPPING",
        GAMMA_FACTOR = "GAMMA_FACTOR",
        USE_LOGDEPTHBUF = "USE_LOGDEPTHBUF",
        USE_LOGDEPTHBUF_EXT = "USE_LOGDEPTHBUF_EXT",
        //
        USE_COLOR = "USE_COLOR",
        USE_MAP = "USE_MAP",
        USE_ALPHAMAP = "USE_ALPHAMAP",
        USE_AOMAP = "USE_AOMAP",
        USE_BUMPMAP = "USE_BUMPMAP",
        USE_NORMALMAP = "USE_NORMALMAP",
        USE_SPECULARMAP = "USE_SPECULARMAP",
        USE_ROUGHNESSMAP = "USE_ROUGHNESSMAP",
        USE_METALNESSMAP = "USE_METALNESSMAP",
        USE_DISPLACEMENTMAP = "USE_DISPLACEMENTMAP",
        USE_EMISSIVEMAP = "USE_EMISSIVEMAP",
        USE_ENVMAP = "USE_ENVMAP",
        USE_LIGHTMAP = "USE_LIGHTMAP",
        USE_SHADOWMAP = "USE_SHADOWMAP",
        USE_SKINNING = "USE_SKINNING",
        USE_SIZEATTENUATION = "USE_SIZEATTENUATION",
        TOON = "TOON",
        STANDARD = "STANDARD",
        //
        TEXTURE_LOD_EXT = "TEXTURE_LOD_EXT",
        //
        ENVMAP_TYPE_CUBE = "ENVMAP_TYPE_CUBE",
        ENVMAP_TYPE_CUBE_UV = "ENVMAP_TYPE_CUBE_UV",
        ENVMAP_TYPE_EQUIREC = "ENVMAP_TYPE_EQUIREC",
        ENVMAP_TYPE_SPHERE = "ENVMAP_TYPE_SPHERE",
        ENVMAP_MODE_REFRACTION = "ENVMAP_MODE_REFRACTION",
        ENVMAP_BLENDING_MULTIPLY = "ENVMAP_BLENDING_MULTIPLY",
        ENVMAP_BLENDING_MIX = "ENVMAP_BLENDING_MIX",
        ENVMAP_BLENDING_ADD = "ENVMAP_BLENDING_ADD",
        //
        FLAT_SHADED = "FLAT_SHADED",
        //
        MAX_BONES = "MAX_BONES",
        //
        NUM_DIR_LIGHTS = "NUM_DIR_LIGHTS",
        NUM_POINT_LIGHTS = "NUM_POINT_LIGHTS",
        NUM_RECT_AREA_LIGHTS = "NUM_RECT_AREA_LIGHTS",
        NUM_SPOT_LIGHTS = "NUM_SPOT_LIGHTS",
        NUM_HEMI_LIGHTS = "NUM_HEMI_LIGHTS",
        NUM_CLIPPING_PLANES = "NUM_CLIPPING_PLANES",
        UNION_CLIPPING_PLANES = "UNION_CLIPPING_PLANES",
        //
        SHADOWMAP_TYPE_PCF = "SHADOWMAP_TYPE_PCF",
        SHADOWMAP_TYPE_PCF_SOFT = "SHADOWMAP_TYPE_PCF_SOFT",
        DEPTH_PACKING_3200 = "DEPTH_PACKING 3200",
        DEPTH_PACKING_3201 = "DEPTH_PACKING 3201",
        //
        FLIP_SIDED = "FLIP_SIDED",
        DOUBLE_SIDED = "DOUBLE_SIDED",
        PREMULTIPLIED_ALPHA = "PREMULTIPLIED_ALPHA",
        //
        USE_FOG = "USE_FOG",
        FOG_EXP2 = "FOG_EXP2",
        //
        FLIP_V = "FLIP_V",
    }
    /**
     * Shader 通用 Uniform 名称。
     */
    export const enum ShaderUniformName {
        Diffuse = "diffuse",
        Opacity = "opacity",
        Size = "size",

        Map = "map",
        AlphaMap = "alphaMap",
        AOMap = "aoMap",
        BumpMap = "bumpMap",
        NormalMap = "normalMap",
        SpecularMap = "specularMap",
        GradientMap = "gradientMap",
        RoughnessMap = "roughnessMap",
        MetalnessMap = "metalnessMap",
        DisplacementMap = "displacementMap",
        EnvMap = "envMap",
        EmissiveMap = "emissiveMap",

        CubeMap = "tCube",
        EquirectMap = "tEquirect",
        Flip = "tFlip",

        UVTransform = "uvTransform",

        Reflectivity = "reflectivity",
        RefractionRatio = "refractionRatio",

        Specular = "specular",
        Shininess = "shininess",

        BumpScale = "bumpScale",
        NormalScale = "normalScale",
        Roughness = "roughness",
        Metalness = "metalness",
        Emissive = "emissive",
        EmissiveIntensity = "emissiveIntensity",
        FlipEnvMap = "flipEnvMap",
        MaxMipLevel = "maxMipLevel",

        Rotation = "rotation",
        Scale2D = "scale2D",
        Center = "center",
    }
    /**
     * Shader宏定义排序。
     */
    export const enum ShaderDefineOrder {
        GammaFactor = 1,
        DecodingFun = 2,
        EncodingFun = 3,
    }
    /**
     * 
     */
    export const enum HumanoidMask {
        Head,
        Body,
        LeftArm,
        RightArm,
        LeftHand,
        RightHand,
        LeftLeg,
        RightLeg,
        LeftHandIK,
        RightHandIK,
        LeftFootIK,
        RightFootIK,
    }
    /**
     * 
     */
    export const enum HumanoidJoint {
        Heck = "H_Neck",
        Head = "H_Head",
        LeftEye = "H_LeftEye",
        RightEye = "H_RightEye",
        Jaw = "H_Jaw",

        Hips = "B_Hips",
        Spine = "B_Spine",
        Chest = "B_Chest",
        UpperChest = "B_UpperChest",

        LeftShoulder = "LA_Shoulder",
        LeftUpperArm = "LA_UpperArm",
        LeftLowerArm = "LA_LowerArm",
        LeftHand = "LA_Hand",

        RightShoulder = "RA_Shoulder",
        RightUpperArm = "RA_UpperArm",
        RightLowerArm = "RA_LowerArm",
        RightHand = "RA_Hand",

        LeftUpperLeg = "LL_UpperLeg",
        LeftLowerLeg = "LL_LowerLeg",
        LeftFoot = "LL_Foot",
        LeftToes = "LL_Toes",

        RightUpperLeg = "RL_UpperLeg",
        RightLowerLeg = "RL_LowerLeg",
        RightFoot = "RL_Foot",
        RightToes = "RL_Toes",

        LeftThumbProximal = "LH_ThumbProximal",
        LeftThumbIntermediate = "LH_ThumbIntermediate",
        LeftThumbDistal = "LH_ThumbDistal",
        LeftIndexProximal = "LH_IndexProximal",
        LeftIndexIntermediate = "LH_IndexIntermediate",
        LeftIndexDistal = "LH_IndexDistal",
        LeftMiddleProximal = "LH_MiddleProximal",
        LeftMiddleIntermediate = "LH_MiddleIntermediate",
        LeftMiddleDistal = "LH_MiddleDistal",
        LeftRingProximal = "LH_RingProximal",
        LeftRingIntermediate = "LH_RingIntermediate",
        LeftRingDistal = "LH_RingDistal",
        LeftLittleProximal = "LH_LittleProximal",
        LeftLittleIntermediate = "LH_LittleIntermediate",
        LeftLittleDistal = "LH_LittleDistal",

        RightThumbProximal = "RH_ThumbProximal",
        RightThumbIntermediate = "RH_ThumbIntermediate",
        RightThumbDistal = "RH_ThumbDistal",
        RightIndexProximal = "RH_IndexProximal",
        RightIndexIntermediate = "RH_IndexIntermediate",
        RightIndexDistal = "RH_IndexDistal",
        RightMiddleProximal = "RH_MiddleProximal",
        RightMiddleIntermediate = "RH_MiddleIntermediate",
        RightMiddleDistal = "RH_MiddleDistal",
        RightRingProximal = "RH_RingProximal",
        RightRingIntermediate = "RH_RingIntermediate",
        RightRingDistal = "RH_RingDistal",
        RightLittleProximal = "RH_LittleProximal",
        RightLittleIntermediate = "RH_LittleIntermediate",
        RightLittleDistal = "RH_LittleDistal",
    }
    /**
     * TODO
     * @internal
     */
    export const TextureDecodingFunction: { [key: string]: string } = {
        "map": "mapTexelToLinear",
        "envMap": "envMapTexelToLinear",
        "emissiveMap": "emissiveMapTexelToLinear",
    };
    /**
     * TODO
     * @internal
     */
    export const ShaderTextureDefine: { [key: string]: ShaderDefine } = {
        "map": ShaderDefine.USE_MAP,
        "alphaMap": ShaderDefine.USE_ALPHAMAP,
        "aoMap": ShaderDefine.USE_AOMAP,
        "bumpMap": ShaderDefine.USE_BUMPMAP,
        "normalMap": ShaderDefine.USE_NORMALMAP,
        "specularMap": ShaderDefine.USE_SPECULARMAP,
        "gradientMap": ShaderDefine.TOON,
        "roughnessMap": ShaderDefine.USE_ROUGHNESSMAP,
        "metalnessMap": ShaderDefine.USE_METALNESSMAP,
        "displacementMap": ShaderDefine.USE_DISPLACEMENTMAP,
        "envMap": ShaderDefine.USE_ENVMAP,
        "emissiveMap": ShaderDefine.USE_EMISSIVEMAP,
    };
    
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
        "ambientLightColor": gltf.UniformSemantics._AMBIENTLIGHTCOLOR,
        "fogColor": gltf.UniformSemantics._FOG_COLOR,
        "fogDensity": gltf.UniformSemantics._FOG_DENSITY,
        "fogNear": gltf.UniformSemantics._FOG_NEAR,
        "fogFar": gltf.UniformSemantics._FOG_FAR,
        "toneMappingExposure": gltf.UniformSemantics._TONE_MAPPING_EXPOSURE,
        "toneMappingWhitePoint": gltf.UniformSemantics._TONE_MAPPING_WHITE_POINT,
        "resolution": gltf.UniformSemantics._RESOLUTION,
    };
    /**
     * 内置提供的场景 Uniform。
     * @private
     */
    export const sceneUniformSemantics: { [key: string]: gltf.UniformSemantics } = {
        "lightMapIntensity": gltf.UniformSemantics._LIGHTMAPINTENSITY,
    };
    /**
     * 内置提供的摄像机 Uniform。
     * @private
     */
    export const cameraUniformSemantics: { [key: string]: gltf.UniformSemantics } = {
        "viewMatrix": gltf.UniformSemantics.VIEW,
        "projectionMatrix": gltf.UniformSemantics.PROJECTION,
        "viewProjectionMatrix": gltf.UniformSemantics._VIEWPROJECTION,
        "cameraForward": gltf.UniformSemantics._CAMERA_FORWARD,
        "cameraUp": gltf.UniformSemantics._CAMERA_UP,
        "cameraPosition": gltf.UniformSemantics._CAMERA_POS,
        "directionalLights[0]": gltf.UniformSemantics._DIRECTLIGHTS,
        "spotLights[0]": gltf.UniformSemantics._SPOTLIGHTS,
        "rectAreaLights[0]": gltf.UniformSemantics._RECTAREALIGHTS,
        "pointLights[0]": gltf.UniformSemantics._POINTLIGHTS,
        "hemisphereLights[0]": gltf.UniformSemantics._HEMILIGHTS,
        "logDepthBufFC": gltf.UniformSemantics._LOG_DEPTH_BUFFC,
    };
    /**
     * 内置提供的影子 Uniform。
     * @private
     */
    export const shadowUniformSemantics: { [key: string]: gltf.UniformSemantics } = {
        "referencePosition": gltf.UniformSemantics._REFERENCEPOSITION,
        "nearDistance": gltf.UniformSemantics._NEARDICTANCE,
        "farDistance": gltf.UniformSemantics._FARDISTANCE,
    };
    /**
     * 内置提供的模型 Uniform。
     * @private
     */
    export const modelUniformSemantics: { [key: string]: gltf.UniformSemantics } = {
        "modelMatrix": gltf.UniformSemantics.MODEL,
        "modelViewMatrix": gltf.UniformSemantics.MODELVIEW,
        "modelViewProjectionMatrix": gltf.UniformSemantics.MODELVIEWPROJECTION,
        "normalMatrix": gltf.UniformSemantics.MODELVIEWINVERSE,
        "boneMatrices[0]": gltf.UniformSemantics.JOINTMATRIX,
        "clock": gltf.UniformSemantics._CLOCK,
        "lightMap": gltf.UniformSemantics._LIGHTMAPTEX,
        "lightMapScaleOffset": gltf.UniformSemantics._LIGHTMAP_SCALE_OFFSET,
        "directionalShadowMatrix[0]": gltf.UniformSemantics._DIRECTIONSHADOWMAT,
        "spotShadowMatrix[0]": gltf.UniformSemantics._SPOTSHADOWMAT,
        "pointShadowMatrix[0]": gltf.UniformSemantics._POINTSHADOWMAT,
        "directionalShadowMap[0]": gltf.UniformSemantics._DIRECTIONSHADOWMAP,
        "pointShadowMap[0]": gltf.UniformSemantics._POINTSHADOWMAP,
        "spotShadowMap[0]": gltf.UniformSemantics._SPOTSHADOWMAP,
        "rotation": gltf.UniformSemantics._ROTATION,
        "scale2D": gltf.UniformSemantics._SCALE2D,
    };
    /**
     * 
     */
    export interface ITransformObserver {
        /**
         * 
         */
        onTransformChange(): void;
    }
    /**
     * 渲染系统接口。
     */
    export interface IRenderSystem {
        /**
         * 渲染相机。
         * @param camera 
         */
        render(camera: Camera, material: Material | null): void;
        /**
         * 绘制一个绘制信息。
         * @param camera 
         * @param drawCall 
         */
        draw(drawCall: DrawCall, material: Material | null): void;
    }
    /**
     * 
     */
    export type RunOptions = {
        /**
         * 
         */
        playerMode?: paper.PlayerMode;
        /**
         * 
         */
        defaultScene?: string;
        /**
         * 舞台宽。
         */
        contentWidth?: number;
        /**
         * 舞台高。
         */
        contentHeight?: number;
        /**
         * 是否开启抗锯齿，默认开启。
         */
        antialias?: boolean;
        /**
         * 是否与画布背景色混合，默认不混合。
         */
        alpha?: boolean;
        /**
         * 
         */
        gammaInput?: boolean;

        antialiasSamples?: number;

        canvas?: HTMLCanvasElement;
        webgl?: WebGLRenderingContext;
    };
}
