namespace egret3d {
    export class DefaultMaterial {
        public static SHADOW_DEPTH: Material;
        public static SHADOW_DISTANCE: Material;


        private static _inited: boolean = false;
        public static init() {
            if (this._inited) {
                return;
            }
            this._inited = true;
            //
            
            this.SHADOW_DEPTH = new Material("shader/depth");
            this.SHADOW_DEPTH.setShader(egret3d.DefaultShaders.SHADOW_DEPTH);
            paper.Asset.register(this.SHADOW_DEPTH);

            this.SHADOW_DISTANCE = new Material("shader/distance");
            this.SHADOW_DISTANCE.setShader(egret3d.DefaultShaders.SHADOW_DISTANCE);
            paper.Asset.register(this.SHADOW_DISTANCE);
        }
    }
}