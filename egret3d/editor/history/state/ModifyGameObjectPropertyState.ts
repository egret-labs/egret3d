namespace paper.editor{
    type ModifyGameObjectPropertyStateData = {gameObjectUUid:string,newValueList:any[],preValueCopylist:any[]};

    export class ModifyGameObjectPropertyState extends BaseState {

        public static create(gameObjectUUid:string,newValueList:any[],preValueCopylist:any[]): ModifyGameObjectPropertyState | null {
            const state = new ModifyGameObjectPropertyState();
            let data:ModifyGameObjectPropertyStateData = {
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

        private async modifyProperty(valueList: any[]) {
            let uuid:string = this.stateData.gameObjectUUid;
            let modifyObj = Editor.editorModel.getGameObjectByUUid(uuid);
            if (modifyObj !== null) {
                valueList.forEach(async (propertyValue) => {
                    const { propName, copyValue, valueEditType } = propertyValue;
                    let newValue = await Editor.editorModel.deserializeProperty(copyValue, valueEditType);
                    Editor.editorModel.setTargetProperty(propName, modifyObj, newValue);
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