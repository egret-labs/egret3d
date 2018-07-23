namespace egret3d {
    //TODO 本身应该是gltf资源的一部分，先放这里
    /**
     * @internal
     */
    export type TechniqueTemplate = { name: string, technique: gltf.Technique, material: GLTFMaterial, shader: Shader };
    /**
     * @internal
     */
    export class DefaultTechnique {
        private static _inited: boolean = false;
        public static readonly techniqueTemplates: { [key: string]: TechniqueTemplate } = {};

        public static registerTechnique(template: TechniqueTemplate) {
            //
            // const technique = template.technique;
            // for (const key in technique.attributes) {
            //     const att = technique.attributes[key];
            //     technique.attributes[key] = { semantic: att.semantic, extensions: { paper: { enable: true, location: -1 } } };
            // }
            // for (var key in technique.uniforms) {
            //     const uniform = technique.uniforms[key];
            //     technique.uniforms[key] = { type: uniform.type, semantic: uniform.semantic, value: uniform.value, extensions: { paper: { dirty: true, enable: false, location: -1 } } };
            // }

            this.techniqueTemplates[template.name] = template;
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
                technique.attributes["_glesBlendIndex4"] = { semantic: gltf.AttributeSemanticType.JOINT };
                technique.attributes["_glesBlendWeight4"] = { semantic: gltf.AttributeSemanticType.WEIGHT };

                technique.uniforms["glstate_directionalShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAT, value: {} };
                technique.uniforms["glstate_directionalShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAP, value: {} };
                technique.uniforms["glstate_directLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._DIRECTLIGHTS, value: {} };
                technique.uniforms["glstate_pointShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_CUBE, semantic: gltf.UniformSemanticType._POINTSHADOWMAP, value: {} };
                technique.uniforms["glstate_pointLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._POINTLIGHTS, value: {} };
                technique.uniforms["glstate_spotShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._SPOTSHADOWMAT, value: {} };
                technique.uniforms["glstate_spotShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: {} };
                technique.uniforms["glstate_spotLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._SPOTLIGHTS, value: {} };
                technique.uniforms["glstate_vec4_bones[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._BONESVEC4, value: {} };

                technique.uniforms["_NormalTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: {} };
                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {} };
                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: {} };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRAY };
                technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };

                const template = { name: "shader/lambert", technique, material, shader: egret3d.DefaultShaders.LAMBERT };

                this.registerTechnique(template);
            }

            {
                const material: GLTFMaterial = { name: "diffuse.shader.json", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: "diffuse.shader.json", attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
                technique.attributes["_glesBlendIndex4"] = { semantic: gltf.AttributeSemanticType.JOINT };
                technique.attributes["_glesBlendWeight4"] = { semantic: gltf.AttributeSemanticType.WEIGHT };

                technique.uniforms["glstate_lightmapOffset"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._LIGHTMAPOFFSET, value: {} };
                technique.uniforms["glstate_lightmapUV"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPUV, value: {} };
                technique.uniforms["_LightmapTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._LIGHTMAPTEX, value: {} };
                technique.uniforms["_LightmapIntensity"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPINTENSITY, value: {} };
                technique.uniforms["glstate_vec4_bones[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._BONESVEC4, value: {} };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {} };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRID };
                technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };
                technique.uniforms["_AlphaCut"] = { type: gltf.UniformType.FLOAT, value: 0 };
                const template = { name: "diffuse.shader.json", technique, material, shader: egret3d.DefaultShaders.DIFFUSE };

                this.registerTechnique(template);
            }

            {
                const material: GLTFMaterial = { name: "shader/depth", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: "shader/depth", attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {} };

                const template = { name: "shader/depth", technique, material, shader: egret3d.DefaultShaders.SHADOW_DEPTH };

                this.registerTechnique(template);
            }

            {
                const material: GLTFMaterial = { name: "shader/distance", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: "shader/distance", attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: {} };
                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: {} };
                
                technique.uniforms["glstate_referencePosition"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._REFERENCEPOSITION, value: {} };
                technique.uniforms["glstate_nearDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._NEARDICTANCE, value: {} };
                technique.uniforms["glstate_farDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._FARDISTANCE, value: {} };

                const template = { name: "shader/distance", technique, material, shader: egret3d.DefaultShaders.SHADOW_DISTANCE };

                this.registerTechnique(template);
            }
        }
    }
}