namespace paper.editor {
    export class xAxis extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let xAxis = this._createAxis(new egret3d.Vector4(1, 0.0, 0.0, 1), 0);
            xAxis.name = "GizmoController_X";
            xAxis.tag = "Editor";
            xAxis.transform.setLocalScale(0.1, 2, 0.1);
            xAxis.transform.setLocalEulerAngles(0, 0, 90);
            xAxis.transform.setLocalPosition(1, 0, 0);
            this.geo = xAxis
        }
    }
}