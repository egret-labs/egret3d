namespace behaviors {
    let hVec2_1 = new egret3d.Vector2();
    let hVec2_2 = new egret3d.Vector2();

    export class HoverCameraScript extends paper.Behaviour {

        public lookAtPoint: egret3d.Vector3 = egret3d.Vector3.create(0.0, 0.0, 0.0);
        public lookAtTarget: egret3d.Transform;
        public distance: number = 30;

        public minPanAngle: number = -Infinity;
        public maxPanAngle: number = Infinity;
        public minTileAngle: number = -90;
        public maxTileAngle: number = 90;

        public scaleSpeed: number = 0.2;

        // private app: framework.Application;
        private bindTouch: egret3d.TouchDevice;
        private bindMouse: egret3d.MouseDevice;

        private _lastMouseX: number;
        private _lastMouseY: number;
        private _mouseDown = false;

        private _lastTouchX: number;
        private _lastTouchY: number;
        private _fingerTwo = false;
        private _lastDistance: number;

        private _panAngle: number = 0;
        private _panRad: number = 0;

        public set panAngle(value: number) {
            this._panAngle = Math.max(this.minPanAngle, Math.min(this.maxPanAngle, value));
            this._panRad = this._panAngle * Math.PI / 180;
        }

        public get panAngle(): number {
            return this._panAngle;
        }

        private _tiltAngle: number = 0;
        private _tiltRad: number = 0;

        public set tiltAngle(value: number) {
            this._tiltAngle = Math.max(this.minTileAngle, Math.min(this.maxTileAngle, value));
            this._tiltRad = this._tiltAngle * Math.PI / 180;
        }

        public get tiltAngle(): number {
            return this._tiltAngle;
        }

        public onStart(): any {
            this.bindTouch = egret3d.InputManager.touch;
            this.bindMouse = egret3d.InputManager.mouse;
        };

        public onUpdate(delta: number): any {
            this.updateMouse(delta);
            this.updateTouch(delta);

            let distanceX = this.distance * Math.sin(this._panRad) * Math.cos(this._tiltRad);
            let distanceY = this.distance * (this._tiltRad == 0 ? 0 : Math.sin(this._tiltRad));
            let distanceZ = this.distance * Math.cos(this._panRad) * Math.cos(this._tiltRad);

            let target: egret3d.Vector3;
            if (this.lookAtTarget) {
                target = this.lookAtTarget.getPosition();
            } else {
                target = this.lookAtPoint;
            }

            this.gameObject.transform.setPosition(target.x + distanceX, target.y + distanceY, target.z + distanceZ);
            this.gameObject.transform.lookAt(target);
        };

        private updateMouse(delta: number) {
            var mouse = this.bindMouse;
            if (mouse.isPressed(0)) {
                if (!this._mouseDown) {
                    this._mouseDown = true;
                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                } else {
                    var moveX = mouse.position.x - this._lastMouseX;
                    var moveY = mouse.position.y - this._lastMouseY;

                    this.panAngle += moveX;
                    this.tiltAngle += moveY;

                    this._lastMouseX = mouse.position.x;
                    this._lastMouseY = mouse.position.y;
                }
            } else if (mouse.wasReleased(0)) {
                this._mouseDown = false;
            }
            this.distance = Math.max(this.distance - mouse.wheel * 2, 1);
        }

        private updateTouch(delta: number) {
            var touch = this.bindTouch;
            if (touch.touchCount > 0) {
                if (touch.touchCount == 1) {
                    var _touch = touch.getTouch(0);
                    if (_touch.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo) {
                        this._lastTouchX = _touch.position.x;
                        this._lastTouchY = _touch.position.y;
                    } else {
                        var moveX = _touch.position.x - this._lastTouchX;
                        var moveY = _touch.position.y - this._lastTouchY;

                        this.panAngle += moveX * 0.5;
                        this.tiltAngle += moveY * 0.5;

                        this._lastTouchX = _touch.position.x;
                        this._lastTouchY = _touch.position.y;
                    }
                    this._fingerTwo = false;
                } else if (touch.touchCount == 2) {
                    var _touch1 = touch.getTouch(0);
                    var _touch2 = touch.getTouch(1);
                    if (_touch1.phase == egret3d.TouchPhase.BEGAN || _touch2.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo == false) {
                        hVec2_1.copy(_touch1.position);
                        hVec2_2.copy(_touch2.position);
                        this._lastDistance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);
                    } else {
                        hVec2_1.copy(_touch1.position);
                        hVec2_2.copy(_touch2.position);
                        var distance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);

                        var deltaDistance = distance - this._lastDistance;

                        this.distance = Math.max(this.distance - deltaDistance * this.scaleSpeed, 1);

                        this._lastDistance = distance;
                    }
                    this._fingerTwo = true;
                } else {
                    this._fingerTwo = false;
                }
            }
        }
    }
}

