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

        private get stateData():CreatePrefabStateData
        {
            return this.data as CreatePrefabStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let deleteUUid: string = this.stateData.cachePrefabUUid;
                if (deleteUUid) {
                    let gameObj = this.editorModel.getGameObjectByUUid(deleteUUid);
                    gameObj.destroy();
                    if (gameObj) {
                        this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS);
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
                    let instance:GameObject = Prefab.create(this.stateData.prefab.prefab.name);

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