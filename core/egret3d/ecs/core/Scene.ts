namespace paper {
    export const enum FogMode {
        NONE,
        FOG,
        FOG_EXP2
    }
    /**
     * 场景类
     */
    export class Scene extends BaseObject {
        /**
         * 创建空场景。
         */
        public static createEmpty(name: string = DefaultNames.NoName, isActive: boolean = true) {
            // const exScene = Application.sceneManager.getSceneByName(name); TODO
            // if (exScene) {
            //     console.warn("The scene with the same name already exists.");
            //     return exScene;
            // }

            const scene = new Scene(name);
            Application.sceneManager._addScene(scene, isActive);

            return scene;
        }
        /**
         * 通过 Asset name 创建指定场景。
         */
        public static create(name: string, combineStaticObjects: boolean = true) {
            const exScene = Application.sceneManager.getSceneByName(name);
            if (exScene) {
                console.warn("The scene with the same name already exists.");
                return exScene;
            }

            const rawScene = paper.Asset.find<RawScene>(name);
            if (rawScene && rawScene instanceof RawScene) {
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
         * 全局静态场景。
         */
        public static get globalScene() {
            return Application.sceneManager.globalScene;
        }
        /**
         * 
         */
        public static get editorScene() {
            return Application.sceneManager.editorScene;
        }
        /**
         * 当前激活场景。
         */
        public static get activeScene() {
            return Application.sceneManager.activeScene;
        }
        public static set activeScene(value: Scene) {
            Application.sceneManager.activeScene = value;
        }
        /**
         * lightmap 表现的光照强度。
         */
        @serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public lightmapIntensity: number = 1.0;
        /**
         * 场景名称。
         */
        @serializedField
        public readonly name: string = "";
        /**
         * 环境光。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly ambientColor: egret3d.Color = egret3d.Color.create(0.20, 0.20, 0.25, 1);
        /**
         * 场景的 lightmap 列表。
         */
        @serializedField
        public readonly lightmaps: egret3d.Texture[] = [];
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum(paper.FogMode) })
        public fogMode: FogMode = FogMode.NONE;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly fogColor: egret3d.Color = egret3d.Color.create(0.5, 0.5, 0.5, 1);
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public fogDensity: number = 0.01;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.001, step: 1.0 })
        public fogNear: number = 0.001;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.001, step: 1.0 })
        public fogFar: number = 300.0;
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        @paper.serializedField
        public extras?: any = Application.playerMode === PlayerMode.Editor ? {} : undefined;
        /**
         * TODO
         * @internal
         */
        public readonly _gameObjects: GameObject[] = [];
        /**
         * 请使用 `paper.Scene.createEmpty()` 创建实例。
         * @see paper.Scene.createEmpty()
         * @see paper.Scene.create()
         */
        private constructor(name: string) {
            super();

            this.name = name;
        }
        /**
         * @internal
         */
        public _addGameObject(gameObject: GameObject) {
            if (this._gameObjects.indexOf(gameObject) >= 0) {
                console.warn("Add game object error.", gameObject.path);
            }

            this._gameObjects.push(gameObject);
        }
        /**
         * @internal
         */
        public _removeGameObject(gameObject: GameObject) {
            const index = this._gameObjects.indexOf(gameObject);

            if (index < 0) {
                console.warn("Remove game object error.", gameObject.path);
            }

            this._gameObjects.splice(index, 1);
        }
        /**
         * 
         */
        public uninitialize() {
            this.lightmapIntensity = 1.0;
            // this.name = "";
            this.ambientColor.set(0.20, 0.20, 0.25, 1);
            this.lightmaps.length = 0;
            // this.extras
        }
        /**
         * 销毁场景。
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
            //
            this._gameObjects.length = 0;

            GameObject.globalGameObject.getOrAddComponent(DisposeCollecter).scenes.push(this);
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
