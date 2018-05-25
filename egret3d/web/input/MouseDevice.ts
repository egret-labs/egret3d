namespace egret3d {

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
    export class MouseDevice extends EventDispatcher {

        private _offsetX:number = 0;
        private _offsetY:number = 0;
        private _scaler:number = 1;
        /**
         *  
         */
        public updateOffsetAndScale(offsetX:number, offsetY:number, scaler:number) {
            this._offsetX = offsetX;
            this._offsetY = offsetY;
            this._scaler = scaler;
        }
        /**
         *  
         */
        public convertPosition(e:MouseEvent, out:Vector2) {
            out.x = (e.clientX - this._offsetX) * this._scaler;
            out.y = (e.clientY - this._offsetY) * this._scaler;
        }

        /**
         * mouse position
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前鼠标位置
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public position:Vector2 = new Vector2();

        /**
         * mouse wheel value
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前鼠标滚轮值
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public wheel:number = 0;

        private _buttons:boolean[] = [false, false, false];

        private _lastbuttons:boolean[] = [false, false, false];

        private _element: HTMLElement | null = null;

        private _upHandler:EventListener = this._handleUp.bind(this);
        private _moveHandler:EventListener = this._handleMove.bind(this);
        private _downHandler:EventListener = this._handleDown.bind(this);
        private _wheelHandler:EventListener = this._handleWheel.bind(this);
        private _contextMenuHandler:EventListener = function(event) {event.preventDefault()};

        /**
         *  
         */
        constructor(element: HTMLElement) {
            super();
            this.attach(element);
        }

        /**
         * disable right key menu
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 禁用右键菜单
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public disableContextMenu() {
            if(!this._element) return;
            this._element.addEventListener("contextmenu", this._contextMenuHandler);
        }

        /**
         * enable right key menu
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 启用右键菜单
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public enableContextMenu() {
            if(!this._element) return;
            this._element.removeEventListener("contextmenu", this._contextMenuHandler);
        }

        private attach(element: HTMLElement) {
            if (this._element) {
                this.detach();
            }
            this._element = element;
            this._element.addEventListener("mouseup", this._upHandler, false);
            this._element.addEventListener("mousemove", this._moveHandler, false);
            this._element.addEventListener("mousedown", this._downHandler, false);
            this._element.addEventListener("mousewheel", this._wheelHandler, false); // WebKit
            this._element.addEventListener("DOMMouseScroll", this._wheelHandler, false); // Gecko
        }

        private detach() {
            if(!this._element) return;
            this._element.removeEventListener("mouseup", this._upHandler, false);
            this._element.removeEventListener("mousemove", this._moveHandler, false);
            this._element.removeEventListener("mousedown", this._downHandler, false);
            this._element.removeEventListener("mousewheel", this._wheelHandler, false); // WebKit
            this._element.removeEventListener("DOMMouseScroll", this._wheelHandler, false); // Gecko
            this._element = null;
        }

        /**
         *  
         */
        public update() {
            // Copy current button state
            this._lastbuttons[0] = this._buttons[0];
            this._lastbuttons[1] = this._buttons[1];
            this._lastbuttons[2] = this._buttons[2];
            // set wheel to 0
            this.wheel = 0;
        }

        /**
         * is pressed
         * @param key key value. 0: left key; 1: middle key; 2: right key.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键是否在按下状态
         * @param key 按键。0: 左键；1: 中键；2: 右键。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public isPressed(button:number):boolean {
            return this._buttons[button];
        }

        /**
         * was pressed
         * @param key key value. 0: left key; 1: middle key; 2: right key.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键被按下一次
         * @param key 按键。0: 左键；1: 中键；2: 右键。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public wasPressed(button:number):boolean {
            return (this._buttons[button] && !this._lastbuttons[button]);
        }

        /**
         * was released
         * @param key key value. 0: left key; 1: middle key; 2: right key.
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 按键被抬起一次
         * @param key 按键。0: 左键；1: 中键；2: 右键。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public wasReleased(button:number):boolean {
            return (!this._buttons[button] && this._lastbuttons[button]);
        }

        private _handleUp(event:MouseEvent) {
            // disable released button
            this._buttons[event.button] = false;
            this.convertPosition(event, this.position);

            this.dispatchEvent({type: "mouseup", x: this.position.x, y: this.position.y, identifier: event.button});
        }

        private _handleMove(event:MouseEvent) {
            this.convertPosition(event, this.position);

            if(this._buttons[event.button]) {
                this.dispatchEvent({type: "mousemove", x: this.position.x, y: this.position.y, identifier: event.button});
            }
        }

        private _handleDown(event:MouseEvent) {
            // Store which button has affected
            this._buttons[event.button] = true;
            this.convertPosition(event, this.position);

            this.dispatchEvent({type: "mousedown", x: this.position.x, y: this.position.y, identifier: event.button});
        }

        private _handleWheel(event:MouseWheelEvent) {
            // FF uses 'detail' and returns a value in 'no. of lines' to scroll
            // WebKit and Opera use 'wheelDelta', WebKit goes in multiples of 120 per wheel notch
            if (event.detail) {
                this.wheel = -1 * event.detail;
            } else if (event.wheelDelta) {
                this.wheel = event.wheelDelta / 120;
            } else {
                this.wheel = 0;
            }
        }

    }

}