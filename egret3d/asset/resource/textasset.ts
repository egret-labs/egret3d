namespace egret3d {
    /**
     * text asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 文本资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class TextAsset extends paper.Asset {
        /**
         * 文本内容
         */
        public content: string = "";

        /**
         * @inheritDoc
         */
        public dispose() {
            this.content = "";
        }

        /**
         * @inheritDoc
         */
        public caclByteLength() {
            if (this.content) {
                return utils.caclStringByteLength(this.content);
            }

            return 0;
        }
    }
}
