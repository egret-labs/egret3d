namespace paper.editor{

    //移除组件
    export class RemovePrefabComponentState extends BaseState {
        public static toString(): string {
            return "[class common.RemovePrefabComponentState]";
        }

        public static create(data: any = null): RemovePrefabComponentState | null {
            const state = new RemovePrefabComponentState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { datas } = this.data;
                for (let index = 0; index < datas.length; index++) {
                    const element = datas[index];
                    const { gameObjUUid, componentUUid, serializeData } = element;
                    const addComponent: BaseComponent = deserialize(serializeData,true);
                    if (addComponent) {
                        const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjUUid);
                        if (gameObj) {
                            // addComponent.uuid = componentUUid;
                            (addComponent as any).gameObject = gameObj;
                            Editor.editorModel.addComponentToGameObject(gameObj, addComponent);
                            this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                        }
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
                    const { gameObjUUid, componentUUid } = element;
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjUUid);
                    if (gameObj) {
                        const componentObj = Editor.editorModel.getComponentById(gameObj, componentUUid);
                        if (componentObj) {
                            gameObj.removeComponent(componentObj.constructor as any);
                            this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                        }
                    }
                }
                return true;
            }

            return false;
        }
    }
}