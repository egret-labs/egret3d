namespace paper.editor {
    export class ballRot extends BaseGeo {
        constructor() {
            super();
        }
        onSet() {
            let xRotate = this._createAxis(new egret3d.Vector4(0.3, 0.3, 0.2, 0.4), 1);
            xRotate.name = "GizmoController_Rotate_X";
            xRotate.tag = "Editor";
            xRotate.transform.setLocalScale(1.3, 1.3, 1.3);
            xRotate.getComponent(egret3d.MeshFilter).mesh = this.drawBall(32)
            this.geo = xRotate
        }
        drawBall(SPHERE_DIV: number) {
            let points = []
            let indices = []
            for (let j = 0; j <= SPHERE_DIV; j++) {//SPHERE_DIV为经纬线数

                let aj = j * Math.PI / SPHERE_DIV;
                let sj = Math.sin(aj);
                let cj = Math.cos(aj);
                for (let i = 0; i <= SPHERE_DIV; i++) {
                    let ai = i * 2 * Math.PI / SPHERE_DIV;
                    let si = Math.sin(ai);
                    let ci = Math.cos(ai);

                    points.push(si * sj);//point为顶点坐标
                    points.push(cj);
                    points.push(ci * sj);
                }
            }

            for (let j = 0; j < SPHERE_DIV; j++) {
                for (let i = 0; i < SPHERE_DIV; i++) {
                    let p1 = j * (SPHERE_DIV + 1) + i;
                    let p2 = p1 + (SPHERE_DIV + 1);

                    indices.push(p1);//indices为顶点的索引
                    indices.push(p2);
                    indices.push(p1 + 1);

                    indices.push(p1 + 1);
                    indices.push(p2);
                    indices.push(p2 + 1);
                }
            }
            let mesh = new egret3d.Mesh(points.length, indices.length)
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, points)
            mesh.setIndices(indices)
            return mesh
        }

        wasPressed_local(ray: egret3d.Ray, selectedGameObjs: any) {
            let lastY = egret3d.InputManager.mouse.position.y;
            let lastX = egret3d.InputManager.mouse.position.x;
            this.helpVec3_1.set(lastX, lastY, 0)
            let worldRotation = selectedGameObjs[0].transform.getRotation();
            this._dragPlaneNormal.applyQuaternion(worldRotation, this.up)
        }
        isPressed_local(ray: egret3d.Ray, selectedGameObjs: GameObject[]) {
            let lastX = egret3d.InputManager.mouse.position.x;
            let lastY = egret3d.InputManager.mouse.position.y;
            let deltaX = -(lastX - this.helpVec3_1.x)
            let deltaY = -(lastY - this.helpVec3_1.y)
            let rot = selectedGameObjs[0].transform.getRotation()
            let cosX = Math.cos(deltaX / 180 * Math.PI / 2), sinX = Math.sin(deltaX / 180 * Math.PI / 2);
            let cosY = Math.cos(deltaY / 180 * Math.PI / 2), sinY = Math.sin(deltaY / 180 * Math.PI / 2);
            this._dragPlaneNormal.set(0, 1, 0)
            this.helpQuat_1.set(this._dragPlaneNormal.x * sinX, this._dragPlaneNormal.y * sinX, this._dragPlaneNormal.z * sinX, cosX);
            this.helpQuat_2.multiply(this.helpQuat_1, rot);
            this.helpQuat_2.normalize()

            let camera = Application.sceneManager.editorScene.find("EditorCamera")
            camera.transform.getRight(this._dragPlaneNormal)
            this._dragPlaneNormal.normalize()
            this.helpQuat_1.set(this._dragPlaneNormal.x * sinY, this._dragPlaneNormal.y * sinY, this._dragPlaneNormal.z * sinY, cosY);
            this.helpQuat_2.multiply(this.helpQuat_1, this.helpQuat_2);
            this.helpQuat_2.normalize()

            this.helpVec3_1.set(lastX, lastY, 0)
            selectedGameObjs[0].transform.setLocalRotation(this.helpQuat_2)
            // this.editorModel.setTransformProperty("rotation", this.helpQuat_2, selectedGameObjs[0].transform);
        }
        wasPressed_world(ray: egret3d.Ray, selectedGameObjs: GameObject[]) {
            let lastX = egret3d.InputManager.mouse.position.x;
            let lastY = egret3d.InputManager.mouse.position.y;
            let len = selectedGameObjs.length
            let ctrlPos = egret3d.Vector3.set(0, 0, 0, this._ctrlPos);
            let ctrlRot = this.geo.transform.parent.getRotation();
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
            let lastY = egret3d.InputManager.mouse.position.y;
            let deltaX = -(lastX - this.helpVec3_1.x)
            let deltaY = -(lastY - this.helpVec3_1.y)
            let cosX = Math.cos(deltaX / 180 * Math.PI / 2), sinX = Math.sin(deltaX / 180 * Math.PI / 2);
            let cosY = Math.cos(deltaY / 180 * Math.PI / 2), sinY = Math.sin(deltaY / 180 * Math.PI / 2);
            let camera = Application.sceneManager.editorScene.find("EditorCamera")

            this._dragPlaneNormal.set(0, 1, 0)
            this.helpQuat_1.set(this._dragPlaneNormal.x * sinX, this._dragPlaneNormal.y * sinX, this._dragPlaneNormal.z * sinX, cosX);
            camera.transform.getRight(this._dragPlaneNormal)
            this._dragPlaneNormal.normalize()
            this.helpQuat_2.set(this._dragPlaneNormal.x * sinY, this._dragPlaneNormal.y * sinY, this._dragPlaneNormal.z * sinY, cosY);

            for (let i = 0; i < len; i++) {
                let obj = selectedGameObjs[i]
                let rot = obj.transform.getRotation()
                rot.multiply(this.helpQuat_1, rot);
                rot.normalize()
                rot.multiply(this.helpQuat_2, rot);
                rot.normalize()
                obj.transform.setLocalRotation(rot)
            }

            this._ctrlRot.premultiply(this.helpQuat_1)
            this._ctrlRot.premultiply(this.helpQuat_2)
            this.helpVec3_1.set(lastX, lastY, 0)
        }
        wasReleased() { return }

    }
}