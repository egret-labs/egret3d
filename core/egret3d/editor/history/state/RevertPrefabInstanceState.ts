
namespace paper.editor {
    type RevertPrefabInstanceStateData = {
        revertPrefabRootId: string,
        revertData: editor.revertData,
    };


    export class RevertPrefabInstanceState extends BaseState {
        public static toString(): string {
            return "[class common.RevertPrefabInstanceState]";
        }

        public static create(revertData: editor.revertData, revertPrefabRootId: string) {
            const state = new RevertPrefabInstanceState();
            let data: RevertPrefabInstanceStateData = { revertData, revertPrefabRootId };
            state.data = data;
            return state;
        }

        public get stateData() {
            return this.data as RevertPrefabInstanceStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                let revertRoot: GameObject = Editor.activeEditorModel.getGameObjectByUUid(this.stateData.revertPrefabRootId);
                let gameObjects: GameObject[] = Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(revertRoot);
                let removeGameObjIds: string[] = [];

                for (const gameObj of gameObjects) {
                    if (!(this.stateData.revertData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let revertData: any = this.stateData.revertData[gameObj!.extras!.linkedID!];

                    if (revertData.revertGameObjects && revertData.revertGameObjects.length > 0) {
                        for (const obj of revertData.revertGameObjects) {
                            const {serializeData} = obj;
                            const newObj:GameObject | null = new Deserializer().deserialize(serializeData,true);
                            newObj.parent = gameObj;
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS);
                    }

                    if (revertData.revertComponents && revertData.revertComponents.length > 0) {
                        for (const com of revertData.revertComponents) {
                            const {serializeData} = com;
                            new Deserializer().deserialize(serializeData,true,false,gameObj);
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.ADD_COMPONENT);
                    }

                    if (revertData.modifyGameObjectPropertyList && revertData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of revertData.modifyGameObjectPropertyList) {
                            const preValueCopylist = obj.newValueList;
                            this.modifyPrefabGameObjectPropertyValues(gameObj, preValueCopylist);
                        }
                    }


                    if (revertData.modifyComponentPropertyList && revertData.modifyComponentPropertyList.length > 0) {
                        for (const obj of revertData.modifyComponentPropertyList) {
                            const { componentId, preValueCopylist } = obj;
                            this.modifyPrefabComponentPropertyValues(gameObj, componentId, preValueCopylist);
                        }
                    }

                }
                return true;
            }
            return false;
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
        }

        private modifyPrefabGameObjectPropertyValues(gameObj: GameObject, valueList: any[]) {
            valueList.forEach(async (propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                this.editorModel.setTargetProperty(propName, gameObj, newValue,valueEditType);
                this.dispathPropertyEvent(gameObj, propName, newValue);
            });
        }

        public modifyPrefabComponentPropertyValues(gameObj: GameObject, componentUUid: string, valueList: any[]) {
            for (let k: number = 0; k < gameObj.components.length; k++) {
                let prefabComp = gameObj.components[k];
                if (prefabComp.uuid === componentUUid) {
                    valueList.forEach(async (propertyValue) => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        let newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                        this.editorModel.setTargetProperty(propName, prefabComp, newValue,valueEditType);
                        this.dispathPropertyEvent(prefabComp, propName, newValue);
                    })
                }
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                let revertRoot: GameObject = Editor.activeEditorModel.getGameObjectByUUid(this.stateData.revertPrefabRootId);
                let gameObjects: GameObject[] = Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(revertRoot);
                let removeGameObjIds: string[] = [];

                for (const gameObj of gameObjects) {
                    if (!(this.stateData.revertData[gameObj!.extras!.linkedID!])) {
                        continue;
                    }

                    let revertData: any = this.stateData.revertData[gameObj!.extras!.linkedID!];

                    if (revertData.revertGameObjects && revertData.revertGameObjects.length > 0) {
                        revertData.revertGameObjects.forEach(element => {
                            removeGameObjIds.push(element.id);
                        });
                    }

                    if (revertData.revertComponents && revertData.revertComponents.length > 0) {
                        const revertComponentIds: string[] = [];
                        revertData.revertComponents.forEach(element => {
                            revertComponentIds.push(element.id);
                        });

                        const components = gameObj.components;
                        for (let index = components.length - 1; index >= 0; index--) {
                            const element = components[index];
                            if (revertComponentIds.indexOf(element.uuid) >= 0) {
                                gameObj.removeComponent(element.constructor as any);
                            }
                        }

                        this.dispatchEditorModelEvent(EditorModelEvent.REMOVE_COMPONENT);
                    }

                    if (revertData.modifyGameObjectPropertyList && revertData.modifyGameObjectPropertyList.length > 0) {
                        for (const obj of revertData.modifyGameObjectPropertyList) {
                            const newValueList = obj.newValueList;
                            this.modifyPrefabGameObjectPropertyValues(gameObj, newValueList);
                        }
                    }

                    if (revertData.modifyComponentPropertyList && revertData.modifyComponentPropertyList.length > 0) {
                        for (const obj of revertData.modifyComponentPropertyList) {
                            const { componentId, newValueList } = obj;
                            this.modifyPrefabComponentPropertyValues(gameObj, componentId, newValueList);
                        }
                    }

                }

                let gameObjs:GameObject[] = Editor.activeEditorModel.getGameObjectsByUUids(removeGameObjIds);
                gameObjs.forEach(element => element.destroy());
                this.dispatchEditorModelEvent(EditorModelEvent.DELETE_GAMEOBJECTS,removeGameObjIds);

                return true;
            }

            return false;
        }
    }
}