namespace egret3d {
    /**
     * 
     */
    export class BaseObjectAsset extends paper.Asset {
        protected _raw: paper.ISerializedData = null;
        /**
         * @internal
         */
        $parse(json: paper.ISerializedData) {
            this._raw = json;
        }

        public dispose() {
            if (this._isBuiltin) {
                return;
            }

            this._raw = null;
        }

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

            return paper.deserialize<paper.GameObject>(this._raw);
        }
    }
}