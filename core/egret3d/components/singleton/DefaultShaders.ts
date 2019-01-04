namespace egret3d {
    /**
     * 默认的 shader。
     */
    export class DefaultShaders extends paper.SingletonComponent {
        public static LINEDASHED: Shader;
        public static VERTEX_COLOR: Shader;
        public static MATERIAL_COLOR: Shader;

        public static MESH_BASIC: Shader;
        public static MESH_LAMBERT: Shader;
        public static MESH_PHONG: Shader;
        public static MESH_PHYSICAL: Shader;

        public static PARTICLE: Shader;

        public static CUBE: Shader;
        public static DEPTH: Shader;
        public static DISTANCE_RGBA: Shader;
        public static EQUIRECT: Shader;
        public static NORMAL: Shader;
        public static POINTS: Shader;
        public static SHADOW: Shader;
        public static SPRITE: Shader;
        public static COPY: Shader;

        /**
         * @deprecated
         */
        public static MESH_BASIC_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        public static MESH_LAMBERT_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        public static MESH_PHONE_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        public static MESH_PHYSICAL_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT_COLOR: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT_ADDITIVE_COLOR: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT_ADDITIVE: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT_ADDITIVE_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT_MULTIPLY: Shader;
        /**
         * @deprecated
         */
        public static TRANSPARENT_MULTIPLY_DOUBLESIDE: Shader;
        /**
         * @deprecated
         */
        public static PARTICLE_BLEND: Shader;
        /**
         * @deprecated
         */
        public static PARTICLE_ADDITIVE: Shader;
        /**
         * @deprecated
         */
        public static PARTICLE_MULTIPLY: Shader;
        /**
         * @deprecated
         */
        public static PARTICLE_BLEND_PREMULTIPLY: Shader;
        /**
         * @deprecated
         */
        public static PARTICLE_ADDITIVE_PREMULTIPLY: Shader;
        /**
         * @deprecated
         */
        public static PARTICLE_MULTIPLY_PREMULTIPLY: Shader;

        private _createShader(name: string, config: GLTF, renderQueue: number, tStates: gltf.States, defines?: string[]) {
            const shader = Shader.create(name, config);

            if (renderQueue) {
                shader._renderQueue = renderQueue;
            }
            shader._states = {
                enable: [],
                functions: {},
            };
            Shader.copyStates(tStates, shader._states);

            if (defines) {
                shader._defines = defines;
            }

            paper.Asset.register(shader);

            return shader;
        }

        public initialize() {
            super.initialize();
            //
            const helpMaterial = Material.create("helpMaterial", Shader.create("helpShader", ShaderLib.linedashed as any));
            const helpStates = helpMaterial.technique.states!;
            //
            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.LINEDASHED = this._createShader("builtin/linedashed.shader.json", ShaderLib.linedashed as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.VERTEX_COLOR = this._createShader("builtin/vertcolor.shader.json", ShaderLib.meshbasic as any, RenderQueue.Geometry, helpStates, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MATERIAL_COLOR = this._createShader("builtin/materialcolor.shader.json", ShaderLib.meshbasic as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_BASIC = this._createShader("builtin/meshbasic.shader.json", ShaderLib.meshbasic as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_LAMBERT = this._createShader("builtin/meshlambert.shader.json", ShaderLib.meshlambert as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_PHONG = this._createShader("builtin/meshphong.shader.json", ShaderLib.meshphong as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);
            DefaultShaders.MESH_PHYSICAL = this._createShader("builtin/meshphysical.shader.json", ShaderLib.meshphysical as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.PARTICLE = this._createShader("builtin/particle.shader.json", ShaderLib.particle as any, RenderQueue.Geometry, helpStates, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.CUBE = this._createShader("builtin/cube.shader.json", ShaderLib.cube as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.DEPTH = this._createShader("builtin/depth.shader.json", ShaderLib.depth as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.DISTANCE_RGBA = this._createShader("builtin/distance_rgba.shader.json", ShaderLib.distanceRGBA as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.EQUIRECT = this._createShader("builtin/equirect.shader.json", ShaderLib.equirect as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.NORMAL = this._createShader("builtin/normal.shader.json", ShaderLib.normal as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.POINTS = this._createShader("builtin/points.shader.json", ShaderLib.points as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.SHADOW = this._createShader("builtin/shadow.shader.json", ShaderLib.shadow as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.SPRITE = this._createShader("builtin/sprite.shader.json", ShaderLib.sprite as any, RenderQueue.Geometry, helpStates);

            helpMaterial.clearStates().setDepth(false, false);
            DefaultShaders.COPY = this._createShader("builtin/copy.shader.json", ShaderLib.copy as any, RenderQueue.Geometry, helpStates);


            // deprecated
            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_BASIC_DOUBLESIDE = this._createShader("builtin/meshbasic_doubleside.shader.json", ShaderLib.meshbasic as any, RenderQueue.Geometry, helpStates);
            
            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_LAMBERT_DOUBLESIDE = this._createShader("builtin/meshlambert_doubleside.shader.json", ShaderLib.meshlambert as any, RenderQueue.Geometry, helpStates);
            
            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_PHONE_DOUBLESIDE = this._createShader("builtin/meshphong_doubleside.shader.json", ShaderLib.meshphong as any, RenderQueue.Geometry, helpStates);
            
            helpMaterial.clearStates().setDepth(true, true);
            DefaultShaders.MESH_PHYSICAL_DOUBLESIDE = this._createShader("builtin/meshphysical_doubleside.shader.json", ShaderLib.meshphysical as any, RenderQueue.Geometry, helpStates);
            
            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(BlendMode.Blend, RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_COLOR = this._createShader("builtin/transparent_color.shader.json", ShaderLib.meshbasic as any, RenderQueue.Transparent, helpStates);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(BlendMode.Normal, RenderQueue.Blend);
            DefaultShaders.TRANSPARENT = this._createShader("builtin/transparent.shader.json", ShaderLib.meshbasic as any, RenderQueue.Blend, helpStates, [ShaderDefine.USE_MAP]);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(BlendMode.Blend, RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT = this._createShader("builtin/transparent.shader.json", ShaderLib.meshbasic as any, RenderQueue.Transparent, helpStates);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Blend, RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_DOUBLESIDE = this._createShader("builtin/transparent_doubleside.shader.json", ShaderLib.meshbasic as any, RenderQueue.Transparent, helpStates);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(BlendMode.Add, RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_ADDITIVE = this._createShader("builtin/transparent_additive.shader.json", ShaderLib.meshbasic as any, RenderQueue.Transparent, helpStates);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Add, RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_ADDITIVE_DOUBLESIDE = this._createShader("builtin/transparent_additive_doubleside.shader.json", ShaderLib.meshbasic as any, RenderQueue.Transparent, helpStates);

            helpMaterial.clearStates().setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back).setBlend(BlendMode.Multiply, RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_MULTIPLY = this._createShader("builtin/transparent_multiply.shader.json", ShaderLib.meshbasic as any, RenderQueue.Transparent, helpStates);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Multiply, RenderQueue.Transparent);
            DefaultShaders.TRANSPARENT_MULTIPLY_DOUBLESIDE = this._createShader("builtin/transparent_multiply_doubleside.shader.json", ShaderLib.meshbasic as any, RenderQueue.Transparent, helpStates);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Add, RenderQueue.Blend);
            DefaultShaders.PARTICLE_ADDITIVE = this._createShader("builtin/particle_additive.shader.json", ShaderLib.particle as any, RenderQueue.Blend, helpStates, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Multiply, RenderQueue.Blend);
            DefaultShaders.PARTICLE_MULTIPLY = this._createShader("builtin/particle_multiply.shader.json", ShaderLib.particle as any, RenderQueue.Blend, helpStates, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Blend_PreMultiply, RenderQueue.Blend);
            DefaultShaders.PARTICLE_BLEND_PREMULTIPLY = this._createShader("builtin/particle_blend_premultiply.shader.json", ShaderLib.particle as any, RenderQueue.Blend, helpStates, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Add_PreMultiply, RenderQueue.Blend);
            DefaultShaders.PARTICLE_ADDITIVE_PREMULTIPLY = this._createShader("builtin/particle_additive_premultiply.shader.json", ShaderLib.particle as any, RenderQueue.Blend, helpStates, [ShaderDefine.USE_COLOR]);

            helpMaterial.clearStates().setDepth(true, false).setBlend(BlendMode.Multiply_PreMultiply, RenderQueue.Blend);
            DefaultShaders.PARTICLE_MULTIPLY_PREMULTIPLY = this._createShader("builtin/particle_multiply_premultiply.shader.json", ShaderLib.particle as any, RenderQueue.Blend, helpStates, [ShaderDefine.USE_COLOR]);

            helpMaterial.dispose();
        }
    }
}
