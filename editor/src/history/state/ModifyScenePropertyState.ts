namespace paper.editor{
    type ModifyScenePropertyStateData = {sceneUUid:string,newValueList:any[],preValueCopylist:any[]};

    export class ModifyScenePropertyState extends BaseState {
        public static create(sceneUUid:string,newValueList:any[],preValueCopylist:any[]){
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

        private modifyProperty(valueList: any[]) {
            let modifyObj = this.editorModel.scene;
            if (modifyObj !== null) {
                valueList.forEach(async (propertyValue) => {
                    const { propName, copyValue, valueEditType } = propertyValue;
                    const newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                    this.editorModel.setTargetProperty(propName, modifyObj, newValue,valueEditType);
                    this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
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