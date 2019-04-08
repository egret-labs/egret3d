namespace egret3d {
    /**
     * Shader 资源。
     */
    export class Shader extends GLTFAsset {
        /**
         * 
         * @param shader 
         * @param name 
         */
        public static create(name: string, shader: Shader): Shader;
        /**
         * @private
         */
        public static create(name: string, config: GLTF): Shader;
        public static create(name: string, shaderOrConfig: Shader | GLTF): Shader {
            let config: GLTF;
            let shader: Shader;
            let parent: Shader | null = null;

            if (shaderOrConfig instanceof Shader) {
                // TODO
                const KHR_techniques_webgl = shaderOrConfig.config.extensions.KHR_techniques_webgl!;
                const technique = KHR_techniques_webgl.techniques[0];
                const uniforms = {} as any;
                parent = shaderOrConfig;

                for (const k in technique.uniforms) {
                    uniforms[k] = technique.uniforms[k];
                }

                config = {
                    extensions: {
                        KHR_techniques_webgl: {
                            shaders: KHR_techniques_webgl.shaders,
                            techniques: [{
                                attributes: technique.attributes,
                                uniforms: uniforms,
                                // states: technique.states,
                            }]
                        }
                    }
                } as GLTF;
            }
            else {
                config = shaderOrConfig;
            }

            // Retargeting.
            shader = new egret3d.Shader();
            shader.initialize(name, config, null, parent);

            return shader;
        }
        /**
         * @private
         */
        public static createDefaultStates(): gltf.States {
            const states: gltf.States = {
                enable: [gltf.EnableState.DepthTest, gltf.EnableState.CullFace],
                functions: {
                    depthFunc: [gltf.DepthFunc.Lequal],
                    depthMask: [true],
                    frontFace: [gltf.FrontFace.CCW],
                    cullFace: [gltf.CullFace.Back],
                },
            };

            return states;
        }
        /**
         * @private
         */
        public static copyStates(source: gltf.States, target: gltf.States) {
            const { enable: sourceEnable, functions: sourceFunctions } = source;
            let { enable, functions } = target;

            if (enable) {
                enable.length = 0;
            }

            if (functions) {
                for (const k in functions) {
                    delete functions[k];
                }
            }

            if (sourceEnable) {
                if (!enable) {
                    enable = target.enable = [];
                }

                for (const value of sourceEnable) {
                    enable.push(value);
                }
            }

            if (sourceFunctions) {
                if (!functions) {
                    functions = target.functions = {};
                }

                for (const k in sourceFunctions) {
                    const sourceFunction = sourceFunctions[k];
                    functions[k] = Array.isArray(sourceFunction) ? sourceFunction.concat() : sourceFunction;
                }
            }
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
        /**
         * @ignore
         */
        public initialize(
            name: string, config: GLTF, buffers: ReadonlyArray<ArrayBufferView> | null,
            parent: Shader | null
        ) {
            super.initialize(name, config, null);

            if (parent) {
                // this.customs = parent.customs; TODO
                this._renderQueue = parent._renderQueue;
                this._defines = parent._defines ? parent._defines.concat() : undefined;
                this._states = parent._states; // TODO
            }
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