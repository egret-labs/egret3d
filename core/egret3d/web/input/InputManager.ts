namespace egret3d {
    /**
     * @deprecated
     */
    export class InputManager {
        /**
         * @deprecated
         */
        public static keyboard: KeyboardDevice;
        /**
         * @deprecated
         */
        public static mouse: MouseDevice;
        /**
         * @deprecated
         */
        public static touch: TouchDevice;

        private static _isInit: boolean = false;

        /**
         *   
         */
        public static init(canvas) {
            if (this._isInit) {
                return;
            }
            this._isInit = true;

            this.keyboard = new KeyboardDevice(window);
            this.mouse = new MouseDevice(canvas);
            this.touch = new TouchDevice(canvas);
        }

        /**
         *   
         */
        public static update(deltaTime: number) {
            this.keyboard.update();
            this.mouse.update();
            this.touch.update();
        }
        /**
         * @deprecated
         */
        public static isPressed(): boolean {
            if (this.mouse.isPressed(0)) {
                return true;
            } else {
                let t = this.touch.getTouch(0);
                if (t && this.touch.touchCount == 1) {
                    if (t.phase == TouchPhase.MOVED || t.phase == TouchPhase.STATIONARY) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * @deprecated
         */
        public static wasPressed(): boolean {
            if (this.mouse.wasPressed(0)) {
                return true;
            } else {
                let t = this.touch.getTouch(0);
                if (t && this.touch.touchCount == 1) {
                    if (t.phase == TouchPhase.BEGAN) {
                        return true;
                    }
                }
            }
            return false;
        }
        /**
         * @deprecated
         */
        public static wasReleased(): boolean {
            if (this.mouse.wasReleased(0)) {
                return true;
            } else {
                let t = this.touch.getTouch(0);
                if (t && this.touch.touchCount == 1) {
                    if (t.phase == TouchPhase.ENDED || t.phase == TouchPhase.CANCELED) {
                        return true;
                    }
                }
            }
            return false;
        }

        private static _touchPoint: Vector2 = new Vector2();
        /**
         * @deprecated
         */
        public static getTouchPoint(): Vector2 {
            let t = this.touch.getTouch(0);

            if (t) {
                this._touchPoint.x = t.position.x;
                this._touchPoint.y = t.position.y;
            } else {
                this._touchPoint.x = this.mouse.position.x;
                this._touchPoint.y = this.mouse.position.y;
            }

            return this._touchPoint;
        }

    }

}