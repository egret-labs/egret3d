namespace paper.editor {
    //删除游戏对象
    export class DeleteGameObjectsState extends BaseState {
        public static toString(): string {
            return "[class common.deleteGameObjectsState]";
        }

        public static create(gameObjects: GameObject[]): DeleteGameObjectsState {
            gameObjects = gameObjects.concat();
            //筛选
            Editor.editorModel.filtTopHierarchyGameObjects(gameObjects);
            //排序
            gameObjects = Editor.editorModel.sortGameObjectsForHierarchy(gameObjects);
            let infos: { UUID: string, oldParentUUID: string, oldIndex: number, serializeData: any }[] = [];
            for (let i: number = 0; i < gameObjects.length; i++) {
                let obj = gameObjects[i];
                let oldParentUUID: string;
                let oldIndex: number;
                let serializeData = serialize(obj);
                if (obj.transform.parent) {
                    oldParentUUID = obj.transform.parent.gameObject.uuid;
                    oldIndex = obj.transform.parent.children.indexOf(obj.transform);
                }
                else {
                    oldParentUUID = undefined;
                    oldIndex = paper.Application.sceneManager.activeScene.gameObjects.indexOf(obj);

                }
                infos.push({ UUID: obj.uuid, oldParentUUID: oldParentUUID, oldIndex: oldIndex, serializeData: serializeData });
            }

            let state = new DeleteGameObjectsState();
            state.deleteInfo = infos;
            return state;
        }
        private deleteInfo: { UUID: string, oldParentUUID: string, oldIndex: number, serializeData: any }[];

        public undo(): boolean {
            if (super.undo()) {
                for (let i: number = 0; i < this.deleteInfo.length; i++) {
                    let info = this.deleteInfo[i];
                    let obj: GameObject = deserialize(info.serializeData,true);
                    let oldParentObj = Editor.editorModel.getGameObjectByUUid(info.oldParentUUID);
                    if (oldParentObj) {
                        let oldTargetTransform = oldParentObj.transform.children[info.oldIndex];
                        if (oldTargetTransform) {
                            Editor.editorModel.setGameObjectsHierarchy([obj], oldTargetTransform.gameObject, 'top');
                        }
                        else {
                            Editor.editorModel.setGameObjectsHierarchy([obj], oldParentObj, 'inner');
                        }
                    }
                    else {
                        obj.transform.parent = null;
                        let all = paper.Application.sceneManager.activeScene.gameObjects as Array<GameObject>;
                        let currentIndex = all.indexOf(obj);
                        all.splice(currentIndex, 1);
                        all.splice(info.oldIndex, 0, obj);
                    }
                }

                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, this.deleteInfo.map(info=>{return info.UUID;}));
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let ids = this.deleteInfo.map(info => { return info.UUID });
                let objs = Editor.editorModel.getGameObjectsByUUids(ids);
                for (let index = 0; index < objs.length; index++) {
                    const element = objs[index];
                    element.destroy();
                }
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS, ids);
                return true;
            }
            return false;
        }
        public serialize(): any {
            return this.deleteInfo;
        }
        public deserialize(data: any): void {
            this.deleteInfo = data;
        }
    }

}