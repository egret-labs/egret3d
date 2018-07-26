namespace paper {
    /**
     * 
     */
    export class BaseObjectAsset extends Asset {
        protected _raw: ISerializedData = null;
        /**
         * @internal
         */
        $parse(json: ISerializedData) {
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

            const gameObject = paper.deserialize<GameObject>(this._raw);
            if (gameObject) {
                gameObject.prefab = this;
            }

            return gameObject;
        }
    }
}