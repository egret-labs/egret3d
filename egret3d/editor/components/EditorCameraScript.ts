namespace paper.editor {
    let forward = new egret3d.Vector3();
    let up = new egret3d.Vector3();
    let right = new egret3d.Vector3();
    @paper.executeInEditMode
    export class EditorCameraScript extends paper.Behaviour {
        public editorModel: EditorModel;

        public moveSpeed: number = 20;
        public wheelSpeed: number = 2;
        public rotateSpeed: number = 1;

        // private app: framework.Application;
        private bindKeyboard: egret3d.KeyboardDevice;
        private bindMouse: egret3d.MouseDevice;
        private _lastMouseX: number = 0;
        private _lastMouseY: number = 0;
        private _mouseDown_r: boolean = false;
        private _mouseDown_l: boolean = false;
        private _mouseDown_m: boolean = false;

        public onStart(): any {
            this.bindKeyboard = egret3d.InputManager.keyboard;
            this.bindMouse = egret3d.InputManager.mouse;
        };

        public onUpdate(delta: number): any {
            this.inputUpdate(delta);
            //this.mouseUpdate(delta);
            //Gizmo.DrawLine(new egret3d.Vector3(-5, 5, 0.5), new egret3d.Vector3(5, 5, 0.5), 100.0, [1.0, 0.0, 0.0, 1.0]);
            // Gizmo.DrawCoord();
            // Gizmo.DrawLights();
            // Gizmo.DrawCameras();
            //Gizmo.DrawArrowXYZ();

            // this.editorModel.geoController.update();
        };

        public OnEnable() {
            this._lastMouseX = 0;
            this._lastMouseY = 0;
            this._mouseDown_r = false;
            this._mouseDown_l = false;
        }

        public OnDisable() {
            this._lastMouseX = 0;
            this._lastMouseY = 0;
            this._mouseDown_r = false;
            this._mouseDown_l = false;
        }

        private inputUpdate(delta: number) {
            let mouse = this.bindMouse
            let keyboard = this.bindKeyboard;

            forward.x = 0;
            forward.y = 0;
            forward.z = 0;

            up.x = 0;
            up.y = this.moveSpeed * delta;
            up.z = 0;

            right.x = this.moveSpeed * delta;
            right.y = 0;
            right.z = 0;

            let rotation = this.gameObject.transform.getLocalRotation();

            up.applyQuaternion(rotation);
            right.applyQuaternion(rotation);

            let p = this.gameObject.transform.getLocalPosition();
            let result = new egret3d.Vector3();
            egret3d.Vector3.copy(p, result);
            //上下左右
            if (keyboard.isPressed("LEFT")) {
                egret3d.Vector3.subtract(result, right, result);
                this.gameObject.transform.setLocalPosition(result);
            }
            if (keyboard.isPressed("RIGHT")) {
                egret3d.Vector3.add(result, right, result);
                this.gameObject.transform.setLocalPosition(result);
            }
            if (keyboard.isPressed("UP")) {
                egret3d.Vector3.add(result, up, result);
                this.gameObject.transform.setLocalPosition(result);
            }
            if (keyboard.isPressed("DOWN")) {
                egret3d.Vector3.subtract(result, up, result);
                this.gameObject.transform.setLocalPosition(result);
            }
            if (mouse.isPressed(1)) {
                if (!this._mouseDown_m) {
                    this._mouseDown_m = true
                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                } else {
                    let move = new egret3d.Vector3
                    move.z = 0
                    move.x = (mouse.position.x - this._lastMouseX) / 10;
                    move.y = -(mouse.position.y - this._lastMouseY) / 10;
                    move.applyQuaternion(rotation);

                    egret3d.Vector3.subtract(result, move, result);
                    this.gameObject.transform.setLocalPosition(result)

                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                }

            } else if (mouse.wasReleased(1)) {
                this._mouseDown_m = false
            }

            //放大缩小
            if (mouse.wheel !== 0) {
                forward.z = mouse.wheel * this.wheelSpeed;
                forward.applyQuaternion(rotation);
                result.add(forward);
                this.gameObject.transform.setLocalPosition(result);
            }

            if (mouse.isPressed(2) && keyboard.isPressed('ALT')) {
                if (!this._mouseDown_r) {
                    this._mouseDown_r = true;
                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                } else {
                    let moveX = mouse.position.x - this._lastMouseX;
                    let moveY = mouse.position.y - this._lastMouseY;

                    forward.z = moveX * 0.1 + moveY * 0.1;
                    forward.applyQuaternion(rotation);
                    egret3d.Vector3.add(result, forward, result);
                    this.gameObject.transform.setLocalPosition(result);

                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                }
            } else if (keyboard.wasReleased('ALT') || mouse.wasReleased(0)) {
                this._mouseDown_r = false;
            }


            //方向
            if (mouse.isPressed(2) && !keyboard.isPressed('ALT')) {
                if (!this._mouseDown_r) {
                    this._mouseDown_r = true;
                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                    console.log(this.gameObject.transform.getLocalEulerAngles())
                } else {
                    let moveX = mouse.position.x - this._lastMouseX;
                    let moveY = mouse.position.y - this._lastMouseY;

                    let theta_x = moveY * this.rotateSpeed, theta_y = moveX * this.rotateSpeed;
                    let sinX = Math.sin(theta_x / 180 * Math.PI / 2), cosX = Math.cos(theta_x / 180 * Math.PI / 2);
                    let sinY = Math.sin(theta_y / 180 * Math.PI / 2), cosY = Math.cos(theta_y / 180 * Math.PI / 2);
                    let rot = this.gameObject.transform.getRotation();

                    this.gameObject.transform.getRight(this._helpVec3);
                    egret3d.Vector3.normalize(this._helpVec3);
                    this._helpQuat.set(sinX * this._helpVec3.x, sinX * this._helpVec3.y, sinX * this._helpVec3.z, cosX);
                    rot.multiply(this._helpQuat, rot)
                    rot.normalize()

                    egret3d.Vector3.set(0, 1, 0, this._helpVec3);
                    this._helpQuat.set(sinY * this._helpVec3.x, sinY * this._helpVec3.y, sinY * this._helpVec3.z, cosY);
                    rot.multiply(this._helpQuat, rot)
                    rot.normalize()

                    this.gameObject.transform.setRotation(rot);

                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                }
            } else if (mouse.wasReleased(2) || keyboard.wasPressed('ALT')) {
                this._mouseDown_r = false;
            }

            if (keyboard.isPressed('ALT') && mouse.isPressed(0)) {
                if (!this._mouseDown_l) {
                    this._mouseDown_l = true;
                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;

                    let screenPosition = new egret3d.Vector2(egret3d.stage.screenViewport.w / 2, egret3d.stage.screenViewport.h / 2);
                    let camera = this.gameObject.getComponent(egret3d.Camera);
                    let ray = camera.createRayByScreen(screenPosition.x, screenPosition.y);
                    this._lookAtPiont = ray.intersectPlane(this._dragPlanePoint, this._dragPlaneNormal);
                } else {
                    let moveX = mouse.position.x - this._lastMouseX;
                    let moveY = mouse.position.y - this._lastMouseY;

                    //let euler = this.gameObject.transform.getLocalEulerAngles();
                    let theta_x = moveY * this.rotateSpeed, theta_y = moveX * this.rotateSpeed;
                    let sinX = Math.sin(theta_x / 180 * Math.PI / 2), cosX = Math.cos(theta_x / 180 * Math.PI / 2);
                    let sinY = Math.sin(theta_y / 180 * Math.PI / 2), cosY = Math.cos(theta_y / 180 * Math.PI / 2);
                    //this.gameObject.transform.setLocalEulerAngles(Math.max(Math.min((euler.x + theta_x), 89.9), -89.9), euler.y + theta_y, euler.z);
                    let rot = this.gameObject.transform.getRotation();
                    let pos = this.gameObject.transform.getPosition();

                    egret3d.Vector3.subtract(pos, this._lookAtPiont, pos);

                    this.gameObject.transform.getRight(this._helpVec3);
                    egret3d.Vector3.normalize(this._helpVec3);
                    this._helpQuat.set(sinX * this._helpVec3.x, sinX * this._helpVec3.y, sinX * this._helpVec3.z, cosX);
                    pos.applyQuaternion(this._helpQuat, pos);
                    rot.multiply(this._helpQuat, rot)
                    rot.normalize()

                    egret3d.Vector3.set(0, 1, 0, this._helpVec3);
                    this._helpQuat.set(sinY * this._helpVec3.x, sinY * this._helpVec3.y, sinY * this._helpVec3.z, cosY);
                    pos.applyQuaternion(this._helpQuat);
                    rot.multiply(this._helpQuat, rot)
                    rot.normalize()


                    egret3d.Vector3.add(pos, this._lookAtPiont, pos);
                    this.gameObject.transform.setRotation(rot);
                    this.gameObject.transform.setPosition(pos);

                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                }
            } else if (keyboard.wasReleased('ALT') || mouse.wasReleased(0)) {
                this._mouseDown_l = false;
            }

            // 复制粘贴
            // if (keyboard.isPressed('CONTROL') && keyboard.wasPressed('C')) {
            //     let clipboard = __global.runtimeModule.getClipborad()
            //     clipboard.writeText("zhrit", "paper");
            // }

            // if (keyboard.isPressed('CONTROL') && keyboard.wasPressed('V')) {
            //     let clipboard = __global.runtimeModule.getClipborad()
            //     let msg = clipboard.readText("paper");
            //     console.log(msg);
            // }

            //(keyboard.isPressed('ALT') && mouse.isPressed(0)) || 
        }

        private _lookAtPiont: egret3d.Vector3 = new egret3d.Vector3();
        private _dragPlanePoint: egret3d.Vector3 = new egret3d.Vector3(0, 0, 0);
        private _dragPlaneNormal: egret3d.Vector3 = new egret3d.Vector3(0, 1, 0);
        private _helpQuat: egret3d.Quaternion = new egret3d.Quaternion();
        private _helpVec3: egret3d.Vector3 = new egret3d.Vector3();;

        public onDestroy(): any {
            let inputManager = egret3d.InputManager;

            if (inputManager.mouse.wasPressed(0)) {
                // do something
            }

            if (inputManager.keyboard.isPressed("K")) {
                // do something
            }

            if (inputManager.touch.touchCount > 0) {
                let touch = inputManager.touch.getTouch(0);
                // do something
            }

        }
    }
}

