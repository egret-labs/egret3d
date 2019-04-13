namespace paper.editor{
    type ModifyScenePropertyStateData = {sceneUUid:string,newValueList:HistoryProperyInfo[],preValueCopylist:HistoryProperyInfo[]};

    export class ModifyScenePropertyState extends BaseState {
        public static create(sceneUUid:string,newValueList:HistoryProperyInfo[],preValueCopylist:HistoryProperyInfo[]){
            const state = new ModifyScenePropertyState();
            const data:ModifyScenePropertyStateData = {
                sceneUUid,
                newValueList,
                preValueCopylist,
            }
            state.data = data;
            return state;
        }

        private get stateData()
        {
            return this.data as ModifyScenePropertyStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                this.modifyProperty(this.stateData.preValueCopylist);
                return true;
            }
            return false;
        }

        private modifyProperty(valueList: HistoryProperyInfo[]) {
            let modifyObj = this.editorModel.scene;
            if (modifyObj !== null) {
                valueList.forEach(async (propertyValue) => {
                    const newValue = this.editorModel.deserializeProperty(propertyValue.copyValue, propertyValue.propertyInfo);
                    this.editorModel.setTargetProperty(propertyValue.propName, modifyObj, newValue,propertyValue.propertyInfo.editType);
                    this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propertyValue.propName, propValue: newValue })
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