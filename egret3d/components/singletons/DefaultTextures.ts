namespace egret3d {

    export class DefaultTextures extends paper.SingletonComponent {
        /**
         * 
         */
        public static WHITE: Texture;
        /**
         * 
         */
        public static GRAY: Texture;
        /**
         * 
         */
        public static GRID: Texture;

        public initialize() {
            {
                const texture = GLTexture2D.createColorTexture("buildin/white.image.json", 255, 255, 255);
                DefaultTextures.WHITE = texture;
                paper.Asset.register(texture);
            }
            {
                const texture = GLTexture2D.createColorTexture("buildin/gray.image.json", 128, 128, 128);
                DefaultTextures.GRAY = texture;
                paper.Asset.register(texture);
            }
            {
                const texture = GLTexture2D.createGridTexture("buildin/grid.image.json");
                DefaultTextures.GRID = texture;
                paper.Asset.register(texture);
            }
        }
    }
}
