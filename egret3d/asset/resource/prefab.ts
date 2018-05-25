namespace egret3d {
    /**
     * 
     */
    export class BaseObjectAsset extends paper.Asset {
        protected readonly _assets: any = {};
        protected _raw: any = null;
        /**
         * TODO 应补全接口和枚举。
         * 
         */
        public $parse(jsonString: string) {
            // 兼容数据
            // jsonStr = jsonStr.replace(/localRotate/g, "localRotation");
            // jsonStr = jsonStr.replace(/localTranslate/g, "localPosition");

            this._raw = JSON.parse(jsonString);
            if (this._raw) {
                for (const item of this._raw.assets) {
                    if (item.url.indexOf("shader.json") < 0) {
                        this._assets[item.hashCode] = paper.Asset.find(utils.combinePath(utils.getPathByUrl(this.url) + "/", item.url));
                    }
                }
            }
        }
        /**
         * @inheritDoc
         */
        public dispose() {
            for (const k of this._assets) {
                delete this._assets[k];
            }

            this._raw = null;
        }
        /**
         * @inheritDoc
         */
        public caclByteLength() {
            return 0;
        }
    }
    /**
     * prefab asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 预制件资源。
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class Prefab extends BaseObjectAsset {
        /**
         * Create instance from this prefab.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 从当前预制件生成一个实例。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public createInstance() {
            if (!this._raw) {
                return null;
            }

            const gameObject = paper.deserialize<paper.GameObject>(this._raw, this._assets);

            return gameObject;
        }
        /**
         * @deprecated
         */
        public getClone() {
            return this.createInstance();
        }
    }
}