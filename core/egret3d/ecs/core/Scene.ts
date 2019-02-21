namespace paper {
    /**
     * 场景。
     */
    export class Scene extends BaseObject implements IScene {
        /**
         * 当场景被创建时派发事件。
         */
        public static readonly onSceneCreated: signals.Signal<[Scene, boolean]> = new signals.Signal();
        /**
         * 当场景将要被销毁时派发事件。
         */
        public static readonly onSceneDestroy: signals.Signal<Scene> = new signals.Signal();
        /**
         * 当场景被销毁时派发事件。
         */
        public static readonly onSceneDestroyed: signals.Signal<Scene> = new signals.Signal();
        /**
         * 创建一个空场景。
         * @param name 场景的名称。
         */
        public static createEmpty(name: string = DefaultNames.NoName, isActive: boolean = true): Scene {
            const scene = new paper.Scene();
            scene._isDestroyed = false;
            scene.name = name;
            this.onSceneCreated.dispatch([scene, isActive]);

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
                    //#ifdef EGRET_3D
                    if (combineStaticObjects && Application.playerMode !== PlayerMode.Editor) {
                        egret3d.combine(scene.gameObjects); // TODO
                    }
                    //#endif

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
        public static get globalScene(): Scene {
            return Application.sceneManager.globalScene;
        }
        /**
         * 全局静态编辑器的场景。
         */
        public static get editorScene(): Scene {
            return Application.sceneManager.editorScene;
        }
        /**
         * 当前激活的场景。
         */
        public static get activeScene(): Scene {
            return Application.sceneManager.activeScene;
        }
        public static set activeScene(value: Scene) {
            Application.sceneManager.activeScene = value;
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
        private _entitiesDirty: boolean = false;
        private readonly _entities: IEntity[] = [];
        private readonly _rootEntities: IEntity[] = [];

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

            this._entitiesDirty = false;
            this._entities.length = 0;
            this._rootEntities.length = 0;

            //#ifdef EGRET_3D
            for (const lightmap of this._lightmaps) {
                if (lightmap) {
                    lightmap.release();
                }
            }

            this.lightmapIntensity = 1.0;
            this.ambientColor.set(0.20, 0.20, 0.25, 1.0);
            // this.fog.clear();

            this._lightmaps.length = 0;
            //#endif
        }

        public destroy(): boolean {
            const sceneManager = Application.sceneManager;

            if (this._isDestroyed) {
                console.warn("The scene has been destroyed.");
                return false;
            }

            if (this === sceneManager.globalScene || this === sceneManager.globalScene) {
                // console.warn("The scene has been destroyed.");
                return false;
            }

            const entities = this._entities;
            Scene.onSceneDestroy.dispatch(this);

            let i = entities.length;
            while (i--) {
                const entity = entities[i];

                if (!entity || entity.isDestroyed) {
                    continue;
                }

                entity.destroy();
            }

            this._isDestroyed = true;
            this._entitiesDirty = true;
            entities.length = 0;
            Scene.onSceneDestroyed.dispatch(this);

            return true;
        }

        public addEntity(entity: IEntity): boolean {
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
                this._entitiesDirty = true;

                return true;
            }

            return false;
        }

        public removeEntity(entity: IEntity): boolean {
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
                entity.scene = Application.sceneManager.globalScene; //
                this._entitiesDirty = true;

                return true;
            }

            return false;
        }

        public containsEntity(entity: IEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }

        public find<TEntity extends IEntity>(name: string): TEntity | null {
            for (const entity of this._entities) {
                if (entity.name === name) {
                    return entity as TEntity;
                }
            }

            return null;
        }
        /**
         * 获取该场景指定标识的第一个实体。
         * - 仅返回第一个符合条件的实体。
         * @param tag 标识。
         */
        public findWithTag<TEntity extends IEntity>(tag: string): TEntity | null {
            for (const entity of this._entities) {
                if (entity.tag === tag) {
                    return entity as TEntity;
                }
            }

            return null;
        }
        /**
         * 获取该场景指定标识的全部实体。
         * - 返回符合条件的全部实体。
         * @param tag 标识。
         */
        public findEntitiesWithTag<TEntity extends IEntity>(tag: string): TEntity[] {
            const entities: TEntity[] = [];

            for (const entity of this._entities) {
                if (entity.tag === tag) {
                    entities.push(entity as TEntity);
                }
            }

            return entities;
        }

        public get isDestroyed(): boolean {
            return this._isDestroyed;
        }

        public get entityCount(): uint {
            return this._entities.length;
        }

        @serializedField("gameObjects")
        @deserializedIgnore
        public get entities(): ReadonlyArray<IEntity> {
            return this._entities;
        }

        public get rootEntities(): ReadonlyArray<IEntity> {
            const rootEntities = this._rootEntities;

            if (this._entitiesDirty) {
                for (const entity of this._entities) {
                    if (entity instanceof GameObject && !entity.transform.parent) {
                        rootEntities.push(entity);
                    }
                }

                this._entitiesDirty = false;
            }

            return rootEntities;
        }
        //#ifdef EGRET_3D
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
        public readonly fog: egret3d.Fog = egret3d.Fog.create(this);
        /**
         * 
         */
        public readonly defines: egret3d.Defines = new egret3d.Defines();

        private readonly _lightmaps: (egret3d.BaseTexture | null)[] = [];
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
        /**
         * @deprecated
         */
        public findGameObjectsWithTag(tag: string): GameObject[] {
            return this.findEntitiesWithTag<GameObject>(tag);
        }
        /**
         * @deprecated
         */
        public getRootGameObjects(): ReadonlyArray<GameObject> {
            return this.rootEntities as any;
        }
        /**
         * @deprecated
         */
        public get gameObjectCount(): uint {
            return this._entities.length;
        }
        /**
         * @deprecated
         */
        public get gameObjects(): ReadonlyArray<GameObject> {
            return this._entities as any;
        }
        //#endif
    }
}
