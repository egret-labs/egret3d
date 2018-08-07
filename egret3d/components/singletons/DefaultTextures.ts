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

            const webgl = WebGLCapabilities.webgl;
            {
                const texture = new Texture("builtin/white.image.json");
                paper.Asset.register(texture);
                texture.glTexture = GlTexture2D.createColorTexture(webgl, 255, 255, 255);
                DefaultTextures.WHITE = texture;
            }

            {
                const texture = new Texture("builtin/gray.image.json");
                paper.Asset.register(texture);
                texture.glTexture = GlTexture2D.createColorTexture(webgl, 128, 128, 128);
                DefaultTextures.GRAY = texture;
            }

            {
                const texture = new Texture("builtin/grid.image.json");
                texture.glTexture = egret3d.GlTexture2D.createGridTexture(webgl);
                paper.Asset.register(texture);
                DefaultTextures.GRID = texture;
            }
        }
    }
}
