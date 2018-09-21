namespace egret3d {
    /**
     * 通用宏定义
     */
    export const enum ShaderDefine {
        USE_COLOR = "USE_COLOR",
        USE_MAP = "USE_MAP",
        USE_SKINNING = "USE_SKINNING",
        USE_LIGHTMAP = "USE_LIGHTMAP",
        USE_SHADOWMAP = "USE_SHADOWMAP",
        USE_SIZEATTENUATION = "USE_SIZEATTENUATION",
        //
        MAX_BONES = "MAX_BONES",
        //
        FLIP_V = "FLIP_V",
        //
        NUM_POINT_LIGHTS = "NUM_POINT_LIGHTS",
        NUM_SPOT_LIGHTS = "NUM_SPOT_LIGHTS",
        SHADOWMAP_TYPE_PCF = "SHADOWMAP_TYPE_PCF",
        SHADOWMAP_TYPE_PCF_SOFT = "SHADOWMAP_TYPE_PCF_SOFT",
        DEPTH_PACKING_3200 = "DEPTH_PACKING 3200",
        DEPTH_PACKING_3201 = "DEPTH_PACKING 3201",
        //
        USE_FOG = "USE_FOG",
        FOG_EXP2 = "FOG_EXP2",
    }
    /**
     * 通用Uniform名字
     */
    export const enum ShaderUniformName {
        Diffuse = "diffuse",
        Opacity = "opacity",
        Size = "size",
        Map = "map",
        Specular = "specular",
        Shininess = "shininess",
        UVTransform = "uvTransform",
    }
    /**
     * 
     */
    export class Shader extends GLTFAsset {
        /**
         * @internal
         */
        public _renderQueue?: number;
        /**
         * @internal
         */
        public _defines?: string[];
        /**
         * @internal
         */
        public _states?: gltf.States;
        /**
         * @internal
         */
        public constructor(config: GLTF, name: string) {
            super(name);

            this.config = config;
        }
    }
}