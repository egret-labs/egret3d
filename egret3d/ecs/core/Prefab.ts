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
                return prefab.createInstance(scene);
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
                gameObject.extras!.prefab = this;
            }

            return gameObject;
        }
    }
}