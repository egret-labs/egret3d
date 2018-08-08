namespace paper.editor{
    type ApplyGameObjectToPrefabStateData =  {
        [parentLinkId: string]: {
            addComponents?: { serializeData: any, cacheSerializeData?: any, cacheId?: string }[],
        }
    };

    //添加组件
    export class AddPrefabComponentState extends BaseState {
        public static toString(): string {
            return "[class common.AddPrefabComponentState]";
        }

        private applyPrefabInstanceRootId:string;
        private tempPrefabObject:GameObject;
        private firstRedo:boolean;

        public static create(applyPrefabInstanceRootId:string,tempPrefabObject:GameObject,dic:any): AddPrefabComponentState | null {
            const state = new AddPrefabComponentState();

            state.tempPrefabObject = tempPrefabObject;
            state.applyPrefabInstanceRootId = applyPrefabInstanceRootId;
            state.data = dic;
            return state;
        }

        private get stateData():ApplyGameObjectToPrefabStateData
        {
            return this.data as ApplyGameObjectToPrefabStateData;
        }

        public undo(): boolean {
            if (super.undo()) {

                return true;
            }

            return false;
        }

        private removeComponent(data:any):void
        {
            const { gameObjectUUid, cacheComponentId } = data;
            const gameObj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
            if (gameObj && cacheComponentId) {
                const removeComponent = this.editorModel.getComponentById(gameObj, cacheComponentId);
                if (removeComponent) {
                    gameObj.removeComponent(removeComponent.constructor as any);
                }
            }
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

        public redo(): boolean {
            if (super.redo()) {
                let allGameObjects = this.getAllGameObjectsFromPrefabInstance(this.tempPrefabObject);

                for (const gameObj of allGameObjects!) {
                    if (!(this.stateData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let applyData: any = this.stateData[gameObj!.extras!.linkedID!];
                    if (applyData.addComponents && applyData.addComponents.length > 0) {
                        for (const obj of applyData.addComponents) {

                            //add to prefab
                            let newComponent: paper.BaseComponent | null;
                            if (this.firstRedo) {
                                //todo:新序列化
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
                            let instanceGameObjects:GameObject[] = this.getGameObjectsByLinkedId(linkedId,this.applyPrefabInstanceRootId);
                            for (const instanceGameObject of instanceGameObjects) {
                                let addComponent:paper.BaseComponent | null;
                                //todo:新序列化
                                addComponent = new Deserializer().deserialize(obj.cacheSerializeData, false);
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