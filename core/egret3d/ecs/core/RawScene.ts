namespace paper {
    /**
     * 场景资源。
     */
    export class RawScene extends BasePrefabAsset {
        /**
         * @deprecated
         */
        public createInstance(keepUUID: boolean = false) {
            if (!this.config) {
                return null;
            }

            const isEditor = Application.playerMode === PlayerMode.Editor;
            const deserializer = new Deserializer();
            const scene = deserializer.deserialize(this.config, keepUUID) as Scene | null;

            if (scene && isEditor) {

            }

            return scene;
        }

        public get sceneName(): string {
            return (this.config.objects![0] as any).name;
        }
    }
}