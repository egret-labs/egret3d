namespace paper.editor{
    type CreatePrefabStateData = {prefab:paper.Prefab,cacheSerializeData?:any,cachePrefabUUid?:string}

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
                    if (gameObj) {
                        gameObj.destroy();
                        this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS);
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
                    let instance:GameObject = this.stateData.prefab.createInstance();

                    if (instance) {
                        this.stateData.cachePrefabUUid = instance.uuid;
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS);
                    }
                }

                return true;
            }

            return false;
        }
    }
}