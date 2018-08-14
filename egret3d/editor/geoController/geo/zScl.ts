namespace paper.editor {
    export class zScl extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let zScale = this._createAxis(new egret3d.Vector4(0.0, 0.0, 0.8, 1), 2);
            zScale.name = "GizmoController_Scale_Z";
            zScale.tag = "Editor";
            zScale.transform.setLocalScale(0.2, 0.2, 0.2);
            zScale.transform.setLocalPosition(0, 0, 2);
            this.geo = zScale
        }
    }
}