namespace paper.editor {
    type ApplyPrefabInstanceStateData = {
        [gameObjectAssetId: string]: {
            addGameObjects?: { serializeData: any, cacheSerializeData?: any, cacheId?: string }[],
            addComponents?: { serializeData: any, cacheSerializeData?: any, cacheId?: string }[],
            modifyGameObjectPropertyList?: { newValueList: any[], preValueCopylist: any[] }[],
            modifyComponentPropertyList?: { componentId: string, newValueList: any[], preValueCopylist: any[] }[]
        }
    };

    //添加组件
    export class ApplyPrefabInstanceState extends BaseState {
        private prefabRootId: string;
        private firstRedo: boolean = true;

        public static toString(): string {
            return "[class common.ApplyPrefabInstanceState]";
        }

        public static create(datas: any, prefabRootId: string): ApplyPrefabInstanceState | null {
            const state = new ApplyPrefabInstanceState();

            state.data = datas;
            state.prefabRootId = prefabRootId;
            return state;
        }

        private get stateData(): ApplyPrefabInstanceStateData {
            return this.data as ApplyPrefabInstanceStateData;
        }

        public undo(): boolean {
            if (super.undo()) {

                return true;
            }

            return false;
        }

        private getRootGameObjectsByPrefab = (prefab: egret3d.Prefab) => {
            let objects = Application.sceneManager.activeScene.gameObjects;
            let result: GameObject[] = [];
            objects.forEach(obj => {
                if (obj.extras!.prefab === prefab) {
                    result.push(obj);
                }
            })
            return result;
        }

        public getAllGameObjectsFromPrefabInstance(gameObj: paper.GameObject, objs: paper.GameObject[] | null = null) {
            if (gameObj) {
                objs = objs || [];
                if (gameObj.extras!.linkedID) {
                    objs.push(gameObj);
                }
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.getAllGameObjectsFromPrefabInstance(obj, objs);
            }

            return objs;
        }

        private async modifyGameObjectPropertyValues(gameObj: GameObject, prefabObj: GameObject, valueList: any[]): Promise<void> {
            valueList.forEach(async (propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = await this.editorModel.deserializeProperty(copyValue, valueEditType);
                if (paper.equal((gameObj as any)[propName], (prefabObj as any)[propName]) == false) {
                    this.editorModel.setTargetProperty(propName, gameObj, newValue);
                }
            });
        }

        private async modifyComponentPropertyValues(gameObj:GameObject,prefabObj:GameObject,componentLinkid:string,valueList: any[]):Promise<void>{
            let comA = this.editorModel.getComponentByAssetId(gameObj,componentLinkid);
            let comB = this.editorModel.getComponentByAssetId(prefabObj,componentLinkid);
            valueList.forEach(async (propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = await this.editorModel.deserializeProperty(copyValue, valueEditType);
                if (paper.equal((comA as any)[propName], (comB as any)[propName]) == false) {
                    this.editorModel.setTargetProperty(propName, gameObj, newValue);
                }
            });
        }

        public redo(): boolean {
            if (super.redo()) {

                //save prefab
                

                this.firstRedo = false;
                return true;
            }

            return false;
        }
    }
}