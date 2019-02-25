namespace paper.editor {
    /**
     * @internal
     */
    export class HierarchySystem extends BaseSystem<GameObject> {
        private _delayShow: uint = 0;
        private _addEntityCount: uint = 0;

        private readonly _controlLeft: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.ControlLeft);
        private readonly _controlRight: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.ControlRight);
        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);
        private readonly _guiComponent: GUIComponent = Application.sceneManager.globalEntity.getOrAddComponent(GUIComponent);
        private readonly _sceneOrEntityBuffer: (IScene | IEntity | null)[] = [];
        private _selectSceneOrEntity: IEntity | null = null;

        private _onSceneCreated([scene, isActive]: [IScene, boolean]) {
            this._addSceneOrEntity(scene);
        }

        private _onSceneDestroy(scene: IScene) {
            this._removeSceneOrEntity(scene);
        }

        private _onTransformParentChanged([transform, prevParent, currentParent]: [BaseTransform, BaseTransform | null, BaseTransform | null]) {
            if (this._sceneOrEntityBuffer.indexOf(transform.entity) < 0) {
                this._removeSceneOrEntity(transform.entity);
                this._sceneOrEntityBuffer.push(transform.entity);
            }
        }

        private _sceneOrGameObjectGUIClickHandler = (gui: dat.GUI) => {
            this._selectSceneOrEntity = gui.instance;

            // this._modelComponent.select(gui.instance, true);
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
                Matcher.create<GameObject>(false, SelectedFlag),
                Matcher.create<GameObject>(false, LastSelectedFlag),
            ];
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
            this._selectSceneOrEntity = null;
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[0]) {
                this._addSceneOrEntity(entity);
            }
            else if (group === groups[1]) {
                const item = this._guiComponent.hierarchyItems[entity.uuid];
                if (item) {
                    item.selected = true;
                    this._openFolder(item);
                }
            }
            else if (group === groups[2]) {
            }
        }

        public onEntityRemoved(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[0]) {
                this._removeSceneOrEntity(entity);
            }
            else if (group === groups[1]) {
                const item = this._guiComponent.hierarchyItems[entity.uuid];
                if (item) {
                    item.selected = false;
                }
            }
            else if (group === groups[2]) {
            }
        }

        public onTick() {
            if (this._guiComponent.hierarchy.closed || this._guiComponent.hierarchy.domElement.style.display === "none") {
                return;
            }

            const selectSceneOrEntity = this._selectSceneOrEntity;

            if (selectSceneOrEntity) {
                if (selectSceneOrEntity instanceof Entity) {
                    const isReplace = !this._controlLeft.isHold(false) && !this._controlRight.isHold(false);
                    this._modelComponent.select(selectSceneOrEntity, isReplace);
                }
                else {

                }

                this._selectSceneOrEntity = null;
            }
            else if (egret3d.inputCollecter.getKey(egret3d.KeyCode.Escape).isUp()) {
                this._modelComponent.select(null);
            }
        }

        public onFrame() {
            if (this._guiComponent.hierarchy.closed || this._guiComponent.hierarchy.domElement.style.display === "none") {
                return;
            }

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
            }
            else {
                this._delayShow++;
            }
        }
    }
}
