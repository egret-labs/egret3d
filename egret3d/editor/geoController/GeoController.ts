namespace paper.editor {
    class Controller extends paper.Behaviour {
        private bindMouse: egret3d.MouseDevice;
        private bindKeyboard: egret3d.KeyboardDevice;
        private mainGeo: BaseGeo;
        private editorModel: EditorModel;
        private geoCtrlMode: string = 'local';
        private geoCtrlType: string = 'position';
        constructor() {
            super();
            this.bindMouse = egret3d.InputManager.mouse;
            this.bindKeyboard = egret3d.InputManager.keyboard;
        }
        onUpdate() {
            this.geoChangeByCamera();
            this.inputUpdate();
        }

        private geoChangeByCamera() {
            //控制杆大小随镜头远近变化
        }
        private inputUpdate() {
            let mouse = this.bindMouse;
            let keyboard = this.bindKeyboard;
        }

        private changeEditType(type: string) {
            if (this.geoCtrlType == type) return;
            this.geoCtrlType = type;

            this.editorModel.changeEditType(type)
        }
    }
}