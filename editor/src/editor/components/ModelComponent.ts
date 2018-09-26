namespace paper.debug {
    /**
     * 
     */
    export const enum ModelComponentEvent {
        SceneSelected = "SceneSelected",
        SceneUnselected = "SceneUnselected",
        GameObjectHovered = "GameObjectHovered",
        GameObjectSelected = "GameObjectSelected",
        GameObjectUnselected = "GameObjectUnselected",
    }
    /**
     * 
     */
    export class ModelComponent extends SingletonComponent {
        /**
         * 所有选中的实体。
         */
        public readonly selectedGameObjects: GameObject[] = [];
        /**
         * 选中的场景。
         */
        public selectedScene: Scene | null = null;
        /**
         * 
         */
        public hoveredGameObject: GameObject | null = null;
        /**
         * 最后一个选中的实体。
         */
        public selectedGameObject: GameObject | null = null;

        //
        private editorModel: paper.editor.EditorModel | null = null;

        private _onEditorSelectGameObjects(gameObjs: GameObject[]) {
            for (const gameObj of this.selectedGameObjects) {
                if (gameObjs.indexOf(gameObj) < 0) {
                    this._unselect(gameObj);
                }
            }

            for (const gameObj of gameObjs) {
                this._select(gameObj);
            }
        }

        private _onChangeEditMode(mode: string) {

        }

        private _onChangeEditType(type: string) {

        }

        private _onChangeProperty(data: { propName: string, propValue: any, target: any }) {
            if ((data.target instanceof egret3d.Transform) && data.propName && this.selectedGameObjects.length > 0) {
                let propName = <string>data.propName;
                switch (propName) {
                    case "position":
                        this.selectedGameObject.transform.position = data.propValue;
                        break;
                    case "rotation":
                        this.selectedGameObject.transform.rotation = data.propValue;
                        break;
                    case "localPosition":
                        this.selectedGameObject.transform.localPosition = data.propValue;
                        break;
                    case "localRotation":
                        this.selectedGameObject.transform.localRotation = data.propValue;
                        break;
                    case "scale":
                        this.selectedGameObject.transform.scale = data.propValue;
                        break;
                    case "localScale":
                        this.selectedGameObject.transform.localScale = data.propValue;
                        break;
                    default:
                        break;
                }
            }
            if (data.target instanceof GameObject) {
                let propName = <string>data.propName;
                console.log(propName);
            }
        }

        public initialize() {
            setTimeout(() => {
                if (Application.playerMode === PlayerMode.Editor) {
                    this.editorModel = paper.editor.Editor.activeEditorModel;
                    this.editorModel.addEventListener(paper.editor.EditorModelEvent.SELECT_GAMEOBJECTS, e => this._onEditorSelectGameObjects(e.data), this);
                    this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_MODE, e => this._onChangeEditMode(e.data), this);
                    this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_EDIT_TYPE, e => this._onChangeEditType(e.data), this);
                    this.editorModel.addEventListener(paper.editor.EditorModelEvent.CHANGE_PROPERTY, e => this._onChangeProperty(e.data), this);
                }
            }, 3000);
        }

        private _select(value: Scene | GameObject | null, isReplace?: boolean) {
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
                    const selectedScene = this.selectedScene;
                    this.selectedScene = null;
                    EventPool.dispatchEvent(ModelComponentEvent.SceneUnselected, this, selectedScene);
                }
                else if (this.selectedGameObjects.length > 0) {
                    const gameObjects = this.selectedGameObjects.concat();
                    this.selectedGameObjects.length = 0;
                    this.selectedGameObject = null;

                    for (const gameObject of gameObjects) {
                        EventPool.dispatchEvent(ModelComponentEvent.GameObjectUnselected, this, gameObject);
                    }
                }
            }

            if (value) {
                if (value instanceof Scene) {
                    this.selectedScene = value;
                    EventPool.dispatchEvent(ModelComponentEvent.SceneSelected, this, value);
                }
                else {
                    this.selectedGameObjects.push(value);
                    this.selectedGameObject = value;
                    EventPool.dispatchEvent(ModelComponentEvent.GameObjectSelected, this, value);
                }
            }

            (global || window)["psgo"] = value; // For quick debug.
        }

        private _unselect(value: Scene | GameObject) {
            if (value instanceof Scene) {
                if (this.selectedScene === value) {
                    this.selectedScene = null;
                    EventPool.dispatchEvent(ModelComponentEvent.SceneUnselected, this, value);
                }
            }
            else {
                const index = this.selectedGameObjects.indexOf(value);
                if (index >= 0) {
                    if (this.selectedGameObject === value) {
                        this.selectedGameObject = null;
                    }

                    this.selectedGameObjects.splice(index, 1);
                    EventPool.dispatchEvent(ModelComponentEvent.GameObjectUnselected, this, value);
                }
            }
        }

        public select(value: Scene | GameObject | null, isReplace?: boolean) {
            this._select(value, isReplace);

            if (this.editorModel !== null) {
                this.editorModel.selectGameObject(this.selectedGameObjects);
            }
        }

        public unselect(value: Scene | GameObject) {
            this._unselect(value);
            if (this.editorModel !== null) {
                this.editorModel.selectGameObject(this.selectedGameObjects);
            }
        }

        public changeProperty(propName: string, propOldValue: any, propNewValue: any, target: BaseComponent) {
            if (this.editorModel) {
                this.editorModel.setTransformProperty(propName, propOldValue, propNewValue, target);
            }
        }

        public hover(value: GameObject | null) {
            if (this.hoveredGameObject === value) {
                return;
            }

            this.hoveredGameObject = value;
            EventPool.dispatchEvent(ModelComponentEvent.GameObjectHovered, this, this.hoveredGameObject);
        }
    }
}