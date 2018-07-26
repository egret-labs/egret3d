namespace paper.editor{
    //修改组件属性属性
    export class ModifyComponentPropertyState extends BaseState {
        public static toString(): string {
            return "[class common.ModifyComponentPropertyState]";
        }

        public static create(source: any, key: number | string, value: any, data: any = null): ModifyComponentPropertyState | null {
            const state = new ModifyComponentPropertyState();
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

        private async modifyProperty(value: any): Promise<void> {
            const { propName, componentUUid, gameObjectUUid, editType } = this.data;
            let gameObj: GameObject | null = Editor.editorModel.getGameObjectByUUid(gameObjectUUid);
            let modifyObj: BaseComponent | null;
            if (gameObj) {
                modifyObj = Editor.editorModel.getComponentById(gameObj, componentUUid);
            }
            if (modifyObj && value !== undefined) {
                let toValue = await Editor.editorModel.deserializeProperty(value, editType);
                if (toValue !== null) {
                    Editor.editorModel.setTargetProperty(propName, modifyObj, toValue);
                    this.dispatchEditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: toValue });
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