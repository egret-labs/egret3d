namespace egret3d {

    export class DefaultTextures {

        static WHITE: Texture;
        static GRAY: Texture;
        static GRID: Texture;

        static init() {
            const t1 = GLTexture2D.createColorTexture("buildin/white.image.json", 255, 255, 255);
            this.WHITE = t1;
            
            const t2 = GLTexture2D.createColorTexture("buildin/gray.image.json", 128, 128, 128);
            this.GRAY = t2;

            const t3 = GLTexture2D.createGridTexture("buildin/grid.image.json");
            this.GRID = t3;

            paper.Asset.register(t1);
            paper.Asset.register(t2);
            paper.Asset.register(t3);
        }
    }
}
