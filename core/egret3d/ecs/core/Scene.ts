namespace paper {
    /**
     * 场景。
     */
    export class Scene extends BaseObject implements IScene {
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

            const scene = new Scene();
            scene.name = name;
            SceneManager.getInstance().onSceneCreated.dispatch([scene, isActive]);

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
                    const existedScene = Application.sceneManager.getScene(rawScene.sceneName);
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
         * 该场景的名称。
         */
        @serializedField
        public name: string = "";
        /**
         * 额外数据，仅保存在编辑器环境，项目发布时该数据将被移除。
         */
        @serializedField
        public extras?: any = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        private _isDestroyed: boolean = true;
        private readonly _entities: IEntity[] = [];

        private constructor() {
            super();
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

        public initialize(): void {
        }

        public uninitialize(): void {
            this.name = "";

            if (this.extras) { // Editor. TODO
                this.extras = {};
            }
        }
        /**
         * 销毁该场景和场景中的全部实体。
         */
        public destroy(): boolean {
            const sceneManager = SceneManager.getInstance();

            if (this._isDestroyed) {
                console.warn("The scene has been destroyed.");
                return false;
            }

            if (this === sceneManager.globalScene || this === sceneManager.globalScene) {
                // console.warn("The scene has been destroyed.");
                return false;
            }

            const entities = this._entities;
            sceneManager.onSceneDestroy.dispatch(this);

            let i = entities.length;
            while (i--) {
                const entity = entities[i];

                if (!entity || entity.isDestroyed) {
                    continue;
                }

                entity.destroy();
            }

            this._isDestroyed = true;
            entities.length = 0;
            sceneManager.onSceneDestroyed.dispatch(this);

            return true;
        }

        public getEntityByName(name: string): IEntity | null {
            for (const entity of this._entities) {
                if (entity.name === name) {
                    return entity;
                }
            }

            return null;
        }

        public containsEntity(entity: IEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }

        public get isDestroyed(): boolean {
            return this._isDestroyed;
        }

        public get entityCount(): uint {
            return this._entities.length;
        }

        public get entities(): ReadonlyArray<IEntity> {
            return this._entities;
        }
    }
}
