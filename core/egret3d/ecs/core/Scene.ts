namespace paper {
    /**
     * 场景。
     */
    export class Scene extends BaseObject implements IScene {
        /**
         * 创建一个空场景。
         * @param name 场景的名称。
         */
        public static createEmpty<TScene extends Scene>(name: string = DefaultNames.NoName, isActive: boolean = true): TScene {
            const scene = new paper.Scene();
            scene._isDestroyed = false;
            scene.name = name;
            SceneManager.getInstance<TScene>().onSceneCreated.dispatch([scene as TScene, isActive]);

            return scene as TScene;
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
                        // egret3d.combine(scene.gameObjects); // TODO
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
        private readonly _entities: Entity[] = [];

        private constructor() {
            super();
        }

        public initialize(): void {
        }

        public uninitialize(): void {
            this.name = "";

            if (this.extras) { // Editor. TODO
                this.extras = {};
            }
        }

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

        public addEntity(entity: Entity): boolean {
            if (this._isDestroyed) {
                if (DEBUG) {
                    console.warn("The scene has been destroyed.");
                }

                return false;
            }

            const entities = this._entities;

            if (entities.indexOf(entity) < 0) {
                entities.push(entity);
                entity.scene = this;

                return true;
            }

            return false;
        }

        public removeEntity(entity: Entity): boolean {
            if (this._isDestroyed) {
                if (DEBUG) {
                    console.warn("The scene has been destroyed.");
                }

                return false;
            }

            const entities = this._entities;
            const index = entities.indexOf(entity);

            if (index >= 0) {
                entities.splice(index, 1);
                entity.scene = null;

                return true;
            }

            return false;
        }

        public containsEntity(entity: Entity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }

        public getEntityByName(name: string): Entity | null {
            for (const entity of this._entities) {
                if (entity.name === name) {
                    return entity;
                }
            }

            return null;
        }

        public get isDestroyed(): boolean {
            return this._isDestroyed;
        }

        public get entityCount(): uint {
            return this._entities.length;
        }

        public get entities(): ReadonlyArray<Entity> {
            return this._entities;
        }
    }
}
