namespace paper.editor{
    type ModifyGameObjectPropertyStateData = {gameObjectUUid:string,newValueList:HistoryProperyInfo[],preValueCopylist:HistoryProperyInfo[]};

    export class ModifyGameObjectPropertyState extends BaseState {

        public static create(gameObjectUUid:string,newValueList:HistoryProperyInfo[],preValueCopylist:HistoryProperyInfo[]): ModifyGameObjectPropertyState | null {
            const state = new ModifyGameObjectPropertyState();
            const data:ModifyGameObjectPropertyStateData = {
                gameObjectUUid,
                newValueList,
                preValueCopylist,
            }
            state.data = data;
            return state;
        }

        private get stateData():ModifyGameObjectPropertyStateData
        {
            return this.data as ModifyGameObjectPropertyStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                this.modifyProperty(this.stateData.preValueCopylist);
                return true;
            }
            return false;
        }

        private modifyProperty(valueList: HistoryProperyInfo[]) {
            let uuid:string = this.stateData.gameObjectUUid;
            let modifyObj = this.editorModel.getGameObjectByUUid(uuid);
            if (modifyObj !== null) {
                valueList.forEach(async (propertyValue) => {
                    let newValue = this.editorModel.deserializeProperty(propertyValue.copyValue, propertyValue.propertyInfo);
                    this.editorModel.setTargetProperty(propertyValue.propName, modifyObj, newValue,propertyValue.propertyInfo.editType);
                    this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName:propertyValue.propName, propValue: newValue })
                });
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                this.modifyProperty(this.stateData.newValueList);
                return true;
            }

            return false;
        }
    }

}