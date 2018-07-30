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
                instance.prefabInfos = instance.prefabInfos.concat(this.makePrefabInfo(obj));
            })
            return instance;
        }
        private static makePrefabInfo(gameOjbect: GameObject): { uuid: string, editInfo: any, prefab: string }[] {
            let makeInfo = (target: GameObject, result: { uuid: string, editInfo: any, prefab: string }[] = []) => {
                result.push({ uuid: target.uuid, editInfo: {...target.extras}, prefab: target.prefab.name });
                target.transform.children.forEach(transform => {
                    let obj = transform.gameObject;
                    if (Editor.editorModel.isPrefabChild(obj) && !Editor.editorModel.isPrefabRoot(obj)) {
                        makeInfo(obj, result);
                    }
                });
            }
            let target: GameObject = gameOjbect;
            let infos: { uuid: string, editInfo: any, prefab: string }[] = [];
            while (target) {
                if (Editor.editorModel.isPrefabRoot(target)) {
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
             
        private prefabInfos: { uuid: string, editInfo: any, prefab: string }[] = [];

        public redo(): boolean {
            let ids = this.prefabInfos.map(prefabInfos => { return prefabInfos.uuid });
            let objs = Editor.editorModel.getGameObjectsByUUids(ids);
            objs.forEach(obj => { 
                obj.prefab = null; 
                obj.extras = {};
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
                        obj.extras = info.editInfo;
                        obj.prefab = paper.Asset.find(info.prefab);
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
            this.prefabInfos=data;
        }
    }
}