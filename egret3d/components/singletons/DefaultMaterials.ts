namespace egret3d {
    /**
     * 
     */
    export class DefaultMaterials extends paper.SingletonComponent {
        public static MESH_BASIC: Material;
        public static MESH_BASIC_DOUBLESIDE: Material;
        public static MESH_LAMBERT: Material;
        public static MESH_LAMBERT_DOUBLESIDE: Material;
        public static MESH_PHONG: Material;
        public static MESH_PHONE_DOUBLESIDE: Material;
        public static MESH_PHYSICAL: Material;
        public static MESH_PHYSICAL_DOUBLESIDE: Material;

        public static LINEDASHED: Material;
        public static VERTEX_COLOR: Material;
        public static MATERIAL_COLOR: Material;

        public static TRANSPARENT: Material;
        public static TRANSPARENT_DOUBLESIDE: Material;
        public static TRANSPARENT_ADDITIVE: Material;
        public static TRANSPARENT_ADDITIVE_DOUBLESIDE: Material;

        public static PARTICLE: Material;
        public static PARTICLE_BLEND: Material;
        public static PARTICLE_ADDITIVE: Material;

        public static PARTICLE_BLEND_PREMULTIPLY: Material;
        public static PARTICLE_ADDITIVE_PREMULTIPLY: Material;

        public static SHADOW_DEPTH: Material;
        public static SHADOW_DISTANCE: Material;
        public static MISSING: Material;

        private _createShaders() {
            const shaders = <any>egret3d.ShaderLib as { [key: string]: GLTF };
            for (const k in shaders) {
                const shader = new GLTFAsset(`builtin/${k}.shader.json`);
                shader.config = shaders[k];
                shader._isBuiltin = true;
                paper.Asset.register(shader);
            }
        }

        private _createMaterial(shaderName: string, name: string, renderQueue: paper.RenderQueue) {
            const shader = paper.Asset.find<GLTFAsset>(shaderName)!;
            const material = new Material(shader);
            material.name = name;
            material.renderQueue = renderQueue;
            material._isBuiltin = true;
            paper.Asset.register(material);

            return material;
        }

        public initialize() {
            super.initialize();
            // Create builtin shaders.
            this._createShaders();

            DefaultMaterials.MESH_BASIC = this._createMaterial("builtin/meshbasic.shader.json", "builtin/meshbasic.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");
            DefaultMaterials.MESH_BASIC_DOUBLESIDE = this._createMaterial("builtin/meshbasic.shader.json", "builtin/meshbasic_doubleside.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");
            DefaultMaterials.MESH_LAMBERT = this._createMaterial("builtin/meshlambert.shader.json", "builtin/meshlambert.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");
            DefaultMaterials.MESH_LAMBERT_DOUBLESIDE = this._createMaterial("builtin/meshlambert.shader.json", "builtin/meshlambert_doubleside.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");
            DefaultMaterials.MESH_PHONG = this._createMaterial("builtin/meshphong.shader.json", "builtin/meshphong.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");
            DefaultMaterials.MESH_PHONE_DOUBLESIDE = this._createMaterial("builtin/meshphong.shader.json", "builtin/meshphong_doubleside.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");
            DefaultMaterials.MESH_PHYSICAL = this._createMaterial("builtin/meshphysical.shader.json", "builtin/meshphysical.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");
            DefaultMaterials.MESH_PHYSICAL_DOUBLESIDE = this._createMaterial("builtin/meshphysical.shader.json", "builtin/meshphysical_doubleside.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None)
                .addDefine("USE_MAP");

            DefaultMaterials.LINEDASHED = this._createMaterial("builtin/linedashed.shader.json", "builtin/linedashed.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultMaterials.VERTEX_COLOR = this._createMaterial("builtin/vertcolor.shader.json", "builtin/vertcolor.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.None);
            DefaultMaterials.MATERIAL_COLOR = this._createMaterial("builtin/meshbasic.shader.json", "builtin/materialcolor.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);

            DefaultMaterials.TRANSPARENT = this._createMaterial("builtin/meshbasic.shader.json", "builtin/transparent.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.Blend)
                .addDefine("USE_MAP");
            DefaultMaterials.TRANSPARENT_DOUBLESIDE = this._createMaterial("builtin/meshbasic.shader.json", "builtin/transparent_doubleside.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Blend)
                .addDefine("USE_MAP");
            DefaultMaterials.TRANSPARENT_ADDITIVE = this._createMaterial("builtin/meshbasic.shader.json", "builtin/transparent_additive.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.BACK).setBlend(gltf.BlendMode.Add)
                .addDefine("USE_MAP");
            DefaultMaterials.TRANSPARENT_ADDITIVE_DOUBLESIDE = this._createMaterial("builtin/meshbasic.shader.json", "builtin/transparent_additive_doubleside.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Add)
                .addDefine("USE_MAP");

            DefaultMaterials.PARTICLE = this._createMaterial("builtin/particle.shader.json", "builtin/particle.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultMaterials.PARTICLE_BLEND = this._createMaterial("builtin/particle.shader.json", "builtin/particle_blend.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Blend);
            DefaultMaterials.PARTICLE_BLEND_PREMULTIPLY = this._createMaterial("builtin/particle.shader.json", "builtin/particle_blend_premultiply.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Blend_PreMultiply);
            DefaultMaterials.PARTICLE_ADDITIVE = this._createMaterial("builtin/particle.shader.json", "builtin/particle_add.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Add);
            DefaultMaterials.PARTICLE_ADDITIVE_PREMULTIPLY = this._createMaterial("builtin/particle.shader.json", "builtin/particle_add_premultiply.mat.json", paper.RenderQueue.Transparent)
                .setDepth(true, false).setCullFace(false).setBlend(gltf.BlendMode.Add_PreMultiply);

            DefaultMaterials.SHADOW_DEPTH = this._createMaterial("builtin/depth.shader.json", "builtin/shadow_depth.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None).addDefine("DEPTH_PACKING 3201");
            DefaultMaterials.SHADOW_DISTANCE = this._createMaterial("builtin/distanceRGBA.shader.json", "builtin/shadow_distance.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
            DefaultMaterials.MISSING = this._createMaterial("builtin/meshbasic.shader.json", "builtin/missing.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None).setVector3v("diffuse", new Float32Array([1.0, 0.0, 1.0]));
        }
    }
}
