namespace egret3d {
    //TODO 本身应该是gltf资源的一部分，先放这里
    /**
     * @internal
     */
    export type TechniqueTemplate = { name: string, technique: gltf.Technique, material: GLTFMaterial };
    /**
     * @internal
     */
    export class DefaultTechnique {
        private static _inited: boolean = false;
        public static readonly techniqueTemplates: { [key: string]: TechniqueTemplate } = {};

        public static registerTechnique(technique: gltf.Technique, material: GLTFMaterial) {
            //
            const template = { name: "shader/lambert", technique, material, shader: egret3d.DefaultShaders.LAMBERT };
            for (const key in technique.attributes) {
                const att = technique.attributes[key];
                technique.attributes[key] = { semantic: att.semantic, extensions: { paper: { enable: true, location: -1 } } };
            }
            for (var key in technique.uniforms) {
                const uniform = technique.uniforms[key];
                technique.uniforms[key] = { type: uniform.type, semantic: uniform.semantic, value: uniform.value, extensions: { paper: { enable: false, location: -1 } } };
            }

            this.techniqueTemplates[technique.name] = template;
        }

        public static findTechniqueTemplate(name: string) {
            if (this.techniqueTemplates[name]) {
                return this.techniqueTemplates[name];
            }

            console.error("没有找到对应的Technique:" + name);
            return null;
        }

        public static createTechnique(source: gltf.Technique) {
            const target: gltf.Technique = { name: source.name, attributes: {}, uniforms: {}, states: { enable: [], functions: {} } };
            for (const key in source.attributes) {
                const attribute = source.attributes[key];
                target.attributes[key] = { semantic: attribute.semantic, extensions: { paper: { enable: true, location: -1 } } };
            }
            for (const key in source.uniforms) {
                const uniform = source.uniforms[key];
                target.uniforms[key] = { type: uniform.type, semantic: uniform.semantic, value: uniform.value, extensions: { paper: { enable: false, location: -1 } } };
                if (Array.isArray(uniform.value)) {
                    target.uniforms[key].value = [];
                    target.uniforms[key].value.length = uniform.value.length;
                    for (let i = 0; i < uniform.value.length; i++) {
                        target.uniforms[key].value[i] = uniform.value[i];
                    }
                }
            }
            return target;
        }

        public static createGLTFMaterial(source: GLTFMaterial) {
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

                const technique: gltf.Technique = { name: egret3d.DefaultShaders.LAMBERT.url, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST, gltf.EnableState.CULL_FACE], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesNormal"] = { semantic: gltf.AttributeSemanticType.NORMAL };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
                technique.attributes["_glesBlendIndex4"] = { semantic: gltf.AttributeSemanticType.JOINTS_0 };
                technique.attributes["_glesBlendWeight4"] = { semantic: gltf.AttributeSemanticType.WEIGHTS_0 };

                technique.uniforms["glstate_directionalShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAT, value: [] };
                technique.uniforms["glstate_directionalShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAP, value: [] };
                technique.uniforms["glstate_directLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._DIRECTLIGHTS, value: [] };
                technique.uniforms["glstate_pointShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_CUBE, semantic: gltf.UniformSemanticType._POINTSHADOWMAP, value: [] };
                technique.uniforms["glstate_pointLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._POINTLIGHTS, value: [] };
                technique.uniforms["glstate_spotShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._SPOTSHADOWMAT, value: [] };
                technique.uniforms["glstate_spotShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: [] };
                technique.uniforms["glstate_spotLights[0]"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._SPOTLIGHTS, value: [] };
                technique.uniforms["glstate_vec4_bones[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._BONESVEC4, value: [] };

                technique.uniforms["_NormalTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: {} };
                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: [] };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRAY };
                technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };

                this.registerTechnique(technique, material);
            }

            {
                const material: GLTFMaterial = { name: "diffuse.shader.json", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: egret3d.DefaultShaders.DIFFUSE.url, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST, gltf.EnableState.CULL_FACE], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
                technique.attributes["_glesBlendIndex4"] = { semantic: gltf.AttributeSemanticType.JOINTS_0 };
                technique.attributes["_glesBlendWeight4"] = { semantic: gltf.AttributeSemanticType.WEIGHTS_0 };

                technique.uniforms["glstate_lightmapOffset"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._LIGHTMAPOFFSET, value: [] };
                technique.uniforms["glstate_lightmapUV"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPUV, value: {} };
                technique.uniforms["_LightmapTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._LIGHTMAPTEX, value: {} };
                technique.uniforms["_LightmapIntensity"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPINTENSITY, value: 1.0 };
                technique.uniforms["glstate_vec4_bones[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._BONESVEC4, value: [] };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: egret3d.DefaultTextures.GRAY };
                technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };
                technique.uniforms["_AlphaCut"] = { type: gltf.UniformType.FLOAT, value: 0 };

                this.registerTechnique(technique, material);
            }

            {
                const material: GLTFMaterial = { name: "shader/diffuse_tintcolor", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: egret3d.DefaultShaders.DIFFUSE_TINT_COLOR.url, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST, gltf.EnableState.CULL_FACE], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
                technique.attributes["_glesBlendIndex4"] = { semantic: gltf.AttributeSemanticType.JOINTS_0 };
                technique.attributes["_glesBlendWeight4"] = { semantic: gltf.AttributeSemanticType.WEIGHTS_0 };

                technique.uniforms["glstate_lightmapOffset"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._LIGHTMAPOFFSET, value: [] };
                technique.uniforms["glstate_lightmapUV"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPUV, value: {} };
                technique.uniforms["_LightmapTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._LIGHTMAPTEX, value: {} };
                technique.uniforms["_LightmapIntensity"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPINTENSITY, value: 1.0 };
                technique.uniforms["glstate_vec4_bones[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._BONESVEC4, value: [] };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: egret3d.DefaultTextures.GRAY };
                technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };
                technique.uniforms["_AlphaCut"] = { type: gltf.UniformType.FLOAT, value: 0 };
                technique.uniforms["_TintColor"] = { type: gltf.UniformType.FLOAT_VEC4, value: [] };

                this.registerTechnique(technique, material);
            }

            {
                const material: GLTFMaterial = { name: "particles.shader.json", alphaMode: "BLEND", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: egret3d.DefaultShaders.PARTICLE.url, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.BLEND, gltf.EnableState.DEPTH_TEST, gltf.EnableState.CULL_FACE], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [false], frontFace: [gltf.FrontFace.CCW], blendEquationSeparate: [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD], blendFuncSeparate: [gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE] } } };
                technique.attributes["_glesCorner"] = { semantic: gltf.AttributeSemanticType._CORNER };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesColor"] = { semantic: gltf.AttributeSemanticType.COLOR_0 };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
                technique.attributes["_startPosition"] = { semantic: gltf.AttributeSemanticType._START_POSITION };
                technique.attributes["_startVelocity"] = { semantic: gltf.AttributeSemanticType._START_VELOCITY };
                technique.attributes["_startColor"] = { semantic: gltf.AttributeSemanticType._START_COLOR };
                technique.attributes["_startSize"] = { semantic: gltf.AttributeSemanticType._START_SIZE };
                technique.attributes["_startRotation"] = { semantic: gltf.AttributeSemanticType._START_ROTATION };
                technique.attributes["_time"] = { semantic: gltf.AttributeSemanticType._TIME };
                technique.attributes["_random0"] = { semantic: gltf.AttributeSemanticType._RANDOM0 };
                technique.attributes["_random1"] = { semantic: gltf.AttributeSemanticType._RANDOM1 };
                technique.attributes["_startWorldPosition"] = { semantic: gltf.AttributeSemanticType._START_POSITION };
                technique.attributes["_startWorldRotation"] = { semantic: gltf.AttributeSemanticType._START_ROTATION };

                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: egret3d.DefaultTextures.GRAY };
                technique.uniforms["_TintColor"] = { type: gltf.UniformType.FLOAT_VEC4, value: [0.5, 0.5, 0.5, 0.5] };

                technique.uniforms["u_currentTime"] = { type: gltf.UniformType.FLOAT, value: 0 };
                technique.uniforms["u_gravity"] = { type: gltf.UniformType.FLOAT_VEC3, value: [0, 0, 0] };
                technique.uniforms["u_worldPosition"] = { type: gltf.UniformType.FLOAT_VEC3, value: [0, 0, 0] };
                technique.uniforms["u_worldRotation"] = { type: gltf.UniformType.FLOAT_VEC4, value: [0, 0, 0, 1] };
                technique.uniforms["u_startRotation3D"] = { type: gltf.UniformType.BOOL, value: false };
                technique.uniforms["u_scalingMode"] = { type: gltf.UniformType.Int, value: 0 };
                technique.uniforms["u_positionScale"] = { type: gltf.UniformType.FLOAT_VEC3, value: [1, 1, 1] };
                technique.uniforms["u_sizeScale"] = { type: gltf.UniformType.FLOAT_VEC3, value: [1, 1, 1] };
                technique.uniforms["glstate_matrix_vp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._VIEWPROJECTION, value: [] };

                technique.uniforms["glstate_cameraPos"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._CAMERA_POS, value: [] };
                technique.uniforms["glstate_cameraForward"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._CAMERA_FORWARD, value: [] };
                technique.uniforms["glstate_cameraUp"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._CAMERA_UP, value: [] };
                technique.uniforms["u_lengthScale"] = { type: gltf.UniformType.FLOAT, value: [1, 1, 1] };
                technique.uniforms["u_speeaScale"] = { type: gltf.UniformType.FLOAT, value: [1, 1, 1] };
                technique.uniforms["u_simulationSpace"] = { type: gltf.UniformType.Int, value: 0 };
                technique.uniforms["u_spaceType"] = { type: gltf.UniformType.Int, value: 0 };
                technique.uniforms["u_velocityConst"] = { type: gltf.UniformType.FLOAT_VEC3, value: [1, 1, 1] };
                technique.uniforms["u_velocityCurveX[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_velocityCurveY[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_velocityCurveZ[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_velocityConstMax"] = { type: gltf.UniformType.FLOAT_VEC3, value: [] };
                technique.uniforms["u_velocityCurveMaxX[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_velocityCurveMaxY[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_velocityCurveMaxZ[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_colorGradient[0]"] = { type: gltf.UniformType.FLOAT_VEC4, value: [] };
                technique.uniforms["u_alphaGradient[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_colorGradientMax[0]"] = { type: gltf.UniformType.FLOAT_VEC4, value: [] };
                technique.uniforms["u_alphaGradientMax[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurve[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurveMax[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurveX[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurveY[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurveZ[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurveMaxX[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurveMaxY[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_sizeCurveMaxZ[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationConst"] = { type: gltf.UniformType.FLOAT, value: 0 };
                technique.uniforms["u_rotationConstMax"] = { type: gltf.UniformType.FLOAT, value: 0 };
                technique.uniforms["u_rotationCurve[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveMax[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationConstSeprarate"] = { type: gltf.UniformType.FLOAT_VEC3, value: [] };
                technique.uniforms["u_rotationConstMaxSeprarate"] = { type: gltf.UniformType.FLOAT_VEC3, value: [] };
                technique.uniforms["u_rotationCurveX[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveY[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveZ[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveW[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveMaxX[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveMaxY[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveMaxZ[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_rotationCurveMaxW[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_cycles"] = { type: gltf.UniformType.FLOAT, value: {} };
                technique.uniforms["u_subUV"] = { type: gltf.UniformType.FLOAT_VEC4, value: [] };
                technique.uniforms["u_uvCurve[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };
                technique.uniforms["u_uvCurveMax[0]"] = { type: gltf.UniformType.FLOAT_VEC2, value: [] };

                this.registerTechnique(technique, material);
            }

            {
                const material: GLTFMaterial = { name: "shader/depth", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: egret3d.DefaultShaders.SHADOW_DEPTH.url, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                this.registerTechnique(technique, material);
            }

            {
                const material: GLTFMaterial = { name: "shader/distance", alphaMode: "OPAQUE", doubleSided: false, extensions: { KHR_techniques_webgl: { technique: -1 } } };

                const technique: gltf.Technique = { name: egret3d.DefaultShaders.SHADOW_DISTANCE.url, attributes: {}, uniforms: {}, states: { enable: [gltf.EnableState.DEPTH_TEST], functions: { depthFunc: [gltf.DepthFunc.LEQUAL], depthMask: [true], frontFace: [gltf.FrontFace.CCW] } } };
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: [] };
                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                technique.uniforms["glstate_referencePosition"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._REFERENCEPOSITION, value: [] };
                technique.uniforms["glstate_nearDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._NEARDICTANCE, value: {} };
                technique.uniforms["glstate_farDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._FARDISTANCE, value: {} };

                this.registerTechnique(technique, material);
            }
        }
    }
}