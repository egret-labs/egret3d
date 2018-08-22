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
         * @internal
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

        private _createMaterial(shaderName: string, name: string, renderQueue: paper.RenderQueue) {
            const shader = paper.Asset.find<GLTFAsset>(shaderName)!;
            if (!shader) {
                console.debug("Cannot find builtin shader.", shaderName);
            }

            const material = new Material(shader);
            material.name = name;
            material.renderQueue = renderQueue;
            material._isBuiltin = true;
            paper.Asset.register(material);

            return material;
        }

        public initialize() {
            super.initialize();

            DefaultMaterials.MESH_BASIC = this._createMaterial("builtin/meshbasic.shader.json", "builtin/meshbasic.mat.json", paper.RenderQueue.Geometry)
                .setTexture("map", DefaultTextures.GRAY);
            DefaultMaterials.MISSING = this._createMaterial("builtin/meshbasic.shader.json", "builtin/missing.mat.json", paper.RenderQueue.Geometry)
                .setVector3v("diffuse", new Float32Array([1.0, 0.0, 1.0]));
            DefaultMaterials.SHADOW_DEPTH = this._createMaterial("builtin/raw_depth.shader.json", "builtin/shadow_depth.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None).addDefine("DEPTH_PACKING 3201");
            DefaultMaterials.SHADOW_DISTANCE = this._createMaterial("builtin/raw_distanceRGBA.shader.json", "builtin/shadow_distance.mat.json", paper.RenderQueue.Geometry)
                .setDepth(true, true).setCullFace(false).setBlend(gltf.BlendMode.None);
        }
    }
}
