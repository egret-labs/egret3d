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
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();
            egret3d.Quaternion.transformVector3(worldRotation, this.up, this._dragPlaneNormal);
            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);
            egret3d.Quaternion.copy(worldRotation, this._initRotation);
            egret3d.Vector3.copy(selectedGameObjs[0].transform.getLocalScale(), this._oldLocalScale);
        }

        isPressed_local() {

        }
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any) {
            let len = selectedGameObjs.length
            let ctrlPos = egret3d.Vector3.set(0, 0, 0, this._ctrlPos);
            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i];
                egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
            }
            ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);

            let ctrlRot = this.geo.transform.parent.getRotation()
            this._ctrlRot = ctrlRot;

            egret3d.Vector3.copy(ctrlPos, this._dragPlanePoint);
            egret3d.Quaternion.transformVector3(ctrlRot, this.up, this._dragPlaneNormal);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
        }
        isPressed_world() {

        }
        wasReleased() { return }

    }
}