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
            if (this._isBuiltin) {
                return;
            }

            this._raw = null as any;
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
         * 
         */
        public static create(name: string, scene: Scene | null = null) {
            const prefab = paper.Asset.find<Prefab>(name);
            if (prefab) {
                return prefab.createInstance(scene);
            }

            return null;
        }

        /**
         * @deprecated
         */
        public createInstance(scene: Scene | null = null) {
            if (!this._raw) {
                return null;
            }

            const isEditor = Application.isEditor && !Application.isPlaying;
            const deserializer = new paper.Deserializer();
            const gameObject = deserializer.deserialize(this._raw, false, isEditor, scene) as GameObject | null;

            if (gameObject && isEditor) {
                gameObject.extras!.prefab = this;
            }

            return gameObject;
        }
    }
}