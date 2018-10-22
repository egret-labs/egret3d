namespace paper.editor {
    /**
     * 
     */
    export class ModelComponent extends SingletonComponent {
        public static readonly onSceneSelected: signals.Signal = new signals.Signal();
        public static readonly onSceneUnselected: signals.Signal = new signals.Signal();

        public static readonly onGameObjectHovered: signals.Signal = new signals.Signal();
        public static readonly onGameObjectSelectChanged: signals.Signal = new signals.Signal();
        public static readonly onGameObjectSelected: signals.Signal = new signals.Signal();
        public static readonly onGameObjectUnselected: signals.Signal = new signals.Signal();
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
        private _editorModel: editor.EditorModel | null = null;

        private _onEditorSelectGameObjects(event: { data: GameObject[] }) {
            for (const gameObject of this.selectedGameObjects) {
                if (event.data.indexOf(gameObject) < 0) {
                    this._unselect(gameObject);
                }
            }

            for (const gameObject of event.data) {
                this._select(gameObject);
            }
        }

        private _onChangeProperty(data: { propName: string, propValue: any, target: any }) {
            const selectedGameObject = this.selectedGameObject;
            if (selectedGameObject && (data.target instanceof egret3d.Transform) && data.propName) {
                const propName = <string>data.propName;
                switch (propName) {
                    case "localPosition":
                        selectedGameObject.transform.localPosition = data.propValue;
                        break;
                    case "localRotation":
                        selectedGameObject.transform.localRotation = data.propValue;
                        break;
                    case "localScale":
                        selectedGameObject.transform.localScale = data.propValue;
                        break;
                    case "position":
                        selectedGameObject.transform.position = data.propValue;
                        break;
                    case "rotation":
                        selectedGameObject.transform.rotation = data.propValue;
                        break;
                    case "scale":
                        selectedGameObject.transform.scale = data.propValue;
                        break;
                }
            }

            if (data.target instanceof GameObject) {
                const propName = <string>data.propName;
                console.log(propName);
            }
        }

        private _onChangeEditMode(mode: string) {

        }

        private _onChangeEditType(type: string) {

        }

        public initialize() {
            if (Application.playerMode === PlayerMode.Editor) {
                editor.Editor.addEventListener(editor.EditorEvent.CHANGE_SCENE, () => {
                    if (this._editorModel) {
                        this._editorModel.removeEventListener(editor.EditorModelEvent.SELECT_GAMEOBJECTS, this._onEditorSelectGameObjects, this);
                        this._editorModel.removeEventListener(editor.EditorModelEvent.CHANGE_PROPERTY, this._onChangeProperty, this);

                        this._editorModel.removeEventListener(editor.EditorModelEvent.CHANGE_EDIT_MODE, this._onChangeEditMode, this);
                        this._editorModel.removeEventListener(editor.EditorModelEvent.CHANGE_EDIT_TYPE, this._onChangeEditType, this);
                    }

                    this._editorModel = editor.Editor.activeEditorModel;
                    this._editorModel.addEventListener(editor.EditorModelEvent.SELECT_GAMEOBJECTS, this._onEditorSelectGameObjects, this);
                    this._editorModel.addEventListener(editor.EditorModelEvent.CHANGE_PROPERTY, this._onChangeProperty, this);

                    this._editorModel.addEventListener(editor.EditorModelEvent.CHANGE_EDIT_MODE, this._onChangeEditMode, this);
                    this._editorModel.addEventListener(editor.EditorModelEvent.CHANGE_EDIT_TYPE, this._onChangeEditType, this);
                }, this);
            }
        }

        private _select(value: Scene | GameObject | null, isReplace?: boolean) {
            if (value) {
                if (value instanceof Scene) {
                    if (this.selectedScene === value) {
                        return;
                    }
                }
                else if (this.selectedGameObjects.indexOf(value) >= 0) {
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
                    ModelComponent.onSceneUnselected.dispatch(this, selectedScene);
                }
                else if (this.selectedGameObjects.length > 0) {
                    const gameObjects = this.selectedGameObjects.concat();
                    const selectedGameObject = this.selectedGameObject!;
                    this.selectedGameObjects.length = 0;
                    this.selectedGameObject = null;

                    ModelComponent.onGameObjectSelectChanged.dispatch(this, selectedGameObject);

                    for (const gameObject of gameObjects) {
                        ModelComponent.onGameObjectUnselected.dispatch(this, gameObject);
                    }
                }
            }

            if (value) {
                if (value instanceof Scene) {
                    this.selectedScene = value;
                    ModelComponent.onSceneSelected.dispatch(this, value);
                }
                else {
                    this.selectedGameObjects.push(value);
                    this.selectedGameObject = value;
                    ModelComponent.onGameObjectSelectChanged.dispatch(this, this.selectedGameObject);
                    ModelComponent.onGameObjectSelected.dispatch(this, value);
                }
            }

            (global || window)["psgo"] = value; // For quick debug.
        }

        private _unselect(value: GameObject) {
            const index = this.selectedGameObjects.indexOf(value);
            if (index < 0) {
                throw new Error();
            }

            if (this.selectedGameObject === value) {
                if (this.selectedGameObjects.length > 1) {
                    this.selectedGameObject = this.selectedGameObjects[index - 1];
                }
                else {
                    this.selectedGameObject = null;
                }

                ModelComponent.onGameObjectSelectChanged.dispatch(this, value);
            }

            this.selectedGameObjects.splice(index, 1);
            ModelComponent.onGameObjectUnselected.dispatch(this, value);
        }

        public hover(value: GameObject | null) {
            if (this.hoveredGameObject === value) {
                return;
            }

            this.hoveredGameObject = value;
            ModelComponent.onGameObjectHovered.dispatch(this, this.hoveredGameObject);
        }

        public select(value: Scene | GameObject | null, isReplace?: boolean) {
            this._select(value, isReplace);

            if (this._editorModel !== null) {
                this._editorModel.selectGameObject(this.selectedGameObjects);
            }
        }
        public remove(value: GameObject) {
            if (this._editorModel !== null) {
                this._editorModel.deleteGameObject(this.selectedGameObjects);
            }
        }

        public unselect(value: GameObject) {
            this._unselect(value);

            if (this._editorModel !== null) {
                this._editorModel.selectGameObject(this.selectedGameObjects);
            }
        }

        public changeProperty(propName: string, propOldValue: any, propNewValue: any, target: BaseComponent) {
            if (this._editorModel) {
                this._editorModel.setTransformProperty(propName, propOldValue, propNewValue, target);
            }
        }
    }
}