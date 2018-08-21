namespace paper.editor{
    type ModifyAssetPropertyStateData = {assetUrl: string, newValueList: any[], preValueCopylist: any[]};

    //修改asset
    export class ModifyAssetPropertyState extends BaseState {
        public static toString(): string {
            return "[class common.ModifyAssetPropertyState]";
        }

        public static create(assetUrl: string, newValueList: any[], preValueCopylist: any[]): ModifyAssetPropertyState | null {
            const state = new ModifyAssetPropertyState();
            let data:ModifyAssetPropertyStateData = {
                assetUrl,
                newValueList,
                preValueCopylist
            }
            state.data = data;
            return state;
        }

        public async modifyAssetPropertyValues(assetUrl: string, valueList: any[]): Promise<void> {
            let target = await this.editorModel.getAssetByAssetUrl(assetUrl);
            let editInfoList = editor.getEditInfo(target);
            valueList.forEach(async (propertyValue) => {
                const { propName, copyValue, valueEditType } = propertyValue;
                const newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                this.editorModel.setTargetProperty(propName, target, newValue);
                this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: target, propName: propName, propValue: newValue });
            });
        }

        public undo(): boolean {
            if (super.undo()) {
                const { assetUrl, preValueCopylist } = this.data;
                this.modifyAssetPropertyValues(assetUrl, preValueCopylist);
                return true;
            }

            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                const { newValueList, assetUrl } = this.data;
                this.modifyAssetPropertyValues(assetUrl, newValueList);
                return true;
            }

            return false;
        }
    }

}