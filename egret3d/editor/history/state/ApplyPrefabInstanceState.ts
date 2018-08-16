namespace paper.editor {
    type ApplyPrefabInstanceStateData = {
        applyPrefabRootId: string,
        applyData: editor.ApplyData,
        prefab: paper.Prefab,
        cachePrefabSerializedData: paper.ISerializedData,
        cacheGameObjetsIds?: string[],
        cacheComponentsIds?: { [gameobjId: string]: string[] }
    };

    //添加组件
    export class ApplyPrefabInstanceState extends BaseState {
        private firstRedo: boolean = true;

        public static toString(): string {
            return "[class common.ApplyPrefabInstanceState]";
        }

        public static create(applyData: editor.ApplyData, applyPrefabRootId: string, prefab: paper.Prefab): ApplyPrefabInstanceState | null {
            const state = new ApplyPrefabInstanceState();
            const cachePrefabSerializedData: paper.ISerializedData = Editor.activeEditorModel.deepClone((prefab as any)._raw);

            let data: ApplyPrefabInstanceStateData = {
                applyPrefabRootId,
                prefab,
                applyData,
                cachePrefabSerializedData
            }

            state.data = data;
            return state;
        }

        private get stateData(): ApplyPrefabInstanceStateData {
            return this.data as ApplyPrefabInstanceStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                //delete new gameobjs
                if (this.stateData.cacheGameObjetsIds && this.stateData.cacheGameObjetsIds.length > 0) {
                    const objs: GameObject[] = Editor.activeEditorModel.getGameObjectsByUUids(this.stateData.cacheGameObjetsIds);
                    objs.forEach(obj => obj.destroy());
                    this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS);
                }

                //delete new components
                if (this.stateData.cacheComponentsIds && this.stateData.cacheComponentsIds) {
                    for (const key in this.stateData.cacheComponentsIds) {
                        if (this.stateData.cacheComponentsIds.hasOwnProperty(key)) {
                            const gameObj = Editor.activeEditorModel.getGameObjectByUUid(key);
                            const componentsIds = this.stateData.cacheComponentsIds[key] as string[];
                            if (gameObj !== null) {
                                for (let i: number = gameObj.components.length - 1; i >= 0; i--) {
                                    let comp = gameObj.components[i];
                                    if (componentsIds.indexOf(comp.uuid) >= 0) {
                                        gameObj.removeComponent(comp.constructor as any);
                                    }
                                }
                            }
                        }
                    }

                    this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                }

                //reset property
                let tempPrefabObject = this.stateData.prefab.createInstance(Application.sceneManager.globalScene, true);
                let allGameObjects = Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(tempPrefabObject);
                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData.applyData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData.applyData[gameObj!.extras!.linkedID!];

                    //modify gameobject property
                    if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of applyData.modifyGameObjectPropertyList) {
                            this.modifyPrefabGameObjectPropertyValues(gameObj.extras!.linkedID!, tempPrefabObject, obj.preValueCopylist);
                        }
                    }

                    //modify componet property
                    if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                        for (const obj of applyData.modifyComponentPropertyList) {
                            this.modifyPrefabComponentPropertyValues(gameObj.extras!.linkedID!, obj.componentId, tempPrefabObject, obj.preValueCopylist);
                        }
                    }
                }

                //reset prefab serrializedata,save prefab
                (this.stateData.prefab as any)._raw = this.stateData.cachePrefabSerializedData;
                this.dispatchEditorModelEvent(EditorModelEvent.SAVE_ASSET, this.stateData.prefab.name);

                tempPrefabObject.destroy();
                tempPrefabObject = null;

                return true;
            }

            return false;
        }

        public getAllUUidFromGameObject(gameObj: paper.GameObject, uuids: string[] | null = null) {
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

        public setLinkedId(gameObj: GameObject, ids: string[]) {
            let linkedId: string = ids.shift();

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
            let objects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
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

        public async modifyPrefabComponentPropertyValues(linkedId: string, componentUUid: string, tempObj: GameObject, valueList: any[]): Promise<void> {
            let prefabObj = this.getGameObjectByLinkedId(tempObj, linkedId);
            let objects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
            for (let k: number = 0; k < prefabObj.components.length; k++) {
                let prefabComp = prefabObj.components[k];
                if (prefabComp.uuid === componentUUid) {
                    valueList.forEach(async (propertyValue) => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        let newValue = await this.editorModel.deserializeProperty(copyValue, valueEditType);

                        objects.forEach(object => {
                            let objectComp = this.editorModel.getComponentByAssetId(object, prefabComp.extras!.linkedID!);
                            if (objectComp !== null) {
                                if (paper.equal((objectComp as any)[propName], (prefabComp as any)[propName])) {
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

        public setGameObjectPrefabRootId(gameObj: GameObject, rootID: string) {
            if (gameObj.extras!.prefab == undefined) {
                gameObj.extras!.rootID = rootID;
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.setGameObjectPrefabRootId(obj, rootID);
            }
        }

        public getGameObjectsByLinkedId(linkedId: string, filterApplyRootId: string): GameObject[] {
            let objects = paper.Application.sceneManager.activeScene.gameObjects;
            let result: GameObject[] = [];
            for (const obj of objects) {
                if ((obj.extras && obj.extras.linkedID && obj.extras.linkedID == linkedId) && (obj.extras.prefab || (obj.extras.rootID && obj.extras.rootID != filterApplyRootId)) && obj.uuid != filterApplyRootId) {
                    result.push(obj);
                }
            }
            return result;
        }

        public getGameObjectByLinkedId(gameObj: paper.GameObject, linkedID: string) {
            if (!gameObj || !linkedID) {
                return null;
            }

            let result: paper.GameObject;

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

                let tempPrefabObject = this.stateData.prefab.createInstance(Application.sceneManager.globalScene, true);
                let allGameObjects = Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(tempPrefabObject);

                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData.applyData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData.applyData[gameObj!.extras!.linkedID!];

                    //add new gameobjects
                    if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {


                        for (let index = 0; index < applyData.addGameObjects.length; index++) {
                            let obj = applyData.addGameObjects[index];
                            let ids: string[] = [];

                            //add to prefab
                            let newObj: paper.GameObject | null;
                            if (this.firstRedo) {
                                newObj = new Deserializer().deserialize(obj.serializeData, false, false, Application.sceneManager.globalScene);
                                newObj.parent = gameObj;
                                ids = this.getAllUUidFromGameObject(newObj);
                                obj.cacheSerializeData = Object.create(null);
                                obj.cacheSerializeData[gameObj.uuid] = [];
                                obj.cacheSerializeData[gameObj.uuid][index] = paper.serialize(newObj);
                            } else {
                                let cacheData = obj.cacheSerializeData[gameObj.uuid][index];
                                newObj = new Deserializer().deserialize(cacheData, true, false, Application.sceneManager.globalScene);
                                newObj.parent = gameObj;``
                            }

                            this.stateData.cacheGameObjetsIds = [];

                            //add to instances
                            let linkedId = gameObj!.extras!.linkedID!;
                            let instanceGameObjects: GameObject[] = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
                            for (const instanceGameObject of instanceGameObjects) {
                                let addObj: paper.GameObject | null;

                                if (this.firstRedo) {
                                    addObj = new Deserializer().deserialize(obj.serializeData, false);
                                    addObj.parent = instanceGameObject;
                                    let rootId: string = instanceGameObject.extras!.prefab ? instanceGameObject.uuid : instanceGameObject.extras!.rootID!;
                                    this.setGameObjectPrefabRootId(addObj, rootId);
                                    this.setLinkedId(addObj, ids.concat());
                                    obj.cacheSerializeData[instanceGameObject.uuid] = [];
                                    obj.cacheSerializeData[instanceGameObject.uuid][index] = paper.serialize(addObj);
                                } else {
                                    let cacheData = obj.cacheSerializeData[instanceGameObject.uuid][index];
                                    addObj = new Deserializer().deserialize(cacheData, true);
                                    addObj.parent = instanceGameObject;
                                }

                                if (addObj) {
                                    this.stateData.cacheGameObjetsIds.push(addObj.uuid);
                                }
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, []);
                    }

                    //add newcomponents                                         
                    if (applyData.addComponents && applyData.addComponents.length > 0) {
                        for (const obj of applyData.addComponents) {

                        }
                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }

                    //modify gameobject property
                    if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of applyData.modifyGameObjectPropertyList) {
                            this.modifyPrefabGameObjectPropertyValues(gameObj.extras!.linkedID!, tempPrefabObject, obj.newValueList);
                        }
                    }

                    //modify componet property
                    if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                        for (const obj of applyData.modifyComponentPropertyList) {
                            this.modifyPrefabComponentPropertyValues(gameObj.extras!.linkedID!, obj.componentId, tempPrefabObject, obj.newValueList);
                        }
                    }

                }

                //update prefab serilizeData
                // (this.stateData.prefab as any)._raw = paper.serialize(tempPrefabObject);

                //save asset
                this.dispatchEditorModelEvent(EditorModelEvent.SAVE_ASSET, this.stateData.prefab.name);

                tempPrefabObject.destroy();

                this.firstRedo = false;
                return true;
            }

            return false;
        }
    }
}