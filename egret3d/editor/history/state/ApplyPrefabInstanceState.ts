namespace paper.editor {
    type ApplyPrefabInstanceStateData = {
        applyPrefabRootId:string,
        prefabName:string,
        applyData:editor.ApplyData
    };

    //添加组件
    export class ApplyPrefabInstanceState extends BaseState {
        private firstRedo: boolean = true;

        public static toString(): string {
            return "[class common.ApplyPrefabInstanceState]";
        }

        public static create(applyData: editor.ApplyData, applyPrefabRootId: string,prefabName:string): ApplyPrefabInstanceState | null {
            const state = new ApplyPrefabInstanceState();

            let data:ApplyPrefabInstanceStateData = {
                applyPrefabRootId,
                prefabName,
                applyData
            }

            state.data = data;
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

        public getAllUUidFromGameObject(gameObj:paper.GameObject,uuids:string[] | null = null)
        {
            if (gameObj) {
                uuids = uuids || [];
                uuids.push(gameObj.uuid);
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.getAllUUidFromGameObject(obj, uuids);
            }

            return uuids;
        }

        public setLinkedId(gameObj:GameObject,ids:string[])
        {
            let linkedId:string = ids.shift();

            if (linkedId === undefined) {
                throw new Error("setLinkedId")
            }

            if (gameObj) {
                gameObj.extras!.linkedID = linkedId;
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.setLinkedId(obj, ids);
            }
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
        }

        private async modifyPrefabGameObjectPropertyValues(linkedId: string, prefabObj: GameObject, valueList: any[]): Promise<void> {
            let objects = this.getGameObjectsByLinkedId(linkedId,this.stateData.applyPrefabRootId);
            valueList.forEach(async (propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;

                let newValue = await this.editorModel.deserializeProperty(copyValue, valueEditType);

                objects.forEach(object => {
                    if (paper.equal((object as any)[propName], (prefabObj as any)[propName])) {
                        this.editorModel.setTargetProperty(propName, object, newValue);
                        this.dispathPropertyEvent(object, propName, newValue);
                    }
                });
               
                this.editorModel.setTargetProperty(propName, prefabObj, newValue);
            });
        }

        public async modifyPrefabComponentPropertyValues(linkedId: string, componentUUid: string,tempObj: GameObject, valueList: any[]): Promise<void> {
            let prefabObj = this.getGameObjectByLinkedId(tempObj,linkedId);
            let objects = this.getGameObjectsByLinkedId(linkedId,this.stateData.applyPrefabRootId);
            for (let k: number = 0; k < prefabObj.components.length; k++) {
                let prefabComp = prefabObj.components[k];
                if (prefabComp.uuid === componentUUid) {
                    valueList.forEach(async (propertyValue) => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        let newValue = await this.editorModel.deserializeProperty(copyValue, valueEditType);

                        objects.forEach(object => {
                            let objectComp = this.editorModel.getComponentByAssetId(object, prefabComp.extras!.linkedID!);
                            if (objectComp !== null) {
                                if (paper.equal((objectComp as any)[propName],(prefabComp as any)[propName])) {
                                    this.editorModel.setTargetProperty(propName, objectComp, newValue);
                                    this.dispathPropertyEvent(objectComp, propName, newValue);
                                }
                            } 
                        });

                        this.editorModel.setTargetProperty(propName, prefabComp, newValue);
                    })
                }
            }
        }

        public setGameObjectPrefabRootId(gameObj:GameObject,prefabRootId:string)
        {
            if (gameObj.extras!.prefab == undefined) {
                gameObj.extras!.prefabRootId = prefabRootId;
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.setGameObjectPrefabRootId(obj, prefabRootId);
            }
        }

        public getGameObjectsByLinkedId(linkedId: string,filterApplyRootId:string): GameObject[] {
            let objects = paper.Application.sceneManager.activeScene.gameObjects;
            let result:GameObject[] = [];
            for (const obj of objects) {
                if ((obj.extras && obj.extras.linkedID && obj.extras.linkedID == linkedId) && (obj.extras.prefab || (obj.extras.prefabRootId && obj.extras.prefabRootId != filterApplyRootId)) && obj.uuid != filterApplyRootId) {
                    result.push(obj);
                }
            }
            return result;
        }

        public getGameObjectByLinkedId(gameObj: paper.GameObject, linkedID:string) {
            if (!gameObj || !linkedID) {
                return null;
            }
    
            let result:paper.GameObject;
    
            if (gameObj.extras.linkedID === linkedID) {
                result = gameObj;
                return gameObj;
            }
    
            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                result = this.getGameObjectByLinkedId(obj, linkedID);
                if (result || result === null) {
                    break;
                }
            }
    
            return result;
        }

        public redo(): boolean {
            if (super.redo()) {

                let tempPrefabObject = Prefab.create(this.stateData.prefabName,Application.sceneManager.globalScene,true);
                let allGameObjects = this.getAllGameObjectsFromPrefabInstance(tempPrefabObject);

                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData.applyData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData.applyData[gameObj!.extras!.linkedID!];

                    //add new gameobjects
                    if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {
                        for (const obj of applyData.addGameObjects) {

                            obj.cacheSerializeData = {};
                            let ids:string[] = [];

                            //add to prefab
                            let newObj: paper.GameObject | null;
                            if (this.firstRedo) {
                                newObj = new Deserializer().deserialize(obj.serializeData, false,false,Application.sceneManager.globalScene);
                                newObj.parent = gameObj;

                                //todo:
                                obj.cacheId = newObj.uuid;
                                ids = this.getAllUUidFromGameObject(newObj);
                                obj.cacheSerializeData[gameObj.uuid] = paper.serialize(newObj);
                            } else {
                                newObj = new Deserializer().deserialize(obj.cacheSerializeData[gameObj.uuid], true,false,Application.sceneManager.globalScene);
                            }

                            //add to instances
                            let linkedId = gameObj!.extras!.linkedID!;
                            let instanceGameObjects:GameObject[] = this.getGameObjectsByLinkedId(linkedId,this.stateData.applyPrefabRootId);
                            for (const instanceGameObject of instanceGameObjects) {
                                 let addObj:paper.GameObject | null;

                                if (this.firstRedo) {
                                    addObj = new Deserializer().deserialize(obj.serializeData,false);
                                    addObj.parent = instanceGameObject;
                                    let rootId:string = instanceGameObject.extras!.prefab ? instanceGameObject.uuid : instanceGameObject.extras!.prefabRootId!;
                                    this.setGameObjectPrefabRootId(addObj,rootId);
                                    this.setLinkedId(addObj,ids.concat());
                                    obj.cacheSerializeData[instanceGameObject.uuid] = paper.serialize(addObj);
                                }else{
                                    addObj = new Deserializer().deserialize(obj.cacheSerializeData[instanceGameObject.uuid],true);
                                }
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, []);
                    }

                    //add newcomponents                                         
                    if (applyData.addComponents && applyData.addComponents.length > 0) {
                        for (const obj of applyData.addComponents) {

                            //add to prefab
                            let newComponent: paper.BaseComponent | null;
                            if (this.firstRedo) {
                                //todo:
                                newComponent = new Deserializer().deserialize(obj.serializeData, false);
                                newComponent!.extras!.linkedID = newComponent!.uuid;
                            } else {
                                newComponent = new Deserializer().deserialize(obj.cacheSerializeData, true);
                            }
                            if (newComponent !== null) {
                                obj.cacheSerializeData = paper.serialize(newComponent);
                                obj.cacheId = newComponent.uuid;
                            }

                            //add to instances
                            let linkedId = gameObj!.extras!.linkedID!;
                            let instanceGameObjects:GameObject[] = this.getGameObjectsByLinkedId(linkedId,this.stateData.applyPrefabRootId);
                            for (const instanceGameObject of instanceGameObjects) {
                                let addComponent:paper.BaseComponent | null;
                                //todo:
                                // addComponent = new Deserializer().deserialize(obj.cacheSerializeData, false);
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }

                    //modify gameobject property
                    if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of applyData.modifyGameObjectPropertyList) {
                            this.modifyPrefabGameObjectPropertyValues(gameObj.extras!.linkedID!,tempPrefabObject,obj.newValueList);
                        }
                    }

                    //modify componet property
                    if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                        for (const obj of applyData.modifyComponentPropertyList) {
                            this.modifyPrefabComponentPropertyValues(gameObj.extras!.linkedID!,obj.componentId,tempPrefabObject, obj.newValueList);
                        }
                    }
                    
                }
                this.firstRedo = false;
                return true;
            }

            return false;
        }
    }
}