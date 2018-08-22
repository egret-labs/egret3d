namespace paper.editor {
    export class xzAxis extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let xyPlane = this._createAxis(new egret3d.Vector4(0.0, 0.0, 1, 0.5), 3);
            xyPlane.name = "GizmoController_XZ";
            xyPlane.tag = "Editor";
            xyPlane.transform.setLocalScale(0.05, 0.05, 0.05);
            xyPlane.transform.setLocalEulerAngles(0, 90, 0);
            xyPlane.transform.setLocalPosition(0.2, 0, 0.2);
            this.geo = xyPlane
        }
        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            this.canDrag = true;
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();

            egret3d.Vector3.copy(worldPosition, this._dragPlanePoint);

            let pos = Application.sceneManager.editorScene.find("EditorCamera").transform.getPosition()
            // let normal = new egret3d.Vector3(0, pos.y + pos.z, pos.z + pos.y)
            let normal = this.forward
            this._dragPlaneNormal.applyQuaternion(worldRotation, this.up)
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(this._dragOffset, worldPosition, this._dragOffset);

            // let normal1 = new egret3d.Vector3(pos.x + pos.z, 0, pos.z + pos.x)
            // this._dragPlaneNormal1.applyQuaternion(worldRotation, normal1)
            // this._dragOffset1 = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal1);
            // egret3d.Vector3.subtract(this._dragOffset1, worldPosition, this._dragOffset1);
        }
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            let worldPosition = selectedGameObjs[0].transform.getPosition();

            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(hit, this._dragOffset, hit);
            egret3d.Vector3.subtract(hit, worldPosition, hit);
            let worldOffset1 = new egret3d.Vector3();
            let worldOffset = new egret3d.Vector3();
            worldOffset.applyQuaternion(worldRotation, this.right)
            worldOffset1.applyQuaternion(worldRotation, this.forward);
            let cosHit1 = egret3d.Vector3.dot(hit, worldOffset1);
            let cosHit = egret3d.Vector3.dot(hit, worldOffset)
            egret3d.Vector3.scale(worldOffset1, cosHit1);
            egret3d.Vector3.scale(worldOffset, cosHit);

            let position = egret3d.Vector3.add(worldPosition, worldOffset1, this.helpVec3_2);
            position = egret3d.Vector3.add(position, worldOffset, this.helpVec3_2);

            // let hit1 = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal1);
            // egret3d.Vector3.subtract(hit1, this._dragOffset, hit1);
            // egret3d.Vector3.subtract(hit1, worldPosition, hit1);
            // let worldOffset = new egret3d.Vector3();
            // worldOffset.applyQuaternion(worldRotation, this.up);
            // let cosHit = egret3d.Vector3.dot(hit1, worldOffset);
            // egret3d.Vector3.scale(worldOffset, cosHit);
            // position = egret3d.Vector3.add(position, worldOffset, this.helpVec3_2);

            if (selectedGameObjs[0].transform.parent) {
                let parentMatrix = selectedGameObjs[0].transform.parent.getWorldMatrix()
                parentMatrix = parentMatrix.inverse()
                parentMatrix.transformNormal(position)
            }

            egret3d.Vector3.copy(position, this._ctrlPos);

            selectedGameObjs[0].transform.setLocalPosition(position)
            // this.editorModel.setTransformProperty("localPosition", position, selectedGameObjs[0].transform);
        }
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: any) {
            let len = selectedGameObjs.length;
            let ctrlPos = egret3d.Vector3.set(0, 0, 0, this._ctrlPos);
            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i];
                egret3d.Vector3.add(obj.transform.getPosition(), ctrlPos, ctrlPos);
            }
            ctrlPos = egret3d.Vector3.scale(ctrlPos, 1 / len);
            egret3d.Vector3.copy(ctrlPos, this._dragPlanePoint);

            let pos = Application.sceneManager.editorScene.find("EditorCamera").transform.getPosition()
            let normal = this.up

            egret3d.Vector3.copy(normal, this._dragPlaneNormal);
            this._dragOffset = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);

        }
        isPressed_world(ray: egret3d.Ray, selectedGameObjs: any) {
            let len = selectedGameObjs.length;
            let hit = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
            egret3d.Vector3.subtract(hit, this._dragOffset, this._delta);
            // let worldOffset = new egret3d.Vector3;
            // let worldOffset1 = new egret3d.Vector3;
            // worldOffset = egret3d.Vector3.copy(this.right, this.helpVec3_1);
            // worldOffset1 = egret3d.Vector3.copy(this.up, this.helpVec3_1);
            // let cosHit = egret3d.Vector3.dot(this._delta, worldOffset);
            // let cosHit1 = egret3d.Vector3.dot(this._delta, worldOffset1);
            // egret3d.Vector3.scale(worldOffset, cosHit);
            // egret3d.Vector3.scale(worldOffset1, cosHit1);
            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i];
                let lastPos = obj.transform.getPosition();
                egret3d.Vector3.add(lastPos, this._delta, this._newPosition);

                if (obj.transform.parent) {
                    let parentMatrix = obj.transform.parent.getWorldMatrix()
                    parentMatrix = parentMatrix.inverse()
                    parentMatrix.transformNormal(this._newPosition)
                }

                obj.transform.setLocalPosition(this._newPosition)
                // this.editorModel.setTransformProperty("localPosition", this._newPosition, obj.transform);
            }
            egret3d.Vector3.copy(hit, this._dragOffset);

        }
        wasReleased(selectedGameObjs: GameObject[]) {
            for (let item of selectedGameObjs) {
                this.editorModel.setTransformProperty("localPosition", item.transform.getLocalPosition(), item.transform);
            }
        }
    }
}