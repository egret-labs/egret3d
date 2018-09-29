namespace paper.editor {
    type ApplyPrefabInstanceStateData = {
        applyPrefabRootId: string,
        applyData: editor.ApplyData,
        prefab: paper.Prefab,
        cachePrefabSerializedData: paper.ISerializedData,
        cacheGameObjetsIds?: string[],
        cacheComponentsIds?: { [gameobjId: string]: string[] }
    };

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
            };
            data.cacheGameObjetsIds = [];
            data.cacheComponentsIds = {};
            state.data = data;
            return state;
        }

        private get stateData(): ApplyPrefabInstanceStateData {
            return this.data as ApplyPrefabInstanceStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let applyGameObject = Editor.activeEditorModel.getGameObjectByUUid(this.stateData.applyPrefabRootId);
                let objects = this.editorModel.scene.gameObjects;
                for (let index = objects.length - 1; index >= 0; index--) {
                    if (this.stateData.cacheGameObjetsIds.length === 0 && Object.keys(this.stateData.cacheComponentsIds).length === 0) {
                        break;
                    }

                    const gameObj = objects[index];
                    const gIndex = this.stateData.cacheGameObjetsIds.indexOf(gameObj.uuid);
                    if (gIndex >= 0) {
                        gameObj.destroy();
                        this.stateData.cacheGameObjetsIds.splice(gIndex,1);
                    }
                    else if (this.stateData.cacheComponentsIds[gameObj.uuid] && this.stateData.cacheComponentsIds[gameObj.uuid].length > 0) {
                        const comIds = this.stateData.cacheComponentsIds[gameObj.uuid];
                        for (let comIndex = gameObj.components.length - 1; comIndex >= 0; comIndex--) {
                            const com = gameObj.components[comIndex];
                            const cIndex = comIds.indexOf(com.uuid);
                            if (cIndex >= 0) {
                                gameObj.removeComponent(com);
                                comIds.splice(cIndex,1);
                                if (comIds.length === 0) {
                                    delete this.stateData.cacheComponentsIds[gameObj.uuid];
                                }
                            }
                        }
                    }
                }
                
                let tempPrefabObject = this.stateData.prefab.createInstance(Application.sceneManager.globalScene, true);
                for (const linkedId in this.stateData.applyData) {

                    let applyData: any = this.stateData.applyData[linkedId];

                    if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {
                        for (let index = 0; index < applyData.addGameObjects.length; index++) {
                            let obj = applyData.addGameObjects[index];
                            let originalObj = this.getGameObjectByUUid(applyGameObject, obj.id);
                            if (originalObj) {
                                this.clearLinkedId(originalObj);
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                    }

                    if (applyData.addComponents && applyData.addComponents.length > 0) {
                        for (let index = 0; index < applyData.addComponents.length; index++) {
                            const element = applyData.addComponents[index];
                            const { id, gameObjId } = element;
                            let originalObj = this.getGameObjectByUUid(applyGameObject, gameObjId);
                            if (originalObj) {
                                let originalComponent = Editor.activeEditorModel.getComponentById(originalObj, id);
                                if (originalComponent) {
                                    originalComponent.extras = {};
                                }
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                    }

                    if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of applyData.modifyGameObjectPropertyList) {
                            this.modifyPrefabGameObjectPropertyValues(linkedId, tempPrefabObject, obj.preValueCopylist);
                        }
                    }

                    if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                        for (const obj of applyData.modifyComponentPropertyList) {
                            this.modifyPrefabComponentPropertyValues(linkedId, obj.componentId, tempPrefabObject, obj.preValueCopylist);
                        }
                    }
                }

                //reset prefab serrializedata,save prefab
                // (this.stateData.prefab as any)._raw = this.stateData.cachePrefabSerializedData;
                const prefabJson = this.stateData.cachePrefabSerializedData;
                (this.stateData.prefab as any)._raw = prefabJson;
                this.dispatchEditorModelEvent(EditorModelEvent.SAVE_ASSET, {name:this.stateData.prefab.name,raw:prefabJson});

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

                for (const com of gameObj.components) {
                    uuids.push(com.uuid);
                }

                for (let index = 0; index < gameObj.transform.children.length; index++) {
                    const element = gameObj.transform.children[index];
                    const obj: paper.GameObject = element.gameObject;
                    this.getAllUUidFromGameObject(obj, uuids);
                }
            }

            return uuids;
        }

        public setLinkedId(gameObj: GameObject, ids: string[]) {
            if (gameObj) {
                let linkedId: string = ids.shift();

                if (linkedId === undefined) {
                    console.error("linkedId error");
                }
                gameObj.extras!.linkedID = linkedId;

                for (const com of gameObj.components) {
                    linkedId = ids.shift();
                    if (linkedId === undefined) {
                        console.error("linkedId error");
                    }
                    com.extras!.linkedID = linkedId;
                }

                for (let index = 0; index < gameObj.transform.children.length; index++) {
                    const element = gameObj.transform.children[index];
                    const obj: paper.GameObject = element.gameObject;
                    if (obj.hideFlags === paper.HideFlags.HideAndDontSave) {
                        continue;
                    }
                    this.setLinkedId(obj, ids);
                }
            }
        }

        public clearLinkedId(gameObj: GameObject) {
            if (gameObj) {
                gameObj.extras = {};

                for (let index = 0; index < gameObj.components.length; index++) {
                    const element = gameObj.components[index];
                    element.extras = {};
                }

                for (let index = 0; index < gameObj.transform.children.length; index++) {
                    const element = gameObj.transform.children[index];
                    const obj: paper.GameObject = element.gameObject;
                    this.clearLinkedId(obj);
                }
            }
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue });
        }

        private modifyPrefabGameObjectPropertyValues(linkedId: string, tempObj: GameObject, valueList: any[]) {
            let prefabObj = this.getGameObjectByLinkedId(tempObj, linkedId);
            let objects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
            valueList.forEach((propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);

                objects.forEach(object => {
                    if (paper.equal((object as any)[propName], (prefabObj as any)[propName])) {
                        this.editorModel.setTargetProperty(propName, object, newValue,valueEditType);
                        this.dispathPropertyEvent(object, propName, newValue);
                    }
                });

                this.editorModel.setTargetProperty(propName, prefabObj, newValue,valueEditType);
            });

            this.dispatchEditorModelEvent(EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
        }

        public modifyPrefabComponentPropertyValues(linkedId: string, componentUUid: string, tempObj: GameObject, valueList: any[]) {
            let prefabObj = this.getGameObjectByLinkedId(tempObj, linkedId);
            let objects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
            for (let k: number = 0; k < prefabObj.components.length; k++) {
                let prefabComp = prefabObj.components[k];
                if (prefabComp.uuid === componentUUid) {
                    valueList.forEach((propertyValue) => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        let newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);

                        objects.forEach(object => {
                            let objectComp = this.editorModel.getComponentByAssetId(object, prefabComp.extras!.linkedID!);
                            if (objectComp !== null) {
                                if (paper.equal((objectComp as any)[propName], (prefabComp as any)[propName])) {
                                    this.editorModel.setTargetProperty(propName, objectComp, newValue,valueEditType);
                                    this.dispathPropertyEvent(objectComp, propName, newValue);
                                }
                            }
                        });

                        this.editorModel.setTargetProperty(propName, prefabComp, newValue,valueEditType);
                    });
                }
            }
        }

        public setGameObjectPrefabRootId(gameObj: GameObject, rootID: string) {
            if (gameObj.extras!.prefab === undefined) {
                gameObj.extras!.rootID = rootID;
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                this.setGameObjectPrefabRootId(obj, rootID);
            }
        }

        public getGameObjectsByLinkedId(linkedId: string, filterApplyRootId: string): GameObject[] {
            let objects = this.editorModel.scene.gameObjects;
            let result: GameObject[] = [];
            for (const obj of objects) {
                if ((obj.extras && obj.extras.linkedID && obj.extras.linkedID === linkedId) && (obj.extras.prefab || (obj.extras.rootID && obj.extras.rootID !== filterApplyRootId)) && obj.uuid !== filterApplyRootId) {
                    result.push(obj);
                }
            }
            return result;
        }

        public getGameObjectByLinkedId(gameObj: paper.GameObject, linkedID: string) {
            if (!gameObj) {
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
                if (result) {
                    break;
                }
            }

            return result;
        }

        public getGameObjectByUUid(gameObj: GameObject, uuid: string) {
            if (!gameObj) {
                return null;
            }

            let result: paper.GameObject;

            if (gameObj.uuid === uuid) {
                result = gameObj;
                return gameObj;
            }

            for (let index = 0; index < gameObj.transform.children.length; index++) {
                const element = gameObj.transform.children[index];
                const obj: paper.GameObject = element.gameObject;
                result = this.getGameObjectByUUid(obj, uuid);
                if (result) {
                    break;
                }
            }

            return result;
        }

        public redo(): boolean {
            if (super.redo()) {
                let tempPrefabObject = this.stateData.prefab.createInstance(Application.sceneManager.globalScene, true);
                let tempGameObjects = Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(tempPrefabObject);
                let applyGameObject = Editor.activeEditorModel.getGameObjectByUUid(this.stateData.applyPrefabRootId);

                for (const gameObj of tempGameObjects!) {
                    if (!(this.stateData.applyData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData.applyData[gameObj!.extras!.linkedID!];

                    if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {
                        for (let index = 0; index < applyData.addGameObjects.length; index++) {
                            let obj = applyData.addGameObjects[index];
                            let ids: string[] = [];

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
                                newObj.parent = gameObj;
                                ids = this.getAllUUidFromGameObject(newObj);
                            }

                            let linkedId = gameObj!.extras!.linkedID!;
                            let instanceGameObjects: GameObject[] = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
                            for (const instanceGameObject of instanceGameObjects) {
                                let addObj: paper.GameObject | null;

                                if (this.firstRedo) {
                                    addObj = new Deserializer().deserialize(obj.serializeData, false,false,this.editorModel.scene);
                                    addObj.parent = instanceGameObject;
                                    let rootId: string = instanceGameObject.extras!.prefab ? instanceGameObject.uuid : instanceGameObject.extras!.rootID!;
                                    this.setGameObjectPrefabRootId(addObj, rootId);
                                    this.setLinkedId(addObj, ids.concat());
                                    obj.cacheSerializeData[instanceGameObject.uuid] = [];
                                    obj.cacheSerializeData[instanceGameObject.uuid][index] = this.clearExtrasFromSerilizeData(paper.serialize(addObj));
                                } else {
                                    let cacheData = obj.cacheSerializeData[instanceGameObject.uuid][index];
                                    addObj = new Deserializer().deserialize(cacheData, true,false,this.editorModel.scene);
                                    addObj.parent = instanceGameObject;
                                    let rootId: string = instanceGameObject.extras!.prefab ? instanceGameObject.uuid : instanceGameObject.extras!.rootID!;
                                    this.setGameObjectPrefabRootId(addObj, rootId);
                                    this.setLinkedId(addObj, ids.concat());
                                }

                                if (addObj) {
                                    this.stateData.cacheGameObjetsIds.push(addObj.uuid);
                                }
                            }

                            let originalGameObj: GameObject = this.getGameObjectByUUid(applyGameObject, obj.id);
                            if (originalGameObj) {
                                this.setGameObjectPrefabRootId(originalGameObj, this.stateData.applyPrefabRootId);
                                this.setLinkedId(originalGameObj, ids.concat());
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS);
                    }

                    if (applyData.addComponents && applyData.addComponents.length > 0) {
                        for (const obj of applyData.addComponents) {
                            let newComponent: BaseComponent;
                            if (this.firstRedo) {
                                newComponent = new Deserializer().deserialize(obj.serializeData, false, false, gameObj);
                                obj.cacheSerializeData = Object.create(null);
                                obj.cacheSerializeData[gameObj.uuid] = paper.serialize(newComponent);
                            } else {
                                let cacheData = obj.cacheSerializeData[gameObj.uuid];
                                newComponent = new Deserializer().deserialize(cacheData, true, false, gameObj);
                            }

                            let linkedId = gameObj!.extras!.linkedID!;
                            let instanceGameObjects: GameObject[] = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
                            for (const instanceGameObject of instanceGameObjects) {
                                let addComponent: BaseComponent;

                                if (this.firstRedo) {
                                    addComponent = new Deserializer().deserialize(obj.serializeData, false, false, instanceGameObject);
                                    addComponent.extras!.linkedID = newComponent.uuid;
                                    obj.cacheSerializeData[instanceGameObject.uuid] = this.clearExtrasFromSerilizeData(paper.serialize(addComponent));
                                } else {
                                    let cacheData = obj.cacheSerializeData[instanceGameObject.uuid];
                                    addComponent = new Deserializer().deserialize(cacheData, true, false, instanceGameObject);
                                    addComponent.extras!.linkedID = newComponent.uuid;
                                }

                                this.stateData.cacheComponentsIds[instanceGameObject.uuid] = this.stateData.cacheComponentsIds[instanceGameObject.uuid] || [];

                                if (addComponent) {
                                    this.stateData.cacheComponentsIds[instanceGameObject.uuid].push(addComponent.uuid);
                                }
                            }

                            let originalGameObj: GameObject = this.getGameObjectByUUid(applyGameObject, obj.gameObjId);
                            if (originalGameObj) {
                                let originalComponent: BaseComponent = Editor.activeEditorModel.getComponentById(originalGameObj, obj.id);
                                originalComponent.extras!.linkedID = newComponent.uuid;
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }

                    if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of applyData.modifyGameObjectPropertyList) {
                            this.modifyPrefabGameObjectPropertyValues(gameObj.extras!.linkedID!, tempPrefabObject, obj.newValueList);
                        }
                    }

                    if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                        for (const obj of applyData.modifyComponentPropertyList) {
                            this.modifyPrefabComponentPropertyValues(gameObj.extras!.linkedID!, obj.componentId, tempPrefabObject, obj.newValueList);
                        }
                    }
                }

                this.clearGameObjectExtrasInfo(tempPrefabObject);
                // (this.stateData.prefab as any)._raw = this.clearExtrasFromSerilizeData(paper.serialize(tempPrefabObject));
                const prefabJson = this.clearExtrasFromSerilizeData(paper.serialize(tempPrefabObject));
                (this.stateData.prefab as any)._raw = prefabJson;
                this.dispatchEditorModelEvent(EditorModelEvent.SAVE_ASSET, {name:this.stateData.prefab.name,raw:prefabJson});

                tempPrefabObject.destroy();
                this.firstRedo = false;
                return true;
            }

            return false;
        }

        private clearGameObjectExtrasInfo(gameObj: paper.GameObject) {
            if (gameObj) {
                delete gameObj.extras;
                for (const comp of gameObj.components) {
                    delete comp.extras;
                }

                for (let index = 0; index < gameObj.transform.children.length; index++) {
                    const element = gameObj.transform.children[index];
                    const obj: paper.GameObject = element.gameObject;
                    this.clearGameObjectExtrasInfo(obj);
                }
            }
        }

        private clearExtrasFromSerilizeData(data: ISerializedData) {
            const objects = data.objects;
            const components = data.components;

            for (const obj of objects) {
                delete obj["extras"];
            }

            for (const comp of components) {
                delete comp["extras"];
            }

            return data;
        }
    }
}