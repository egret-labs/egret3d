namespace egret3d {
    /**
     * @private
     */
    enum BlendModeEnum {
        Close,
        Blend,
        Blend_PreMultiply,
        Add,
        Add_PreMultiply,
    }

    export class DefaultShaders {

        // public static DIFFUSE_VERT_COLOR: Shader;
        // public static LAMBERT_NORMAL: Shader;

        public static SHADOW_DEPTH: GLTFAsset;
        public static SHADOW_DISTANCE: GLTFAsset;
        public static LINE: GLTFAsset;
        public static DIFFUSE: GLTFAsset;
        public static DIFFUSE_TINT_COLOR: GLTFAsset;
        public static DIFFUSE_BOTH_SIDE: GLTFAsset;
        public static TRANSPARENT: GLTFAsset;
        public static TRANSPARENT_ALPHACUT: GLTFAsset;
        public static TRANSPARENT_TINTCOLOR: GLTFAsset;
        public static TRANSPARENT_ADDITIVE: GLTFAsset;
        public static TRANSPARENT_BOTH_SIDE: GLTFAsset;
        public static TRANSPARENT_ADDITIVE_BOTH_SIDE: GLTFAsset;
        public static LAMBERT: GLTFAsset;
        public static GIZMOS_COLOR: GLTFAsset;
        public static MATERIAL_COLOR: GLTFAsset;
        public static VERT_COLOR: GLTFAsset;
        public static PARTICLE: GLTFAsset;
        public static PARTICLE_ADDITIVE: GLTFAsset;
        public static PARTICLE_ADDITIVE_PREMYLTIPLY: GLTFAsset;
        public static PARTICLE_BLEND: GLTFAsset;
        public static PARTICLE_BLEND_PREMYLTIPLY: GLTFAsset;

        private static _inited: boolean = false;

        public static createBuildinShader(url: string, vertName: string, vertSource: string, fragName: string, fragSource: string, renderQueue: number) {
            const asset = GLTFAsset.createGLTFExtensionsAsset(url);

            const KHRExtensions = asset.config.extensions.KHR_techniques_webgl;

            KHRExtensions.shaders.push({ type: gltf.ShaderStage.VERTEX_SHADER, name: vertName, uri: vertSource });
            KHRExtensions.shaders.push({ type: gltf.ShaderStage.FRAGMENT_SHADER, name: fragName, uri: fragSource });
            KHRExtensions.techniques.push({ attributes: {}, uniforms: {}, states: { enable: [], functions: {} } } as any);

            asset.config.extensions.paper = { renderQueue };

            return asset;
        }

        private static _setBlend(technique: gltf.Technique, blend: BlendModeEnum) {
            const funs = technique.states.functions;
            const enables = technique.states.enable;
            switch (blend) {
                case BlendModeEnum.Add:
                    funs.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    funs.blendFuncSeparate = [gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE];
                    break;
                case BlendModeEnum.Add_PreMultiply:
                    funs.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    funs.blendFuncSeparate = [gltf.BlendFactor.ONE, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE];
                    break;
                case BlendModeEnum.Blend:
                    funs.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    funs.blendFuncSeparate = [gltf.BlendFactor.SRC_ALPHA, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_SRC_ALPHA];
                    break;
                case BlendModeEnum.Blend_PreMultiply:
                    funs.blendEquationSeparate = [gltf.BlendEquation.FUNC_ADD, gltf.BlendEquation.FUNC_ADD];
                    funs.blendFuncSeparate = [gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_CONSTANT_ALPHA, gltf.BlendFactor.ONE, gltf.BlendFactor.ONE_MINUS_CONSTANT_ALPHA];
                    break;
                default:
                    delete funs.blendEquationSeparate;
                    delete funs.blendFuncSeparate;
                    break;
            }
            const index = enables.indexOf(gltf.EnableState.BLEND);
            if (blend === BlendModeEnum.Close) {
                if (index >= 0) {
                    enables.splice(index, 1);
                }
            }
            else {
                if (index < 0) {
                    enables.push(gltf.EnableState.BLEND);
                }
            }
        }

        private static _setCullFace(technique: gltf.Technique, cull: boolean, frontFace?: gltf.FrontFace, cullFace?: gltf.CullFace) {
            const funs = technique.states.functions;
            const enables = technique.states.enable;
            const index = enables.indexOf(gltf.EnableState.CULL_FACE);
            if (cull && frontFace && cullFace) {
                funs.frontFace = [frontFace];
                funs.cullFace = [cullFace];
                if (index < 0) {
                    enables.push(gltf.EnableState.CULL_FACE);
                }
            }
            else {
                delete funs.frontFace;
                delete funs.cullFace;

                if (index >= 0) {
                    enables.splice(index, 1);
                }
            }
        }

        private static _setDepth(technique: gltf.Technique, zTest: boolean, zWrite: boolean) {
            const funs = technique.states.functions;
            const enables = technique.states.enable;
            const index = enables.indexOf(gltf.EnableState.DEPTH_TEST);
            if (zTest) {
                if (index < 0) {
                    enables.push(gltf.EnableState.DEPTH_TEST);
                }
                funs.depthFunc = [gltf.DepthFunc.LEQUAL];
            }
            else {
                if (index >= 0) {
                    enables.splice(index, 1);
                }
            }
            if (zWrite) {
                funs.depthMask = [true];
            }
            else {
                funs.depthMask = [false];
            }
        }

        private static _createColorShaderTemplate(url: string) {
            const shader = this.createBuildinShader(url, "color_vs", ShaderLib.materialcolor_vert, "color_fs", ShaderLib.line_frag, RenderQueue.Geometry);

            const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
            technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

            technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
            technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };

            return shader;
        }

        private static _createDiffuseShaderTemplate(url: string) {
            const shader = this.createBuildinShader(url, "diffuse_vs", ShaderLib.diffuse_vert, "diffuse_fs", ShaderLib.diffuse_frag, RenderQueue.Geometry);
            const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];

            technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
            technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
            technique.attributes["_glesBlendIndex4"] = { semantic: gltf.AttributeSemanticType.JOINTS_0 };
            technique.attributes["_glesBlendWeight4"] = { semantic: gltf.AttributeSemanticType.WEIGHTS_0 };

            technique.uniforms["glstate_lightmapOffset"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._LIGHTMAPOFFSET, value: [] };
            technique.uniforms["glstate_lightmapUV"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPUV, value: {} };
            technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
            technique.uniforms["glstate_vec4_bones[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._BONESVEC4, value: [] };

            technique.uniforms["_LightmapTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._LIGHTMAPTEX, value: {} };
            technique.uniforms["_LightmapIntensity"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPINTENSITY, value: 1.0 };
            technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: egret3d.DefaultTextures.GRAY };
            technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };
            technique.uniforms["_AlphaCut"] = { type: gltf.UniformType.FLOAT, value: 0 };

            return shader;
        }

        private static _createLambertShaderTemplate() {
            const shader = this.createBuildinShader("buildin/lambert.shader.gltf", "lambert_vs", ShaderLib.lambert_vert, "lambert_fs", ShaderLib.lambert_frag, RenderQueue.Geometry);

            const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
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
            technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
            technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: [] };

            technique.uniforms["_NormalTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: {} };
            technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRAY };
            technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };
            return shader;
        }

        private static _createParticleShaderTemplate(url: string) {
            const shader = this.createBuildinShader(url, "particle_vs", ShaderLib.particlesystem_vert, "particle_fs", ShaderLib.particlesystem_frag, RenderQueue.Transparent);

            const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
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
            technique.attributes["_startWorldPosition"] = { semantic: gltf.AttributeSemanticType._WORLD_POSITION };
            technique.attributes["_startWorldRotation"] = { semantic: gltf.AttributeSemanticType._WORLD_ROTATION };

            technique.uniforms["glstate_matrix_vp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._VIEWPROJECTION, value: [] };
            technique.uniforms["glstate_cameraPos"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._CAMERA_POS, value: [] };
            technique.uniforms["glstate_cameraForward"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._CAMERA_FORWARD, value: [] };
            technique.uniforms["glstate_cameraUp"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._CAMERA_UP, value: [] };

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

            return shader;
        }

        public static init() {
            if (this._inited) {
                return;
            }

            this._inited = true;

            {
                const shader = this.createBuildinShader("buildin/depth.shader.gltf", "depth_vs", ShaderLib.depthpackage_vert, "depth_fs", ShaderLib.depthpackage_frag, RenderQueue.Geometry);
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                //
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;

                this.SHADOW_DEPTH = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this.createBuildinShader("buildin/distance.shader.gltf", "distance_vs", ShaderLib.distancepackage_vert, "distance_fs", ShaderLib.distancepackage_frag, RenderQueue.Geometry);
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: [] };
                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                technique.uniforms["glstate_referencePosition"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._REFERENCEPOSITION, value: [] };
                technique.uniforms["glstate_nearDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._NEARDICTANCE, value: {} };
                technique.uniforms["glstate_farDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._FARDISTANCE, value: {} };

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;

                this.SHADOW_DISTANCE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this.createBuildinShader("buildin/line.shader.gltf", "line_vs", ShaderLib.line_vert, "line_fs", ShaderLib.line_frag, RenderQueue.Geometry);
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesColor"] = { semantic: gltf.AttributeSemanticType.COLOR_0 };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;

                this.LINE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/diffuse.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;

                this.DIFFUSE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/diffuse_tintcolor.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;
                this.DIFFUSE_TINT_COLOR = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/diffuse_bothside.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;
                this.DIFFUSE_BOTH_SIDE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Blend);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.TRANSPARENT = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_tintColor.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Add);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.TRANSPARENT_TINTCOLOR = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_alphaCut.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.TRANSPARENT_ALPHACUT = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_additive.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Add);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.TRANSPARENT_ADDITIVE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_additive_bothside.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.TRANSPARENT_ADDITIVE_BOTH_SIDE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_bothside.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.TRANSPARENT_ADDITIVE_BOTH_SIDE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createLambertShaderTemplate();
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;

                this.LAMBERT = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createColorShaderTemplate("buildin/gizmos.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];

                this._setDepth(technique, false, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Blend);
                shader.config.extensions.paper.renderQueue = RenderQueue.Overlay;

                this.GIZMOS_COLOR = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createColorShaderTemplate("buildin/materialcolor.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;

                this.MATERIAL_COLOR = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this.createBuildinShader("buildin/vertcolor.shader.gltf", "vertcolor_vs", ShaderLib.vertcolor_vert, "vertcolor_fs", ShaderLib.vertcolor_frag, RenderQueue.Geometry);

                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesNormal"] = { semantic: gltf.AttributeSemanticType.NORMAL };
                technique.attributes["_glesColor"] = { semantic: gltf.AttributeSemanticType.COLOR_0 };
                technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: {} };
                technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_MAT4, value: {} };

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;

                this.VERT_COLOR = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particle.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                //
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);

                this.PARTICLE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particles_additive.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.PARTICLE_ADDITIVE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particles_additive_premultiply.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add_PreMultiply);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.PARTICLE_ADDITIVE_PREMYLTIPLY = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particles_blend1.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                //
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);
                technique.states.functions.depthFunc = [gltf.DepthFunc.EQUAL];//TODO
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                paper.Asset.register(shader);
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particles_blend.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.PARTICLE_BLEND = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particles_blend_premultiply.shader.gltf");
                const technique = shader.config.extensions.KHR_techniques_webgl.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend_PreMultiply);
                shader.config.extensions.paper.renderQueue = RenderQueue.Transparent;

                this.PARTICLE_BLEND_PREMYLTIPLY = shader;
                paper.Asset.register(shader);
            }

        }

        // public static init2() {
        //     if (this._inited) {
        //         return;
        //     }

        //     this._inited = true;


        //     //
        //     const def_code_vs = Shader.registerVertShader("def_code", ShaderLib.code_vert);
        //     const def_code_fs = Shader.registerFragShader("def_code", ShaderLib.code_frag);
        //     const def_code2_fs = Shader.registerFragShader("def_code2", ShaderLib.code2_frag);
        //     const def_ui_fs = Shader.registerFragShader("def_ui", ShaderLib.ui_frag);
        //     const def_uifont_vs = Shader.registerVertShader("def_uifont", ShaderLib.uifont_vert);
        //     const def_uifont_fs = Shader.registerFragShader("def_uifont", ShaderLib.uifont_frag);
        //     const def_diffuse_vs = Shader.registerVertShader("def_diffuse", ShaderLib.diffuse_vert);
        //     const def_diffuse_fs = Shader.registerFragShader("def_diffuse", ShaderLib.diffuse_frag);
        //     const def_boneeff_vs = Shader.registerVertShader("def_boneeff", ShaderLib.boneeff_vert);
        //     const def_bonelambert_vs = Shader.registerVertShader("def_bonelambert_vert", ShaderLib.bonelambert_vert);
        //     const def_diffuselightmap_vs = Shader.registerVertShader("def_diffuselightmap", ShaderLib.diffuselightmap_vert);
        //     const def_diffuselightmap_fs = Shader.registerFragShader("def_diffuselightmap", ShaderLib.diffuselightmap_frag);
        //     const def_postquad_vs = Shader.registerVertShader("def_postquad", ShaderLib.postquad_vert);
        //     const def_postquaddepth_fs = Shader.registerFragShader("def_postquaddepth", ShaderLib.postquaddepth_frag);
        //     const def_postdepth_vs = Shader.registerVertShader("def_postdepth", ShaderLib.postdepth_vert);
        //     const def_postdepth_fs = Shader.registerFragShader("def_postdepth", ShaderLib.postdepth_frag);
        //     const def_line_vs = Shader.registerVertShader("def_line", ShaderLib.line_vert);
        //     const def_line_fs = Shader.registerFragShader("def_line", ShaderLib.line_frag);
        //     const def_materialcolor_vs = Shader.registerVertShader("def_materialcolor", ShaderLib.materialcolor_vert);

        //     const def_diffusetintcolor_fs = Shader.registerFragShader("def_diffusetintcolor", ShaderLib.tintcolor_frag);
        //     const def_diffusevertcolor_vs = Shader.registerVertShader("def_diffusevertcolor", ShaderLib.vertcolor_vert);
        //     const def_diffusevertcolor_fs = Shader.registerFragShader("def_diffusevertcolor", ShaderLib.vertcolor_frag);

        //     const def_lambert_vs = Shader.registerVertShader("def_lambert", ShaderLib.lambert_vert);
        //     const def_lambert_fs = Shader.registerFragShader("def_lambert", ShaderLib.lambert_frag);

        //     const def_lambertnormal_vs = Shader.registerVertShader("def_lambertnormal", "#define USE_NORMAL_MAP \n" + ShaderLib.lambert_vert);
        //     const def_lambertnormal_fs = Shader.registerFragShader("def_lambertnormal", "#define USE_NORMAL_MAP \n" + ShaderLib.lambert_frag);

        //     const def_depthpackage_vs = Shader.registerVertShader("def_depthpackage", ShaderLib.depthpackage_vert); // non-linear
        //     const def_depthpackage_fs = Shader.registerFragShader("def_depthpackage", ShaderLib.depthpackage_frag);

        //     const def_distancepackage_vs = Shader.registerVertShader("def_depthpackage", ShaderLib.distancepackage_vert); // linear
        //     const def_distancepackage_fs = Shader.registerFragShader("def_depthpackage", ShaderLib.distancepackage_frag);

        //     const def_particlesystem_vs = Shader.registerVertShader("def_particlesystem", "#define DIFFUSEMAP \n#define TINTCOLOR \n" + ShaderLib.particlesystem_vert);
        //     const def_particlesystem_fs = Shader.registerFragShader("def_particlesystem", "#define DIFFUSEMAP \n#define TINTCOLOR \n" + ShaderLib.particlesystem_frag);

        //     const def_alphaBlend_fs = Shader.registerFragShader("def_alphaBlend", ShaderLib.alphaBlend_frag);
        //     const def_alphaCut_fs = Shader.registerFragShader("def_alphaCut", ShaderLib.alphaCut_frag);

        //     {
        //         const shader = new Shader("shader/lambert");
        //         shader.renderQueue = RenderQueue.Geometry;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_Color"] = { type: "Vector4", value: [1, 1, 1, 1] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_lambert_vs, def_lambert_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.LEQUAL;
        //         renderPass.state_zwrite = true;
        //         renderPass.state_showface = ShowFaceStateEnum.CCW;
        //         renderPass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["base"].push(renderPass);

        //         shader.passes["base_depth_package"] = [];
        //         const depthPass = new DrawPass(def_depthpackage_vs, def_depthpackage_fs);
        //         depthPass.state_ztest = true;
        //         depthPass.state_ztest_method = WebGLKit.LEQUAL;
        //         depthPass.state_zwrite = true;
        //         depthPass.state_showface = ShowFaceStateEnum.CCW;
        //         depthPass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["base_depth_package"].push(depthPass);

        //         shader.passes["base_distance_package"] = [];
        //         const distancePass = new DrawPass(def_distancepackage_vs, def_distancepackage_fs);
        //         distancePass.state_ztest = true;
        //         distancePass.state_ztest_method = WebGLKit.LEQUAL;
        //         distancePass.state_zwrite = true;
        //         distancePass.state_showface = ShowFaceStateEnum.CCW;
        //         distancePass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["base_distance_package"].push(distancePass);

        //         const skinPass = new DrawPass(def_bonelambert_vs, def_lambert_fs);
        //         shader.passes["skin"] = [];
        //         skinPass.state_ztest = true;
        //         skinPass.state_ztest_method = WebGLKit.LEQUAL;
        //         skinPass.state_zwrite = true;
        //         skinPass.state_showface = ShowFaceStateEnum.CCW;
        //         skinPass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["skin"].push(skinPass);

        //         this.LAMBERT = shader;

        //         paper.Asset.register(shader);
        //     }
        //     {
        //         const shader = new Shader("shader/lambertnormal");
        //         shader.renderQueue = RenderQueue.Geometry;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_Color"] = { type: "Vector4", value: [1, 1, 1, 1] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_lambertnormal_vs, def_lambertnormal_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.LEQUAL;
        //         renderPass.state_zwrite = true;
        //         renderPass.state_showface = ShowFaceStateEnum.CCW;
        //         renderPass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["base"].push(renderPass);

        //         shader.passes["base_depth_package"] = [];
        //         const depthPass = new DrawPass(def_depthpackage_vs, def_depthpackage_fs);
        //         depthPass.state_ztest = true;
        //         depthPass.state_ztest_method = WebGLKit.LEQUAL;
        //         depthPass.state_zwrite = true;
        //         depthPass.state_showface = ShowFaceStateEnum.CCW;
        //         depthPass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["base_depth_package"].push(depthPass);

        //         shader.passes["base_distance_package"] = [];
        //         const distancePass = new DrawPass(def_distancepackage_vs, def_distancepackage_fs);
        //         distancePass.state_ztest = true;
        //         distancePass.state_ztest_method = WebGLKit.LEQUAL;
        //         distancePass.state_zwrite = true;
        //         distancePass.state_showface = ShowFaceStateEnum.CCW;
        //         distancePass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["base_distance_package"].push(distancePass);

        //         this.LAMBERT_NORMAL = shader;

        //         paper.Asset.register(shader);
        //     }
        //     {
        //         const sh = new Shader("shader/def");
        //         sh.renderQueue = RenderQueue.Geometry;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         // p.setProgram(diffuseProgram);
        //         p.setAlphaBlend(BlendModeEnum.Close);
        //         // p.uniformTexture("_MainTex", null);

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 transparent.shader.gltf
        //         const sh = new Shader("transparent.shader.gltf");
        //         sh.renderQueue = RenderQueue.Transparent;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         // p.setProgram(diffuseProgram);
        //         p.setAlphaBlend(BlendModeEnum.Blend);
        //         // p.uniformTexture("_MainTex", null);
        //         this.TRANSPARENT = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 transparent_tintColor.shader.gltf
        //         const sh = new Shader("transparent_tintColor.shader.gltf");
        //         sh.renderQueue = RenderQueue.Transparent;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_TintColor"] = { type: "Vector4", value: [0.5, 0.5, 0.5, 0.5] };
        //         const p = new DrawPass(def_diffuse_vs, def_alphaBlend_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = false;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         p.setAlphaBlend(BlendModeEnum.Add);
        //         this.TRANSPARENT_ADDITIVE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 transparent_tintColor.shader.gltf
        //         const sh = new Shader("transparent_alphaCut.shader.gltf");
        //         sh.renderQueue = RenderQueue.AlphaTest;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         const p = new DrawPass(def_diffuse_vs, def_alphaCut_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         p.setAlphaBlend(BlendModeEnum.Close);
        //         this.TRANSPARENT_ADDITIVE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 transparent_additive.shader.gltf
        //         const sh = new Shader("transparent_additive.shader.gltf");
        //         sh.renderQueue = RenderQueue.Transparent;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = false;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         // p.setProgram(diffuseProgram);
        //         p.setAlphaBlend(BlendModeEnum.Add);
        //         // p.uniformTexture("_MainTex", null);
        //         this.TRANSPARENT_ADDITIVE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 transparent_additive_bothside.shader.gltf
        //         const sh = new Shader("transparent_additive_bothside.shader.gltf");
        //         sh.renderQueue = RenderQueue.Transparent;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = false;
        //         p.state_showface = ShowFaceStateEnum.ALL;
        //         // p.setProgram(diffuseProgram);
        //         p.setAlphaBlend(BlendModeEnum.Add);
        //         // p.uniformTexture("_MainTex", null);
        //         this.TRANSPARENT_ADDITIVE_BOTH_SIDE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 transparent_bothside.shader.gltf
        //         const sh = new Shader("transparent_bothside.shader.gltf");
        //         sh.renderQueue = RenderQueue.Transparent;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = false;
        //         p.state_showface = ShowFaceStateEnum.ALL;
        //         // p.setProgram(diffuseProgram);
        //         p.setAlphaBlend(BlendModeEnum.Blend);
        //         // p.uniformTexture("_MainTex", null);
        //         this.TRANSPARENT_BOTH_SIDE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 diffuse.shader.gltf
        //         const sh = new Shader("diffuse.shader.gltf");
        //         sh.renderQueue = RenderQueue.Geometry;
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };

        //         const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
        //         sh.passes["base"] = [];
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         p.setAlphaBlend(BlendModeEnum.Close);

        //         const p2 = new DrawPass(def_boneeff_vs, def_diffuse_fs);
        //         sh.passes["skin"] = [];
        //         sh.passes["skin"].push(p2);
        //         p2.state_ztest = true;
        //         p2.state_ztest_method = WebGLKit.LEQUAL;
        //         p2.state_zwrite = true;
        //         p2.state_showface = ShowFaceStateEnum.CCW;
        //         p2.setAlphaBlend(BlendModeEnum.Close);

        //         const p3 = new DrawPass(def_diffuselightmap_vs, def_diffuselightmap_fs);
        //         sh.passes["lightmap"] = [];
        //         sh.passes["lightmap"].push(p3);
        //         p3.state_ztest = true;
        //         p3.state_ztest_method = WebGLKit.LEQUAL;
        //         p3.state_zwrite = true;
        //         p3.state_showface = ShowFaceStateEnum.CCW;
        //         p3.setAlphaBlend(BlendModeEnum.Close);

        //         const p4 = new DrawPass(def_postquad_vs, def_postquaddepth_fs);
        //         sh.passes["quad"] = [];
        //         sh.passes["quad"].push(p4);
        //         p4.state_ztest = true;
        //         p4.state_ztest_method = WebGLKit.LEQUAL;
        //         p4.state_zwrite = true;
        //         p4.state_showface = ShowFaceStateEnum.CCW;
        //         p4.setAlphaBlend(BlendModeEnum.Close);

        //         const p5 = new DrawPass(def_postdepth_vs, def_postdepth_fs);
        //         sh.passes["base_depth"] = [];
        //         sh.passes["base_depth"].push(p5);
        //         p5.state_ztest = true;
        //         p5.state_ztest_method = WebGLKit.LEQUAL;
        //         p5.state_zwrite = true;
        //         p5.state_showface = ShowFaceStateEnum.CCW;
        //         p5.setAlphaBlend(BlendModeEnum.Close);

        //         const p6 = new DrawPass(def_depthpackage_vs, def_depthpackage_fs);
        //         sh.passes["base_depth_package"] = [];
        //         sh.passes["base_depth_package"].push(p6);
        //         p6.state_ztest = false;
        //         p6.state_ztest_method = WebGLKit.LEQUAL;
        //         p6.state_zwrite = false;
        //         p6.state_showface = ShowFaceStateEnum.CCW;
        //         p6.setAlphaBlend(BlendModeEnum.Close);

        //         // p.uniformTexture("_MainTex", null);
        //         this.DIFFUSE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const sh = new Shader("shader/diffuse_tintcolor");
        //         sh.renderQueue = RenderQueue.Geometry;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         sh.defaultValue["_TintColor"] = { type: "Vector4", value: [1, 1, 1, 1] };
        //         const p = new DrawPass(def_diffuse_vs, def_diffusetintcolor_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         // p.setProgram(diffuseProgram);
        //         p.setAlphaBlend(BlendModeEnum.Close);
        //         // p.uniformTexture("_MainTex", null);
        //         this.DIFFUSE_TINT_COLOR = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const sh = new Shader("shader/diffuse_vertcolor");
        //         sh.renderQueue = RenderQueue.Geometry;
        //         sh.passes["base"] = [];
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };
        //         const p = new DrawPass(def_diffusevertcolor_vs, def_diffusevertcolor_fs);
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         // p.setProgram(diffuseProgram);
        //         p.setAlphaBlend(BlendModeEnum.Close);
        //         // p.uniformTexture("_MainTex", null);
        //         this.DIFFUSE_VERT_COLOR = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         // 兼容外部引入的 diffuse_bothside.shader.gltf
        //         const sh = new Shader("diffuse_bothside.shader.gltf");
        //         sh.renderQueue = RenderQueue.Geometry;
        //         // sh.defaultAsset = true;
        //         sh.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRID };
        //         sh.defaultValue["_MainTex_ST"] = { type: "Vector4", value: [1, 1, 0, 0] };
        //         sh.defaultValue["_AlphaCut"] = { type: "Range", value: 0.1, min: 0, max: 1 };

        //         const p = new DrawPass(def_diffuse_vs, def_diffuse_fs);
        //         sh.passes["base"] = [];
        //         sh.passes["base"].push(p);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.ALL;
        //         p.setAlphaBlend(BlendModeEnum.Close);

        //         const p2 = new DrawPass(def_boneeff_vs, def_diffuse_fs);
        //         sh.passes["skin"] = [];
        //         sh.passes["skin"].push(p2);
        //         p2.state_ztest = true;
        //         p2.state_ztest_method = WebGLKit.LEQUAL;
        //         p2.state_zwrite = true;
        //         p2.state_showface = ShowFaceStateEnum.CCW;
        //         p2.setAlphaBlend(BlendModeEnum.Close);

        //         const p3 = new DrawPass(def_diffuselightmap_vs, def_diffuselightmap_fs);
        //         sh.passes["lightmap"] = [];
        //         sh.passes["lightmap"].push(p3);
        //         p3.state_ztest = true;
        //         p3.state_ztest_method = WebGLKit.LEQUAL;
        //         p3.state_zwrite = true;
        //         p3.state_showface = ShowFaceStateEnum.CCW;
        //         p3.setAlphaBlend(BlendModeEnum.Close);

        //         const p4 = new DrawPass(def_postquad_vs, def_postquaddepth_fs);
        //         sh.passes["quad"] = [];
        //         sh.passes["quad"].push(p4);
        //         p4.state_ztest = true;
        //         p4.state_ztest_method = WebGLKit.LEQUAL;
        //         p4.state_zwrite = true;
        //         p4.state_showface = ShowFaceStateEnum.CCW;
        //         p4.setAlphaBlend(BlendModeEnum.Close);

        //         const p5 = new DrawPass(def_postdepth_vs, def_postdepth_fs);
        //         sh.passes["base_depth"] = [];
        //         sh.passes["base_depth"].push(p5);
        //         p5.state_ztest = true;
        //         p5.state_ztest_method = WebGLKit.LEQUAL;
        //         p5.state_zwrite = true;
        //         p5.state_showface = ShowFaceStateEnum.CCW;
        //         p5.setAlphaBlend(BlendModeEnum.Close);

        //         // p.uniformTexture("_MainTex", null);
        //         this.DIFFUSE_BOTH_SIDE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const sh = new Shader("shader/defui");
        //         sh.passes["base"] = [];
        //         const p = new DrawPass(def_code_vs, def_ui_fs);
        //         sh.passes["base"].push(p);
        //         // p.setProgram(program2);
        //         p.state_showface = ShowFaceStateEnum.CW;// ui 只需要显示正面
        //         p.state_ztest = false;
        //         p.state_zwrite = false;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
        //         const p2 = new DrawPass(def_code_vs, def_ui_fs);
        //         sh.passes["base"].push(p2);
        //         // p2.setProgram(program2);
        //         p2.state_showface = ShowFaceStateEnum.ALL;
        //         p2.state_ztest = true;
        //         p2.state_zwrite = false;
        //         p2.state_ztest_method = WebGLKit.LEQUAL;
        //         p2.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
        //         this.UI = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const sh = new Shader("shader/defuifont");
        //         sh.passes["base"] = [];
        //         const p = new DrawPass(def_uifont_vs, def_uifont_fs);
        //         sh.passes["base"].push(p);
        //         // p.setProgram(programuifont);
        //         p.state_showface = ShowFaceStateEnum.CW;
        //         p.state_ztest = false;
        //         p.state_zwrite = false;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
        //         const p2 = new DrawPass(def_uifont_vs, def_uifont_fs);
        //         sh.passes["base"].push(p2);
        //         // p2.setProgram(programuifont);
        //         p2.state_showface = ShowFaceStateEnum.ALL;
        //         p2.state_ztest = true;
        //         p2.state_zwrite = false;
        //         p2.state_ztest_method = WebGLKit.LEQUAL;
        //         p2.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
        //         this.UI_FONT = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const sh = new Shader("line.shader.gltf");
        //         sh.renderQueue = RenderQueue.Geometry;
        //         // sh.defaultAsset = true;
        //         sh.passes["base"] = [];
        //         const p = new DrawPass(def_line_vs, def_line_fs);
        //         sh.passes["base"].push(p);
        //         // p.setProgram(programline);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.ALL;
        //         p.setAlphaBlend(BlendModeEnum.Close);
        //         this.LINE = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const sh = new Shader("materialcolor.shader.gltf");
        //         sh.renderQueue = RenderQueue.Geometry;
        //         sh.defaultValue["_Color"] = { type: "Vector4", value: [1, 1, 1, 1] };
        //         // sh.defaultAsset = true;
        //         sh.passes["base"] = [];
        //         const p = new DrawPass(def_materialcolor_vs, def_line_fs);
        //         sh.passes["base"].push(p);
        //         // p.setProgram(programmaterialcolor);
        //         p.state_ztest = true;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = true;
        //         p.state_showface = ShowFaceStateEnum.ALL;
        //         p.setAlphaBlend(BlendModeEnum.Close);
        //         sh.renderQueue = RenderQueue.Overlay;
        //         this.MATERIAL_COLOR = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const sh = new Shader("gizmos.shader.gltf");
        //         sh.renderQueue = RenderQueue.Overlay;
        //         sh.defaultValue["_Color"] = { type: "Vector4", value: [1, 1, 1, 1] };
        //         // sh.defaultAsset = true;
        //         sh.passes["base"] = [];
        //         const p = new DrawPass(def_materialcolor_vs, def_line_fs);
        //         sh.passes["base"].push(p);
        //         // p.setProgram(programmaterialcolor);
        //         p.state_ztest = false;
        //         p.state_ztest_method = WebGLKit.LEQUAL;
        //         p.state_zwrite = false;
        //         p.state_showface = ShowFaceStateEnum.CCW;
        //         p.setAlphaBlend(BlendModeEnum.Blend);
        //         sh.renderQueue = RenderQueue.Overlay;
        //         this.GIZMOS_COLOR = sh;

        //         paper.Asset.register(sh);
        //     }
        //     {
        //         const shader = new Shader("particles.shader.gltf");
        //         shader.renderQueue = RenderQueue.Transparent;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_TintColor"] = { type: "Vector4", value: [1.0, 1.0, 1.0, 1.0] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_particlesystem_vs, def_particlesystem_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.LEQUAL;
        //         renderPass.state_zwrite = true;
        //         renderPass.state_showface = ShowFaceStateEnum.ALL;
        //         renderPass.setAlphaBlend(BlendModeEnum.Close);
        //         shader.passes["base"].push(renderPass);

        //         this.PARTICLE = shader;

        //         paper.Asset.register(shader);
        //     }
        //     {
        //         const shader = new Shader("particles_additive.shader.gltf");
        //         shader.renderQueue = RenderQueue.Transparent;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_TintColor"] = { type: "Vector4", value: [1.0, 1.0, 1.0, 1.0] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_particlesystem_vs, def_particlesystem_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.LEQUAL;
        //         renderPass.state_zwrite = false;
        //         renderPass.state_showface = ShowFaceStateEnum.ALL;
        //         renderPass.setAlphaBlend(BlendModeEnum.Add);
        //         shader.passes["base"].push(renderPass);

        //         this.PARTICLE_ADDITIVE = shader;

        //         paper.Asset.register(shader);
        //     }
        //     {
        //         const shader = new Shader("particles_additive_premultiply.shader.gltf");
        //         shader.renderQueue = RenderQueue.Transparent;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_TintColor"] = { type: "Vector4", value: [1.0, 1.0, 1.0, 1.0] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_particlesystem_vs, def_particlesystem_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.LEQUAL;
        //         renderPass.state_zwrite = false;
        //         renderPass.state_showface = ShowFaceStateEnum.ALL;
        //         renderPass.setAlphaBlend(BlendModeEnum.Add_PreMultiply);
        //         shader.passes["base"].push(renderPass);

        //         this.PARTICLE_ADDITIVE_PREMYLTIPLY = shader;

        //         paper.Asset.register(shader);
        //     }
        //     {
        //         //TODO
        //         const shader = new Shader("particles_blend1.shader.gltf");
        //         shader.renderQueue = RenderQueue.Transparent;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_TintColor"] = { type: "Vector4", value: [1.0, 1.0, 1.0, 1.0] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_particlesystem_vs, def_particlesystem_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.LEQUAL;
        //         renderPass.state_zwrite = true;
        //         renderPass.state_showface = ShowFaceStateEnum.ALL;
        //         renderPass.setAlphaBlend(BlendModeEnum.Blend);
        //         shader.passes["base"].push(renderPass);

        //         this.PARTICLE_BLEND = shader;

        //         paper.Asset.register(shader);
        //     }
        //     {
        //         const shader = new Shader("particles_blend.shader.gltf");
        //         shader.renderQueue = RenderQueue.Transparent;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_TintColor"] = { type: "Vector4", value: [1.0, 1.0, 1.0, 1.0] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_particlesystem_vs, def_particlesystem_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.EQUAL;
        //         renderPass.state_zwrite = true;
        //         renderPass.state_showface = ShowFaceStateEnum.ALL;
        //         renderPass.setAlphaBlend(BlendModeEnum.Blend);
        //         shader.passes["base"].push(renderPass);

        //         this.PARTICLE_BLEND = shader;

        //         paper.Asset.register(shader);
        //     }

        //     {
        //         const shader = new Shader("particles_blend_premultiply.shader.gltf");
        //         shader.renderQueue = RenderQueue.Transparent;
        //         shader.defaultValue["_MainTex"] = { type: "Texture", value: DefaultTextures.GRAY };
        //         shader.defaultValue["_TintColor"] = { type: "Vector4", value: [1.0, 1.0, 1.0, 1.0] };

        //         shader.passes["base"] = [];
        //         const renderPass = new DrawPass(def_particlesystem_vs, def_particlesystem_fs);
        //         renderPass.state_ztest = true;
        //         renderPass.state_ztest_method = WebGLKit.LEQUAL;
        //         renderPass.state_zwrite = false;
        //         renderPass.state_showface = ShowFaceStateEnum.ALL;
        //         renderPass.setAlphaBlend(BlendModeEnum.Blend_PreMultiply);
        //         shader.passes["base"].push(renderPass);

        //         this.PARTICLE_BLEND_PREMYLTIPLY = shader;

        //         paper.Asset.register(shader);
        //     }
        // }
    }
}
