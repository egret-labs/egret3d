namespace paper.editor {
    /**
     * @internal
     */
    @executeMode(PlayerMode.Player | PlayerMode.DebugPlayer)
    export class HierarchySystem extends BaseSystem<GameObject> {
        private _delayShow: uint = 0;
        private _addEntityCount: uint = 0;

        private readonly _controlLeft: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.ControlLeft);
        private readonly _controlRight: egret3d.Key = egret3d.inputCollecter.getKey(egret3d.KeyCode.ControlRight);

        private readonly _modelComponent: ModelComponent = GameObject.globalGameObject.getOrAddComponent(ModelComponent);
        private readonly _guiComponent: GUIComponent = Application.sceneManager.globalEntity.getOrAddComponent(GUIComponent);
        private readonly _sceneOrEntityBuffer: (IScene | IEntity | null)[] = [];
        private readonly _selectedItems: dat.GUI[] = [];

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
            const selectSceneOrEntity = gui.instance;

            if (selectSceneOrEntity instanceof Scene) {
                if (selectSceneOrEntity.isDestroyed) {
                    return;
                }

                this._modelComponent.select(selectSceneOrEntity);
            }
            else if (selectSceneOrEntity instanceof Entity) {
                if (selectSceneOrEntity.isDestroyed) {
                    return;
                }

                const isReplace = !this._controlLeft.isHold(false) && !this._controlRight.isHold(false);

                if (selectSceneOrEntity.getComponent(SelectedFlag)) {
                    if (!isReplace) {
                        this._modelComponent.unselect(selectSceneOrEntity);
                    }
                }
                else {
                    this._modelComponent.select(selectSceneOrEntity, isReplace);
                }
            }
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
                if (v) {
                    Application.playerMode = PlayerMode.DebugPlayer;
                }
                else {
                    Application.playerMode = PlayerMode.Player;
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
        }

        public onDisable() {
            Scene.onSceneCreated.remove(this._onSceneCreated, this);
            Scene.onSceneDestroy.remove(this._onSceneDestroy, this);
            BaseTransform.onTransformParentChanged.remove(this._onTransformParentChanged, this);

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
        }

        public onEntityAdded(entity: GameObject, group: Group<GameObject>) {
            const groups = this.groups;

            if (group === groups[0]) {
                this._addSceneOrEntity(entity);
            }
            else if (group === groups[1]) {
                for (const item of this._selectedItems) {
                    item.selected = false;
                }

                this._selectedItems.length = 0;
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

        public onFrame() {
            const { hierarchy, hierarchyItems } = this._guiComponent;
            if (hierarchy.closed || hierarchy.domElement.style.display === "none") {
                return;
            }

            // Update item.
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

            // Update selected items.
            const selectedScene = this._modelComponent.selectedScene;
            const selectedEntities = this.groups[1].entities;

            if (selectedScene) {
                const item = this._getOrAddScene(selectedScene);

                if (item && !item.selected) {
                    item.selected = true;
                    this._openFolder(item);
                    this._selectedItems.push(item);
                }
            }
            else {
                for (const entity of selectedEntities) {
                    const item = hierarchyItems[entity.uuid];

                    if (item && !item.selected) {
                        item.selected = true;
                        this._openFolder(item);
                    }
                }
            }
        }
    }
}
