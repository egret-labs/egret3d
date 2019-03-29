/**
 * @internal
 */
type GlobalWeblGLShader = WebGLShader;

namespace egret3d.webgl {
    let _hashCode: uint = 0;
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
        semantic?: string;
        textureUnits?: uint[];
    }
    /**
     * @internal
     */
    export class WebGLProgramBinder {
        public readonly id: uint = _hashCode++;
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
            const attributeCount = webgl.getProgramParameter(program, webgl.ACTIVE_ATTRIBUTES);

            for (let i = 0; i < attributeCount; ++i) {
                const webGLActiveInfo = webgl.getActiveAttrib(program, i)!;
                const { name, type } = webGLActiveInfo;
                const location = webgl.getAttribLocation(program, name);

                let semantic = "";

                if (name in technique.attributes) {
                    if (!(name in globalAttributeSemantics)) {
                        console.warn("Invalid attribute.", name);
                    }
                }
                else {
                    semantic = technique.attributes[name].semantic;
                }

                attributes.push({ name, type, location, semantic });
            }
            // Link uniforms.
            const uniformCount = webgl.getProgramParameter(program, webgl.ACTIVE_UNIFORMS) as uint;

            for (let i = 0; i < uniformCount; ++i) {
                const webGLActiveInfo = webgl.getActiveUniform(program, i)!;
                const { name, type, size } = webGLActiveInfo;
                const location = webgl.getUniformLocation(program, name)!;

                if (name in technique.uniforms) {
                    if (name in globalUniformSemantics) {
                        globalUniforms.push({ name, type, size, semantic: globalUniformSemantics[name], location });
                    }
                    else if (name in sceneUniformSemantics) {
                        sceneUniforms.push({ name, type, size, semantic: sceneUniformSemantics[name], location });
                    }
                    else if (name in cameraUniformSemantics) {
                        cameraUniforms.push({ name, type, size, semantic: cameraUniformSemantics[name], location });
                    }
                    else if (name in shadowUniformSemantics) {
                        shadowUniforms.push({ name, type, size, semantic: shadowUniformSemantics[name], location });
                    }
                    else if (name in modelUniformSemantics) {
                        modelUniforms.push({ name, type, size, semantic: modelUniformSemantics[name], location });
                    }
                    else {
                        console.warn("Invalid uniform.", name);
                    }
                }
                else {
                    const gltfUniform = technique.uniforms[name];
                    uniforms.push({ name, type, size, semantic: gltfUniform.semantic, location });

                    if (DEBUG && gltfUniform.semantic !== undefined) {
                        console.debug("Custom uniform.", name);
                    }
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
            let textureUint = 0;
            const allNames = samplerNames.concat(samplerArrayNames);

            for (const uniform of activeUniforms) {
                if (allNames.indexOf(uniform.name) < 0) {
                    continue;
                }

                let textureUnits = uniform.textureUnits;

                if (!textureUnits) {
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
