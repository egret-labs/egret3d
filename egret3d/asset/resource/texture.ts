namespace egret3d {
    /**
     * textrue asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 纹理资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Texture extends paper.Asset {

        /**
         * gl texture 实例
         */
        glTexture: egret3d.ITexture;

        public dispose() {
            if (this._isBuiltin) {
                return;
            }
            this.glTexture.dispose(WebGLCapabilities.webgl);
        }

        /**
         * @inheritDoc
         */
        public caclByteLength(): number {
            if (this.glTexture) {
                return this.glTexture.caclByteLength();
            }

            return 0;
        }

        private _realName: string = "";

        /**
         * real image name
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 如果是imgdesc加载来的图片，通过这个可以获取到真实的图片名字。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public get realName(): string {
            return this._realName;
        }
        public set realName(name: string) {
            this._realName = name;
        }
    }
}
