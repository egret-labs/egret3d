namespace egret3d.web {
    // 运行时 draw call 排序优化使用。
    let _hashCode: uint = 0;
    /**
     * @internal
     */
    export interface WebGLActiveAttribute {
        name: string;
        size: uint;
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
        public readonly uniforms: WebGLActiveUniform[] = [];
        public readonly program: WebGLProgram;

        public constructor(program: WebGLProgram) {
            this.program = program;
        }

        public extract(technique: gltf.Technique): this {
            const webgl = WebGLRenderState.webgl!;
            const webglProgram = this.program;
            //
            const attributes = this.attributes;
            const totalAttributes = webgl.getProgramParameter(webglProgram, webgl.ACTIVE_ATTRIBUTES);

            for (let i = 0; i < totalAttributes; i++) {
                const webglActiveInfo = webgl.getActiveAttrib(webglProgram, i)!;
                const name = webglActiveInfo.name;
                const location = webgl.getAttribLocation(webglProgram, name);
                let semantic = "";

                if (!technique.attributes[name]) {
                    semantic = globalAttributeSemantics[name];
                    if (!semantic) {
                        console.error("未知Uniform定义：" + name);
                    }
                }
                else {
                    semantic = technique.attributes[name].semantic;
                }

                attributes.push({ name, type: webglActiveInfo.type, size: webglActiveInfo.size, location, semantic });
            }
            //
            const globalUniforms = this.globalUniforms;
            const uniforms = this.uniforms;
            const totalUniforms = webgl.getProgramParameter(webglProgram, webgl.ACTIVE_UNIFORMS);

            for (let i = 0; i < totalUniforms; i++) {
                const webglActiveInfo = webgl.getActiveUniform(webglProgram, i)!;
                const name = webglActiveInfo.name;
                const location = webgl.getUniformLocation(webglProgram, name)!;
                const gltfUniform = technique.uniforms[name];
                let semantic: string | undefined = undefined;

                if (!gltfUniform) {
                    semantic = globalUniformSemantics[name];

                    if (!semantic) {
                        //不在自定义中，也不在全局Uniform中
                        console.error("未知Uniform定义：" + name);
                    }
                }
                else {
                    semantic = gltfUniform.semantic;
                }

                if (semantic) {
                    globalUniforms.push({ name, type: webglActiveInfo.type, size: webglActiveInfo.size, semantic, location });
                }
                else {
                    uniforms.push({ name, type: webglActiveInfo.type, size: webglActiveInfo.size, location });
                }
            }
            //
            const activeUniforms = globalUniforms.concat(uniforms);
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
