namespace paper.editor {
    //修改预制体组件属性
    export class ModifyPrefabComponentPropertyState extends BaseState {
        public static toString(): string {
            return "[class common.ModifyPrefabComponentPropertyState]";
        }

        public static create(gameObjUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyPrefabComponentPropertyState | null {
            const state = new ModifyPrefabComponentPropertyState();
            let data = {
                gameObjUUid,
                componentUUid,
                newValueList,
                preValueCopylist,
            }
            state.data = data;
            return state;
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
        }

        public async modifyPrefabComponentPropertyValues(gameObjUUid: string, componentUUid: string, valueList: any[]): Promise<void> {
            // let prefabObj = Editor.editorModel.getGameObjectByUUid(gameObjUUid);
            // if (!prefabObj) {
            //     return;
            // }
            // let objects = Editor.editorModel.getRootGameObjectsByPrefab(prefabObj.prefab);
            // for (let k: number = 0; k < prefabObj.components.length; k++) {
            //     let prefabComp = prefabObj.components[k];
            //     let editInfoList = editor.getEditInfo(prefabComp);
            //     if (prefabComp.uuid === componentUUid) {
            //         valueList.forEach(async (propertyValue) => {
            //             const { propName, copyValue, valueEditType } = propertyValue;
            //             let newValue = await Editor.editorModel.deserializeProperty(copyValue, valueEditType);
            //             objects.forEach(object => {
            //                 let objectComp = Editor.editorModel.getComponentByAssetId(object, prefabComp.linkedID);
            //                 if (objectComp !== null) {
            //                     if (Editor.editorModel.compareValue(objectComp[propName],prefabComp[propName])) {
            //                         Editor.editorModel.setTargetProperty(propName, objectComp, newValue);
            //                         this.dispathPropertyEvent(objectComp, propName, newValue);
            //                     }
            //                 } else {
            //                     console.warn(`{prefabComp.assetId} not match!`)
            //                 }

            //             });

            //             Editor.editorModel.setTargetProperty(propName, prefabComp, newValue);
            //             this.dispathPropertyEvent(prefabComp, propName, newValue);
            //         })
            //     }
            // }
        }

        public undo(): boolean {
            if (super.undo()) {
                const { gameObjUUid, componentUUid, preValueCopylist } = this.data;
                this.modifyPrefabComponentPropertyValues(gameObjUUid, componentUUid, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjUUid, componentUUid, newValueList } = this.data;
                this.modifyPrefabComponentPropertyValues(gameObjUUid, componentUUid, newValueList);
                return true;
            }

            return false;
        }
    }
}