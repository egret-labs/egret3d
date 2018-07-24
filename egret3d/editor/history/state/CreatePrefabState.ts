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

        /**
         * 设置children prefab属性
         * @param gameObj 
         * @param prefab 
         */
        private setGameObjectPrefab(gameObj: paper.GameObject, prefab: egret3d.Prefab, rootObj: paper.GameObject) {
            if (!gameObj) {
                return;
            }
            (gameObj as any).prefab = prefab;
            if (gameObj != rootObj) {
                (gameObj as any).prefabEditInfo = rootObj.uuid;
            }
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.setGameObjectPrefab(obj, prefab, rootObj);
            }
        }

        public undo(): boolean {
            if (super.undo()) {
                let deleteUUid: string = this.data.cachePrefabUUid;
                let gameObj = Editor.editorModel.getGameObjectByUUid(deleteUUid);
                Editor.editorModel._deleteGameObject([gameObj]);
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, [this.data.selectIds]);
                return true;

            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { prefab } = this.data;
                if (prefab) {
                    let instance;
                    if (this.data.serializeData) {
                        instance = deserialize(this.data.serializeData,true);
                        this.setGameObjectPrefab(instance, prefab, instance);
                    } else {
                        instance = prefab.createInstance();
                        (instance as any).prefabEditInfo = true;
                        this.setGameObjectPrefab(instance, prefab, instance);
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