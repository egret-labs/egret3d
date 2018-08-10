namespace paper.editor {

    //克隆游戏对象
    export class DuplicateGameObjectsState extends BaseState {
        public static toString(): string {
            return "[class common.DuplicateGameObjectsState]";
        }

        public static create(objs: GameObject[],editorModel:EditorModel): DuplicateGameObjectsState {
            //过滤
            editorModel.filtTopHierarchyGameObjects(objs);
            //排序
            objs=editorModel.sortGameObjectsForHierarchy(objs);
            let duplicateInfo: { UUID: string, parentUUID: string, serializeData: any }[] = [];
            for (let i: number = 0; i < objs.length; i++) {
                let obj = objs[i];
                let UUID = obj.uuid;
                let parentUUID = obj.transform.parent ? obj.transform.parent.gameObject.uuid : null;
                let serializeData = serialize(obj);
                duplicateInfo.push({ UUID, parentUUID, serializeData });
            }
            const state = new DuplicateGameObjectsState();
            state.duplicateInfo = duplicateInfo;
            return state;
        }
        //克隆信息列表
        private duplicateInfo: { UUID: string, parentUUID: string, serializeData: any }[];
        //新增的游戏对象列表
        private addList: string[];

        public undo(): boolean {
            if (super.undo()) {
                let objs = this.editorModel.getGameObjectsByUUids(this.addList);
                for (let index = 0; index < objs.length; index++) {
                    const element = objs[index];
                    element.destroy();
                }
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, objs);
                return true;
            }

            return false;
        }
        private firstDo:boolean=true;
        public redo(): boolean {
            if (super.redo()) {
                this.addList = [];
                for (let i: number = 0; i < this.duplicateInfo.length; i++) {
                    let info = this.duplicateInfo[i];
                    let obj: GameObject = new Deserializer().deserialize(info.serializeData,!this.firstDo);
                    let parent = this.editorModel.getGameObjectByUUid(info.parentUUID);
                    if (parent) {
                        obj.transform.parent = parent.transform;
                    }
                    //清理预置体信息
                    this.clearPrefabInfo(obj);
                    this.addList.push(obj.uuid);
                    if(this.firstDo){
                        info.serializeData=serialize(obj);
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, this.addList);
                this.firstDo=false;
                return true;
            }

            return false;
        }
        private clearPrefabInfo(obj: GameObject): void {
            if (this.editorModel.isPrefabChild(obj)) {
                obj.extras.linkedID=undefined;
                obj.extras.prefab=undefined;
                obj.extras.prefabRootId=undefined;
                for (let i: number = 0; i < obj.transform.children.length; i++) {
                    this.clearPrefabInfo(obj.transform.children[i].gameObject);
                }
            }
        }
        public serialize(): any {
            return { duplicateInfo: this.duplicateInfo, addList: this.addList };
        }
        public deserialize(data: any) {
            this.duplicateInfo = data.duplicateInfo;
            this.addList = data.addList;
        }
    }
}