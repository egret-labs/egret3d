namespace paper.editor {
    export class xRot extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let xRotate = this._createAxis(new egret3d.Vector4(0.8, 0.0, 0.0, 0.8), 1);
            xRotate.name = "GizmoController_Rotate_X";
            xRotate.tag = "Editor";
            xRotate.transform.setLocalScale(2, 2, 2);
            xRotate.transform.setLocalEulerAngles(90, 0, 0);
            this.geo = xRotate
        }

        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();

            let temp = new egret3d.Vector3(egret3d.InputManager.mouse.position.x, egret3d.InputManager.mouse.position.y, 0)
            this.helpVec3_1.copy(temp)
            // egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);
            // this._dragPlaneNormal.applyQuaternion(worldRotation, this.right)
            // this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            // egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);
            worldRotation.copy(this._initRotation);
        }
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[]) {
            let worldPosition = selectedGameObjs[0].transform.getPosition();
            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            let move = new egret3d.Vector3
            move.z = 0
            move.x = (egret3d.InputManager.mouse.position.x - this.helpVec3_1.x) / 10;
            move.y = -(egret3d.InputManager.mouse.position.y - this.helpVec3_1.y) / 10;

            egret3d.Vector3.subtract(hit, worldPosition, hit);

            let cosHitOffset = egret3d.Vector3.dot(egret3d.Vector3.normalize(hit) as any, egret3d.Vector3.normalize(this._dragOffset) as any);

            egret3d.Vector3.cross(this._dragOffset, hit, this.helpVec3_1)
            let theta = egret3d.Vector3.dot(this.helpVec3_1, this._dragPlaneNormal) >= 0 ? Math.acos(cosHitOffset) : -Math.acos(cosHitOffset);
            let cos = Math.cos(theta * 0.5), sin = Math.sin(theta * 0.5);
            this.helpQuat_1.set(this._dragPlaneNormal.x * sin, this._dragPlaneNormal.y * sin, this._dragPlaneNormal.z * sin, cos);
            this.helpQuat_2.multiply(this.helpQuat_1, this._initRotation);
            this._ctrlRot.copy(this.helpQuat_2);
            selectedGameObjs[0].transform.setLocalRotation(this.helpQuat_2)
            // this.editorModel.setTransformProperty("rotation", this.helpQuat_2, selectedGameObjs[0].transform);

        }
        wasPressed_world() {

        }
        isPressed_world() {

        }
        wasReleased() { return }

    }
}