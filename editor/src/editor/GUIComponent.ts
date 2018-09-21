namespace paper.debug {
    /**
     * 
     */
    export const enum GUIComponentEvent {
        SceneSelected = "SceneSelected",
        SceneUnselected = "SceneUnselected",
        GameObjectSelected = "GameObjectSelected",
        GameObjectUnselected = "GameObjectUnselected",
    }
    /**
     * 
     */
    export class GUIComponent extends SingletonComponent {
        // public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });
        // public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 330 });

        /**
         * 所有选中的实体。
         */
        public readonly selectedGameObjects: GameObject[] = [];
        /**
         * 选中的场景。
         */
        public selectedScene: Scene | null = null;
        /**
         * 最后一个选中的实体。
         */
        public selectedGameObject: GameObject | null = null;

        public editorModel: editor.EditorModel | null;

        public initialize() {
            super.initialize();

            if (paper.Application.playerMode === PlayerMode.Editor) {
                const guiSceneSystem = Application.systemManager.getOrRegisterSystem(debug.GUISceneSystem);
                this.editorModel = paper.editor.Editor.activeEditorModel;

                this.editorModel.addEventListener(paper.editor.EditorModelEvent.SELECT_GAMEOBJECTS, e => this.selectGameObjects(e.data), this);
                // this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_MODE, e => this.changeEditMode(e.data), this);
                // this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_TYPE, e => this.changeEditType(e.data), this);
                this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_PROPERTY, e => this.changeProperty(e.data), this);
            }

            // const sceneOptions = {
            //     debug: false
            // };

            // this.hierarchy.add(sceneOptions, "debug").onChange((v: boolean) => {
            //     const guiSceneSystem = Application.systemManager.getOrRegisterSystem(debug.GUISceneSystem);
            //     const guiSystem = Application.systemManager.getOrRegisterSystem(debug.GUISystem);

            //     if (v) {
            //         Application.playerMode = PlayerMode.DebugPlayer;
            //         guiSceneSystem.enabled = true;
            //         guiSystem.enabled = true;
            //     }
            //     else {
            //         Application.playerMode = PlayerMode.Player;
            //         guiSceneSystem.enabled = false;
            //         guiSystem.enabled = false;
            //     }
            // });
        }

        public uninitialize() {
            if (paper.Application.playerMode === PlayerMode.Editor) {
                this.editorModel.removeEventListener(paper.editor.EditorModelEvent.SELECT_GAMEOBJECTS, e => this.selectGameObjects(e.data), this);
                // this.editorModel.removeEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_MODE, e => this.changeEditMode(e.data), this);
                // this.editorModel.removeEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_TYPE, e => this.changeEditType(e.data), this);
                this.editorModel.removeEventListener(paper.editor.EditorModelEvent.CHANGE_PROPERTY, e => this.changeProperty(e.data), this);
            }
        }

        public selectGameObjects(gameObjs: GameObject[]) {

        }

        private changeProperty(data) {
            if ((data.target instanceof egret3d.Transform) && data.propName && this.selectedGameObjects.length > 0) {
                let propName = <string>data.propName;
                let target = <egret3d.Transform>data.target;
                switch (propName) {
                    case "position":
                        // this.controller.transform.setPosition(this._ctrlPos);
                        break;
                    case "rotation":
                        // this.controller.transform.setRotation(this._ctrlRot);
                        break;
                    case "localPosition":
                        // this._ctrlPos = this.selectedGameObjs[0].transform.getPosition();
                        // this.controller.transform.setPosition(this._ctrlPos);
                        break;
                    case "localRotation":
                        // this._ctrlRot = this.selectedGameObjs[0].transform.getRotation();
                        // this.controller.transform.setRotation(this._ctrlRot);
                        break;
                    default:
                        break;
                }
            }
            //
            if (data.target instanceof GameObject) {
                let propName = <string>data.propName;
                console.log(propName);
            }
        }

        public select(value: Scene | GameObject | null, isReplace?: boolean) {
            if (value) {
                if (value instanceof Scene) {
                    if (this.selectedScene === value) {
                        return;
                    }
                }
                else if (
                    this.selectedGameObject === value ||
                    this.selectedGameObjects.indexOf(value) >= 0
                ) {
                    return;
                }
            }

            if (!value || value instanceof Scene || this.selectedScene) {
                isReplace = true;
            }

            if (isReplace) {
                if (this.selectedScene) {
                    EventPool.dispatchEvent(GUIComponentEvent.SceneUnselected, this, this.selectedScene);
                    this.selectedScene = null;
                }
                else if (this.selectedGameObjects.length > 0) {
                    const gameObjects = this.selectedGameObjects.concat();
                    this.selectedGameObjects.length = 0;
                    this.selectedGameObject = null;

                    for (const gameObject of gameObjects) {
                        EventPool.dispatchEvent(GUIComponentEvent.GameObjectUnselected, this, gameObject);
                    }
                }
            }

            if (value) {
                if (value instanceof Scene) {
                    this.selectedScene = value;
                    EventPool.dispatchEvent(GUIComponentEvent.SceneSelected, this, value);
                }
                else {
                    this.selectedGameObjects.push(value);
                    this.selectedGameObject = value;
                    EventPool.dispatchEvent(GUIComponentEvent.GameObjectSelected, this, value);
                }
            }

            (global || window)["psgo"] = value; // For quick debug;
        }
    }

    // 
    // if (dat) {
    //     GameObject.globalGameObject.getOrAddComponent(debug.GUIComponent);
    // }
}