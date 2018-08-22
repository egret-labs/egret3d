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
            let lastY = egret3d.InputManager.mouse.position.x;
            let lastX = egret3d.InputManager.mouse.position.x;
            this.helpVec3_1.set(lastX, lastY, 0)
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            this._dragPlaneNormal.applyQuaternion(worldRotation, this.up)
        }
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[]) {
            let lastX = egret3d.InputManager.mouse.position.x;
            let lastY = egret3d.InputManager.mouse.position.x;
            let delta = lastY - this.helpVec3_1.y
            let rot = selectedGameObjs[0].transform.getRotation()
            let cos = Math.cos(delta / 180 * Math.PI / 2), sin = Math.sin(delta / 180 * Math.PI / 2);

            this.helpQuat_1.set(this._dragPlaneNormal.x * sin, this._dragPlaneNormal.y * sin, this._dragPlaneNormal.z * sin, cos);
            this.helpQuat_2.multiply(this.helpQuat_1, rot);
            this.helpQuat_2.normalize()

            this.helpVec3_1.set(lastX, lastY, 0)
            selectedGameObjs[0].transform.setLocalRotation(this.helpQuat_2)
            // this.editorModel.setTransformProperty("rotation", this.helpQuat_2, selectedGameObjs[0].transform);
        }
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: GameObject[]) {
            let lastX = egret3d.InputManager.mouse.position.x;
            let lastY = egret3d.InputManager.mouse.position.x;
            let len = selectedGameObjs.length
            let ctrlPos = egret3d.Vector3.set(0, 0, 0, this._ctrlPos);
            let ctrlRot = this.geo.transform.parent.getRotation();
            this._dragPlaneNormal.applyQuaternion(ctrlRot, this.up)
            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i];
                egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
            }
            ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);
            this.helpVec3_1.set(lastX, lastY, 0)
            this._ctrlRot = ctrlRot;
        }
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: GameObject[]) {
            let len = selectedGameObjs.length
            let lastX = egret3d.InputManager.mouse.position.x;
            let lastY = egret3d.InputManager.mouse.position.x;
            let delta = lastY - this.helpVec3_1.y
            let cos = Math.cos(delta / 180 * Math.PI / 2), sin = Math.sin(delta / 180 * Math.PI / 2);
            this.helpQuat_1.set(this._dragPlaneNormal.x * sin, this._dragPlaneNormal.y * sin, this._dragPlaneNormal.z * sin, cos);

            this._ctrlRot.premultiply(this.helpQuat_1)
            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i]
                let rot = obj.transform.getRotation()
                this.helpQuat_2.multiply(this.helpQuat_1, rot);
                this.helpQuat_2.normalize()

                obj.transform.setLocalRotation(this.helpQuat_2)
            }

            this.helpVec3_1.set(lastX, lastY, 0)
        }
        wasReleased() { return }

    }
}