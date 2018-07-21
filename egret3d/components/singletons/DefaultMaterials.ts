namespace egret3d {
    /**
     * 
     */
    export class DefaultMaterials extends paper.SingletonComponent {

        public static DefaultDiffuse: Material;
        public static MissingMaterial: Material;

        public initialize() {
            super.initialize();

            DefaultMaterials.DefaultDiffuse = new Material("buildin/DefaultDiffuse");
            DefaultMaterials.DefaultDiffuse._isBuiltin = true;
            DefaultMaterials.DefaultDiffuse.setShader(egret3d.DefaultShaders.DIFFUSE);
            paper.Asset.register(DefaultMaterials.DefaultDiffuse);

            DefaultMaterials.MissingMaterial = new Material("buildin/MissingMaterial");
            DefaultMaterials.MissingMaterial._isBuiltin = true;
            DefaultMaterials.MissingMaterial.setShader(egret3d.DefaultShaders.MATERIAL_COLOR);
            DefaultMaterials.MissingMaterial.setVector4v("_Color", new Float32Array([1.0, 0.0, 1.0, 1.0]));
            paper.Asset.register(DefaultMaterials.DefaultDiffuse);
        }
    }
}
