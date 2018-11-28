namespace egret3d {
    /**
     * 默认的 shader。
     */
    export class DefaultShaders extends paper.SingletonComponent {
        public static MESH_BASIC: Shader;
        public static MESH_BASIC_DOUBLESIDE: Shader;
        public static MESH_LAMBERT: Shader;
        public static MESH_LAMBERT_DOUBLESIDE: Shader;
        public static MESH_PHONG: Shader;
        public static MESH_PHONE_DOUBLESIDE: Shader;
        public static MESH_PHYSICAL: Shader;
        public static MESH_PHYSICAL_DOUBLESIDE: Shader;

        public static LINEDASHED: Shader;
        public static VERTEX_COLOR: Shader;
        public static MATERIAL_COLOR: Shader;
        public static TRANSPARENT_COLOR: Shader;
        public static TRANSPARENT_ADDITIVE_COLOR: Shader;

        public static TRANSPARENT: Shader;
        public static TRANSPARENT_DOUBLESIDE: Shader;
        public static TRANSPARENT_ADDITIVE: Shader;
        public static TRANSPARENT_ADDITIVE_DOUBLESIDE: Shader;
        public static TRANSPARENT_MULTIPLY: Shader;
        public static TRANSPARENT_MULTIPLY_DOUBLESIDE: Shader;

        public static PARTICLE: Shader;
        public static PARTICLE_BLEND: Shader;
        public static PARTICLE_ADDITIVE: Shader;
        public static PARTICLE_MULTIPLY: Shader;

        public static PARTICLE_BLEND_PREMULTIPLY: Shader;
        public static PARTICLE_ADDITIVE_PREMULTIPLY: Shader;
        public static PARTICLE_MULTIPLY_PREMULTIPLY: Shader;

        public static CUBE: Shader;
        public static DEPTH: Shader;
        public static DISTANCE_RGBA: Shader;
        public static EQUIRECT: Shader;
        public static NORMAL: Shader;
        public static POINTS: Shader;
        public static SHADOW: Shader;
        public static SPRITE: Shader;
        public static COPY: Shader;

        private _createShader(name: string, config: GLTF, renderQueue?: number, states?: gltf.States, defines?: string[]) {
            const shader = new Shader(config, name);
            shader._isBuiltin = true;

            if (renderQueue) {
                shader._renderQueue = renderQueue;
            }

            if (defines) {
                shader._defines = defines;
            }

            if (states) {
                const shaderStates = GLTFAsset.copyTechniqueStates(states);
                if (shaderStates) {
                    shader._states = shaderStates;
                }
            }

            paper.Asset.register(shader);

            return shader;
        }

        public initialize() {
            super.initialize();
            //
            const helpMaterial = new Material(new Shader(egret3d.ShaderLib.meshbasic as any, ""));
            //
            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_BASIC = this._createShader("builtin/meshbasic.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_BASIC_DOUBLESIDE = this._createShader("builtin/meshbasic_doubleside.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_LAMBERT = this._createShader("builtin/meshlambert.shader.json", egret3d.ShaderLib.meshlambert as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_LAMBERT_DOUBLESIDE = this._createShader("builtin/meshlambert_doubleside.shader.json", egret3d.ShaderLib.meshlambert as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_PHONG = this._createShader("builtin/meshphong.shader.json", egret3d.ShaderLib.meshphong as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_PHONE_DOUBLESIDE = this._createShader("builtin/meshphong_doubleside.shader.json", egret3d.ShaderLib.meshphong as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_PHYSICAL = this._createShader("builtin/meshphysical.shader.json", egret3d.ShaderLib.meshphysical as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_PHYSICAL_DOUBLESIDE = this._createShader("builtin/meshphysical_doubleside.shader.json", egret3d.ShaderLib.meshphysical as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT = this._createShader("builtin/transparent.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_DOUBLESIDE = this._createShader("builtin/transparent_doubleside.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(gltf.BlendMode.Add, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_ADDITIVE = this._createShader("builtin/transparent_additive.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Add, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_ADDITIVE_DOUBLESIDE = this._createShader("builtin/transparent_additive_doubleside.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(gltf.BlendMode.Multiply, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_MULTIPLY = this._createShader("builtin/transparent_multiply.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Multiply, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_MULTIPLY_DOUBLESIDE = this._createShader("builtin/transparent_multiply_doubleside.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.LINEDASHED = this._createShader("builtin/linedashed.shader.json", egret3d.ShaderLib.linedashed as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.VERTEX_COLOR = this._createShader("builtin/vertcolor.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP, ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MATERIAL_COLOR = this._createShader("builtin/materialcolor.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);
            
            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_COLOR = this._createShader("builtin/transparent_color.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states);
            
            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.Additive, paper.RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_ADDITIVE_COLOR = this._createShader("builtin/transparent_additive_color.shader.json", egret3d.ShaderLib.meshbasic as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.PARTICLE = this._createShader("builtin/particle.shader.json", egret3d.ShaderLib.particle as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Blend, paper.RenderQueue.Transparent);
            DefaultShaders.PARTICLE_BLEND = this._createShader("builtin/particle_blend.shader.json", egret3d.ShaderLib.particle as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Add, paper.RenderQueue.Transparent);
            DefaultShaders.PARTICLE_ADDITIVE = this._createShader("builtin/particle_additive.shader.json", egret3d.ShaderLib.particle as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Multiply, paper.RenderQueue.Transparent);
            DefaultShaders.PARTICLE_MULTIPLY = this._createShader("builtin/particle_multiply.shader.json", egret3d.ShaderLib.particle as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Blend_PreMultiply, paper.RenderQueue.Transparent);
            DefaultShaders.PARTICLE_BLEND_PREMULTIPLY = this._createShader("builtin/particle_blend_premultiply.shader.json", egret3d.ShaderLib.particle as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Add_PreMultiply, paper.RenderQueue.Transparent);
            DefaultShaders.PARTICLE_ADDITIVE_PREMULTIPLY = this._createShader("builtin/particle_additive_premultiply.shader.json", egret3d.ShaderLib.particle as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(gltf.BlendMode.Multiply_PreMultiply, paper.RenderQueue.Transparent);
            DefaultShaders.PARTICLE_MULTIPLY_PREMULTIPLY = this._createShader("builtin/particle_multiply_premultiply.shader.json", egret3d.ShaderLib.particle as any, paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.CUBE = this._createShader("builtin/cube.shader.json", egret3d.ShaderLib.cube as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.DEPTH = this._createShader("builtin/depth.shader.json", egret3d.ShaderLib.depth as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.DISTANCE_RGBA = this._createShader("builtin/distanceRGBA.shader.json", egret3d.ShaderLib.distanceRGBA as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.EQUIRECT = this._createShader("builtin/equirect.shader.json", egret3d.ShaderLib.equirect as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.NORMAL = this._createShader("builtin/normal.shader.json", egret3d.ShaderLib.normal as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.POINTS = this._createShader("builtin/points.shader.json", egret3d.ShaderLib.points as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.SHADOW = this._createShader("builtin/shadow.shader.json", egret3d.ShaderLib.shadow as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.SPRITE = this._createShader("builtin/sprite.shader.json", egret3d.ShaderLib.sprite as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(false, false);
            DefaultShaders.COPY = this._createShader("builtin/copy.shader.json", egret3d.ShaderLib.copy as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefine.USE_MAP]);
            // // TODO
            // helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK);
            // this._createShader("obsolete/shaders/diffuse.shader.json", egret3d.ShaderLib.diffuse as any, paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, [ShaderDefines.USE_MAP]);

            helpMaterial.dispose();
        }
    }
}
