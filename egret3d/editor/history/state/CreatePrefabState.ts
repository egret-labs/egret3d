namespace paper.editor{

    export class CreatePrefabState extends BaseState {
        public static toString(): string {
            return "[class common.CreatePrefabState]";
        }

        public static create(data: any = null): CreatePrefabState | null {
            const state = new CreatePrefabState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                let deleteUUid: string = this.data.cachePrefabUUid;
                let gameObj = Editor.editorModel.getGameObjectByUUid(deleteUUid);
                Editor.editorModel._deleteGameObject([gameObj]);
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, []);
                return true;

            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { prefab } = this.data;
                if (prefab) {
                    let instance:GameObject;
                    if (this.data.serializeData) {
                        instance = deserialize(this.data.serializeData,true);
                        Editor.editorModel.setGameObjectPrefab(instance,prefab,instance);
                    } else {
                        instance = prefab.createInstance();
                        instance.extras.isPrefabRoot = true;
                        Editor.editorModel.setGameObjectPrefab(instance,prefab,instance);
                        this.data.serializeData = serialize(instance);
                    }

                    this.data.cachePrefabUUid = instance.uuid;
                }

                //select prefab root
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, [this.data.cachePrefabUUid]);
                return true;
            }

            return false;
        }
    }
}