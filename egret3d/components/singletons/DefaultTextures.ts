namespace egret3d {

    export class DefaultTextures extends paper.SingletonComponent {
        /**
         * 
         */
        public static WHITE: GLTexture;
        /**
         * 
         */
        public static GRAY: GLTexture;
        /**
         * 
         */
        public static GRID: GLTexture;

        public initialize() {
            {
                const texture = GLTexture2D.createColorTexture("builtin/white.image.gltf", 255, 255, 255);
                texture._isBuiltin = true;
                DefaultTextures.WHITE = texture;
                paper.Asset.register(texture);
            }

            {
                const texture = GLTexture2D.createColorTexture("builtin/gray.image.gltf", 128, 128, 128);
                texture._isBuiltin = true;
                DefaultTextures.GRAY = texture;
                paper.Asset.register(texture);
            }

            {
                const texture = GLTexture2D.createGridTexture("builtin/grid.image.gltf");
                texture._isBuiltin = true;
                DefaultTextures.GRID = texture;
                paper.Asset.register(texture);
            }
        }
    }
}
