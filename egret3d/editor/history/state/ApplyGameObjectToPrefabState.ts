namespace paper.editor{
    type ApplyGameObjectToPrefabStateData = {serializeData:any,parentIds:string[],addList:string[]};

    export class ApplyGameObjectToPrefabState extends BaseState {
        public static toString(): string {
            return "[class common.ApplyGameObjectToPrefabState]";
        }

        public static create(serializeData:any,parentIds:string[]): ApplyGameObjectToPrefabState{
            const state = new ApplyGameObjectToPrefabState();
            let data:ApplyGameObjectToPrefabStateData = {
                serializeData,
                parentIds,
                addList:[]
            }
            state.data = data;
            return state;
        }

        private get stateData():ApplyGameObjectToPrefabStateData
        {
            return this.data as ApplyGameObjectToPrefabStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let objs = Editor.editorModel.getGameObjectsByUUids(this.stateData.addList);
                Editor.editorModel._deleteGameObject(objs);
                this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, this.stateData.addList);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let parentObjs = Editor.editorModel.getGameObjectsByUUids(this.stateData.parentIds);
                for (const parentObj of parentObjs) {
                    let obj: GameObject = deserialize(this.stateData.serializeData, false);
                    if (parentObj) {
                        obj.transform.parent = parentObj.transform;

                        //set extras
                        obj.extras.isPrefabRoot = false;
                        obj.extras.prefabRootId = parentObj.extras.prefabRootId;
                        obj.prefab = parentObj.prefab;
                        this.stateData.addList.push(obj.uuid);
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, this.stateData.addList);
                return true;
            }

            return false;
        }
    }

}