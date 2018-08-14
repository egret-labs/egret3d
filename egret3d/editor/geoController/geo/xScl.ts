namespace paper.editor {
    export class xScl extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let xScale = this._createAxis(new egret3d.Vector4(0.8, 0.0, 0.0, 1), 2);
            xScale.name = "GizmoController_Scale_X";
            xScale.tag = "Editor";
            xScale.transform.setLocalScale(0.2, 0.2, 0.2);
            xScale.transform.setLocalPosition(2, 0, 0);
            this.geo = xScale
        }
    }
}