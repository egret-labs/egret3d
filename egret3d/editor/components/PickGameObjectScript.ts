namespace paper.editor {
    @paper.executeInEditMode
    export class PickGameObjectScript extends paper.Behaviour {

        public editorModel: EditorModel;
        private bindMouse: egret3d.MouseDevice;
        private bindKeyboard: egret3d.KeyboardDevice;
        private cameraScript: EditorCameraScript;
        private camera: egret3d.Camera;

        public onStart(): any {
            this.bindMouse = egret3d.InputManager.mouse;
            this.bindKeyboard = egret3d.InputManager.keyboard;
            this.camera = this.gameObject.getComponent(egret3d.Camera);
            this.cameraScript = this.gameObject.getComponent(EditorCameraScript);
            this.selectedGameObjects = [];
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
                    let ray = this.camera.createRayByScreen(this.bindMouse.position.x, this.bindMouse.position.y);
                    let pickInfo = egret3d.Ray.raycast(ray, true);
                    let tapDelta = Date.now() - this._tapStart;
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
                                    this.editorModel.selectGameObject(this.selectedGameObjects);
                                }
                            }
                        }
                    } else {
                        if (pickInfo) {
                            let picked = pickInfo.transform.gameObject;
                            if (picked.name !== "GizmoController_YZ" && picked.name !== "GizmoController_XZ" && picked.name !== "GizmoController_XY" && picked.name !== "GizmoController_X" && picked.name !== "GizmoController_Y" && picked.name !== "GizmoController_Z"
                                && picked.name !== "GizmoController_Rotate_X" && picked.name !== "GizmoController_Rotate_Y" && picked.name !== "GizmoController_Rotate_Z"
                                && picked.name !== "GizmoController_Scale_X" && picked.name !== "GizmoController_Scale_Y" && picked.name !== "GizmoController_Scale_Z") {
                                // 对GameObject的点选
                                if (tapDelta < 200) {
                                    this.selectedGameObjects = [picked];
                                    // this.setStroke(picked)
                                    this.editorModel.selectGameObject(this.selectedGameObjects);
                                }
                            }
                        } else if (tapDelta < 200) {
                            this.selectedGameObjects = [];
                            this.editorModel.selectGameObject(this.selectedGameObjects);
                        }
                    }
                }

                // 点击控制杆，更新控制点
                if (this.bindMouse.wasPressed(0)) {
                    this._tapStart = Date.now();
                }
            }
            catch (e) {
                console.log(e);
            }
        }

        //TODO,描边
        private setStroke(picked: GameObject) {
            let render = picked.getComponent(egret3d.MeshRenderer);
            // let mat = new egret3d.Material(egret3d.DefaultShaders.DIFFUSE_TINT_COLOR)
            render.materials = [egret3d.DefaultMaterials.MESH_BASIC.clone()];
            console.log(render.materials)
        }
    }
}

