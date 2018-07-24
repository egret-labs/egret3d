namespace paper.editor {
    /**
     * 游戏对象层级
     * @author 杨宁
     */
    export class GameObjectHierarchyState extends BaseState {

        private gameObjects: { UUID: string, oldParentUUID: string, oldIndex: number }[] = [];
        private targetObject: string;
        private targetDir: 'top' | 'inner' | 'bottom';

        public static create(gameObjects: GameObject[], targetGameObj: GameObject, dir: 'top' | 'inner' | 'bottom'): GameObjectHierarchyState {
            //筛选
            gameObjects=gameObjects.concat();
            Editor.editorModel.filtTopHierarchyGameObjects(gameObjects);
            //必须进行层级排序
            let objs = Editor.editorModel.sortGameObjectsForHierarchy(gameObjects);
            //整理对象信息
            let objInfos: { UUID: string, oldParentUUID: string, oldIndex: number }[] = [];
            for (let i: number = 0; i < objs.length; i++) {
                let obj = objs[i];
                let oldParentUUID: string;
                let oldIndex: number;
                if (obj.transform.parent) {
                    oldParentUUID = obj.transform.parent.gameObject.uuid;
                    oldIndex = obj.transform.parent.children.indexOf(obj.transform);
                }
                else {
                    oldParentUUID = undefined;
                    oldIndex = paper.Application.sceneManager.activeScene.gameObjects.indexOf(obj);

                }
                objInfos.push({ UUID: obj.uuid, oldParentUUID: oldParentUUID, oldIndex: oldIndex });
            }
            let instance = new GameObjectHierarchyState();
            instance.gameObjects = objInfos;
            instance.targetDir = dir;
            instance.targetObject = targetGameObj.uuid;
            return instance;
        }
        public undo(): boolean {
            if (super.undo()) {
                for (let index = 0; index < this.gameObjects.length; index++) {
                    let obj = Editor.editorModel.getGameObjectByUUid(this.gameObjects[index].UUID);
                    let oldParentObj = Editor.editorModel.getGameObjectByUUid(this.gameObjects[index].oldParentUUID);
                    if (oldParentObj) {
                        let oldTargetTransform = oldParentObj.transform.children[this.gameObjects[index].oldIndex];
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
                        all.splice(this.gameObjects[index].oldIndex, 0, obj);
                    }
                }
                this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                let gameObjectUUids = this.gameObjects.map(v => { return v.UUID });
                let gameObjs = Editor.editorModel.getGameObjectsByUUids(gameObjectUUids);
                let targetGameObj = Editor.editorModel.getGameObjectByUUid(this.targetObject);
                gameObjs = Editor.editorModel.sortGameObjectsForHierarchy(gameObjs);
                Editor.editorModel.setGameObjectsHierarchy(gameObjs, targetGameObj, this.targetDir);

                this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                return true;
            }
            return false;
        }
    }
}