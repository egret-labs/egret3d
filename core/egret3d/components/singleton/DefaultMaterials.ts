namespace egret3d {
    /**
     * 
     */
    export class DefaultMaterials extends paper.SingletonComponent {
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
        public static LINEDASHED: Material;
        /**
         * 
         */
        public static LINEDASHED_COLOR: Material;
        /**
         * 
         */
        public static MISSING: Material;
        /**
         * @internal
         */
        public static SHADOW_DEPTH: Material;
        /**
         * @internal
         */
        public static SHADOW_DISTANCE: Material;
        /**
         * @internal
         */
        public static COPY: Material;

        private _createMaterial(shader: Shader, name: string) {
            const material = Material.create(shader, name);
            paper.Asset.register(material);

            return material;
        }

        public initialize() {
            super.initialize();

            DefaultMaterials.MESH_BASIC = this._createMaterial(DefaultShaders.MESH_BASIC, "builtin/meshbasic.mat.json")
                .setTexture(DefaultTextures.WHITE);

            DefaultMaterials.MESH_BASIC_DOUBLESIDE = this._createMaterial(DefaultShaders.MESH_BASIC, "builtin/meshbasic_doubleside.mat.json")
                .setTexture(DefaultTextures.WHITE)
                .setCullFace(false);

            DefaultMaterials.MESH_LAMBERT = this._createMaterial(DefaultShaders.MESH_LAMBERT, "builtin/meshlambert.mat.json")
                .setTexture(DefaultTextures.WHITE);

            DefaultMaterials.MESH_LAMBERT_DOUBLESIDE = this._createMaterial(DefaultShaders.MESH_LAMBERT, "builtin/meshlambert_doubleside.mat.json")
                .setTexture(DefaultTextures.WHITE)
                .setCullFace(false);

            DefaultMaterials.LINEDASHED = this._createMaterial(DefaultShaders.LINEDASHED, "builtin/linedashed.mat.json");

            DefaultMaterials.LINEDASHED_COLOR = this._createMaterial(DefaultShaders.LINEDASHED, "builtin/linedashed_color.mat.json")
                .addDefine(ShaderDefine.USE_COLOR);

            DefaultMaterials.MISSING = this._createMaterial(DefaultShaders.MESH_BASIC, "builtin/missing.mat.json")
                .setColor(Color.PURPLE);

            DefaultMaterials.SHADOW_DEPTH = this._createMaterial(DefaultShaders.DEPTH, "builtin/shadow_depth.mat.json")
                .addDefine(ShaderDefine.DEPTH_PACKING_3201);

            DefaultMaterials.SHADOW_DISTANCE = this._createMaterial(DefaultShaders.DISTANCE_RGBA, "builtin/shadow_distance.mat.json");

            DefaultMaterials.COPY = this._createMaterial(DefaultShaders.COPY, "builtin/copy.mat.json");
        }
    }
}
