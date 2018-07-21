namespace egret3d {
    //TODO 本身应该是gltf资源的一部分，先放这里
    export type TechniqueTemplate = { name: string, technique: gltf.Technique, material: GLTFMaterial, shader: Shader };

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
            const target: gltf.Technique = { name: source.name, attributes: {}, uniforms: {}, states: source.states };
            for (const key in source.attributes) {
                const att = source.attributes[key];
                target.attributes[key] = { semantic: att.semantic, extensions: { paper: { enable: true, location: -1 } } };
            }
            for (var key in source.uniforms) {
                const uniform = source.uniforms[key];
                target.uniforms[key] = { type: uniform.type, semantic: uniform.semantic, value: uniform.value, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            }

            return target;
        }

        public static cloneGLTFMaterial(source: GLTFMaterial) {
            const target: GLTFMaterial = { name: source.name, alphaMode: source.alphaMode, doubleSided: source.doubleSided, extensions: { KHR_techniques_webgl: { technique: -1 } } };
            
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

                const technique: gltf.Technique = { name: "shader/lambert", attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesNormal"] = { semantic: gltf.AttributeSemanticType.NORMAL };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };

                technique.uniforms["glstate_directionalShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAT, value: {} };
                technique.uniforms["glstate_directionalShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAP, value: {} };
                technique.uniforms["glstate_directLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._DIRECTLIGHTS, value: {} };
                technique.uniforms["glstate_pointShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_CUBE, semantic: gltf.UniformSemanticType._POINTSHADOWMAP, value: {} };
                technique.uniforms["glstate_pointLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._POINTLIGHTS, value: {} };
                technique.uniforms["glstate_spotShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._SPOTSHADOWMAT, value: {} };
                technique.uniforms["glstate_spotShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: {} };
                technique.uniforms["glstate_spotLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._SPOTLIGHTS, value: {} };

                technique.uniforms["_NormalTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: {} };
                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {} };
                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: {} };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRAY };
                technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };

                const shader = new egret3d.Shader("shader/lambert");
                shader.vertShader = { name: "def_lambert_vs", src: egret3d.DefaultShaders.findShader("def_lambert_vs") };
                shader.fragShader = { name: "def_lambert_fs", src: egret3d.DefaultShaders.findShader("def_lambert_fs") };

                const template = { name: "shader/lambert", technique, material, shader };

                this.registerTechnique(template);
            }

            {
                const material: GLTFMaterial = { name: "diffuse.shader.json", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: "diffuse.shader.json", attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {} };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRID };
                technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };

                const shader = new egret3d.Shader("diffuse.shader.json");
                shader.vertShader = { name: "def_diffuse_vs", src: egret3d.DefaultShaders.findShader("def_diffuse_vs") };
                shader.fragShader = { name: "def_diffuse_fs", src: egret3d.DefaultShaders.findShader("def_diffuse_fs") };

                const template = { name: "diffuse.shader.json", technique, material, shader };

                this.registerTechnique(template);
            }
        }
    }
}