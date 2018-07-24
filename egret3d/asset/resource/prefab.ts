namespace egret3d {

    export type PrefabConfig = {
        assets: { uuid: string, hashCode: string, class: string, url: string }[]; // 兼容 hashCode 。
        objects: any[];
    }

    /**
     * 
     */
    export class BaseObjectAsset extends paper.Asset {
        protected readonly _assets: any = {};
        protected _raw: PrefabConfig = null;

        public $parse(json: PrefabConfig) {

            this._raw = json;
            if (this._raw) {
                for (const item of this._raw.assets) {
                    if (item.url.indexOf("shader.json") < 0) {
                        this._assets[item.hashCode || item.uuid] = paper.Asset.find(utils.combinePath(utils.getPathByUrl(this.url) + "/", item.url)); // 兼容 hashCode 。
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
        public createInstance(isCreate:boolean = true) {
            if (!this._raw) {
                return null;
            }

            const gameObject = paper.deserialize<paper.GameObject>(this._raw, this._assets,isCreate);

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