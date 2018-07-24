namespace paper.editor{
    export class ModifyGameObjectPropertyState extends BaseState {
        public static create(data: any = null): ModifyGameObjectPropertyState | null {
            const state = new ModifyGameObjectPropertyState();
            state.data = data;
            return state;
        }

        public undo(): boolean {
            if (super.undo()) {
                const { preValue } = this.data;
                this.modifyProperty(preValue);
                return true;
            }
            return false;
        }

        private async modifyProperty(value: any) {
            const { uuid, propName, editType } = this.data;
            let modifyObj = Editor.editorModel.getGameObjectByUUid(uuid);
            if (modifyObj && value !== undefined) {
                const toValue = await Editor.editorModel.deserializeProperty(value, editType);
                if (toValue !== null) {
                    Editor.editorModel.setTargetProperty(propName, modifyObj, toValue);
                    this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: toValue })
                }
            }
        }

        public redo(): boolean {
            if (super.redo()) {
                const { newValue } = this.data;
                this.modifyProperty(newValue);
                return true;
            }

            return false;
        }
    }

}