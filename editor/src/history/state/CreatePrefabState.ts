namespace paper.editor{
    type CreatePrefabStateData = {prefab:paper.Prefab,parentUUID?:string,cacheSerializeData?:any,cachePrefabUUid?:string}

    export class CreatePrefabState extends BaseState {
        public static toString(): string {
            return "[class common.CreatePrefabState]";
        }

        public static create(prefab:Prefab,parent?:GameObject): CreatePrefabState | null {
            const state = new CreatePrefabState();
            let parentUUID=parent?parent.uuid:undefined;
            let data:CreatePrefabStateData = {
                prefab,
                parentUUID
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
                let deleteUUid: string = this.stateData.cachePrefabUUid!;
                if (deleteUUid) {
                    let gameObj = this.editorModel.getGameObjectByUUid(deleteUUid);
                    if (gameObj) {
                        gameObj.destroy();
                        this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS,[deleteUUid]);
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
                    let instance:GameObject|null = this.stateData.prefab.createInstance(this.editorModel.scene);
                    this.stateData.cachePrefabUUid = instance!.uuid;
                    let parent=this.editorModel.getGameObjectByUUid(this.stateData.parentUUID!);
                    if(parent){
                        instance!.transform.parent=parent.transform;
                    }
                    this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS);
                }

                return true;
            }

            return false;
        }
    }
}