namespace egret3d {
    /**
     * 
     */
    export class DefaultMaterials extends paper.SingletonComponent {

        public static DefaultDiffuse: Material;
        public static Missing: Material;
        public static Line: Material;
        public static ShadowDepth: Material;
        public static ShadowDistance: Material;

        public initialize() {
            super.initialize();

            {
                const material = new Material(egret3d.DefaultShaders.DIFFUSE);
                material.name = "builtin/default_diffuse.mat.gltf";
                material._isBuiltin = true;
                DefaultMaterials.DefaultDiffuse = material;
            }

            {
                const material = new Material(egret3d.DefaultShaders.GIZMOS_COLOR);
                material.name = "builtin/missing.mat.gltf";
                material._isBuiltin = true;
                material.setVector4v("_Color", new Float32Array([1.0, 0.0, 1.0, 1.0]));
                DefaultMaterials.Missing = material;
            }

            {
                const material = new Material(egret3d.DefaultShaders.LINE);
                material.name = "builtin/line.mat.gltf";
                material._isBuiltin = true;
                DefaultMaterials.Line = material;
            }

            {
                const material = new Material(egret3d.DefaultShaders.SHADOW_DEPTH);
                material.name = "builtin/line.mat.gltf";
                material._isBuiltin = true;
                DefaultMaterials.ShadowDepth = material;
            }

            {
                const material = new Material(egret3d.DefaultShaders.LINE);
                material.name = "builtin/line.mat.gltf";
                material._isBuiltin = true;
                DefaultMaterials.Line = material;
            }

            DefaultMaterials.ShadowDepth = new Material(egret3d.DefaultShaders.SHADOW_DEPTH);
            DefaultMaterials.ShadowDistance = new Material(egret3d.DefaultShaders.SHADOW_DISTANCE);
        }
    }
}
