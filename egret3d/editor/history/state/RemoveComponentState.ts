namespace paper.editor{
    type RemoveComponentStateData = {gameObjectUUid:string,componentUUid:string,cacheSerializeData:any};

    //移除组件
    export class RemoveComponentState extends BaseState {
        public static toString(): string {
            return "[class common.RemoveComponentState]";
        }

        public static create(gameObjectUUid:string,componentUUid:string,cacheSerializeData:any): RemoveComponentState | null {
            const state = new RemoveComponentState();
            let data:RemoveComponentStateData = {
                gameObjectUUid,
                componentUUid,
                cacheSerializeData
            }
            state.data = data;
            return state;
        }

        private get stateData():RemoveComponentStateData
        {
            return this.data as RemoveComponentStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let serializeData = this.data.serializeData;
                let component: BaseComponent | null = new Deserializer().deserialize(serializeData,true);
                let gameObjectUUid = this.data.gameObjectUUid;
                if (component) {
                    let gameObject = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObject) {
                        (component as any).gameObject = gameObject;

                        this.editorModel.addComponentToGameObject(gameObject, component);
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUid = this.data.gameObjectUUid;
                let componentUUid = this.data.componentUUid;
                let obj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (obj) {
                    for (let i: number = 0; i < obj.components.length; i++) {
                        let comp = obj.components[i];
                        if (comp.uuid === componentUUid) {
                            obj.removeComponent(comp.constructor as any);
                            break;
                        }
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                return true;
            }

            return false;
        }
    }

}