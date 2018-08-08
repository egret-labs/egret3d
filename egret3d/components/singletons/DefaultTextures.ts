namespace egret3d {
    /**
     * 
     */
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
                const texture = new Texture("builtin/white.image.gltf");
                texture._isBuiltin = true;
                texture.glTexture = GlTexture2D.createColorTexture(webgl, 255, 255, 255);
                paper.Asset.register(texture);
                DefaultTextures.WHITE = texture;
            }

            {
                const texture = new Texture("builtin/gray.image.gltf");
                texture._isBuiltin = true;
                texture.glTexture = GlTexture2D.createColorTexture(webgl, 128, 128, 128);
                paper.Asset.register(texture);
                DefaultTextures.GRAY = texture;
            }

            {
                const texture = new Texture("builtin/grid.image.gltf");
                texture._isBuiltin = true;
                texture.glTexture = egret3d.GlTexture2D.createGridTexture(webgl);
                paper.Asset.register(texture);
                DefaultTextures.GRID = texture;
            }
        }
    }
}
