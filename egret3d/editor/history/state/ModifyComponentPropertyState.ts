namespace paper.editor{
    type ModifyComponentPropertyStateData = {gameObjUUid:string,componentUUid:string,newValueList:any[],preValueCopylist:any[]};

    //修改组件属性属性
    export class ModifyComponentPropertyState extends BaseState {
        public static toString(): string {
            return "[class common.ModifyComponentPropertyState]";
        }

        public static create(gameObjUUid: string, componentUUid: string, newValueList: any[], preValueCopylist: any[]): ModifyComponentPropertyState | null {
            const state = new ModifyComponentPropertyState();
            let data:ModifyComponentPropertyStateData = {
                gameObjUUid,
                componentUUid,
                newValueList,
                preValueCopylist,
            }
            state.data = data;
            return state;
        }

        private get stateData():ModifyComponentPropertyStateData
        {
            return this.data as ModifyComponentPropertyStateData;
        }

        public undo(): boolean {
            if (super.undo()) {
                this.modifyProperty(this.stateData.preValueCopylist);
                return true;
            }
            return false;
        }

        private modifyProperty(valueList: any[]) {
            const gameObjectUUid = this.stateData.gameObjUUid;
            const componentUUid = this.stateData.componentUUid;
            let gameObj: GameObject | null = this.editorModel.getGameObjectByUUid(gameObjectUUid);
            let modifyObj: BaseComponent | null;
            if (gameObj) {
                modifyObj = this.editorModel.getComponentById(gameObj, componentUUid);
                if (modifyObj) {
                    valueList.forEach(async (propertyValue) => {
                        const { propName, copyValue, valueEditType } = propertyValue;
                        let newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                        this.editorModel.setTargetProperty(propName, modifyObj, newValue);
                        this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue })
                    });
                }
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