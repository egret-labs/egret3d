namespace paper.editor {
    type dir = 'top' | 'inner' | 'bottom';
    type Info = { UUID: string, oldTargetUUID: string, oldDir: dir };
    /**
     * 游戏对象层级
     * @author 杨宁
     */
    export class GameObjectHierarchyState extends BaseState {

        private gameObjectsInfo: Info[] = [];
        private targetObject: string;
        private targetDir: dir;

        public static create(gameObjects: GameObject[], targetGameObj: GameObject, dir: 'top' | 'inner' | 'bottom',editorModel:EditorModel): GameObjectHierarchyState {
            //筛选
            gameObjects = gameObjects.concat();
            editorModel.filtTopHierarchyGameObjects(gameObjects);
            //必须进行层级排序
            let objs = editorModel.sortGameObjectsForHierarchy(gameObjects);
            //整理对象信息
            let objInfos: Info[] = [];
            for (let i: number = 0; i < objs.length; i++) {
                let obj = objs[i];
                let oldTargetUUID: string;
                let oldDir: dir;
                if (obj.transform.parent) {
                    let index = obj.transform.parent.children.indexOf(obj.transform);
                    if (++index < obj.transform.parent.children.length) {
                        oldTargetUUID = obj.transform.parent.children[index].gameObject.uuid;
                        oldDir = 'top';
                    }
                    else {
                        oldTargetUUID = obj.transform.parent.gameObject.uuid;
                        oldDir = 'inner';
                    }
                }
                else {
                    let all = editorModel.scene.gameObjects;
                    let index = all.indexOf(obj);
                    if (++index < all.length) {
                        oldTargetUUID = all[index].uuid;
                        oldDir = 'top';
                    }
                    else {
                        oldTargetUUID = 'scene';//特殊标记，用来标记最外层最后一个
                        oldDir = 'inner';
                    }
                }
                objInfos.push({ UUID: obj.uuid, oldTargetUUID: oldTargetUUID, oldDir: oldDir });
            }
            let instance = new GameObjectHierarchyState();
            instance.gameObjectsInfo = objInfos;
            instance.targetDir = dir;
            instance.targetObject = targetGameObj.uuid;
            return instance;
        }
        public undo(): boolean {
            if (super.undo()) {
                let tmpList=this.gameObjectsInfo.concat();
                tmpList.reverse();
                for (let index = 0; index < tmpList.length; index++) {
                    let info=tmpList[index];
                    let obj = this.editorModel.getGameObjectByUUid(info.UUID);
                    let oldTarget=this.editorModel.getGameObjectByUUid(info.oldTargetUUID);
                    let oldDir=info.oldDir;
                    if(info.oldTargetUUID==='scene'){
                        let all=this.editorModel.scene.gameObjects;
                        oldTarget=all[all.length-1];
                        oldDir='bottom';
                    }
                    this.editorModel.setGameObjectsHierarchy([obj],oldTarget,oldDir);
                }
                this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUids = this.gameObjectsInfo.map(v => { return v.UUID; });
                let gameObjs = this.editorModel.getGameObjectsByUUids(gameObjectUUids);
                let targetGameObj = this.editorModel.getGameObjectByUUid(this.targetObject);
                gameObjs = this.editorModel.sortGameObjectsForHierarchy(gameObjs);
                this.editorModel.setGameObjectsHierarchy(gameObjs, targetGameObj, this.targetDir);

                this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                return true;
            }
            return false;
        }
    }
}