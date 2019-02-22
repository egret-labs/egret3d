namespace paper.editor {
    /**
     * @internal
     */
    export class HierarchySystem extends BaseSystem<GameObject> {
        private _delayShow: uint = 0;
        private _addEntityCount: uint = 0;
        private readonly _modelComponent: ModelComponent = Application.sceneManager.globalEntity.getOrAddComponent(ModelComponent);
        private readonly _guiComponent: GUIComponent = Application.sceneManager.globalEntity.getOrAddComponent(GUIComponent);
        private readonly _sceneOrEntityBuffer: (IScene | IEntity | null)[] = [];
        private _selectItem: dat.GUI | null = null;

        private _onSceneCreated([scene, isActive]: [IScene, boolean]) {
            this._addSceneOrEntity(scene);
        }

        private _onSceneDestroy(scene: IScene) {
            this._removeSceneOrEntity(scene);
        }

        private _onSceneSelected = (_c: any, value: Scene) => {
            this._selectSceneOrGameObject(value);
        }

        private _onSceneUnselected = (_c: any, value: Scene) => {
            this._selectSceneOrGameObject(null);
        }

        private _onGameObjectSelectedChange = (_c: any, value: GameObject) => {
            this._selectSceneOrGameObject(this._modelComponent.selectedGameObject);
        }

        private _onTransformParentChanged([transform, prevParent, currentParent]: [BaseTransform, BaseTransform | null, BaseTransform | null]) {
            if (this._sceneOrEntityBuffer.indexOf(transform.entity) < 0) {
                this._removeSceneOrEntity(transform.entity);
                this._sceneOrEntityBuffer.push(transform.entity);
            }
        }

        private _sceneOrGameObjectGUIClickHandler = (gui: dat.GUI) => {
            this._modelComponent.select(gui.instance, true);
        }

        private _addSceneOrEntity(value: IScene | IEntity) {
            this._sceneOrEntityBuffer.push(value);
        }

        private _removeSceneOrEntity(value: IScene | IEntity) {
            const { hierarchyItems } = this._guiComponent;

            if (value.uuid in hierarchyItems) {
                const item = hierarchyItems[value.uuid];
                delete hierarchyItems[value.uuid];

                if (item.parent) {
                    try {
                        item.parent.removeFolder(item);
                    }
                    catch (e) {
                    }
                }
            }

            const index = this._sceneOrEntityBuffer.indexOf(value);

            if (index >= 0) {
                this._sceneOrEntityBuffer[index] = null;
            }
        }

        private _getOrAddScene(scene: IScene) {
            if (scene === Scene.editorScene) {
                return null;
            }

            const guiComponent = this._guiComponent;

            if (!(scene.uuid in guiComponent.hierarchyItems)) {
                const item = guiComponent.hierarchy.addFolder(scene.uuid, scene.name + " <Scene>");
                item.instance = scene;
                item.onClick = this._sceneOrGameObjectGUIClickHandler;
                guiComponent.hierarchyItems[scene.uuid] = item;
            }

            return guiComponent.hierarchyItems[scene.uuid];
        }

        private _addEntity(entity: IEntity) {
            const { hierarchyItems } = this._guiComponent;

            if (
                entity.uuid in hierarchyItems ||
                (entity.hideFlags & HideFlags.Hide) ||
                entity.scene === Scene.editorScene
            ) {
                return true;
            }

            if (this._addEntityCount > 5) {
                this._sceneOrEntityBuffer.push(entity);
                return false;
            }

            let parent: dat.GUI;

            if (entity instanceof GameObject && entity.transform.parent) {
                parent = hierarchyItems[entity.transform.parent.entity.uuid];

                if (!parent) {
                    this._sceneOrEntityBuffer.push(entity);
                    return true;
                }
            }
            else {
                parent = this._getOrAddScene(entity.scene)!;
            }

            const item = parent.addFolder(entity.uuid, entity.name);
            item.instance = entity;
            item.onClick = this._sceneOrGameObjectGUIClickHandler;
            hierarchyItems[entity.uuid] = item;

            this._addEntityCount++;

            return true;
        }

        private _selectSceneOrGameObject(sceneOrGameObject: Scene | GameObject | null) {
            // Unselect prev folder.
            if (this._selectItem) {
                this._selectItem.selected = false;
                this._selectItem = null;
            }
        }

        private _openFolder(folder: dat.GUI) {
            if (!folder.parent || folder.parent === this._guiComponent.hierarchy) {
                return;
            }

            folder.parent.open();
            this._openFolder(folder.parent);
        }

        protected getMatchers() {
            return [
                Matcher.create<GameObject>(false, egret3d.Transform),
            ];
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            this._addSceneOrEntity(entity);
        }

        public onEntityRemoved(entity: GameObject, group: Group<GameObject>) {
            this._removeSceneOrEntity(entity);
        }

        public onAwake() {
            const sceneOptions = {
                debug: false,
            };

            this._guiComponent.hierarchy.add(sceneOptions, "debug").onChange((v: boolean) => {
                let sceneSystem = Application.systemManager.getSystem(editor.SceneSystem);

                if (!sceneSystem) {
                    sceneSystem = Application.systemManager.register(editor.SceneSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
                }

                if (v) {
                    Application.playerMode = PlayerMode.DebugPlayer;
                    sceneSystem.enabled = true;
                }
                else {
                    Application.playerMode = PlayerMode.Player;
                    sceneSystem.enabled = false;
                }
            });
        }

        public onEnable() {
            Scene.onSceneCreated.add(this._onSceneCreated, this);
            Scene.onSceneDestroy.add(this._onSceneDestroy, this);
            BaseTransform.onTransformParentChanged.add(this._onTransformParentChanged, this);

            this._sceneOrEntityBuffer.push(Application.sceneManager.globalScene);
            for (const entity of Application.sceneManager.globalScene.rootEntities) {
                this._sceneOrEntityBuffer.push(entity);
            }

            // this._modelComponent.select(Scene.activeScene);
        }

        public onDisable() {
            Scene.onSceneCreated.remove(this._onSceneCreated);
            Scene.onSceneDestroy.remove(this._onSceneDestroy);
            BaseTransform.onTransformParentChanged.remove(this._onTransformParentChanged);

            const { hierarchyItems } = this._guiComponent;

            for (const k in hierarchyItems) {
                const item = hierarchyItems[k];
                delete hierarchyItems[k];

                if (item && item.parent) {
                    try {
                        item.parent.removeFolder(item);
                    }
                    catch (e) {
                    }
                }
            }

            this._delayShow = 0;
            this._addEntityCount = 0;
            this._sceneOrEntityBuffer.length = 0;
            this._selectItem = null;
        }

        public onUpdate() {
            const isHierarchyShowed = !this._guiComponent.hierarchy.closed && this._guiComponent.hierarchy.domElement.style.display !== "none";

            if (isHierarchyShowed) { // Add folder.
                if (this._delayShow > 5) {
                    const sceneOrEntityBuffer = this._sceneOrEntityBuffer;

                    while (sceneOrEntityBuffer.length > 0) {
                        const element = sceneOrEntityBuffer.shift();

                        if (element) {
                            if (element instanceof Entity) {
                                if (!this._addEntity(element)) {
                                    break;
                                }
                            }
                            else {
                                this._getOrAddScene(element as IScene);
                            }
                        }
                    }

                    this._addEntityCount = 0;

                    if (!this._selectItem) {  // Open and select folder.
                        const sceneOrEntity = this._modelComponent.selectedScene || this._modelComponent.selectedGameObject;
                        const { hierarchyItems } = this._guiComponent;

                        if (sceneOrEntity && sceneOrEntity.uuid in hierarchyItems) {
                            this._selectItem = hierarchyItems[sceneOrEntity.uuid];
                            this._selectItem.selected = true;
                            this._openFolder(this._selectItem);
                        }
                    }
                }
                else {
                    this._delayShow++;
                }
            }
        }
    }
}
