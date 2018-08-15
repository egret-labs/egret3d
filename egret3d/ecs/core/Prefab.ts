namespace paper {
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
                const gameObject = prefab.createInstance(scene);
                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);

                return gameObject;
            }

            return null;
        }

        /**
         * @deprecated
         */
        public createInstance(scene: Scene | null = null, keepUUID: boolean = false) {
            if (!this._raw) {
                return null;
            }

            const isEditor = Application.isEditor && !Application.isPlaying;
            const deserializer = new paper.Deserializer();
            const gameObject = deserializer.deserialize(this._raw, keepUUID, isEditor, scene) as GameObject | null;

            if (gameObject && isEditor) {
                if (!gameObject.extras!.prefab) {
                    gameObject.extras!.prefab = this;
                }
            }

            return gameObject;
        }
    }
}