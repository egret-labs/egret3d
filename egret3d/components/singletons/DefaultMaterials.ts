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
        public static LINEDASHED_COLOR: Material;
        /**
         * 
         */
        public static LINEDASHED_COLOR_OVERLAY: Material;
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

        private _createMaterial(name: string, shader: Shader, renderQueue: paper.RenderQueue = paper.RenderQueue.Geometry) {
            const material = new Material(shader);
            material.name = name;
            material.renderQueue = renderQueue;
            material._isBuiltin = true;
            paper.Asset.register(material);

            return material;
        }

        public initialize() {
            super.initialize();

            DefaultMaterials.MESH_BASIC = this._createMaterial("builtin/meshbasic.mat.json", DefaultShaders.MESH_BASIC)
                .setTexture("map", DefaultTextures.WHITE);
            DefaultMaterials.LINEDASHED_COLOR = this._createMaterial("builtin/linedashed_color.mat.json", DefaultShaders.LINEDASHED)
                .addDefine("USE_COLOR");
            DefaultMaterials.LINEDASHED_COLOR_OVERLAY = this._createMaterial("builtin/linedashed_color.mat.json", DefaultShaders.LINEDASHED)
                .addDefine("USE_COLOR").setDepth(false, false);
            DefaultMaterials.LINEDASHED_COLOR_OVERLAY.renderQueue = paper.RenderQueue.Overlay;

            DefaultMaterials.MISSING = this._createMaterial("builtin/missing.mat.json", DefaultShaders.MESH_BASIC)
                .setVector3v("diffuse", new Float32Array([1.0, 0.0, 1.0]));
            DefaultMaterials.SHADOW_DEPTH = this._createMaterial("builtin/shadow_depth.mat.json", DefaultShaders.DEPTH)
                .addDefine("DEPTH_PACKING 3201");
            DefaultMaterials.SHADOW_DISTANCE = this._createMaterial("builtin/shadow_distance.mat.json", DefaultShaders.DISTANCE_RGBA);
        }
    }
}
