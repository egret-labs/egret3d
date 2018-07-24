namespace paper.editor{
    //添加组件
    export class AddComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddComponentState]";
        }

        public static create(data: any = null): AddComponentState | null {
            const state = new AddComponentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                let gameObjectUUid = this.data.gameObjectUUid;
                let componentId = this.data.cacheUUid;
                let gameObject = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObject) {
                    for (let i: number = 0; i < gameObject.components.length; i++) {
                        let comp = gameObject.components[i];
                        if (comp.uuid === componentId) {
                            gameObject.removeComponent(comp.constructor as any);
                            break;
                        }
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUid = this.data.gameObjectUUid;
                let compClzName = this.data.compClzName;
                let gameObject = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObject) {
                    let addComponent;
                    if (this.data.serializeData) {
                        addComponent = deserialize(this.data.serializeData, this.data.assetsMap);
                        Editor.editorModel.addComponentToGameObject(gameObject, addComponent);
                    } else {
                        let compClz = egret.getDefinitionByName(compClzName);
                        addComponent = gameObject.addComponent(compClz);
                        this.data.serializeData = serialize(addComponent);
                        this.data.assetsMap = Editor.editorModel.createAssetMap(this.data.serializeData);
                    }

                    this.data.cacheUUid = addComponent.uuid;
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                return true;
            }

            return false;
        }
    }
}