namespace egret3d {
    /**
     * 默认的材质。
     */
    @paper.singleton
    export class DefaultMaterials extends paper.BaseComponent {
        /**
         * 
         */
        public static MESH_BASIC: Material;
        /**
         * 
         */
        public static MESH_BASIC_DOUBLESIDE: Material;
        /**
         * 
         */
        public static MESH_LAMBERT: Material;
        /**
         * 
         */
        public static MESH_LAMBERT_DOUBLESIDE: Material;
        /**
         * 
         */
        public static MESH_PHONG: Material;
        /**
         * 
         */
        public static LINEDASHED: Material;
        /**
         * 
         */
        public static LINEDASHED_COLOR: Material;
        /**
         * 
         */
        public static CUBE: Material;
        /**
         * 
         */
        public static MISSING: Material;
        /**
         * @internal
         */
        public static SHADOW_DEPTH_3201: Material;
        /**
         * @internal
         */
        public static SHADOW_DEPTH_3200: Material;
        /**
         * @internal
         */
        public static SHADOW_DISTANCE: Material;
        /**
         * @internal
         */
        public static COPY: Material;

        private _createMaterial(name: string, shader: Shader) {
            const material = Material.create(name, shader);
            paper.Asset.register(material);

            return material;
        }

        public initialize() {
            super.initialize();

            DefaultMaterials.MESH_BASIC = this._createMaterial("builtin/meshbasic.mat.json", DefaultShaders.MESH_BASIC)
                .setTexture(DefaultTextures.WHITE);

            DefaultMaterials.MESH_BASIC_DOUBLESIDE = this._createMaterial("builtin/meshbasic_doubleside.mat.json", DefaultShaders.MESH_BASIC)
                .setTexture(DefaultTextures.WHITE)
                .setCullFace(false);

            DefaultMaterials.MESH_LAMBERT = this._createMaterial("builtin/meshlambert.mat.json", DefaultShaders.MESH_LAMBERT)
                .setTexture(DefaultTextures.WHITE);

            DefaultMaterials.MESH_LAMBERT_DOUBLESIDE = this._createMaterial("builtin/meshlambert_doubleside.mat.json", DefaultShaders.MESH_LAMBERT)
                .setTexture(DefaultTextures.WHITE)
                .setCullFace(false);

            DefaultMaterials.MESH_PHONG = this._createMaterial("builtin/meshphong.mat.json", DefaultShaders.MESH_PHONG);

            DefaultMaterials.LINEDASHED = this._createMaterial("builtin/linedashed.mat.json", DefaultShaders.LINEDASHED);

            DefaultMaterials.LINEDASHED_COLOR = this._createMaterial("builtin/linedashed_color.mat.json", DefaultShaders.LINEDASHED)
                .addDefine(ShaderDefine.USE_COLOR);

            DefaultMaterials.CUBE = this._createMaterial("builtin/cube.mat.json", DefaultShaders.CUBE);

            DefaultMaterials.MISSING = this._createMaterial("builtin/missing.mat.json", DefaultShaders.MESH_BASIC)
                .setColor(Color.PURPLE);

            DefaultMaterials.SHADOW_DEPTH_3200 = this._createMaterial("builtin/shadow_depth_3200.mat.json", DefaultShaders.DEPTH)
                .setDepth(true, true)
                .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back)
                .addDefine(ShaderDefine.DEPTH_PACKING_3200);

            DefaultMaterials.SHADOW_DEPTH_3201 = this._createMaterial("builtin/shadow_depth_3201.mat.json", DefaultShaders.DEPTH)
                .setDepth(true, true)
                .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back)
                .addDefine(ShaderDefine.DEPTH_PACKING_3201);

            DefaultMaterials.SHADOW_DISTANCE = this._createMaterial("builtin/shadow_distance.mat.json", DefaultShaders.DISTANCE_RGBA)
                .setDepth(true, true)
                .addDefine(ShaderDefine.FLIP_SIDED).addDefine(ShaderDefine.USE_SHADOWMAP)
                .setCullFace(true, gltf.FrontFace.CCW, gltf.CullFace.Back);

            DefaultMaterials.COPY = this._createMaterial("builtin/copy.mat.json", DefaultShaders.COPY);
        }
    }
}
