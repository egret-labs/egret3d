namespace behaviors {
    let forward = new egret3d.Vector3();
    let up = new egret3d.Vector3();
    let right = new egret3d.Vector3();

    export class FlyCameraScript extends paper.Behaviour {

        public moveSpeed: number = 20;
        public rotateSpeed: number = 1;

        // private app: framework.Application;
        private bindKeyboard: egret3d.KeyboardDevice;
        private bindMouse: egret3d.MouseDevice;
        private _lastMouseX: number = 0;
        private _lastMouseY: number = 0;
        private _mouseDown: boolean = false;

        public onStart(): any {
            this.bindKeyboard = egret3d.InputManager.keyboard;
            this.bindMouse = egret3d.InputManager.mouse;
            this.gameObject.transform.setParent(null, true);
        }

        public onUpdate(delta: number): any {
            this.keyboardonUpdate(delta);
            this.mouseonUpdate(delta);
        }

        private keyboardonUpdate(delta: number) {
            let keyboard = this.bindKeyboard;

            forward.x = 0;
            forward.y = 0;
            forward.z = this.moveSpeed * delta;

            up.x = 0;
            up.y = this.moveSpeed * delta;
            up.z = 0;

            right.x = this.moveSpeed * delta;
            right.y = 0;
            right.z = 0;

            let rotation = this.gameObject.transform.getLocalRotation();

            right.applyQuaternion(rotation);
            up.applyQuaternion(rotation);
            forward.applyQuaternion(rotation);

            let p = this.gameObject.transform.getLocalPosition();
            let result = new egret3d.Vector3();
            egret3d.Vector3.copy(p, result);

            if (keyboard.isPressed("W")) {
                egret3d.Vector3.add(result, forward, result);
            }
            if (keyboard.isPressed("A")) {
                egret3d.Vector3.subtract(result, right, result);
            }
            if (keyboard.isPressed("S")) {
                egret3d.Vector3.subtract(result, forward, result);
            }
            if (keyboard.isPressed("D")) {
                egret3d.Vector3.add(result, right, result);
            }
            if (keyboard.isPressed("E")) {
                egret3d.Vector3.add(result, up, result);
            }
            if (keyboard.isPressed("Q")) {
                egret3d.Vector3.subtract(result, up, result);
            }

            this.gameObject.transform.setLocalPosition(result);
        }

        private mouseonUpdate(delta: number) {
            let mouse = this.bindMouse;

            if (mouse.isPressed(0)) {
                if (!this._mouseDown) {
                    this._mouseDown = true;
                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                } else {
                    let moveX = mouse.position.x - this._lastMouseX;
                    let moveY = mouse.position.y - this._lastMouseY;

                    let euler = this.gameObject.transform.getLocalEulerAngles();
                    this.gameObject.transform.setLocalEulerAngles(euler.x + moveY * this.rotateSpeed, euler.y + moveX * this.rotateSpeed, euler.z);

                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                }
            } else if (mouse.wasReleased(0)) {
                this._mouseDown = false;
            }
            if (mouse.wheel !== 0) {

            }
        }

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

