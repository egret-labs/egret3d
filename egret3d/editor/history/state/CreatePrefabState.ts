namespace paper.editor{
    type CreatePrefabStateData = {prefab:any,cacheSerializeData?:any,cachePrefabUUid?:string}

    export class CreatePrefabState extends BaseState {
        public static toString(): string {
            return "[class common.CreatePrefabState]";
        }

        public static create(prefab:any): CreatePrefabState | null {
            const state = new CreatePrefabState();
            let data:CreatePrefabStateData = {
                prefab
            }
            state.data = data;
            return state;
        }

        public get stateData():CreatePrefabStateData
        {
            return this.data as CreatePrefabStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let deleteUUid: string = this.stateData.cachePrefabUUid;
                if (deleteUUid) {
                    let gameObj = Editor.editorModel.getGameObjectByUUid(deleteUUid);

                    if (gameObj) {
                        Editor.editorModel._deleteGameObject([gameObj]);
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS);
                        this.dispatchEditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS,[]);
                    }
                }
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const prefab = this.stateData.prefab;
                if (prefab) {
                    let instance:GameObject;

                    if (this.stateData.cacheSerializeData) {
                        instance = deserialize(this.stateData.cacheSerializeData,true);
                        Editor.editorModel.setGameObjectPrefab(instance,prefab,instance);
                    } else {
                        instance = prefab.createInstance();
                        Editor.editorModel.setGameObjectPrefab(instance,prefab,instance);
                        this.stateData.cacheSerializeData = serialize(instance);
                    }

                    if (instance) {
                        this.stateData.cachePrefabUUid = instance.uuid
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS);
                        this.dispatchEditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS,[this.data.cachePrefabUUid]);
                    }
                }

                return true;
            }

            return false;
        }
    }
}