namespace paper {
    /**
     * 
     */
    export class BaseObjectAsset extends Asset {
        protected _raw: ISerializedData = null as any;
        /**
         * @internal
         */
        $parse(json: ISerializedData) {
            this._raw = json;
        }

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            this._raw = null!;

            return true;
        }

        public caclByteLength() {
            return 0;
        }
    }

    /**
     * scene asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 场景数据资源
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class RawScene extends BaseObjectAsset {
        /**
         * @internal
         */
        public createInstance(keepUUID: boolean = false) {
            if (!this._raw) {
                return null;
            }

            const isEditor = Application.playerMode === PlayerMode.Editor;
            const deserializer = new paper.Deserializer();
            const scene = deserializer.deserialize(this._raw, keepUUID) as Scene | null;

            if (scene && isEditor) {

            }

            return scene;
        }
    }
}