namespace paper {
    /**
     * 场景类
     */
    export class Scene extends BaseObject {
        /**
         * 
         */
        public static createEmpty(name: string = DefaultNames.NoName, isActive: boolean = true) {
            // const exScene = Application.sceneManager.getSceneByName(name);
            // if (exScene) {
            //     console.warn("The scene with the same name already exists.");
            //     return exScene;
            // }

            const scene = new Scene(name);
            Application.sceneManager._addScene(scene, isActive);

            return scene;
        }
        /**
         * 
         */
        public static create(name: string, combineStaticObjects: boolean = true) {
            const exScene = Application.sceneManager.getSceneByName(name);
            if (exScene) {
                console.warn("The scene with the same name already exists.");
                return exScene;
            }

            const rawScene = paper.Asset.find<RawScene>(name);
            if (rawScene) {
                const scene = rawScene.createInstance();

                if (scene) {
                    if (combineStaticObjects && Application.playerMode !== PlayerMode.Editor) {
                        egret3d.combine(scene.gameObjects);
                    }

                    return scene;
                }
            }

            return null;
        }
        /**
         * lightmap强度
         */
        @serializedField
        public lightmapIntensity: number = 1.0;
        /**
         * 场景名称。
         */
        @serializedField
        public readonly name: string = "";
        /**
         * 场景的light map列表。
         */
        @serializedField
        public readonly lightmaps: egret3d.Texture[] = [];
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        @paper.serializedField
        public extras?: any = Application.playerMode === PlayerMode.Editor ? {} : undefined;
        /**
         * @internal
         */
        public readonly _gameObjects: GameObject[] = [];
        /**
         * 环境光
         */
        @paper.serializedField
        public readonly ambientColor: egret3d.Color = egret3d.Color.create(0.21, 0.22, 0.25, 1);
        private constructor(name: string) {
            super();

            this.name = name;
        }
        /**
         * @internal
         */
        public _addGameObject(gameObject: GameObject) {
            if (this._gameObjects.indexOf(gameObject) < 0) {
                this._gameObjects.push(gameObject);
            }
            else {
                console.debug("Add game object error.", gameObject.path);
            }
        }
        /**
         * @internal
         */
        public _removeGameObject(gameObject: GameObject) {
            const index = this._gameObjects.indexOf(gameObject);
            if (index >= 0) {
                this._gameObjects.splice(index, 1);
            }
            else {
                console.debug("Remove game object error.", gameObject.path);
            }
        }
        /**
         * 
         */
        public destroy() {
            if (!Application.sceneManager._removeScene(this)) {
                return;
            }

            let i = this._gameObjects.length;
            while (i--) {
                const gameObject = this._gameObjects[i];
                if (!gameObject || gameObject.transform.parent) {
                    continue;
                }

                gameObject.destroy();
            }

            this.lightmaps.length = 0;
            this._gameObjects.length = 0;
        }
        /**
         * 
         */
        public find(nameOrPath: string) {
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
         * 
         */
        public findWithTag(tag: string) {
            for (const gameObject of this._gameObjects) {
                if (gameObject.tag === tag) {
                    return gameObject;
                }
            }

            return null;
        }
        /**
         * 
         */
        public findGameObjectsWithTag(tag: string) {
            const gameObjects: GameObject[] = [];
            for (const gameObject of this._gameObjects) {
                if (gameObject.tag === tag) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
        }
        /**
         * 所有根实体。
         */
        public getRootGameObjects() {
            const gameObjects: GameObject[] = [];
            for (const gameObject of this._gameObjects) {
                if (!gameObject.transform.parent) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
        }
        /**
         * 
         */
        public get gameObjectCount() {
            return this._gameObjects.length;
        }
        /**
         * 所有实体。
         */
        @serializedField
        @deserializedIgnore
        public get gameObjects(): ReadonlyArray<GameObject> {
            return this._gameObjects;
        }
    }
}
