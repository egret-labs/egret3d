namespace egret3d {
    /**
     * Shader 通用宏定义。
     */
    export const enum ShaderDefine {
        //
        TONE_MAPPING = "TONE_MAPPING",
        GAMMA_FACTOR = "GAMMA_FACTOR",
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
        Flip = "tFlip",

        UVTransform = "uvTransform",

        Reflectivity = "reflectivity",
        RefractionRatio = "refractionRatio",

        Specular = "specular",
        Shininess = "shininess",

        BumpScale = "bumpScale",
        Roughness = "roughness",
        Metalness = "metalness",
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
}