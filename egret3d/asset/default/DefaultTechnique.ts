namespace egret3d {
    //TODO 本身应该是gltf资源的一部分，先放这里
    export type TechniqueTemplate = { name: string, technique: gltf.Technique, material: GLTFMaterial, program: gltf.Program, shader: Shader };

    export class DefaultTechnique {
        private static _inited: boolean = false;
        public static readonly techniqueTemplates: { [key: string]: TechniqueTemplate } = {};

        public static registerTechnique(technique: TechniqueTemplate) {
            this.techniqueTemplates[technique.name] = technique;
        }

        public static findTechniqueTemplate(name: string) {
            if (this.techniqueTemplates[name]) {
                return this.techniqueTemplates[name];
            }

            console.error("没有找到对应的Technique:" + name);
            return null;
        }

        public static cloneTechnique(source: gltf.Technique) {
            const target: gltf.Technique = { name: source.name, program: -1, attributes: {}, uniforms: {}, states: {} };
            //
            // for (var key in source.attributes) {
            //     target.attributes[key] = source.attributes[key];
            // }

            // for (var key in source.uniforms) {
            //     target.uniforms[key] = source.uniforms[key];
            // }

            // for (var key in source.states) {
            //     target.states[key] = source.states[key];
            // }

            for (var key in source) {
                target[key] = source[key];
            }

            return target;
        }

        public static cloneGLTFMaterial(source: GLTFMaterial) {
            const target: GLTFMaterial = { name: source.name, alphaMode: source.alphaMode, doubleSided: source.doubleSided, extensions: { KHR_techniques_webgl: { technique: -1 } } };
            if (source.extensions.KHR_blend) {
                target.extensions.KHR_blend = { blendEquation: source.extensions.KHR_blend.blendEquation, blendFactors: source.extensions.KHR_blend.blendFactors };
            }

            return target;
        }

        public static cloneGLTFProgram(source: gltf.Program) {
            const target: gltf.Program = { vertexShader: source.vertexShader, fragmentShader: source.fragmentShader };
            return target;
        }

        public static init() {
            if (this._inited) {
                return;
            }

            this._inited = true;
            //
            {
                const material: GLTFMaterial = { name: "shader/lambert", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: "shader/lambert", program: -1, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION, extensions: { paper: { enable: true, location: -1 } } };
                technique.attributes["_glesNormal"] = { semantic: gltf.AttributeSemanticType.NORMAL, extensions: { paper: { enable: true, location: -1 } } };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0, extensions: { paper: { enable: true, location: -1 } } };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {}, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: {}, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRAY, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
                technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1], extensions: { paper: { dirty: true, enable: false, location: -1 } } };

                const shader = new egret3d.Shader("shader/lambert");
                shader.vertShader = { name: "def_lambert_vs", src: egret3d.DefaultShaders.findShader("def_lambert_vs") };
                shader.fragShader = { name: "def_lambert_fs", src: egret3d.DefaultShaders.findShader("def_lambert_fs") };

                const program: gltf.Program = { vertexShader: -1, fragmentShader: -1 };

                const template = { name: "shader/lambert", technique, material, program, shader };

                this.registerTechnique(template);
            }

            {
                const material: GLTFMaterial = { name: "diffuse.shader.json", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: "diffuse.shader.json", program: -1, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION, extensions: { paper: { enable: true, location: -1 } } };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0, extensions: { paper: { enable: true, location: -1 } } };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {}, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRID, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
                technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0], extensions: { paper: { dirty: true, enable: false, location: -1 } } };

                const shader = new egret3d.Shader("diffuse.shader.json");
                shader.vertShader = { name: "def_diffuse_vs", src: egret3d.DefaultShaders.findShader("def_diffuse_vs") };
                shader.fragShader = { name: "def_diffuse_fs", src: egret3d.DefaultShaders.findShader("def_diffuse_fs") };

                const program: gltf.Program = { vertexShader: -1, fragmentShader: -1 };

                const template = { name: "diffuse.shader.json", technique, material, program, shader };

                this.registerTechnique(template);
            }
        }
    }
}