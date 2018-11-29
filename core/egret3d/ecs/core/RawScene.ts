namespace paper {
    /**
     * 场景资源。
     */
    export class RawScene extends BasePrefabAsset {
        /**
         * @private
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

        public get name(): string {
            return this._raw.objects![0].name;
        }
    }
}