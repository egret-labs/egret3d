namespace paper.editor{
    type AddComponentStateData = {gameObjectUUid:string,compClzName:string,serializeData?:any,cacheComponentId?:string};

    //添加组件
    export class AddComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddComponentState]";
        }

        public static create(gameObjectUUid:string,compClzName:string): AddComponentState | null {
            const state = new AddComponentState();
            let data:AddComponentStateData = {gameObjectUUid,compClzName};
            state.data = data;
            return state;
        }

        public get stateData():AddComponentStateData
        {
            return this.data as AddComponentStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                const {gameObjectUUid,cacheComponentId} = this.stateData;
                const gameObject = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObject && cacheComponentId) {
                    const comp = Editor.editorModel.getComponentById(gameObject,cacheComponentId);
                    if (comp) {
                        gameObject.removeComponent(comp.constructor as any);
                        this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                        return true;
                    }
                }

            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const {gameObjectUUid,compClzName} = this.stateData;
                let gameObject = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObject) {
                    let addComponent;
                    if (this.stateData.serializeData) {
                        addComponent = deserialize(this.stateData.serializeData, true);
                        Editor.editorModel.addComponentToGameObject(gameObject, addComponent);
                    } else {
                        let compClz = egret.getDefinitionByName(compClzName);
                        addComponent = gameObject.addComponent(compClz);
                        this.stateData.serializeData = serialize(addComponent);
                    }
                    addComponent && (this.stateData.cacheComponentId = addComponent.uuid);
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                return true;
            }

            return false;
        }
    }
}