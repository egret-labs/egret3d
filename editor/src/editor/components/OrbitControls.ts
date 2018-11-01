namespace paper.editor {
    /**
     * @internal
     */
    @executeInEditMode
    export class OrbitControls extends Behaviour {
        public lookAtPoint: egret3d.Vector3 = egret3d.Vector3.create(0.0, 0.0, 0.0);
        public lookAtOffset: egret3d.Vector3 = egret3d.Vector3.create();
        public distance: number = 30;

        public minPanAngle: number = -Infinity;
        public maxPanAngle: number = Infinity;
        public minTileAngle: number = -90;
        public maxTileAngle: number = 90;

        public moveSpped: number = 0.001;
        public scaleSpeed: number = 0.2;

        private _enableMove: boolean = true;

        private _lastMouseX: number;
        private _lastMouseY: number;
        private _mouseDown = false;

        private _lastTouchX: number;
        private _lastTouchY: number;
        private _fingerTwo = false;
        private _lastDistance: number;

        private _panAngle: number = 0;
        private _panRad: number = 0;

        private _tiltAngle: number = 0;
        private _tiltRad: number = 0;

        public set panAngle(value: number) {
            this._panAngle = Math.max(this.minPanAngle, Math.min(this.maxPanAngle, value));
            this._panRad = this._panAngle * Math.PI / 180;
        }

        public get panAngle(): number {
            return this._panAngle;
        }

        public set tiltAngle(value: number) {
            this._tiltAngle = Math.max(this.minTileAngle, Math.min(this.maxTileAngle, value));
            this._tiltRad = this._tiltAngle * Math.PI / 180;
        }

        public get tiltAngle(): number {
            return this._tiltAngle;
        }

        public set enableMove(value: boolean) {
            if (this._enableMove === value) {
                return;
            }
            this._enableMove = value;
        }

        public get enableMove(): boolean {
            return this._enableMove;
        }

        public onStart() {
        }

        public onEnable() {
            const canvas = egret3d.WebGLCapabilities.canvas;
            if (canvas) {
                canvas!.addEventListener("mousedown", this._mouseDownHandler);
                canvas!.addEventListener("mouseup", this._mouseUpHandler);
                canvas!.addEventListener("mouseout", this._mouseUpHandler);
                canvas!.addEventListener("dblclick", this._mouseUpHandler);
                canvas!.addEventListener("mousemove", this._mouseMoveHandler);
                canvas!.addEventListener("wheel", this._mouseWheelHandler);
            }
        }

        public onDisable() {
            const canvas = egret3d.WebGLCapabilities.canvas;
            if (canvas) {
                canvas!.removeEventListener("mousedown", this._mouseDownHandler);
                canvas!.removeEventListener("mouseup", this._mouseUpHandler);
                canvas!.removeEventListener("mouseout", this._mouseUpHandler);
                canvas!.removeEventListener("dblclick", this._mouseUpHandler);
                canvas!.removeEventListener("mousemove", this._mouseMoveHandler);
                canvas!.removeEventListener("wheel", this._mouseWheelHandler);
            }
        }

        public onUpdate(delta: number) {
            if (!this._enableMove) {
                return;
            }
            this.move();
        }

        private _mouseDownHandler = (event: MouseEvent) => {
            if (event.button === 0b10) {
                this._mouseDown = true;
                this._lastMouseX = event.x;
                this._lastMouseY = event.y;
                event.preventDefault();
            }
        }

        private _mouseUpHandler = (event: MouseEvent) => {
            if (event.button === 0b10) {
                this._mouseDown = false;
                event.preventDefault();
            }
        }

        private _mouseMoveHandler = (event: MouseEvent) => {
            if (!this._mouseDown || !this._enableMove) {
                return;
            }

            const move = egret3d.Vector3.create(event.x - this._lastMouseX, event.y - this._lastMouseY, 0);
            if (event.ctrlKey) {
                move.x = -move.x;
                const center = this.lookAtPoint;
                const dis = this.gameObject.transform.position.getDistance(center);
                move.multiplyScalar(dis * this.moveSpped).applyMatrixWithoutTranslate(this.gameObject.transform.localMatrix);

                this.lookAtOffset.add(move);
            }
            else {
                this.panAngle += move.x;
                this.tiltAngle += move.y;
            }

            this._lastMouseX = event.x;
            this._lastMouseY = event.y;
            move.release();

            event.preventDefault();
        }

        private _mouseWheelHandler = (event: WheelEvent) => {
            this.distance = Math.max(this.distance - (event.wheelDelta > 0 ? 2 : -2), 1);
            event.preventDefault();
        }

        private move() {
            const distanceX = this.distance * Math.sin(this._panRad) * Math.cos(this._tiltRad);
            const distanceY = this.distance * (this._tiltRad === 0 ? 0 : Math.sin(this._tiltRad));
            const distanceZ = this.distance * Math.cos(this._panRad) * Math.cos(this._tiltRad);

            const target: egret3d.Vector3 = egret3d.Vector3.create();
            target.copy(this.lookAtPoint);
            target.add(this.lookAtOffset);

            this.gameObject.transform.setPosition(target.x + distanceX, target.y + distanceY, target.z + distanceZ);
            this.gameObject.transform.lookAt(target);

            target.release();
        }

        // private updateTouch(delta: number) {
        //     var touch = this.bindTouch;
        //     if (touch.touchCount > 0) {
        //         if (touch.touchCount == 1) {
        //             var _touch = touch.getTouch(0);
        //             if (_touch.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo) {
        //                 this._lastTouchX = _touch.position.x;
        //                 this._lastTouchY = _touch.position.y;
        //             } else {
        //                 var moveX = _touch.position.x - this._lastTouchX;
        //                 var moveY = _touch.position.y - this._lastTouchY;

        //                 this.panAngle += moveX * 0.5;
        //                 this.tiltAngle += moveY * 0.5;

        //                 this._lastTouchX = _touch.position.x;
        //                 this._lastTouchY = _touch.position.y;
        //             }
        //             this._fingerTwo = false;
        //         } else if (touch.touchCount == 2) {
        //             var _touch1 = touch.getTouch(0);
        //             var _touch2 = touch.getTouch(1);
        //             if (_touch1.phase == egret3d.TouchPhase.BEGAN || _touch2.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo == false) {
        //                 hVec2_1.copy(_touch1.position);
        //                 hVec2_2.copy(_touch2.position);
        //                 this._lastDistance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);
        //             } else {
        //                 hVec2_1.copy(_touch1.position);
        //                 hVec2_2.copy(_touch2.position);
        //                 var distance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);

        //                 var deltaDistance = distance - this._lastDistance;

        //                 this.distance = Math.max(this.distance - deltaDistance * this.scaleSpeed, 1);

        //                 this._lastDistance = distance;
        //             }
        //             this._fingerTwo = true;
        //         } else {
        //             this._fingerTwo = false;
        //         }
        //     }
        // }
    }
}