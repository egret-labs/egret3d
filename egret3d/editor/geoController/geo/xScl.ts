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
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();
            this._dragPlaneNormal.applyQuaternion(worldRotation, this.up)
            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);
            this._initRotation.copy(worldRotation);
            egret3d.Vector3.copy(selectedGameObjs[0].transform.getLocalScale(), this._oldLocalScale);
        }
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();
            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(hit, worldPosition, this._delta);
            let worldOffset: egret3d.Vector3;
            let scale: egret3d.Vector3;
            worldOffset.applyQuaternion(worldRotation, this.right);
            let cosHit = egret3d.Vector3.dot(hit, worldOffset);
            let len = egret3d.Vector3.dot(this._dragOffset, worldOffset);
            this.geo.transform.setLocalPosition(cosHit / len * 2, 0, 0);
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
            this._dragPlaneNormal.applyQuaternion(ctrlRot, this.up);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
        }
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any) {
            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(hit, this._dragOffset, this._delta);
            let worldOffset: egret3d.Vector3;
            let scale: egret3d.Vector3;
            let len = selectedGameObjs.length
            worldOffset.applyQuaternion(this._ctrlRot, this.right);
            let cosHit = egret3d.Vector3.dot(this._delta, worldOffset);
            let src = this.geo.transform.getLocalPosition().x;
            this.geo.transform.setLocalPosition(cosHit + src, 0, 0);

            let s = cosHit / src + 1;

            for (let i = 0; i < len; i++) {
                let lastSca = selectedGameObjs[i].transform.getLocalScale();
                scale = egret3d.Vector3.set(lastSca.x * s, lastSca.y, lastSca.z, this.helpVec3_2);
                this.editorModel.setTransformProperty("localScale", scale, selectedGameObjs[i].transform);

                let pos = selectedGameObjs[i].transform.getPosition();
                let sub = this.helpVec3_2;
                egret3d.Vector3.subtract(pos, this._ctrlPos, this.helpVec3_2);
                this.helpVec3_3.applyQuaternion(this.geo.transform.parent.getRotation(), this.right);
                let cos = egret3d.Vector3.dot(sub, this.helpVec3_3);
                egret3d.Vector3.scale(this.helpVec3_3, cos * (s - 1));
                egret3d.Vector3.add(pos, this.helpVec3_3, pos);
                this.editorModel.setTransformProperty("position", pos, selectedGameObjs[i].transform);
            }
            egret3d.Vector3.copy(hit, this._dragOffset);
        }
        wasReleased() {
            this.geo.transform.setLocalPosition(2, 0, 0)
        }

    }
}