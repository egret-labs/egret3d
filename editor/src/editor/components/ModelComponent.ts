namespace paper.editor {
    /**
     * 
     */
    @singleton
    export class ModelComponent extends Component {
        /**
         * 选中的场景。
         */
        public selectedScene: Scene | null = null;
        /**
         * 
         */
        public readonly openedComponents: IComponentClass<IComponent>[] = [];
        //
        private _editorModel: editor.EditorModel | null = null;

        private readonly _selectedGroup: Group<GameObject> = Application.gameObjectContext.getGroup(
            Matcher.create<GameObject>(false, SelectedFlag)
        );
        private readonly _lastSelectedGroup: Group<GameObject> = Application.gameObjectContext.getGroup(
            Matcher.create<GameObject>(false, LastSelectedFlag)
        );

        private _onEditorSelectGameObjects(event: { data: GameObject[] }) {
            this._select(null, true);

            for (const gameObject of event.data) {
                this._select(gameObject, false);
            }
        }

        private _onChangeProperty(data: { propName: string, propValue: any, target: any }) {
            const lastSelectedEntity = this._lastSelectedGroup.singleEntity;

            if (lastSelectedEntity && (data.target instanceof egret3d.Transform) && data.propName) {
                const propName = <string>data.propName;
                switch (propName) {
                    case "localPosition":
                        lastSelectedEntity.transform.localPosition = data.propValue;
                        break;
                    case "localRotation":
                        lastSelectedEntity.transform.localRotation = data.propValue;
                        break;
                    case "localScale":
                        lastSelectedEntity.transform.localScale = data.propValue;
                        break;
                    case "position":
                        lastSelectedEntity.transform.position = data.propValue;
                        break;
                    case "rotation":
                        lastSelectedEntity.transform.rotation = data.propValue;
                        break;
                    case "scale":
                        lastSelectedEntity.transform.scale = data.propValue;
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

        private _select(value: Scene | IEntity | null, isReplace?: boolean) {
            if (value) {
                if (value instanceof Scene) {
                    if (this.selectedScene === value) {
                        return;
                    }

                    isReplace = true;
                }
                else if (value.getComponent(SelectedFlag)) {
                    return;
                }

                if (this.selectedScene) {
                    isReplace = true;
                }
            }
            else {
                isReplace = true;
            }

            const lastSelectedEntity = this._lastSelectedGroup.singleEntity;

            if (lastSelectedEntity) {
                lastSelectedEntity.removeComponent(LastSelectedFlag);
            }

            if (isReplace) {
                if (this.selectedScene) {
                    this.selectedScene = null;
                }
                else {
                    for (const entity of this._selectedGroup.entities) {
                        entity.removeComponent(SelectedFlag);
                    }
                }
            }

            if (value) {
                if (value instanceof Scene) {
                    (window as any)["pse"] = (window as any)["psgo"] = null; // For quick debug.
                    this.selectedScene = value;
                }
                else {
                    (window as any)["pse"] = (window as any)["psgo"] = value; // For quick debug.
                    value.addComponent(SelectedFlag);
                    value.addComponent(LastSelectedFlag);
                }
            }
        }

        private _unselect(value: IEntity) {
            if (value.getComponent(SelectedFlag)) {
                const lastSelectedEntity = this._lastSelectedGroup.singleEntity;

                if (value === lastSelectedEntity) {
                    value.removeComponent(LastSelectedFlag);
                    value.removeComponent(SelectedFlag);

                    const selectedEntities = this._selectedGroup.entities;

                    if (selectedEntities.length > 0) {
                        selectedEntities[selectedEntities.length - 1].addComponent(LastSelectedFlag);
                    }
                }
                else {
                    value.removeComponent(SelectedFlag);
                }
            }
        }

        public initialize() {
            super.initialize();

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

        public select(value: Scene | IEntity | null, isReplace?: boolean) {
            this._select(value, isReplace);

            if (this._editorModel) {
                this._editorModel.selectGameObject(this._selectedGroup.entities.concat() as any);
            }
        }

        public unselect(value: IEntity) {
            this._unselect(value);

            if (this._editorModel) {
                this._editorModel.selectGameObject(this._selectedGroup.entities.concat() as any);
            }
        }

        public delete(value: IEntity | null = null) {
            if (this._editorModel) {
                this._editorModel.deleteGameObject(this._selectedGroup.entities.concat() as any);
            }
            else if (value) {
                value.destroy();
            }
            else {
                for (const entity of this._selectedGroup.entities) {
                    entity.destroy();
                }
            }
        }

        public openComponents(...args: IComponentClass<IComponent>[]) {
            this.openedComponents.length = 0;

            for (const component of args) {
                this.openedComponents.push(component);
            }
        }

        public changeProperty(propName: string, propOldValue: any, propNewValue: any, target: BaseComponent) {
            if (this._editorModel) {
                this._editorModel.setTransformProperty(propName, propOldValue, propNewValue, target);
            }
        }
    }
}
