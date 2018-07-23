namespace egret3d {

    export class DefaultTextures {

        static WHITE: Texture;
        static GRAY: Texture;
        static GRID: Texture;

        static init() {

            const gl = WebGLRenderUtils.webgl;

            const t1 = new Texture("white");
            t1.glTexture = GlTexture2D.createColorTexture(gl, 255, 255, 255);
            this.WHITE = t1;

            const t2 = new Texture("gray");
            t2.glTexture = GlTexture2D.createColorTexture(gl, 128, 128, 128);
            this.GRAY = t2;

            const t3 = new Texture("grid");
            t3.glTexture = egret3d.GlTexture2D.createGridTexture(gl);
            this.GRID = t3;

            paper.Asset.register(t1);
            paper.Asset.register(t2);
            paper.Asset.register(t3);
        }
    }
}
