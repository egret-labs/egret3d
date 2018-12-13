namespace paper {
    /**
     * 场景。
     */
    export class Scene extends BaseObject {
        /**
         * 创建一个空场景。
         * @param name 场景的名称。
         */
        public static createEmpty(name: string = DefaultNames.NoName, isActive: boolean = true) {
            // const exScene = Application.sceneManager.getSceneByName(name); TODO
            // if (exScene) {
            //     console.warn("The scene with the same name already exists.");
            //     return exScene;
            // }

            const scene = new Scene(name);
            Application.sceneManager.addScene(scene, isActive);

            return scene;
        }
        /**
         * 通过指定的场景资源创建一个场景。
         * @param name 场景资源的名称。
         */
        public static create(name: string, combineStaticObjects: boolean = true) {
            const rawScene = Asset.find<RawScene>(name);

            if (rawScene && rawScene instanceof RawScene) {
                if (rawScene) {
                    const existedScene = Application.sceneManager.getScene(rawScene.name);
                    if (existedScene) {
                        console.warn("The scene with the same name already exists.");
                        return existedScene;
                    }
                }

                const scene = rawScene.createInstance();

                if (scene) {
                    if (combineStaticObjects && Application.playerMode !== PlayerMode.Editor) {
                        egret3d.combine(scene.gameObjects);
                    }

                    return scene;
                }
            }
            else {
                console.warn("The scene don't exists.", name);
            }

            return null;
        }
        /**
         * 全局静态的场景。
         * - 全局场景无法被销毁。
         */
        public static get globalScene() {
            return Application.sceneManager.globalScene;
        }
        /**
         * 全局静态编辑器的场景。
         */
        public static get editorScene() {
            return Application.sceneManager.editorScene;
        }
        /**
         * 当前激活的场景。
         */
        public static get activeScene() {
            return Application.sceneManager.activeScene;
        }
        public static set activeScene(value: Scene) {
            Application.sceneManager.activeScene = value;
        }
        /**
         * 该场景的名称。
         */
        @serializedField
        public readonly name: string = "";
        /**
         * 额外数据，仅保存在编辑器环境，项目发布时该数据将被移除。
         */
        @serializedField
        public extras?: any = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        /**
         * 该场景使用光照贴图时的光照强度。
         */
        @serializedField
        @editor.property(editor.EditType.FLOAT, { minimum: 0.0 })
        public lightmapIntensity: number = 1.0;
        /**
         * 该场景的环境光。
         */
        @serializedField
        @editor.property(editor.EditType.COLOR)
        public readonly ambientColor: egret3d.Color = egret3d.Color.create(0.20, 0.20, 0.25, 1.0);
        /**
         * 该场景的雾。
         */
        @serializedField
        @editor.property(editor.EditType.NESTED)
        public readonly fog: egret3d.Fog = egret3d.Fog.create();

        private readonly _gameObjects: GameObject[] = [];
        private readonly _lightmaps: (egret3d.BaseTexture | null)[] = [];

        private constructor(name: string) {
            super();

            this.name = name;
        }
        /**
         * @internal
         */
        public addGameObject(gameObject: GameObject) {
            if (this._gameObjects.indexOf(gameObject) >= 0) {
                console.warn("Add game object error.", gameObject.path);
                return;
            }

            this._gameObjects.push(gameObject);
        }
        /**
         * @internal
         */
        public removeGameObject(gameObject: GameObject) {
            const index = this._gameObjects.indexOf(gameObject);

            if (index < 0) {
                console.warn("Remove game object error.", gameObject.path);
                return;
            }

            this._gameObjects.splice(index, 1);
        }
        /**
         * 场景被销毁后，内部卸载。
         * @internal
         */
        public uninitialize() {
            for (const lightmap of this._lightmaps) {
                if (lightmap) {
                    lightmap.release();
                }
            }

            // TODO
            // this.name = "";
            // this.extras

            this.lightmapIntensity = 1.0;
            this.ambientColor.set(0.20, 0.20, 0.25, 1.0);
            // this.fog.clear();
            this._lightmaps.length = 0;
        }
        /**
         * 销毁该场景和场景中的全部实体。
         */
        public destroy(): boolean {
            if (!Application.sceneManager.removeScene(this)) {
                return false;
            }

            let i = this._gameObjects.length;
            while (i--) {
                const gameObject = this._gameObjects[i];
                if (!gameObject || gameObject.transform.parent) {
                    continue;
                }

                gameObject.destroy();
            }
            // 销毁的第一时间就将实体清除。
            this._gameObjects.length = 0;
            disposeCollecter.scenes.push(this);

            return true;
        }
        /**
         * 获取该场景指定名称或路径的第一个实体。
         * - 仅返回第一个符合条件的实体。
         * @param nameOrPath 名称或路径。
         */
        public find(nameOrPath: string): GameObject | null {
            const index = nameOrPath.indexOf("/");
            if (index > 0) {
                const firstName = nameOrPath.slice(0, index);
                for (const gameObject of this._gameObjects) {
                    if (gameObject.name === firstName) {
                        const child = gameObject.transform.find(nameOrPath.slice(index + 1));
                        return child ? child.gameObject : null;
                    }
                }
            }
            else {
                for (const gameObject of this._gameObjects) {
                    if (gameObject.name === nameOrPath) {
                        return gameObject;
                    }
                }
            }

            return null;
        }
        /**
         * 获取该场景指定标识的第一个实体。
         * - 仅返回第一个符合条件的实体。
         * @param tag 标识。
         */
        public findWithTag(tag: string): GameObject | null {
            for (const gameObject of this._gameObjects) {
                if (gameObject.tag === tag) {
                    return gameObject;
                }
            }

            return null;
        }
        /**
         * 获取该场景指定标识的全部实体。
         * - 返回符合条件的全部实体。
         * @param tag 标识。
         */
        public findGameObjectsWithTag(tag: string): GameObject[] {
            const gameObjects: GameObject[] = [];
            for (const gameObject of this._gameObjects) {
                if (gameObject.tag === tag) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
        }
        /**
         * 该场景的全部根实体。
         */
        public getRootGameObjects(): GameObject[] {
            const gameObjects: GameObject[] = [];
            for (const gameObject of this._gameObjects) {
                if (!gameObject.transform.parent) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
        }
        /**
         * 该场景的实体总数。
         */
        public get gameObjectCount(): uint {
            return this._gameObjects.length;
        }
        /**
         * 该场景的全部实体。
         */
        @serializedField
        @deserializedIgnore
        public get gameObjects(): ReadonlyArray<GameObject> {
            return this._gameObjects;
        }
        /**
         * 该场景的光照贴图列表。
         */
        @serializedField
        public get lightmaps(): ReadonlyArray<egret3d.BaseTexture | null> {
            return this._lightmaps;
        }
        public set lightmaps(value: ReadonlyArray<egret3d.BaseTexture | null>) {
            const lightmaps = this._lightmaps;

            for (const lightmap of lightmaps) {
                if (lightmap) {
                    lightmap.release();
                }
            }

            if (value !== lightmaps) {
                lightmaps.length = 0;

                for (const lightmap of value) {
                    lightmaps.push(lightmap);
                }
            }

            for (const lightmap of lightmaps) {
                if (lightmap) {
                    lightmap.retain();
                }
            }
        }
    }
}
