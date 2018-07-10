namespace egret3d {

    export type PrefabConfig = {
        assets: { uuid: string, hashCode: string, class: string, url: string }[]; // 兼容 hashCode 。
        objects: any[];
    }

    /**
     * 
     */
    export class BaseObjectAsset extends paper.Asset {
        protected readonly _assets: { [index: string]: paper.Asset } = {};
        protected _raw: PrefabConfig = null;

        public $parse(json: PrefabConfig, subAssets: paper.Asset[]) {

            this._raw = json;
            for (let item of subAssets) {
                this._assets[item.hashCode || item.uuid] = item; // 兼容 hashCode 。
            }
        }
        /**
         * @inheritDoc
         */
        public dispose() {
            for (const k in this._assets) {
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
     * 预制体资源。
     */
    export class Prefab extends BaseObjectAsset {

        /**
         * 从当前预制体生成一个实例。
         */
        public createInstance() {
            if (!this._raw) {
                return null;
            }

            const gameObject = paper.deserialize<paper.GameObject>(this._raw, this._assets, true);

            return gameObject;
        }
    }
}