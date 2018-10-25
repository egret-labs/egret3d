namespace egret3d {

    /**
     * 默认的贴图。
     */
    export class DefaultTextures extends paper.SingletonComponent {

        /**
         * 纯白色纹理
         */
        public static WHITE: Texture;

        /**
         * 纯灰色纹理
         */
        public static GRAY: Texture;

        /**
         * 黑白网格纹理
         */
        public static GRID: Texture;

        /**
         * 用于表示纹理丢失的紫色纹理
         */
        public static MISSING: Texture;

        public initialize() {
            super.initialize();
            {
                const texture = GLTexture2D.createColorTexture("builtin/white.image.json", 255, 255, 255);
                texture._isBuiltin = true;
                DefaultTextures.WHITE = texture;
                paper.Asset.register(texture);
            }

            {
                const texture = GLTexture2D.createColorTexture("builtin/gray.image.json", 128, 128, 128);
                texture._isBuiltin = true;
                DefaultTextures.GRAY = texture;
                paper.Asset.register(texture);
            }

            {
                const texture = GLTexture2D.createGridTexture("builtin/grid.image.json");
                texture._isBuiltin = true;
                DefaultTextures.GRID = texture;
                paper.Asset.register(texture);
            }

            {
                const texture = GLTexture2D.createColorTexture("builtin/missing.image.json", 255, 0, 255);
                texture._isBuiltin = true;
                DefaultTextures.MISSING = texture;
                paper.Asset.register(texture);
            }
        }
    }
}
