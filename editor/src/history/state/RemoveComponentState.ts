namespace paper.editor {
    type RemoveComponentStateData = { gameObjectUUid: string, componentUUid: string, cacheSerializeData: any };

    //移除组件
    export class RemoveComponentState extends BaseState {
        public static toString(): string {
            return "[class common.RemoveComponentState]";
        }

        public static create(gameObjectUUid: string, componentUUid: string, cacheSerializeData: any): RemoveComponentState | null {
            const state = new RemoveComponentState();
            let data: RemoveComponentStateData = {
                gameObjectUUid,
                componentUUid,
                cacheSerializeData
            }
            state.data = data;
            return state;
        }

        private get stateData(): RemoveComponentStateData {
            return this.data as RemoveComponentStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let gameObject = this.editorModel.getGameObjectByUUid(this.stateData.gameObjectUUid);
                
                if (gameObject) {
                    new Deserializer().deserialize(this.stateData.cacheSerializeData, true, false, gameObject);
                    this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                }

                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUid = this.stateData.gameObjectUUid;
                let componentUUid = this.stateData.componentUUid;
                let obj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (obj) {
                    let component: BaseComponent = this.editorModel.getComponentById(obj, componentUUid) as BaseComponent;

                    if (component) {
                        obj.removeComponent(component);
                        this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }
    }

}