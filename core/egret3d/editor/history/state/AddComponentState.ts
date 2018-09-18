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

        private get stateData():AddComponentStateData
        {
            return this.data as AddComponentStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let gameObjectUUid = this.stateData.gameObjectUUid;
                let componentId = this.stateData.cacheComponentId;
                let gameObject = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                
                if (gameObject) {
                    let component = this.editorModel.getComponentById(gameObject,componentId);
                    if (component) {
                        gameObject.removeComponent(component);     
                        this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);                   
                    }
                }

                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUid = this.stateData.gameObjectUUid;
                let compClzName = this.stateData.compClzName;
                let gameObject = this.editorModel.getGameObjectByUUid(gameObjectUUid);

                if (gameObject) {
                    if (this.stateData.serializeData) {
                        new Deserializer().deserialize(this.data.serializeData, true,false,gameObject);
                    } else {
                        let compClz = egret.getDefinitionByName(compClzName);
                        let addComponent = gameObject.addComponent(compClz);
                        this.stateData.serializeData = serialize(addComponent);
                        this.stateData.cacheComponentId = addComponent.uuid;
                    }

                    this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                }
                return true;
            }

            return false;
        }
    }
}