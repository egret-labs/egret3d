namespace paper.editor {
    type ApplyComponentPropertysData = {
        [parentLinkId: string]: {
            modifyComponentPropertyList?: { componentId: string, newValueList: any[], preValueCopylist: any[] }[]
        }
    };
    //修改预制体组件属性
    export class ApplyComponentPropertys extends BaseState {
        public static toString(): string {
            return "[class common.ApplyComponentPropertys]";
        }

        private applyPrefabInstanceRootId: string;
        private tempPrefabObject: GameObject;
        private firstRedo: boolean;

        public static create(applyPrefabInstanceRootId: string, tempPrefabObject: GameObject, dic: any) {
            const state = new ApplyComponentPropertys();

            state.tempPrefabObject = tempPrefabObject;
            state.applyPrefabInstanceRootId = applyPrefabInstanceRootId;
            state.data = dic;
            return state;
        }

        public get stateData(): ApplyComponentPropertysData {
            return this.data as ApplyComponentPropertysData;
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
        }

        public async modifyPrefabComponentPropertyValues(linkedId: string, componentUUid: string,prefabObj: GameObject, valueList: any[]): Promise<void> {
            let objects = this.getGameObjectsByLinkedId(linkedId,this.applyPrefabInstanceRootId);
            for (let k: number = 0; k < prefabObj.components.length; k++) {
                let prefabComp = prefabObj.components[k];
                let editInfoList = editor.getEditInfo(prefabComp);
                if (prefabComp.uuid === componentUUid) {
                    valueList.forEach(async (propertyValue) => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        
                        let newValue = await this.editorModel.deserializeProperty(copyValue, valueEditType);
                        this.editorModel.setTargetProperty(propName, prefabComp, newValue);
                        this.dispathPropertyEvent(prefabComp, propName, newValue);

                        objects.forEach(object => {
                            let objectComp = this.editorModel.getComponentByAssetId(object, prefabComp.extras!.linkedID!);
                            if (objectComp !== null) {
                                if (paper.equal((objectComp as any)[propName],(prefabComp as any)[propName]) === false) {
                                    this.editorModel.setTargetProperty(propName, objectComp, newValue);
                                }
                            } 
                        });
                    })
                }
            }
        }

        public undo(): boolean {
            if (super.undo()) {
                let allGameObjects = this.getAllGameObjectsFromPrefabInstance(this.tempPrefabObject);

                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData[gameObj.extras!.linkedID!];
                    if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                        for (const obj of applyData.modifyComponentPropertyList) {
                            this.modifyPrefabComponentPropertyValues(gameObj.extras!.linkedID!,obj.componentId,this.tempPrefabObject, obj.preValueCopylist);
                        }
                    }
                }
                return true;
            }

            return false;
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
                    if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                        for (const obj of applyData.modifyComponentPropertyList) {
                            this.modifyPrefabComponentPropertyValues(gameObj.extras!.linkedID!,obj.componentId,this.tempPrefabObject, obj.newValueList);
                        }
                    }
                }
                return true;
            }

            return false;
        }
    }
}