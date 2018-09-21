namespace paper {
    /**
     * 预制体资源。
     */
    export class Prefab extends BaseObjectAsset {
        /**
         * 
         */
        public static create(name: string): GameObject | null;
        public static create(name: string, x: number, y: number, z: number): GameObject | null;
        public static create(name: string, scene: Scene): GameObject | null;
        public static create(name: string, x: number, y: number, z: number, scene: Scene): GameObject | null;
        public static create(name: string, xOrScene?: number | Scene, y?: number, z?: number, scene?: Scene) {
            const prefab = paper.Asset.find<Prefab>(name);
            if (prefab && prefab instanceof Prefab) {
                if (xOrScene !== undefined && xOrScene !== null) {
                    if (xOrScene instanceof Scene) {
                        const gameObject = prefab.createInstance(xOrScene);
                        if (gameObject) {
                            gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                        }

                        return gameObject;
                    }
                    else {
                        const gameObject = prefab.createInstance(scene || null);
                        if (gameObject) {
                            gameObject.transform.setLocalPosition(xOrScene, y!, z!);
                        }

                        return gameObject;
                    }
                }
                else {
                    const gameObject = prefab.createInstance();
                    if (gameObject) {
                        gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                    }

                    return gameObject;
                }
            }
            else {
                console.warn("The prefab don't exists.", name);
            }

            return null;
        }

        /**
         * @deprecated
         */
        public createInstance(scene?: Scene | null, keepUUID?: boolean) {
            if (!this._raw) {
                return null;
            }

            const isEditor = Application.playerMode === PlayerMode.Editor;
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