namespace egret3d {
    const enum BlendModeEnum {
        Close,
        Blend,
        Blend_PreMultiply,
        Add,
        Add_PreMultiply,
    }
    /**
     * 
     */
    export class DefaultShaders extends paper.SingletonComponent {

        // public static DIFFUSE_VERT_COLOR: Shader;
        // public static LAMBERT_NORMAL: Shader;
        public static MESHLAMBERT: GLTFAsset;

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

        private _createShaderAsset(template: any, renderQueue: number = RenderQueue.Geometry, name: string = null, defines?: string[]) {
            const shader = JSON.parse(JSON.stringify(template)) as GLTFAsset;
            const extensions = shader.config.extensions;
            if (renderQueue) {
                extensions.paper.renderQueue = RenderQueue.Geometry;
            }
            else {
                extensions.paper.renderQueue = renderQueue;
            }
            if (name) {
                shader.name = name;
            }

            if (defines) {
                const shaders = extensions.KHR_techniques_webgl.shaders;
                for (const define of defines) {
                    const defineStr = `#define ${define} \n`;
                    shaders[0].uri = defineStr + shaders[0].uri;
                    shaders[1].uri = defineStr + shaders[1].uri;
                }
            }

            paper.Asset.register(shader);
            return shader;
        }

        public initialize() {
            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.depth, RenderQueue.Geometry, null, ["DEPTH_PACKING 3201"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.SHADOW_DEPTH = shader;
                paper.Asset.register(shader);
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.distanceRGBA, RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.SHADOW_DISTANCE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.line, RenderQueue.Geometry);
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.LINE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshlambert, RenderQueue.Geometry, null, ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.MESHLAMBERT = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Geometry, "buildin/diffuse.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.DIFFUSE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Geometry, "buildin/diffuse_tintcolor.shader.gltf", ["USE_MAP"]);

                shader.config.extensions.paper.renderQueue = RenderQueue.Geometry;
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);
                DefaultShaders.DIFFUSE_TINT_COLOR = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Geometry, "buildin/diffuse_bothside.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);
                DefaultShaders.DIFFUSE_BOTH_SIDE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Transparent, "buildin/transparent.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.TRANSPARENT = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Transparent, "buildin/transparent_tintColor.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.TRANSPARENT_TINTCOLOR = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Transparent, "buildin/transparent_alphaCut.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.TRANSPARENT_ALPHACUT = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Transparent, "buildin/transparent_additive.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.TRANSPARENT_ADDITIVE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Transparent, "buildin/transparent_additive_bothside.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.TRANSPARENT_ADDITIVE_BOTH_SIDE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.meshbasic, RenderQueue.Transparent, "buildin/transparent_bothside.shader.gltf", ["USE_MAP"]);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.TRANSPARENT_ADDITIVE_BOTH_SIDE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.line, RenderQueue.Overlay, "buildin/gizmos.shader.gltf");
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, false, false);
                this._setCullFace(technique, true, gltf.FrontFace.CCW);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.GIZMOS_COLOR = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.line, RenderQueue.Geometry, "buildin/materialcolor.shader.gltf");
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.MATERIAL_COLOR = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.vertcolor, RenderQueue.Geometry);

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.VERT_COLOR = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.particle, RenderQueue.Geometry, "buildin/particle.shader.gltf");

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Close);

                DefaultShaders.PARTICLE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.particle, RenderQueue.Transparent, "buildin/particle_additive.shader.gltf");

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add);

                DefaultShaders.PARTICLE_ADDITIVE = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.particle, RenderQueue.Transparent, "buildin/particle_additive_premultiply.shader.gltf");

                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Add_PreMultiply);

                DefaultShaders.PARTICLE_ADDITIVE_PREMYLTIPLY = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.particle, RenderQueue.Transparent, "buildin/particle_blend1.shader.gltf");
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];

                this._setDepth(technique, true, true);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);
                technique.states.functions!.depthFunc = [gltf.DepthFunc.EQUAL];//TODO
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.particle, RenderQueue.Transparent, "buildin/particle_blend.shader.gltf");
                const technique = shader.config.extensions!.KHR_techniques_webgl!.techniques[0];
                //
                this._setDepth(technique, true, false);
                this._setCullFace(technique, false);
                this._setBlend(technique, BlendModeEnum.Blend);

                DefaultShaders.PARTICLE_BLEND = shader;
            }

            {
                const shader = this._createShaderAsset(egret3d.ShaderLib.particle, RenderQueue.Transparent, "buildin/particle_blend_premultiply.shader.gltf");
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
