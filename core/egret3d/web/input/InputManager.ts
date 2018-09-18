namespace egret3d {
    /**
     * device input manager
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 用户输入设备管理器
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class InputManager {

        /**
         * keyboard input
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 键盘输入
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public static keyboard: KeyboardDevice;

        /**
         * mouse input
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 鼠标输入
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public static mouse: MouseDevice;

        /**
         * touch input
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 鼠标输入
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
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
         * is pressed
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否正在被点击或者触摸
         * 只有单点触摸才被触发，多点触摸请使用 MouseDivice
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
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
         * was pressed
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否完成一次点击或触摸
         * 只有单点触摸才被触发，多点触摸请使用 MouseDivice
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
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
         * was released
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否完成一次鼠标或触摸释放。
         * 只有单点触摸才被触发，多点触摸请使用 MouseDivice
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
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
         * get touch point
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取点击或触摸位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
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