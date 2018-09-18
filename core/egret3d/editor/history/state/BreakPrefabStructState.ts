namespace paper.editor {

    type Info = { uuid: string, linkid?: string, rootid?: string, prefab?: string };
    /**
     * 预置体结构状态
     * @author 杨宁
     */
    export class BreakPrefabStructState extends BaseState {

        public static create(prefabInstanceList: GameObject[]): BreakPrefabStructState {
            let instance: BreakPrefabStructState = new BreakPrefabStructState();
            instance.prefabInfos = [];
            prefabInstanceList.forEach(obj => {
                for (let info of instance.prefabInfos) {
                    if (info.uuid === obj.uuid)
                        return;
                }
                instance.prefabInfos = instance.prefabInfos.concat(this.makePrefabInfo(obj));
            })
            return instance;
        }
        private static makePrefabInfo(gameOjbect: GameObject): Info[] {
            let isPrefabRoot = (gameObj: GameObject): boolean => {
                if (gameObj.extras.prefab) {
                    return true;
                }
                return false;
            }
            let isPrefabChild = (gameObj: GameObject): boolean => {
                if (gameObj.extras.rootID) {
                    return true;
                }
                return false;
            }

            let makeInfo = (target: GameObject, result: Info[] = []) => {
                result.push({ uuid: target.uuid, linkid: target.extras.linkedID, rootid: target.extras.rootID, prefab: target.extras.prefab.name });
                target.transform.children.forEach(transform => {
                    let obj = transform.gameObject;
                    if (isPrefabChild(obj) && !isPrefabRoot(obj)) {
                        makeInfo(obj, result);
                    }
                });
            }
            let target: GameObject = gameOjbect;
            let infos: Info[] = [];
            while (target) {
                if (isPrefabRoot(target)) {
                    makeInfo(target, infos);
                    break;
                }
                if (target.transform.parent)
                    target = target.transform.parent.gameObject;
                else
                    break;
            }
            return infos;
        }

        private prefabInfos: Info[] = [];

        public redo(): boolean {
            let ids = this.prefabInfos.map(prefabInfos => { return prefabInfos.uuid });
            let objs = this.editorModel.getGameObjectsByUUids(ids);
            objs.forEach(obj => {
                obj.extras.linkedID = undefined;
                obj.extras.prefab = undefined;
                obj.extras.rootID = undefined;
                this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: obj, propName: 'prefab', propValue: null });
            });
            return true;
        }
        public undo(): boolean {
            let all = Application.sceneManager.activeScene.gameObjects;
            for (let i: number = 0; i < all.length; i++) {
                let obj = all[i];
                b: for (let k: number = 0; k < this.prefabInfos.length; k++) {
                    let info = this.prefabInfos[k];
                    if (obj.uuid === info.uuid) {
                        obj.extras.linkedID = info.linkid;
                        obj.extras.prefab = paper.Asset.find(info.prefab)
                        obj.extras.rootID = info.rootid;
                        this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: obj, propName: 'prefab', propValue: obj.extras.prefab });
                        break b;
                    }
                }
            }
            return true;
        }
        public serialize(): any {
            return this.prefabInfos;
        }
        public deserialize(data: any): void {
            this.prefabInfos = data;
        }
    }
}