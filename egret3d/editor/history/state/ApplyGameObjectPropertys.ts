namespace paper.editor {
    type ApplyGameObjectPropertysData = {
        [parentLinkId: string]: {
            modifyGameObjectPropertyList?: { newValueList: any[], preValueCopylist: any[] }[],
        }
    };

    export class ApplyGameObjectPropertys extends BaseState {
        public static toString(): string {
            return "[class common.ModifyPrefabGameObjectPropertyState]";
        }

        private applyPrefabInstanceRootId: string;
        private tempPrefabObject: GameObject;
        private firstRedo: boolean;

        public static create(applyPrefabInstanceRootId: string, tempPrefabObject: GameObject, dic: any): ApplyGameObjectPropertys | null {
            const state = new ApplyGameObjectPropertys();

            state.tempPrefabObject = tempPrefabObject;
            state.applyPrefabInstanceRootId = applyPrefabInstanceRootId;
            state.data = dic;
            return state;
        }

        public get stateData(): ApplyGameObjectPropertysData {
            return this.data as ApplyGameObjectPropertysData;
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
        }

        private async modifyPrefabGameObjectPropertyValues(linkedId: string, prefabObj: GameObject, valueList: any[]): Promise<void> {
            let objects = this.getGameObjectsByLinkedId(linkedId,this.applyPrefabInstanceRootId);
            valueList.forEach(async (propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = await this.editorModel.deserializeProperty(copyValue, valueEditType);
                this.editorModel.setTargetProperty(propName, prefabObj, newValue);

                objects.forEach(object => {
                    if (paper.equal((object as any)[propName], (prefabObj as any)[propName]) === false) {
                        this.editorModel.setTargetProperty(propName, object, newValue);
                    }
                });
            });
        }

        public getGameObjectsByLinkedId(linkedId: string, filterApplyRootId: string): GameObject[] {
            let objects = paper.Application.sceneManager.activeScene.gameObjects;
            let result: GameObject[] = [];
            for (const obj of objects) {
                if ((obj.extras && obj.extras.linkedID && obj.extras.linkedID == linkedId) && (obj.extras.prefabRootId && obj.extras.prefabRootId != filterApplyRootId) && obj.uuid != filterApplyRootId) {
                    result.push(obj);
                }
            }
            return result;
        }

        public undo(): boolean {
            let allGameObjects = this.getAllGameObjectsFromPrefabInstance(this.tempPrefabObject);

            for (const gameObj of allGameObjects!) {
                if (!(this.stateData[gameObj!.extras!.linkedID!])) {
                    continue;
                }

                let applyData: any = this.stateData[gameObj.extras!.linkedID!];
                if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                    for (const obj of applyData.modifyGameObjectPropertyList) {
                        this.modifyPrefabGameObjectPropertyValues(gameObj.extras!.linkedID!,this.tempPrefabObject,obj.preValueCopylist);
                    }
                }
            }

            return false;
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

        public redo(): boolean {
            if (super.redo()) {
                let allGameObjects = this.getAllGameObjectsFromPrefabInstance(this.tempPrefabObject);

                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData[gameObj.extras!.linkedID!];
                    if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of applyData.modifyGameObjectPropertyList) {
                            this.modifyPrefabGameObjectPropertyValues(gameObj.extras!.linkedID!,this.tempPrefabObject,obj.newValueList);
                        }
                    }
                }
                return true;
            }

            return false;
        }
    }

}