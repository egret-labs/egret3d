namespace paper.editor {
    export class yAxis extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let yAxis = this._createAxis(new egret3d.Vector4(0.0, 1, 0.0, 1), 0);
            yAxis.name = "GizmoController_Y";
            yAxis.tag = "Editor";
            yAxis.transform.setLocalScale(0.1, 2, 0.1);
            yAxis.transform.setLocalEulerAngles(0, 0, 0);
            yAxis.transform.setLocalPosition(0, 1, 0);
            this.geo = yAxis
        }
    }
}