namespace egret3d {

    export class DefaultTextures {

        static WHITE: Texture;
        static GRAY: Texture;
        static GRID: Texture;

        static init() {
            // const t1 = new Texture("buildin/white.image.json");
            // t1.glTexture = GlTexture2D.createColorTexture("buildin/white.image.json", 255, 255, 255);
            const t1 = GLTexture2D.createColorTexture("buildin/white.image.json", 255, 255, 255);
            this.WHITE = t1;

            // const t2 = new Texture("buildin/gray.image.json");
            // t2.glTexture = GlTexture2D.createColorTexture("buildin/gray.image.json",128, 128, 128);
            const t2 = GLTexture2D.createColorTexture("buildin/gray.image.json", 128, 128, 128);
            this.GRAY = t2;

            // const t3 = new Texture("buildin/grid.image.json");
            // t3.glTexture = egret3d.GlTexture2D.createGridTexture("buildin/grid.image.json");
            const t3 = GLTexture2D.createGridTexture("buildin/grid.image.json");
            this.GRID = t3;

            paper.Asset.register(t1);
            paper.Asset.register(t2);
            paper.Asset.register(t3);
        }
    }
}
