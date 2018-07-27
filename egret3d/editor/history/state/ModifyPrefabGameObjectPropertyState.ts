namespace paper.editor{
    export class ModifyPrefabGameObjectPropertyState extends BaseState {
        public static toString(): string {
            return "[class common.ModifyPrefabGameObjectPropertyState]";
        }

        public static create(gameObjectUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyPrefabGameObjectPropertyState | null {
            const state = new ModifyPrefabGameObjectPropertyState();
            let data = {
                gameObjectUUid,
                newValueList,
                preValueCopylist,
            }
            state.data = data;
            return state;
        }

        protected dispathPropertyEvent(modifyObj: any, propName: string, newValue: any) {
            this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
        }

        /**
         * 修改预制体游戏对象属性,目前只支持修改根对象
         * @param gameObjectId 
         * @param valueList 
         */
        private async modifyPrefabGameObjectPropertyValues(gameObjectUUid: string, valueList: any[]): Promise<void> {
            let prefabObj = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
            if (!prefabObj) {
                return;
            }
            let objects = Editor.editorModel.getRootGameObjectsByPrefab(prefabObj.prefab);
            let editInfoList = editor.getEditInfo(prefabObj);
            valueList.forEach(async (propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                let newValue = await Editor.editorModel.deserializeProperty(copyValue, valueEditType);
                objects.forEach(object => {
                    if (Editor.editorModel.compareValue(object[propName], prefabObj[propName])) {
                        Editor.editorModel.setTargetProperty(propName, object, newValue);
                        this.dispathPropertyEvent(object, propName, newValue);
                    }
                });

                Editor.editorModel.setTargetProperty(propName, prefabObj, newValue);
                this.dispathPropertyEvent(prefabObj, propName, newValue);
            });
        }

        public undo(): boolean {
            if (super.undo()) {
                const { gameObjectUUid, preValueCopylist } = this.data;
                this.modifyPrefabGameObjectPropertyValues(gameObjectUUid, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { gameObjectUUid, newValueList } = this.data;
                this.modifyPrefabGameObjectPropertyValues(gameObjectUUid, newValueList);
                return true;
            }

            return false;
        }
    }

}