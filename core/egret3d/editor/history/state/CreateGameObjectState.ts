namespace paper.editor {

    //创建游戏对象
    export class CreateGameObjectState extends BaseState {
        public static toString(): string {
            return "[class common.AddGameObjectState]";
        }

        public static create(parentList: (GameObject | Scene)[], createType: string, mesh: egret3d.Mesh): CreateGameObjectState | null {
            let infos = parentList.map((obj) => { return { parentUUID: obj.uuid, serializeData: null } });
            let state = new CreateGameObjectState();
            state.infos = infos;
            state.createType = createType;
            state.mesh = mesh;
            return state;
        }
        public infos: { parentUUID: string, serializeData: any }[];
        public createType: string;
        public addList: string[];
        private mesh: egret3d.Mesh;
        private isFirst: boolean = true;


        public undo(): boolean {
            if (super.undo()) {
                let objs = this.editorModel.getGameObjectsByUUids(this.addList);
                for (let index = 0; index < objs.length; index++) {
                    const element = objs[index];
                    element.destroy();
                }
                this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, this.addList);
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                this.addList = [];
                //一条信息都没有则添加到场景根
                if (this.infos.length === 0) {
                    this.infos.push({ parentUUID: null, serializeData: null });
                }
                for (let i: number = 0; i < this.infos.length; i++) {
                    let obj: GameObject;
                    if (this.isFirst) {
                        obj = this.createGameObjectByType(this.createType);
                        this.infos[i].serializeData = serialize(obj);
                    }
                    else {
                        obj = new Deserializer().deserialize(this.infos[i].serializeData, true,false,this.editorModel.scene);
                    }
                    let parent = this.editorModel.getGameObjectByUUid(this.infos[i].parentUUID);
                    if (parent)
                        obj.transform.parent = parent.transform;
                    this.addList.push(obj.uuid);
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, this.addList);
                this.isFirst = false;
                return true;
            }
            return false;
        }

        private createGameObjectByType(createType: string): GameObject {
            let obj: GameObject = new GameObject();
            let meshFilter: egret3d.MeshFilter;
            obj.name = createType.toLowerCase();
            if (this.mesh) {
                meshFilter = obj.addComponent(egret3d.MeshFilter);
                meshFilter.mesh = this.mesh;
                obj.addComponent(egret3d.MeshRenderer);
            }
            return obj;
        }
    }
}