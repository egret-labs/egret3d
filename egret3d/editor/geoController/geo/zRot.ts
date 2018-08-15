namespace paper.editor {
    export class zRot extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let zRotate = this._createAxis(new egret3d.Vector4(0.0, 0.0, 0.8, 0.5), 1);
            zRotate.name = "GizmoController_Rotate_Z";
            zRotate.tag = "Editor";
            zRotate.transform.setLocalEulerAngles(90, 0, 0);
            zRotate.transform.setLocalScale(3, 0.05, 3);
            this.geo = zRotate
        }
        wasPressed_local() {

        }
        isPressed_local() {

        }
        wasPressed_world() {

        }
        isPressed_world() {

        }
        wasReleased() { return }

    }
}