namespace egret3d {

    /**
     * Asset Bundle
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 资源包.
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class AssetBundle extends paper.Asset {

        public readonly assets: { url: string }[] = [];

        /**
         * @inheritDoc
         */
        public dispose() {
            this.assets.length = 0;
        }

        /**
         * @inheritDoc
         */
        public caclByteLength(): number {
            return 0;
        }

        /**
         * 
         */
        public $parse(json: { assets?: any[] }) {
            this.assets.length = 0;

            if (!json.assets || json.assets.length === 0) {
                return;
            }

            for (const asset of json.assets) {
                this.assets.push(asset);
            }
        }
    }
}
