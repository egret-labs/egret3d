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
        /**
         * 
         */
        public static MISSING: Texture;

        public static CAMERA_ICON: Texture;
        public static LIGHT_ICON: Texture;

        public initialize() {
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

            {
                const texture = new GLTexture2D("builtin/camera_icon.image.json");
                let image = new Image();
                image.setAttribute('src', paper.editor.icons["camera"]);
                image.onload = function () { texture.uploadImage(image, false, true, true, false); };
                texture._isBuiltin = true;
                DefaultTextures.CAMERA_ICON = texture;
                paper.Asset.register(texture);
            }

            {
                const texture = new GLTexture2D("builtin/light_icon.image.json");
                let image = new Image();
                image.setAttribute('src', paper.editor.icons["light"]);
                image.onload = function () { texture.uploadImage(image, false, true, true, false); };
                texture._isBuiltin = true;
                DefaultTextures.LIGHT_ICON = texture;
                paper.Asset.register(texture);
            }
        }
    }
}
