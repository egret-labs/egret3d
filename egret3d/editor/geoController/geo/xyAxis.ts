namespace paper.editor {
    export class xyAxis extends BaseGeo {
        constructor() {
            super();
        }
        private _dragPlaneNormal1: egret3d.Vector3 = new egret3d.Vector3()
        private _dragOffset1: egret3d.Vector3 = new egret3d.Vector3()
        onSet() {
            let xAxis = this._createAxis(new egret3d.Vector4(1, 0.0, 0.0, 0.5), 3);
            xAxis.name = "GizmoController_X";
            xAxis.tag = "Editor";
            xAxis.transform.setLocalScale(0.05, 0.05, 0.05);
            xAxis.transform.setLocalEulerAngles(90, 0, 0);
            xAxis.transform.setLocalPosition(0.2, 0.2, 0);
            this.geo = xAxis
        }
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            this.canDrag = true;
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();

            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);
            this._dragPlaneNormal.applyQuaternion(worldRotation, this.up);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);

            this._dragPlaneNormal1.applyQuaternion(worldRotation, this.forward);
            this._dragOffset1 = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal1);
            egret3d.Vector3.subtract(this._dragOffset1, worldPosition, this._dragOffset1);
        }
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();

            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(hit, this._dragOffset, hit);
            egret3d.Vector3.subtract(hit, worldPosition, hit);
            let worldOffset1: egret3d.Vector3;
            worldOffset1.applyQuaternion(worldRotation, this.right);
            let cosHit1 = egret3d.Vector3.dot(hit, worldOffset1);
            egret3d.Vector3.scale(worldOffset1, cosHit1);
            let position = egret3d.Vector3.add(worldPosition, worldOffset1, this.helpVec3_2);

            let hit1 = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal1);
            egret3d.Vector3.subtract(hit1, this._dragOffset, hit1);
            egret3d.Vector3.subtract(hit1, worldPosition, hit1);
            let worldOffset: egret3d.Vector3;
            worldOffset.applyQuaternion(worldRotation, this.up);
            let cosHit = egret3d.Vector3.dot(hit1, worldOffset);
            egret3d.Vector3.scale(worldOffset, cosHit);
            position = egret3d.Vector3.add(position, worldOffset, this.helpVec3_2);

            egret3d.Vector3.copy(position, this._ctrlPos);
            this.editorModel.setTransformProperty("position", position, selectedGameObjs[0].transform);

        }
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any) {
            egret3d.Vector3.set(0, 0, 0, this._dragOffset);
            egret3d.Vector3.set(0, 0, 0, this._dragPlanePoint);
            egret3d.Vector3.set(0, 0, 0, this._dragPlaneNormal);

            let len = selectedGameObjs.length;
            let ctrlPos = egret3d.Vector3.set(0, 0, 0, this._ctrlPos);
            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i];
                egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
            }
            ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);
            egret3d.Vector3.copy(ctrlPos, this._dragPlanePoint);
            egret3d.Vector3.copy(this.up, this._dragPlaneNormal);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);

        }
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any) {
            let len = selectedGameObjs.length;
            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(hit, this._dragOffset, this._delta);
            let worldOffset: egret3d.Vector3;
            worldOffset = egret3d.Vector3.copy(this.right, this.helpVec3_1);
            let cosHit = egret3d.Vector3.dot(this._delta, worldOffset);
            egret3d.Vector3.scale(worldOffset, cosHit);
            egret3d.Vector3.add(this._ctrlPos, worldOffset, this._ctrlPos);
            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i];
                let lastPos = obj.transform.getPosition();
                egret3d.Vector3.add(lastPos, worldOffset, this._newPosition);

                this.editorModel.setTransformProperty("position", this._newPosition, obj.transform);
            }
            egret3d.Vector3.copy(hit, this._dragOffset);

        }
        wasReleased() { }

    }
}