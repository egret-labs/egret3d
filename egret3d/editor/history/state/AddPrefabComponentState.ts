namespace paper.editor{
    type ComponentData = {gameObjectUUid:string,serializeData?:any,cacheComponentId?:string};
    type AddPrefabComponentStateData = {serializeData:any,addDatas:ComponentData[]};

    //添加组件
    export class AddPrefabComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddPrefabComponentState]";
        }

        public static create(serializeData:any,gameObjIds:string[]): AddPrefabComponentState | null {
            const state = new AddPrefabComponentState();

            let addDatas:ComponentData[] = [];
            for (const uuid of gameObjIds) {
                let componentData:ComponentData = {gameObjectUUid:uuid};
                addDatas.push(componentData);
            }

            let data:AddPrefabComponentStateData = {
                serializeData,
                addDatas
            }
            state.data = data;
            return state;
        }

        private get stateData():AddPrefabComponentStateData
        {
            return this.data as AddPrefabComponentStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { addDatas } = this.stateData;

                for (let index = 0; index < addDatas.length; index++) {
                    const instanceData = addDatas[index];
                    this.removeComponent(instanceData);
                }
                return true;
            }

            return false;
        }

        private removeComponent(data:ComponentData):void
        {
            const { gameObjectUUid, cacheComponentId } = data;
            const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
            if (gameObj && cacheComponentId) {
                const removeComponent = Editor.editorModel.getComponentById(gameObj, cacheComponentId);
                if (removeComponent) {
                    gameObj.removeComponent(removeComponent.constructor as any);
                    this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                }
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                const { addDatas } = this.stateData;
                for (const addData of addDatas) {
                    const { gameObjectUUid} = addData;
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObj) {
                        let addComponent;
                        if (addData.serializeData) {
                            addComponent = deserialize(addData.serializeData, true);
                        }else{
                            addComponent = deserialize(this.stateData.serializeData,false);
                            addData.serializeData = serialize(addComponent);
                            addData.cacheComponentId = addComponent.uuid;
                        }
                        Editor.editorModel.addComponentToGameObject(gameObj, addComponent);
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }
                }
                return true;
            }

            return false;
        }
    }
}