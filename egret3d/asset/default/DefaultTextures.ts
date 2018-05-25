namespace egret3d {

    export class DefaultTextures {

        public static WHITE: Texture;
        public static GRAY: Texture;
        public static GRID: Texture;

        private static _inited: boolean = false;

        public static init() {
            if (this._inited) {
                return;
            }

            this._inited = true;

            const gl = WebGLKit.webgl;

            const t1 = new Texture("white");
            t1.glTexture = egret3d.GlTexture2D.staticTexture(gl, "white");
            t1.url = "white";
            // t1.defaultAsset = true;
            this.WHITE = t1;

            const t2 = new Texture("gray");
            t2.glTexture = egret3d.GlTexture2D.staticTexture(gl, "gray");
            // t2.defaultAsset = true;
            t2.url = "gray";
            this.GRAY = t2;

            const t3 = new Texture("grid");
            t3.glTexture = egret3d.GlTexture2D.staticTexture(gl, "grid");
            // t3.defaultAsset = true;
            t3.url = "grid";
            this.GRID = t3;

            paper.Asset.register(this.WHITE);
            paper.Asset.register(this.GRAY);
            paper.Asset.register(this.GRID);
        }
    }
}
