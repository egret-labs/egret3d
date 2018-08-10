namespace paper.editor {
    let helpVec3_1 = new egret3d.Vector3();
    let helpVec3_2 = new egret3d.Vector3();
    let helpVec3_3 = new egret3d.Vector3();
    let helpQuat_1 = new egret3d.Quaternion();
    let helpQuat_2 = new egret3d.Quaternion();

    class Controller extends paper.Behaviour {

        private _isEditing: boolean = false;
        public selectedGameObjs: GameObject[] = [];

        private bindMouse: egret3d.MouseDevice;
        private bindKeyboard: egret3d.KeyboardDevice;

        private mainGeo: BaseGeo;
        private get controller() {
            return this.mainGeo.geo;
        }

        private _editorModel: EditorModel;
        public set editorModel(editorModel: EditorModel) {
            this._editorModel = editorModel
            this.addEventListener();
        }
        public get editorModel() {
            return this._editorModel;
        }

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

        private changeEditMode(mode: string) {

        }

        private changeEditType(type: string) {
            if (this.geoCtrlType == type) return;
            this.geoCtrlType = type;

            this.editorModel.changeEditType(type)
        }
        private addEventListener() {
            this.editorModel.addEventListener(EditorModelEvent.SELECT_GAMEOBJECTS, e => this.selectGameObjects(e.data), this);
            this.editorModel.addEventListener(EditorModelEvent.CHANGE_EDIT_MODE, e => this.changeEditMode(e.data), this);
            this.editorModel.addEventListener(EditorModelEvent.CHANGE_EDIT_TYPE, e => this.changeEditType(e.data), this);
            // this.editorModel.addEventListener(EditorModelEvent.CHANGE_PROPERTY, e => this.changeProperty(e.data), this);

        }
        private selectGameObjects(gameObjs: GameObject[]) {
            if (!gameObjs) { gameObjs = [] }
            this.selectedGameObjs = gameObjs;
            let len = this.selectedGameObjs.length;
            // this._modeCanChange = true;            
            if (len > 0) {
                this._isEditing = true;
                this.controller.activeSelf
                if (len == 1) {
                    // console.log("select: " + this.selectedGameObjs[0].name);
                    this.controller.transform.setPosition(this.selectedGameObjs[0].transform.getPosition());
                    if (this.geoCtrlMode == "local") {
                        this.controller.transform.setRotation(this.selectedGameObjs[0].transform.getRotation());
                    } else if (this.geoCtrlMode == "world") {
                        this.controller.transform.setRotation(0, 0, 0, 1);
                    }
                } else {
                    let ctrlPos = egret3d.Vector3.set(0, 0, 0, helpVec3_3);
                    for (let i = 0; i < len; i++) {
                        // console.log("select: " + i + " " + this.selectedGameObjs[i].name);
                        let obj = this.selectedGameObjs[i];
                        egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
                    }
                    ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);
                    this.controller.transform.setPosition(ctrlPos);
                    this.controller.transform.setRotation(0, 0, 0, 1);
                    this.geoCtrlMode = "world";
                    // this._modeCanChange = false;
                }
            } else {
                this._isEditing = false;
                this.controller.activeSelf = false;
            }

        }
    }
}