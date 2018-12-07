namespace egret3d {
    /**
     * Shader 通用宏定义。
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
        //
        CUSTOM_VERTEX = "custom_vertex",
        CUSTOM_BEGIN_VERTEX = "custom_begin_vertex",
        CUSTOM_END_VERTEX = "custom_end_vertex",
    }
    /**
     * Shader 通用 Uniform 名称。
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
     * Shader 资源。
     */
    export class Shader extends GLTFAsset {
        /**
         * 
         * @param shader 
         * @param name 
         */
        public static create(shader: Shader, name: string): Shader;
        /**
         * 
         * @param glTF
         * @param name 
         */
        public static create(glTF: GLTF, name: string): Shader;
        public static create(shaderOrGLTF: Shader | GLTF, name: string): Shader {
            const shader = new Shader(name);
            if (shaderOrGLTF instanceof Shader) {
                const KHR_techniques_webgl = shaderOrGLTF.config.extensions.KHR_techniques_webgl!;
                const technique = KHR_techniques_webgl.techniques[0];
                const uniforms = {} as any;
                for (const k in technique.uniforms) {
                    uniforms[k] = technique.uniforms[k];
                }

                shader.config = {
                    extensions: {
                        KHR_techniques_webgl: {
                            shaders: KHR_techniques_webgl.shaders,
                            techniques: [{
                                attributes: technique.attributes,
                                uniforms: uniforms,
                                states: technique.states,
                            }]
                        }
                    }
                } as any; // TODO
                shaderOrGLTF.config;
                // shader.customs = shaderOrGLTF.customs; TODO
                shader._renderQueue = shaderOrGLTF._renderQueue;
                shader._defines = shaderOrGLTF._defines ? shaderOrGLTF._defines.concat() : undefined;
                shader._states = shaderOrGLTF._states; // TODO
            }
            else {
                shader.config = shaderOrGLTF;
            }

            return shader;
        }
        /**
         * @private
         */
        public customs: { [key: string]: string } | null = null;
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

        private constructor(name: string) {
            super(name);
        }
        /**
         * @private
         */
        public addDefine(defineString: string, value?: number | { [key: string]: string }) {
            if (value !== undefined) {
                if (typeof value === "number") {
                    defineString += " " + value;
                }
                else {
                    this.customs = {};
                    const customs = this.customs;

                    for (const k in value) {
                        customs[k] = value[k];
                    }
                }
            }

            const defines = this._defines = this._defines || [];
            if (defines.indexOf(defineString) < 0) {
                defines.push(defineString);
            }

            return this;
        }
        /**
         * @private
         */
        public addUniform(name: string, type: gltf.UniformType, value: any) {
            const uniforms = this.config.extensions.KHR_techniques_webgl!.techniques[0].uniforms;
            uniforms[name] = {
                type: type,
                value: value,
            };

            return this;
        }
    }
}