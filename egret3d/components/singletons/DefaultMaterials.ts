namespace egret3d {
    /**
     * 
     */
    export class DefaultMaterials extends paper.SingletonComponent {

        public static DefaultDiffuse: Material;
        public static MissingMaterial: Material;

        public static Line: Material;

        public static ShadowDepth: Material;
        public static ShadowDistance: Material;

        public initialize() {
            super.initialize();

            DefaultMaterials.DefaultDiffuse = new Material(egret3d.DefaultShaders.DIFFUSE);

            DefaultMaterials.MissingMaterial = new Material(egret3d.DefaultShaders.GIZMOS_COLOR);
            DefaultMaterials.MissingMaterial.setVector4v("_Color", new Float32Array([1.0, 0.0, 1.0, 1.0]));

            DefaultMaterials.Line = new Material(egret3d.DefaultShaders.LINE);

            DefaultMaterials.ShadowDepth = new Material(egret3d.DefaultShaders.SHADOW_DEPTH);

            DefaultMaterials.ShadowDistance = new Material(egret3d.DefaultShaders.SHADOW_DISTANCE);
        }
    }
}
