namespace paper.editor {
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
        private static makePrefabInfo(gameOjbect: GameObject): { uuid: string, extras: GameObjectExtras }[] {
            let isPrefabRoot = (gameObj: GameObject): boolean => {
                if (gameObj.extras.prefab) {
                    return true;
                }
                return false;
            }
            let isPrefabChild = (gameObj: GameObject): boolean => {
                if (gameObj.extras.prefabRootId) {
                    return true;
                }
                return false;
            }

            let makeInfo = (target: GameObject, result: { uuid: string, extras: GameObjectExtras }[] = []) => {
                result.push({ uuid: target.uuid, extras: target.extras });
                target.transform.children.forEach(transform => {
                    let obj = transform.gameObject;
                    if (isPrefabChild(obj) && !isPrefabRoot(obj)) {
                        makeInfo(obj, result);
                    }
                });
            }
            let target: GameObject = gameOjbect;
            let infos: { uuid: string, extras: GameObjectExtras }[] = [];
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

        private prefabInfos: { uuid: string, extras: GameObjectExtras }[] = [];

        public redo(): boolean {
            let ids = this.prefabInfos.map(prefabInfos => { return prefabInfos.uuid });
            let objs = this.editorModel.getGameObjectsByUUids(ids);
            objs.forEach(obj => {
                obj.extras.linkedID = undefined;
                obj.extras.prefab = undefined;
                obj.extras.prefabRootId = undefined;
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
                        obj.extras.linkedID = info.extras.linkedID;
                        obj.extras.prefab = info.extras.prefab;
                        obj.extras.prefabRootId = info.extras.prefabRootId;
                        this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: obj, propName: 'prefab', propValue: obj.prefab });
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