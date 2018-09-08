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
                .setTexture(ShaderUniformNames.Map, DefaultTextures.WHITE);
            DefaultMaterials.LINEDASHED_COLOR = this._createMaterial("builtin/linedashed_color.mat.json", DefaultShaders.LINEDASHED)
                .addDefine(ShaderDefines.USE_COLOR);
            DefaultMaterials.MISSING = this._createMaterial("builtin/missing.mat.json", DefaultShaders.MESH_BASIC)
                .setVector3v(ShaderUniformNames.Diffuse, new Float32Array([1.0, 0.0, 1.0]));
            DefaultMaterials.SHADOW_DEPTH = this._createMaterial("builtin/shadow_depth.mat.json", DefaultShaders.DEPTH)
                .addDefine(ShaderDefines.DEPTH_PACKING_3201);
            DefaultMaterials.SHADOW_DISTANCE = this._createMaterial("builtin/shadow_distance.mat.json", DefaultShaders.DISTANCE_RGBA);
        }
    }
}
