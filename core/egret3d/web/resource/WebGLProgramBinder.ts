namespace egret3d.webgl {
    /**
     * Index creater.
     */
    let _count: uint = 0;
    /**
     * 
     */
    const _attributes: string[] = [];
    /**
     * @internal
     */
    export interface WebGLActiveAttribute {
        name: string;
        type: uint;
        location: uint;
        semantic: string;
    }
    /**
     * @internal
     */
    export interface WebGLActiveUniform {
        name: string;
        size: uint;
        type: uint;
        location: WebGLUniformLocation;
        semantic: string;
        textureUnits: uint[] | null;
    }
    /**
     * @internal
     */
    export class WebGLProgramBinder {
        public readonly index: uint = _count++;
        public readonly attributesMask: uint;
        public readonly attributes: WebGLActiveAttribute[] = [];
        public readonly globalUniforms: WebGLActiveUniform[] = [];
        public readonly sceneUniforms: WebGLActiveUniform[] = [];
        public readonly cameraUniforms: WebGLActiveUniform[] = [];
        public readonly shadowUniforms: WebGLActiveUniform[] = [];
        public readonly modelUniforms: WebGLActiveUniform[] = [];
        public readonly uniforms: WebGLActiveUniform[] = [];
        public readonly program: WebGLProgram;

        public constructor(program: WebGLProgram) {
            this.program = program;
        }

        public dispose() {
            const webgl = WebGLRenderState.webgl!;
            webgl.deleteProgram(this.program);
        }

        public extract(technique: gltf.Technique): this {
            const webgl = WebGLRenderState.webgl!;
            const {
                attributes,
                globalUniforms, sceneUniforms, cameraUniforms, shadowUniforms, modelUniforms,
                uniforms,
                program
            } = this;
            // Link attributes.
            const attributeCount = webgl.getProgramParameter(program, webgl.ACTIVE_ATTRIBUTES) as uint;

            for (let i = 0; i < attributeCount; ++i) {
                const { name, type } = webgl.getActiveAttrib(program, i)!;
                const location = webgl.getAttribLocation(program, name);

                let semantic = "";

                if (name in technique.attributes) {
                    semantic = technique.attributes[name].semantic;
                }
                else if (name in globalAttributeSemantics) {
                    semantic = globalAttributeSemantics[name];
                }
                else if (DEBUG) {
                    console.warn("Invalid attribute.", name);
                }

                if (_attributes.indexOf(semantic) < 0) {
                    _attributes.push(semantic);
                }
                
                (this.attributesMask as uint) |= 1 << (_attributes.indexOf(semantic));
                attributes.push({ name, type, location, semantic });
            }
            // Link uniforms.
            const uniformCount = webgl.getProgramParameter(program, webgl.ACTIVE_UNIFORMS) as uint;

            for (let i = 0; i < uniformCount; ++i) {
                const { name, type, size } = webgl.getActiveUniform(program, i)!;
                const location = webgl.getUniformLocation(program, name)!;

                let semantic = "";
                let targetUniforms: WebGLActiveUniform[] | null = null;

                if (name in technique.uniforms) {
                    const gltfUniform = technique.uniforms[name];
                    semantic = gltfUniform.semantic || ""; //
                    targetUniforms = uniforms;

                    if (DEBUG && semantic !== "") {
                        console.debug("Custom uniform.", name, semantic);
                    }
                }
                else if (name in globalUniformSemantics) {
                    semantic = globalUniformSemantics[name];
                    targetUniforms = globalUniforms;
                }
                else if (name in sceneUniformSemantics) {
                    semantic = sceneUniformSemantics[name];
                    targetUniforms = sceneUniforms;
                }
                else if (name in cameraUniformSemantics) {
                    semantic = cameraUniformSemantics[name];
                    targetUniforms = cameraUniforms;
                }
                else if (name in shadowUniformSemantics) {
                    semantic = shadowUniformSemantics[name];
                    targetUniforms = shadowUniforms;
                }
                else if (name in modelUniformSemantics) {
                    semantic = modelUniformSemantics[name];
                    targetUniforms = modelUniforms;
                }
                else if (DEBUG) {
                    console.warn("Invalid uniform.", name);
                }

                if (targetUniforms !== null) {
                    targetUniforms.push({ name, type, size, semantic, location, textureUnits: null });
                }
            }
            //
            const activeUniforms = globalUniforms.concat(sceneUniforms).concat(cameraUniforms).concat(shadowUniforms).concat(modelUniforms).concat(uniforms);
            const samplerArrayNames: string[] = [];
            const samplerNames: string[] = [];
            // Sort.
            for (const uniform of activeUniforms) {
                const name = uniform.name;
                if (uniform.type === gltf.UniformType.SAMPLER_2D || uniform.type === gltf.UniformType.SAMPLER_CUBE) {
                    if (name.indexOf("[") > -1) {
                        samplerArrayNames.push(name);
                    }
                    else {
                        samplerNames.push(name);
                    }
                }
            }
            //
            const allNames = samplerNames.concat(samplerArrayNames);
            let textureUint = 0;

            for (const uniform of activeUniforms) {
                if (allNames.indexOf(uniform.name) < 0) {
                    continue;
                }

                let textureUnits = uniform.textureUnits;

                if (textureUnits === null) {
                    textureUnits = uniform.textureUnits = [];
                }

                textureUnits.length = uniform.size;

                for (let i = 0; i < uniform.size; i++) {
                    textureUnits[i] = textureUint++;
                }
            }

            return this;
        }
    }
}
