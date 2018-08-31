namespace paper.editor {
    @paper.executeInEditMode
    export class PickGameObjectScript extends paper.Behaviour {

        public editorModel: EditorModel;
        private bindMouse: egret3d.MouseDevice;
        private bindKeyboard: egret3d.KeyboardDevice;
        private cameraScript: EditorCameraScript;
        private camera: egret3d.Camera;
        private lastX
        private lastY
        private selectBox: GameObject
        private boundingBoxes: GameObject[] = []
        private get onGeoControll() {
            return this.gameObject.getComponent(Controller).onGeoControll
        }
        public onStart(): any {
            this.bindMouse = egret3d.InputManager.mouse;
            this.bindKeyboard = egret3d.InputManager.keyboard;
            this.camera = this.gameObject.getComponent(egret3d.Camera);
            this.cameraScript = this.gameObject.getComponent(EditorCameraScript);
            this.selectedGameObjects = [];
            this.initSelectBox()
        }

        private _tapStart: number = 0;
        private selectedGameObjects: GameObject[] = [];

        public clearSelected() {
            this.selectedGameObjects = [];
        }
        public onUpdate(delta: number): any {
            try {
                // 点击 game object 激活
                if (this.bindMouse.wasReleased(0)) {
                    let lastX = this.lastX
                    let lastY = this.lastY
                    let ray = this.camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                    let pickInfo: any = egret3d.Ray.raycast(ray, true);
                    let tapDelta = Date.now() - this._tapStart;
                    let pickCamera = this.intersectWithCameraAndLight(ray)
                    if (pickCamera) {
                        pickInfo = pickCamera
                    }
                    if (this.bindKeyboard.isPressed('CONTROL')) {
                        if (pickInfo) {
                            let picked = pickInfo.transform.gameObject;
                            if (picked.name !== "GizmoController_YZ" && picked.name !== "GizmoController_XZ" && picked.name !== "GizmoController_XY" && picked.name !== "GizmoController_X" && picked.name !== "GizmoController_Y" && picked.name !== "GizmoController_Z"
                                && picked.name !== "GizmoController_Rotate_X" && picked.name !== "GizmoController_Rotate_Y" && picked.name !== "GizmoController_Rotate_Z"
                                && picked.name !== "GizmoController_Scale_X" && picked.name !== "GizmoController_Scale_Y" && picked.name !== "GizmoController_Scale_Z") {
                                // 对GameObject的点选
                                if (tapDelta < 200) {
                                    let index: number = -1;
                                    let l = this.selectedGameObjects.length;
                                    for (let i = 0; i < l; i++) {
                                        if (this.selectedGameObjects[i] == picked) {
                                            index = i;
                                            break;
                                        }
                                    }
                                    if (index < 0) {
                                        this.selectedGameObjects.push(picked);
                                    } else if (l > 1) {
                                        this.selectedGameObjects.splice(index, 1);
                                    }
                                }
                            }
                        } else if (tapDelta >= 200 && !this.onGeoControll) {
                            this.boxSelect()
                        }
                    } else {
                        if (pickInfo) {
                            let picked = pickInfo.transform.gameObject;
                            this.setStroke(picked)
                            if (picked.name !== "GizmoController_YZ" && picked.name !== "GizmoController_XZ" && picked.name !== "GizmoController_XY" && picked.name !== "GizmoController_X" && picked.name !== "GizmoController_Y" && picked.name !== "GizmoController_Z"
                                && picked.name !== "GizmoController_Rotate_X" && picked.name !== "GizmoController_Rotate_Y" && picked.name !== "GizmoController_Rotate_Z"
                                && picked.name !== "GizmoController_Scale_X" && picked.name !== "GizmoController_Scale_Y" && picked.name !== "GizmoController_Scale_Z") {
                                // 对GameObject的点选
                                if (tapDelta < 200) {
                                    this.selectedGameObjects = [picked];
                                    // this.setStroke(picked)
                                }
                            }
                        } else if (tapDelta < 200) {
                            this.selectedGameObjects = [];
                        } else if (tapDelta >= 200 && !this.onGeoControll) {
                            this.selectedGameObjects = []
                            this.boxSelect()
                        }
                    }
                    this.excludingChild()
                    this.selectBox.activeSelf = false
                    this.setBoundingBox()
                    this.editorModel.selectGameObject(this.selectedGameObjects);
                }

                if (this.bindMouse.isPressed(0) && !this.bindKeyboard.isPressed('ALT')) {
                    if (!this.onGeoControll) {
                        this.selectBox.activeSelf = true
                    } else {
                        this.selectBox.activeSelf = false
                    }

                    let tapDelta = Date.now() - this._tapStart;
                    let MaxX = Math.max(this.lastX, this.bindMouse.position.x)
                    let MinX = Math.min(this.lastX, this.bindMouse.position.x)
                    let MaxY = Math.max(this.lastY, this.bindMouse.position.y)
                    let MinY = Math.min(this.lastY, this.bindMouse.position.y)
                    this.drawSelectBox(new egret3d.Vector2(MaxX, MaxY), new egret3d.Vector2(MinX, MinY))
                }
                // 点击控制杆，更新控制点
                if (this.bindMouse.wasPressed(0)) {
                    this.lastX = this.bindMouse.position.x
                    this.lastY = this.bindMouse.position.y
                    this._tapStart = Date.now();
                }
            }
            catch (e) {
                console.log(e);
            }
        }

        //当父对象被选中时剔除子物体
        private excludingChild() {
            let children: egret3d.Transform[] = []
            for (let item of this.selectedGameObjects) {
                if (item.transform.childCount > 0) {
                    children = children.concat(children, item.transform.getAllChildren())
                }
            }
            for (let child of children) {
                for (let i = 0; i < this.selectedGameObjects.length; i++) {
                    if (this.selectedGameObjects[i].transform == child) {
                        this.selectedGameObjects.splice(i, 1)
                        break;
                    }
                }
            }
        }

        //框选
        private boxSelect() {
            let MaxX = Math.max(this.lastX, this.bindMouse.position.x)
            let MinX = Math.min(this.lastX, this.bindMouse.position.x)
            let MaxY = Math.max(this.lastY, this.bindMouse.position.y)
            let MinY = Math.min(this.lastY, this.bindMouse.position.y)
            for (const gameObject of Application.sceneManager.activeScene.gameObjects) {
                let pos = new egret3d.Vector2
                this.camera.calcScreenPosFromWorldPos(gameObject.transform.getPosition(), pos)
                if (pos.x < MaxX && pos.y < MaxY && pos.x > MinX && pos.y > MinY) {
                    let l = this.selectedGameObjects.length;
                    let js = 1;
                    for (let i = 0; i < l; i++) {
                        if (this.selectedGameObjects[i] == gameObject) {
                            js = 0;
                            break;
                        }
                    }
                    if (js) {
                        this.selectedGameObjects.push(gameObject)
                    }
                }
            }
        }

        //TODO,描边
        private setStroke(picked: GameObject) {
            // let render = picked.getComponent(egret3d.MeshRenderer);
            // let mat = new egret3d.Material(egret3d.DefaultShaders.DIFFUSE_TINT_COLOR)
            // const strokeObj = new GameObject('stroke', '', Application.sceneManager.editorScene)
            // let mesh = strokeObj.addComponent(egret3d.MeshFilter)
            // let render = strokeObj.addComponent(egret3d.MeshRenderer)
            // let transform = strokeObj.getComponent(egret3d.Transform)
            // let _transform = picked.getComponent(egret3d.Transform)
            // mesh.mesh = picked.getComponent(egret3d.MeshFilter).mesh
            // render.materials = [egret3d.DefaultMaterials.MESH_BASIC.clone()];
            // transform.setPosition(_transform.getPosition())
            // transform.setRotation(_transform.getRotation())
            // transform.setScale(_transform.getScale())
            // transform.setLocalScale(new egret3d.Vector3(1.05, 1.05, 1.05))
            // transform.parent = _transform
            // console.log(render.materials)
        }

        private setBoundingBox() {
            for (let item of this.boundingBoxes) {
                item.activeSelf = false
                item.destroy()
            }
            this.boundingBoxes = []
            let drawList = []
            for (let item of this.selectedGameObjects) {
                if (item.transform.childCount > 0) {
                    drawList = drawList.concat(drawList, item.transform.getAllChildren())
                }
                drawList.push(item.transform)
            }
            for (let item of drawList) {
                if (item.gameObject) {
                    if (item.gameObject.getComponent(egret3d.MeshFilter)) {
                        this.boundingBoxes.push(this.drawBoundingBox(item.gameObject))
                    }
                }

            }
        }

        //
        private drawBoundingBox(obj: GameObject) {
            let box = new GameObject('boundingBox', 'Editor', Application.sceneManager.editorScene)
            let position = obj.getComponent(egret3d.MeshFilter).mesh.getAttributes('POSITION')
            let max = new egret3d.Vector3(position[0], position[1], position[2])
            let min = new egret3d.Vector3(position[0], position[1], position[2])
            let mesh = new egret3d.Mesh(8, 24)
            for (let i = 0; i < position.length; i = i + 3) {
                max.set(Math.max(max.x, position[i]), Math.max(max.y, position[i + 1]), Math.max(max.z, position[i + 2]))
                min.set(Math.min(min.x, position[i]), Math.min(min.y, position[i + 1]), Math.min(min.z, position[i + 2]))
            }
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                max.x, max.y, max.z,
                max.x, max.y, min.z,
                max.x, min.y, min.z,
                max.x, min.y, max.z,
                min.x, max.y, max.z,
                min.x, max.y, min.z,
                min.x, min.y, max.z,
                min.x, min.y, min.z,
            ])
            mesh.setIndices([0, 1, 0, 3, 1, 2, 7, 6, 7, 5, 6, 4, 5, 4, 0, 4, 5, 1, 2, 7, 3, 6, 2, 3])
            let meshFilter = box.addComponent(egret3d.MeshFilter)
            meshFilter.mesh = mesh
            mesh.glTFMesh.primitives[0].mode = gltf.MeshPrimitiveMode.Lines
            box.addComponent(egret3d.MeshRenderer)
            box.transform.setPosition(obj.transform.getPosition())
            box.transform.setRotation(obj.transform.getRotation())
            box.transform.setScale(obj.transform.getScale())
            return box
        }

        //
        private initSelectBox() {
            this.selectBox = new GameObject('selectBox', '', Application.sceneManager.editorScene)
            let selectBox = this.selectBox
            let MeshFilter = selectBox.addComponent(egret3d.MeshFilter)
            let render = selectBox.addComponent(egret3d.MeshRenderer)
            let mesh = new egret3d.Mesh(4, 6)
            MeshFilter.mesh = mesh
            selectBox.activeSelf = false
            let mat = new egret3d.Material(egret3d.DefaultShaders.LINEDASHED);
            mat.setVector3v("diffuse", new Float32Array([0.8, 0.8, 0.3]));
            mat.setFloatv("opacity", new Float32Array([0.3]))
            mat.setDepth(true, true)
            mat.renderQueue = paper.RenderQueue.Overlay
            mat.setCullFace(false)
            mat.setBlend(gltf.BlendMode.Blend)
            render.materials = [mat]
        }

        //
        private drawSelectBox(start: egret3d.Vector2, end: egret3d.Vector2) {
            let selectBox = this.selectBox
            let MeshFilter = selectBox.getOrAddComponent(egret3d.MeshFilter)
            let mesh: egret3d.Mesh
            mesh = MeshFilter.mesh
            // mesh = egret3d.DefaultMeshes.QUAD
            let a = new egret3d.Vector3
            let a1 = new egret3d.Vector3
            let a2 = new egret3d.Vector3
            let a3 = new egret3d.Vector3
            this.camera.calcWorldPosFromScreenPos(new egret3d.Vector3(start.x, start.y, 0), a)
            this.camera.calcWorldPosFromScreenPos(new egret3d.Vector3(start.x, end.y, 0), a1)
            this.camera.calcWorldPosFromScreenPos(new egret3d.Vector3(end.x, start.y, 0), a2)
            this.camera.calcWorldPosFromScreenPos(new egret3d.Vector3(end.x, end.y, 0), a3)
            mesh.setAttributes(gltf.MeshAttributeType.POSITION, [
                a.x, a.y, a.z,
                a1.x, a1.y, a1.z,
                a2.x, a2.y, a2.z,
                a3.x, a3.y, a3.z,
            ])
            mesh.uploadVertexBuffer(gltf.MeshAttributeType.POSITION)
            mesh.setIndices([0, 1, 2, 2, 1, 3])
        }

        //点击选择相机和灯光
        private intersectWithCameraAndLight(ray: egret3d.Ray) {
            const camerasAndLights = Application.sceneManager.globalGameObject.getOrAddComponent(egret3d.CamerasAndLights);
            for (let item of camerasAndLights.cameras) {
                if (item.gameObject.name != "EditorCamera") {
                    let pos = item.transform.getPosition()
                    let rot = item.transform.getRotation()
                    let min = new egret3d.Vector3(pos.x - 0.5, pos.y - 0.5, pos.z - 0.5)
                    let max = new egret3d.Vector3(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5)
                    // min.applyQuaternion(rot)
                    // max.applyQuaternion(rot)
                    if (ray.intersectBoxMinMax(min, max)) {
                        return item.gameObject
                    }
                }
            }
            for (let item of camerasAndLights.lights) {

                let pos = item.transform.getPosition()
                let rot = item.transform.getRotation()
                let min = new egret3d.Vector3(pos.x - 0.5, pos.y - 0.5, pos.z - 0.5)
                let max = new egret3d.Vector3(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5)
                // min.applyQuaternion(rot)
                // max.applyQuaternion(rot)
                if (ray.intersectBoxMinMax(min, max)) {
                    return item.gameObject
                }

            }
        }
    }
}

