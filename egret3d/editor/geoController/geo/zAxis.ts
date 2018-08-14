namespace paper.editor {
    export class zAxis extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let zAxis = this._createAxis(new egret3d.Vector4(0.0, 0.0, 1, 1), 0);
            zAxis.name = "GizmoController_Z";
            zAxis.tag = "Editor";
            zAxis.transform.setLocalScale(0.1, 2, 0.1);
            zAxis.transform.setLocalEulerAngles(90, 0, 0);
            zAxis.transform.setLocalPosition(0, 0, 1);
            this.geo = zAxis
        }

    }
}