namespace paper.editor{

    //添加组件
    export class AddPrefabComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddPrefabComponentState]";
        }

        public static create(sourceData:any,instanceDatas:any[]): AddPrefabComponentState | null {
            const state = new AddPrefabComponentState();
            let data = {
                sourceData,
                instanceDatas
            }
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { instanceDatas,sourceData } = this.data;
                //remove from prefab
                this.removeComponent(sourceData);

                //remove from instance
                for (let index = 0; index < instanceDatas.length; index++) {
                    const instanceData = instanceDatas[index];
                    this.removeComponent(instanceData);
                }
                return true;
            }

            return false;
        }

        private removeComponent(data:any):void
        {
            const { gameObjectUUid, cacheUUid } = data;
            const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
            if (gameObj && cacheUUid) {
                const removeComponent = Editor.editorModel.getComponentById(gameObj, cacheUUid);
                if (removeComponent) {
                    gameObj.removeComponent(removeComponent as any);
                    this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                }
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                const { instanceDatas,sourceData } = this.data;

                //add component to prefab
                const { gameObjectUUid, compClz } = sourceData;
                const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                if (gameObj) {
                    let addComponent;
    
                    if (sourceData.serializeData) {
                        addComponent = deserialize(sourceData.serializeData, true);
                        Editor.editorModel.addComponentToGameObject(gameObj, addComponent);
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
                    const gameObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
                    let addComponent;
    
                    if (instanceData.serializeData) {
                        addComponent = deserialize(instanceData.serializeData, true);
                        Editor.editorModel.addComponentToGameObject(gameObj, addComponent);
                    } else {
                        addComponent = deserialize(sourceData.serializeData, false);
                        instanceData.serializeData = serialize(addComponent);
                        Editor.editorModel.addComponentToGameObject(gameObj, addComponent);
                        instanceData.cacheUUid = addComponent.uuid;
                    }
    
                    this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                }
                return true;
            }

            return false;
        }
    }
}