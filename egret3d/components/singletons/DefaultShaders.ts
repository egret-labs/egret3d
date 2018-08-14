namespace egret3d {
    /**
     * @private
     */
    const enum BlendModeEnum {
        Close,
        Blend,
        Blend_PreMultiply,
        Add,
        Add_PreMultiply,
    }

    export class DefaultShaders extends paper.SingletonComponent {

        // public static DIFFUSE_VERT_COLOR: Shader;
        // public static LAMBERT_NORMAL: Shader;
        public static TEST: GLTFAsset;

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

        public createBuildinShader(url: string, vertName: string, vertSource: string, fragName: string, fragSource: string, renderQueue: number) {
            const asset = GLTFAsset.createShaderAsset(url);

            const KHRExtensions = asset.config.extensions!.KHR_techniques_webgl!;

            KHRExtensions.shaders.push({ type: gltf.ShaderStage.VERTEX_SHADER, name: vertName, uri: vertSource });
            KHRExtensions.shaders.push({ type: gltf.ShaderStage.FRAGMENT_SHADER, name: fragName, uri: fragSource });
            KHRExtensions.techniques.push({ attributes: {}, uniforms: {}, states: { enable: [], functions: {} } } as any);

            asset.config.extensions!.paper = { renderQueue };

            asset._isBuiltin = true;
            paper.Asset.register(asset);

            return asset;
        }

        private _setBlend(technique: gltf.Technique, blend: BlendModeEnum) {
            const funs = technique.states.functions!;
            const enables = technique.states.enable!;
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

        private _setCullFace(technique: gltf.Technique, cull: boolean, frontFace?: gltf.FrontFace, cullFace?: gltf.CullFace) {
            const funs = technique.states.functions!;
            const enables = technique.states.enable!;
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

        private _setDepth(technique: gltf.Technique, zTest: boolean, zWrite: boolean) {
            const funs = technique.states.functions!;
            const enables = technique.states.enable!;
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

        private _createColorShaderTemplate(url: string, renderQueue: RenderQueue) {
            const shader = this.createBuildinShader(url, "color_vs", ShaderLib.materialcolor_vert, "color_fs", ShaderLib.line_frag, renderQueue);

            const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
            technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

            technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
            technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };

            return shader;
        }

        private _createTestShaderTemplate(url: string, renderQueue: RenderQueue) {
            const shader = this.createBuildinShader(url, "test_vs", ShaderLib.test_vert, "test_fs", ShaderLib.test_frag, renderQueue);
            const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

            technique.attributes["position"] = { semantic: gltf.AttributeSemanticType.POSITION };
            technique.attributes["normal"] = { semantic: gltf.AttributeSemanticType.NORMAL };
            technique.attributes["uv"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
            technique.attributes["uv2"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_1 };
            technique.attributes["color"] = { semantic: gltf.AttributeSemanticType.COLOR_0 };
            technique.attributes["morphTarget0"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_0 };
            technique.attributes["morphTarget1"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_1 };
            technique.attributes["morphTarget2"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_2 };
            technique.attributes["morphTarget3"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_3 };
            technique.attributes["morphTarget4"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_4 };
            technique.attributes["morphTarget5"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_5 };
            technique.attributes["morphTarget6"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_6 };
            technique.attributes["morphTarget7"] = { semantic: gltf.AttributeSemanticType.MORPHTARGET_7 };
            technique.attributes["morphNormal0"] = { semantic: gltf.AttributeSemanticType.MORPHNORMAL_0 };
            technique.attributes["morphNormal1"] = { semantic: gltf.AttributeSemanticType.MORPHNORMAL_1 };
            technique.attributes["morphNormal2"] = { semantic: gltf.AttributeSemanticType.MORPHNORMAL_2 };
            technique.attributes["morphNormal3"] = { semantic: gltf.AttributeSemanticType.MORPHNORMAL_3 };
            technique.attributes["skinIndex"] = { semantic: gltf.AttributeSemanticType.JOINTS_0 };
            technique.attributes["skinWeight"] = { semantic: gltf.AttributeSemanticType.WEIGHTS_0 };

            technique.uniforms["modelMatrix"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: [] };
            technique.uniforms["modelViewMatrix"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEW, value: [] };
            technique.uniforms["projectionMatrix"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.PROJECTION, value: [] };
            technique.uniforms["viewMatrix"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.VIEW, value: [] };
            technique.uniforms["normalMatrix"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWINVERSE, value: [] };
            technique.uniforms["cameraPosition"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._CAMERA_POS, value: [] };

            technique.uniforms["ambientLightColor"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._AMBIENTLIGHTCOLOR, value: [0, 0, 0] };
            technique.uniforms["directionalLights[0]"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._DIRECTLIGHTS, value: [] };//
            technique.uniforms["pointLights[0]"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._POINTLIGHTS, value: [] };//
            technique.uniforms["spotLights[0]"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType._SPOTLIGHTS, value: [] };//
            // technique.uniforms["ltc_1"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType.MODEL, value: [] };
            // technique.uniforms["ltc_2"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType.MODEL, value: [] };
            // technique.uniforms["rectAreaLights"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType.MODEL, value: [] };//
            // technique.uniforms["hemisphereLights"] = { type: gltf.UniformType.FLOAT_VEC3, semantic: gltf.UniformSemanticType.MODEL, value: [] };//

            technique.uniforms["bindMatrix"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._BINDMATRIX, value: [] };
            technique.uniforms["bindMatrixInverse"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._BINDMATRIXINVERSE, value: [] };
            // technique.uniforms["boneTexture"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._BONETEXTURE, value: [] };
            // technique.uniforms["boneTextureSize"] = { type: gltf.UniformType.INT, semantic: gltf.UniformSemanticType._BONETEXTURESIZE, value: [] };
            technique.uniforms["boneMatrices"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._BONEMATRIX, value: [] };

            technique.uniforms["directionalShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAT, value: [] };
            technique.uniforms["spotShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType._SPOTSHADOWMAT, value: [] };
            technique.uniforms["pointShadowMatrix[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._POINTSHADOWMAT, value: [] };
            technique.uniforms["directionalShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._DIRECTIONSHADOWMAP, value: [] };
            technique.uniforms["spotShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._SPOTSHADOWMAP, value: [] };
            technique.uniforms["pointShadowMap[0]"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._POINTSHADOWMAT, value: [] };
            technique.uniforms["lightMap"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._LIGHTMAPTEX, value: [] };
            technique.uniforms["lightMapIntensity"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPINTENSITY, value: [] };

            technique.uniforms["uvTransform"] = { type: gltf.UniformType.FLOAT_MAT3, value: [1, 0, 0, 0, 1, 0, 0, 0, 1] };
            technique.uniforms["refractionRatio"] = { type: gltf.UniformType.FLOAT, value: 0 };
            technique.uniforms["diffuse"] = { type: gltf.UniformType.FLOAT_VEC3, value: [1, 1, 1] };
            technique.uniforms["emissive"] = { type: gltf.UniformType.FLOAT_VEC3, value: [0, 0, 0] };
            technique.uniforms["opacity"] = { type: gltf.UniformType.FLOAT, value: 1 };
            technique.uniforms["map"] = { type: gltf.UniformType.SAMPLER_2D, value: egret3d.DefaultTextures.GRAY };
            technique.uniforms["alphaMap"] = { type: gltf.UniformType.SAMPLER_2D, value: {} };
            technique.uniforms["aoMap"] = { type: gltf.UniformType.SAMPLER_2D, value: {} };
            technique.uniforms["aoMapIntensity"] = { type: gltf.UniformType.FLOAT, value: 1 };
            technique.uniforms["emissiveMap"] = { type: gltf.UniformType.SAMPLER_2D, value: {} };
            technique.uniforms["reflectivity"] = { type: gltf.UniformType.FLOAT, value: 0 };
            technique.uniforms["envMapIntensity"] = { type: gltf.UniformType.FLOAT, value: 1 };
            // technique.uniforms["envMap"] = { type: gltf.UniformType.SAMPLER_CUBE, value: [] };
            // technique.uniforms["envMap"] = { type: gltf.UniformType.SAMPLER_2D, value: [] };
            technique.uniforms["flipEnvMap"] = { type: gltf.UniformType.FLOAT, value: 1 };
            technique.uniforms["maxMipLevel"] = { type: gltf.UniformType.INT, value: 0 };
            technique.uniforms["specularMap"] = { type: gltf.UniformType.SAMPLER_2D, value: {} };
            technique.uniforms["clippingPlanes"] = { type: gltf.UniformType.FLOAT_VEC4, value: [] };


            return shader;
        }

        private _createDiffuseShaderTemplate(url: string, renderQueue: RenderQueue) {
            const shader = this.createBuildinShader(url, "diffuse_vs", ShaderLib.diffuse_vert, "diffuse_fs", ShaderLib.diffuse_frag, renderQueue);
            const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

            technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
            technique.attributes["_glesMultiTexCoord0"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_0 };
            technique.attributes["_glesMultiTexCoord1"] = { semantic: gltf.AttributeSemanticType.TEXCOORD_1 };
            technique.attributes["_glesBlendIndex4"] = { semantic: gltf.AttributeSemanticType.JOINTS_0 };
            technique.attributes["_glesBlendWeight4"] = { semantic: gltf.AttributeSemanticType.WEIGHTS_0 };

            technique.uniforms["glstate_lightmapOffset"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._LIGHTMAPOFFSET, value: [] };
            technique.uniforms["glstate_lightmapUV"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPUV, value: {} };
            technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };
            technique.uniforms["glstate_vec4_bones[0]"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._BONESVEC4, value: [] };

            technique.uniforms["_LightmapTex"] = { type: gltf.UniformType.SAMPLER_2D, semantic: gltf.UniformSemanticType._LIGHTMAPTEX, value: {} };
            technique.uniforms["_LightmapIntensity"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._LIGHTMAPINTENSITY, value: 1.0 };
            technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: egret3d.DefaultTextures.GRAY };
            technique.uniforms["_MainColor"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };
            technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };
            technique.uniforms["_AlphaCut"] = { type: gltf.UniformType.FLOAT, value: 0 };

            return shader;
        }

        private _createLambertShaderTemplate(url: string, renderQueue: RenderQueue) {
            const shader = this.createBuildinShader(url, "lambert_vs", ShaderLib.lambert_vert, "lambert_fs", ShaderLib.lambert_frag, renderQueue);

            const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
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

            technique.uniforms["_NormalTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRAY };
            technique.uniforms["_MainTex"] = { type: gltf.UniformType.SAMPLER_2D, value: DefaultTextures.GRAY };
            technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };
            technique.uniforms["_Color"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 1, 1] };
            return shader;
        }

        private _createParticleShaderTemplate(url: string, renderQueue: RenderQueue) {
            const shader = this.createBuildinShader(url, "particle_vs", ShaderLib.particlesystem_vert, "particle_fs", ShaderLib.particlesystem_frag, renderQueue);

            const technique = shader.config!.extensions!.KHR_techniques_webgl!.techniques[0];
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
            technique.uniforms["_MainTex_ST"] = { type: gltf.UniformType.FLOAT_VEC4, value: [1, 1, 0, 0] };
            technique.uniforms["_TintColor"] = { type: gltf.UniformType.FLOAT_VEC4, value: [0.5, 0.5, 0.5, 0.5] };
            technique.uniforms["u_currentTime"] = { type: gltf.UniformType.FLOAT, value: 0 };
            technique.uniforms["u_gravity"] = { type: gltf.UniformType.FLOAT_VEC3, value: [0, 0, 0] };
            technique.uniforms["u_worldPosition"] = { type: gltf.UniformType.FLOAT_VEC3, value: [0, 0, 0] };
            technique.uniforms["u_worldRotation"] = { type: gltf.UniformType.FLOAT_VEC4, value: [0, 0, 0, 1] };
            technique.uniforms["u_startRotation3D"] = { type: gltf.UniformType.BOOL, value: false };
            technique.uniforms["u_scalingMode"] = { type: gltf.UniformType.INT, value: 0 };
            technique.uniforms["u_positionScale"] = { type: gltf.UniformType.FLOAT_VEC3, value: [1, 1, 1] };
            technique.uniforms["u_sizeScale"] = { type: gltf.UniformType.FLOAT_VEC3, value: [1, 1, 1] };
            technique.uniforms["u_lengthScale"] = { type: gltf.UniformType.FLOAT, value: [1, 1, 1] };
            technique.uniforms["u_speeaScale"] = { type: gltf.UniformType.FLOAT, value: [1, 1, 1] };
            technique.uniforms["u_simulationSpace"] = { type: gltf.UniformType.INT, value: 0 };
            technique.uniforms["u_spaceType"] = { type: gltf.UniformType.INT, value: 0 };
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

        public initialize() {
            {
                const shader = this.createBuildinShader("buildin/depth.shader.gltf", "depth_vs", ShaderLib.depthpackage_vert, "depth_fs", ShaderLib.depthpackage_frag, RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                //
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.SHADOW_DEPTH = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this.createBuildinShader("buildin/distance.shader.gltf", "distance_vs", ShaderLib.distancepackage_vert, "distance_fs", ShaderLib.distancepackage_frag, RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };

                technique.uniforms["glstate_matrix_model"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODEL, value: [] };
                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                technique.uniforms["glstate_referencePosition"] = { type: gltf.UniformType.FLOAT_VEC4, semantic: gltf.UniformSemanticType._REFERENCEPOSITION, value: [] };
                technique.uniforms["glstate_nearDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._NEARDICTANCE, value: {} };
                technique.uniforms["glstate_farDistance"] = { type: gltf.UniformType.FLOAT, semantic: gltf.UniformSemanticType._FARDISTANCE, value: {} };

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.SHADOW_DISTANCE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this.createBuildinShader("buildin/line.shader.gltf", "line_vs", ShaderLib.line_vert, "line_fs", ShaderLib.line_frag, RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                technique.attributes["_glesVertex"] = { semantic: gltf.AttributeSemanticType.POSITION };
                technique.attributes["_glesColor"] = { semantic: gltf.AttributeSemanticType.COLOR_0 };

                technique.uniforms["glstate_matrix_mvp"] = { type: gltf.UniformType.FLOAT_MAT4, semantic: gltf.UniformSemanticType.MODELVIEWPROJECTION, value: [] };

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.LINE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createTestShaderTemplate("buildin/test.shader.gltf", RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.TEST = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/diffuse.shader.gltf", RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.DIFFUSE = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/diffuse_tintcolor.shader.gltf", RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                DefaultShaders.DIFFUSE_TINT_COLOR = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/diffuse_bothside.shader.gltf", RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);
                DefaultShaders.DIFFUSE_BOTH_SIDE = shader;
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.TRANSPARENT = shader;
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_tintColor.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.TRANSPARENT_TINTCOLOR = shader;
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_alphaCut.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.TRANSPARENT_ALPHACUT = shader;
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_additive.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.TRANSPARENT_ADDITIVE = shader;
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_additive_bothside.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.TRANSPARENT_ADDITIVE_BOTH_SIDE = shader;
            }

            {
                const shader = this._createDiffuseShaderTemplate("buildin/transparent_bothside.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.TRANSPARENT_ADDITIVE_BOTH_SIDE = shader;
            }

            {
                const shader = this._createLambertShaderTemplate("buildin/lambert.shader.gltf", RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.LAMBERT = shader;
            }

            {
                const shader = this._createColorShaderTemplate("buildin/gizmos.shader.gltf", RenderQueue.Overlay);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, false, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.GIZMOS_COLOR = shader;
            }

            {
                const shader = this._createColorShaderTemplate("buildin/materialcolor.shader.gltf", RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.MATERIAL_COLOR = shader;
            }

            {
                const shader = this.createBuildinShader("buildin/vertcolor.shader.gltf", "vertcolor_vs", ShaderLib.vertcolor_vert, "vertcolor_fs", ShaderLib.vertcolor_frag, RenderQueue.Geometry);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
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

                DefaultShaders.VERT_COLOR = shader;
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particle.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.PARTICLE = shader;
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particle_additive.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.PARTICLE_ADDITIVE = shader;
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particle_additive_premultiply.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add_PreMultiply);

                DefaultShaders.PARTICLE_ADDITIVE_PREMYLTIPLY = shader;
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particle_blend1.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);
                technique.states.functions!.depthFunc = [gltf.DepthFunc.EQUAL];//TODO

                paper.Asset.register(shader);
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particle_blend.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.PARTICLE_BLEND = shader;
            }

            {
                const shader = this._createParticleShaderTemplate("buildin/particle_blend_premultiply.shader.gltf", RenderQueue.Transparent);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend_PreMultiply);

                DefaultShaders.PARTICLE_BLEND_PREMYLTIPLY = shader;
            }
        }
    }
}
