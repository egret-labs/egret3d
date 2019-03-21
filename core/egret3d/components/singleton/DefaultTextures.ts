namespace egret3d {
    /**
     * 默认的纹理资源。
     */
    @paper.singleton
    export class DefaultTextures extends paper.BaseComponent {
        /**
         * 纯白色纹理。
         * - 注意请不要修改该值。
         */
        public static WHITE: BaseTexture;
        /**
         * 纯灰色纹理。
         * - 注意请不要修改该值。
         */
        public static GRAY: BaseTexture;
        /**
         * 黑白网格纹理。
         * - 注意请不要修改该值。
         */
        public static GRID: BaseTexture;
        /**
         * 用于表示纹理资源丢失的纹理。
         * - 注意请不要修改该值。
         */
        public static MISSING: BaseTexture;

        public initialize() {
            super.initialize();

            let texture: BaseTexture;

            texture = Texture.createColorTexture("builtin/white.image.json", 255, 255, 255);
            DefaultTextures.WHITE = texture;
            paper.Asset.register(texture);

            texture = Texture.createColorTexture("builtin/gray.image.json", 128, 128, 128);
            DefaultTextures.GRAY = texture;
            paper.Asset.register(texture);

            texture = Texture.createGridTexture("builtin/grid.image.json");
            DefaultTextures.GRID = texture;
            paper.Asset.register(texture);

            texture = Texture.createColorTexture("builtin/missing.image.json", 255, 0, 255);
            DefaultTextures.MISSING = texture;
            paper.Asset.register(texture);
        }
    }
}
