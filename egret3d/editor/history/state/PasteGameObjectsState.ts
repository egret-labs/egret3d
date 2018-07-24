namespace paper.editor{
    //粘贴游戏对象
    export class PasteGameObjectsState extends BaseState {
        public static toString(): string {
            return "[class common.PasteGameObjectsState]";
        }

        public static create(serializeData: any [],parent:GameObject): PasteGameObjectsState {
            const state = new PasteGameObjectsState();
            let parentUUID:string=parent?parent.uuid:null;
            state.pasteInfo={parentUUID:parentUUID,serializeData:serializeData};
            return state;
        }
        private pasteInfo:{parentUUID:string,serializeData:any[]};
        private addList:string[];
        public undo(): boolean {
            if (super.undo()) {
                let objs=Editor.editorModel.getGameObjectsByUUids(this.addList);
                Editor.editorModel._deleteGameObject(objs);
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, this.addList);
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let parent=Editor.editorModel.getGameObjectByUUid(this.pasteInfo.parentUUID);
                for(let i:number=0;i<this.pasteInfo.serializeData.length;i++){
                    let info=this.pasteInfo.serializeData[i];
                    let obj:GameObject=deserialize(info);
                    if(parent){
                        obj.transform.parent=parent.transform;
                    }
                    //清理预置体信息
                    this.clearPrefabInfo(obj);
                    this.addList.push(obj.uuid);
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, this.addList);\
                return true;
            }
            return false;
        }
        private clearPrefabInfo(obj: GameObject): void {
            if (Editor.editorModel.isPrefabChild(obj)) {
                obj.prefab = null;
                obj['prefabEditInfo'] = undefined;
                for (let i: number = 0; i < obj.transform.children.length; i++) {
                    this.clearPrefabInfo(obj.transform.children[i].gameObject);
                }
            }
        }
        public serialize():any{
            return {pasteInfo:this.pasteInfo,addList:this.addList};
        }
        public deserialize(data:any):void{
            this.addList=data.addList;
            this.pasteInfo=data.pasteInfo;
        }
    }
}