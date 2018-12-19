namespace paper {
    /**
     * 基础预制体资源。
     * - 预制体资源和场景资源的基类。
     */
    export abstract class BasePrefabAsset extends Asset {
        /**
         * 
         */
        public readonly config: ISerializedData = null!;

        public constructor(config: ISerializedData, name: string) {
            super();
            
            this.name = name;
            this.config = config;
        }

        public dispose() {
            if (!super.dispose()) {
                return false;
            }

            (this.config as any) = null;

            return true;
        }
    }
    /**
     * 预制体资源。
     */
    export class Prefab extends BasePrefabAsset {
        /**
         * 通过预置体资源创建一个实体实例到激活或指定的场景。
         * @param name 资源的名称。
         */
        public static create(name: string): GameObject | null;
        /**
         * @param name 资源的名称。
         * @param x X 坐标。
         * @param y Y 坐标。
         * @param z Z 坐标。
         */
        public static create(name: string, x: number, y: number, z: number): GameObject | null;
        /**
         * @param name 资源的名称。
         * @param scene 指定的场景。
         */
        public static create(name: string, scene: Scene): GameObject | null;
        /**
         * @param name 资源的名称。
         * @param x X 坐标。
         * @param y Y 坐标。
         * @param z Z 坐标。
         * @param scene 指定的场景。
         */
        public static create(name: string, x: number, y: number, z: number, scene: Scene): GameObject | null;
        public static create(name: string, xOrScene?: number | Scene, y?: number, z?: number, scene?: Scene) {
            const prefab = Asset.find<Prefab>(name);
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
            if (!this.config) {
                return null;
            }

            const isEditor = Application.playerMode === PlayerMode.Editor;
            const deserializer = new Deserializer();
            const gameObject = deserializer.deserialize(this.config, keepUUID, isEditor, scene) as GameObject | null;

            if (gameObject && isEditor) {
                if (!gameObject.extras!.prefab) {
                    gameObject.extras!.prefab = this;
                }
            }

            return gameObject;
        }
    }
}