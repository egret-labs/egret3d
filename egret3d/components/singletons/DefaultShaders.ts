namespace egret3d {
    /**
     * 
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

        public static TRANSPARENT: Shader;
        public static TRANSPARENT_DOUBLESIDE: Shader;
        public static TRANSPARENT_ADDITIVE: Shader;
        public static TRANSPARENT_ADDITIVE_DOUBLESIDE: Shader;

        public static PARTICLE: Shader;
        public static PARTICLE_BLEND: Shader;
        public static PARTICLE_ADDITIVE: Shader;

        public static PARTICLE_BLEND_PREMULTIPLY: Shader;
        public static PARTICLE_ADDITIVE_PREMULTIPLY: Shader;

        private _createShader(name: string, shaderNameOrConfig: string | GLTF, renderQueue?: number, states?: gltf.States, defines?: string[]) {
            const shader = new Shader(name);

            if (typeof shaderNameOrConfig === "string") {
                shader.config = paper.Asset.find<Shader>(shaderNameOrConfig)!.config;
            }
            else {
                shader.config = shaderNameOrConfig;
            }

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
            // Create builtin shaders.
            const shaders = <any>egret3d.ShaderLib as { [key: string]: GLTF };
            for (const k in shaders) {
                this._createShader(`builtin/raw_${k}.shader.json`, shaders[k]);
            }
            //
            const helpMaterial = new Material(paper.Asset.find<Shader>("builtin/raw_meshbasic.shader.json")!);
            //
            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_BASIC = this._createShader("builtin/meshbasic.shader.json", "builtin/raw_meshbasic.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_BASIC_DOUBLESIDE = this._createShader("builtin/meshbasic_doubleside.shader.json", "builtin/raw_meshbasic.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_LAMBERT = this._createShader("builtin/meshlambert.shader.json", "builtin/raw_meshlambert.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_LAMBERT_DOUBLESIDE = this._createShader("builtin/meshlambert_doubleside.shader.json", "builtin/raw_meshlambert.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_PHONG = this._createShader("builtin/meshphong.shader.json", "builtin/raw_meshphong.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_PHONE_DOUBLESIDE = this._createShader("builtin/meshphong_doubleside.shader.json", "builtin/raw_meshphong.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_PHYSICAL = this._createShader("builtin/meshphysical.shader.json", "builtin/raw_meshphysical.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultShaders.MESH_PHYSICAL_DOUBLESIDE = this._createShader("builtin/meshphysical_doubleside.shader.json", "builtin/raw_meshphysical.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.Blend);
            DefaultShaders.TRANSPARENT = this._createShader("builtin/transparent.shader.json", "builtin/raw_meshbasic.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Blend);
            DefaultShaders.TRANSPARENT_DOUBLESIDE = this._createShader("builtin/transparent_doubleside.shader.json", "builtin/raw_meshbasic.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.Add);
            DefaultShaders.TRANSPARENT_ADDITIVE = this._createShader("builtin/transparent_additive.shader.json", "builtin/raw_meshbasic.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Add);
            DefaultShaders.TRANSPARENT_ADDITIVE_DOUBLESIDE = this._createShader("builtin/transparent_additive_doubleside.shader.json", "builtin/raw_meshbasic.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states, ["USE_MAP"]);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultShaders.LINEDASHED = this._createShader("builtin/linedashed.shader.json", "builtin/raw_linedashed.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultShaders.VERTEX_COLOR = this._createShader("builtin/vertcolor.shader.json", "builtin/raw_vertcolor.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultShaders.MATERIAL_COLOR = this._createShader("builtin/materialcolor.shader.json", "builtin/raw_meshbasic.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultShaders.PARTICLE = this._createShader("builtin/particle.shader.json", "builtin/raw_particle.shader.json", paper.RenderQueue.Geometry, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Blend);
            DefaultShaders.PARTICLE_BLEND = this._createShader("builtin/particle_blend.shader.json", "builtin/raw_particle.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Add);
            DefaultShaders.PARTICLE_ADDITIVE = this._createShader("builtin/particle_additive.shader.json", "builtin/raw_particle.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Blend_PreMultiply);
            DefaultShaders.PARTICLE_BLEND_PREMULTIPLY = this._createShader("builtin/particle_blend_premultiply.shader.json", "builtin/raw_particle.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Add_PreMultiply);
            DefaultShaders.PARTICLE_ADDITIVE_PREMULTIPLY = this._createShader("builtin/particle_additive_premultiply.shader.json", "builtin/raw_particle.shader.json", paper.RenderQueue.Transparent, helpMaterial.glTFTechnique.states);

            helpMaterial.dispose();
        }
    }
}
