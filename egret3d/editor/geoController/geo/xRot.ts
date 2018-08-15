namespace paper.editor {
    export class xRot extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let xRotate = this._createAxis(new egret3d.Vector4(0.8, 0.0, 0.0, 0.5), 1);
            xRotate.name = "GizmoController_Rotate_X";
            xRotate.tag = "Editor";
            xRotate.transform.setLocalScale(3, 3, 3);
            xRotate.transform.setLocalEulerAngles(0, 0, -90);
            this.geo = xRotate
        }

        wasPressed_local() {

        }
        isPressed_local() {

        }
        wasPressed_world() {

        }
        isPressed_world() {

        }
    }
}