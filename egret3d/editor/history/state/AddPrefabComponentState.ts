namespace paper.editor{

    //添加组件
    export class AddPrefabComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddPrefabComponentState]";
        }

        public static create(data: any = null): AddPrefabComponentState | null {
            const state = new AddPrefabComponentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { datas } = this.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { gameObjectUUid, compClzName, cacheUUid } = element;
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObj && cacheUUid) {
                        const removeComponent = Editor.editorModel.getComponentById(gameObj, cacheUUid);
                        if (removeComponent) {
                            gameObj.removeComponent(removeComponent as any);
                        }
                        this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { datas } = this.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { gameObjectUUid, compClz } = element;
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObj) {
                        let addComponent;

                        if (this.data.serializeData) {
                            addComponent = deserialize(this.data.serializeData, true);
                            Editor.editorModel.addComponentToGameObject(gameObj, addComponent);
                        } else {
                            addComponent = gameObj.addComponent(compClz);
                            this.data.serializeData = serialize(addComponent);
                        }

                        element.cacheUUid = addComponent.uuid;
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }
    }
}