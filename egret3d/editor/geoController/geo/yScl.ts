namespace paper.editor {
    export class yScl extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let yScale = this._createAxis(new egret3d.Vector4(0.0, 0.8, 0.0, 1), 2);
            yScale.name = "GizmoController_Scale_Y";
            yScale.tag = "Editor";
            yScale.transform.setLocalScale(0.2, 0.2, 0.2);
            yScale.transform.setLocalPosition(0, 2, 0);
            this.geo = yScale
        }
    }
}