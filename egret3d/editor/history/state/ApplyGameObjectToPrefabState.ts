namespace paper.editor{
    type ApplyGameObjectToPrefabStateData =  {
        [parentLinkId: string]: {
            addGameObjects?: { serializeData: any, cacheSerializeData?: any, cacheId?: string }[],
        }
    };

    export class ApplyGameObjectToPrefabState extends BaseState {
        public static toString(): string {
            return "[class common.ApplyGameObjectToPrefabState]";
        }

        private applyPrefabInstanceRootId:string;
        private tempPrefabObject:GameObject;
        private firstRedo:boolean;

        public static create(applyPrefabInstanceRootId:string,tempPrefabObject:GameObject,dic:any): ApplyGameObjectToPrefabState{
            const state = new ApplyGameObjectToPrefabState();
            state.applyPrefabInstanceRootId = applyPrefabInstanceRootId;
            state.tempPrefabObject = tempPrefabObject;

            let data:ApplyGameObjectToPrefabStateData = dic;
            state.data = data;
            return state;
        }

        private get stateData()
        {
            return this.data as ApplyGameObjectToPrefabStateData;
        }

        public set tmepObject(tempGameObject:GameObject)
        {
            this.tempPrefabObject = tempGameObject;
        }

        public undo(): boolean {
            if (super.undo()) {
                let allGameObjects = this.getAllGameObjectsFromPrefabInstance(this.tempPrefabObject);

                //delete addObjs from tempPrefb
                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData[gameObj!.extras!.linkedID!];
                    if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {
                        for (const obj of applyData.addGameObjects) {
                            if (obj.cacheId) {
                                
                            }
                        }
                    }
                }

                //delete from scene

                return true;
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

        public getGameObjectsByLinkedId(linkedId: string,filterApplyRootId:string): GameObject[] {
            let objects = paper.Application.sceneManager.activeScene.gameObjects;
            let result:GameObject[] = [];
            for (const obj of objects) {
                if ((obj.extras && obj.extras.linkedID && obj.extras.linkedID == linkedId) && (obj.extras.prefabRootId && obj.extras.prefabRootId != filterApplyRootId) && obj.uuid != filterApplyRootId) {
                    result.push(obj);
                }
            }
            return result;
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

        public redo(): boolean {
            if (super.redo()) {
                let allGameObjects = this.getAllGameObjectsFromPrefabInstance(this.tempPrefabObject);

                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData[gameObj!.extras!.linkedID!];
                    if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {
                        for (const obj of applyData.addGameObjects) {

                            //add to prefab
                            let newObj: paper.GameObject | null;
                            if (this.firstRedo) {
                                newObj = new Deserializer().deserialize(obj.serializeData, false);
                                newObj!.extras!.linkedID = newObj!.uuid;
                                newObj!.extras!.prefabRootId = this.tempPrefabObject.uuid;
                            } else {
                                newObj = new Deserializer().deserialize(obj.cacheSerializeData, true);
                            }
                            if (newObj !== null) {
                                newObj.parent = gameObj;
                                obj.cacheSerializeData = paper.serialize(newObj);
                                obj.cacheId = newObj.uuid;
                            }

                            //add to instances
                            let linkedId = gameObj!.extras!.linkedID!;
                            let instanceGameObjects:GameObject[] = this.getGameObjectsByLinkedId(linkedId,this.applyPrefabInstanceRootId);
                            for (const instanceGameObject of instanceGameObjects) {
                                 let addObj:paper.GameObject | null;
                                 addObj = new Deserializer().deserialize(obj.cacheSerializeData,false);
                                 if (addObj !== null) {
                                    addObj.parent = instanceGameObject;
                                    let rootId:string = instanceGameObject.extras!.prefab ? instanceGameObject.uuid : instanceGameObject.extras!.prefabRootId!;
                                    this.setGameObjectPrefabRootId(addObj,rootId);

                                    //todo:cache id
                                 }
                            }
                        }
                    }
                }

                return true;
            }

            return false;
        }
    }

}