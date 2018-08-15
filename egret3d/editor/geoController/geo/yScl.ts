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
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();
            egret3d.Quaternion.transformVector3(worldRotation, this.forward, this._dragPlaneNormal);
            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);
            egret3d.Quaternion.copy(worldRotation, this._initRotation);
            egret3d.Vector3.copy(selectedGameObjs[0].transform.getLocalScale(), this._oldLocalScale);
        }

        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();
            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(hit, worldPosition, this._delta);
            let worldOffset: egret3d.Vector3;
            let scale: egret3d.Vector3;
            worldOffset = egret3d.Quaternion.transformVector3(worldRotation, this.up, this.helpVec3_1);
            let cosHit = egret3d.Vector3.dot(hit, worldOffset);
            let len = egret3d.Vector3.dot(this._dragOffset, worldOffset);
            this.geo.transform.setLocalPosition(0, cosHit / len * 2, 0);
            let oldScale = this._oldLocalScale;
            let sx = this.geo.transform.getLocalPosition().x / 2;
            let sy = 1;
            let sz = 1;
            scale = egret3d.Vector3.set(oldScale.x * sx, oldScale.y * sy, oldScale.z * sz, this.helpVec3_2);
            this.editorModel.setTransformProperty("localScale", scale, selectedGameObjs[0].transform);
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
            egret3d.Quaternion.transformVector3(ctrlRot, this.forward, this._dragPlaneNormal);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
        }
        isPressed_world() {

        }
        wasReleased() { return }

    }
}