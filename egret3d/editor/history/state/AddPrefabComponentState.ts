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
            const gameObj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
            if (gameObj && cacheComponentId) {
                const removeComponent = this.editorModel.getComponentById(gameObj, cacheComponentId);
                if (removeComponent) {
                    gameObj.removeComponent(removeComponent.constructor as any);
                    this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                }
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                const { instanceDatas,sourceData } = this.data;

                const deserializer=new Deserializer();
                //add component to prefab
                const { gameObjectUUid, compClz } = sourceData;
                const gameObj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObj) {
                    let addComponent;
    
                    if (sourceData.serializeData) {
                        addComponent = deserializer.deserialize(sourceData.serializeData, true);
                        this.editorModel.addComponentToGameObject(gameObj, addComponent);
                    } else {
                        addComponent = gameObj.addComponent(compClz);
                        sourceData.serializeData = serialize(addComponent);
                        sourceData.cacheUUid = addComponent.uuid;
                    }
    
                    this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                }
                //add component to instances
                for (let index = 0; index < instanceDatas.length; index++) {
                    const instanceData = instanceDatas[index];
                    const { gameObjectUUid, compClz } = instanceData;
                    const gameObj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                    let addComponent;
    
                    if (instanceData.serializeData) {
                        addComponent = deserializer.deserialize(instanceData.serializeData, true);
                        this.editorModel.addComponentToGameObject(gameObj, addComponent);
                    } else {
                        addComponent = deserializer.deserialize(sourceData.serializeData, false);
                        instanceData.serializeData = serialize(addComponent);
                        this.editorModel.addComponentToGameObject(gameObj, addComponent);
                        instanceData.cacheUUid = addComponent.uuid;
                    }
                }
                return true;
            }

            return false;
        }
    }
}