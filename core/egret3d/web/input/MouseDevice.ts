namespace egret3d {
    /**
     * @deprecated
     */
    export class MouseDevice extends EventDispatcher {

        private _offsetX: number = 0;
        private _offsetY: number = 0;
        private _scalerX: number = 1;
        private _scalerY: number = 1;
        private _rotated: boolean = false;
        /**
         *  
         */
        public updateOffsetAndScale(offsetX: number, offsetY: number, scalerX: number, scalerY: number, rotated: boolean) {
            this._offsetX = offsetX;
            this._offsetY = offsetY;
            this._scalerX = scalerX;
            this._scalerY = scalerY;
            this._rotated = rotated;
        }
        /**
         *  
         */
        public convertPosition(value: Readonly<IVector2>, out: IVector2) {
            const { x, y } = value;

            if (this._rotated) {
                out.y = (window.innerWidth - x + this._offsetX) * this._scalerX;
                out.x = (y - this._offsetY) * this._scalerY;
            }
            else {
                out.x = (x - this._offsetX) * this._scalerX;
                out.y = (y - this._offsetY) * this._scalerY;
            }
        }

        /**
         * @deprecated
         */
        public position: Vector2 = new Vector2();

        public wheel: number = 0;

        private _buttons: boolean[] = [false, false, false];

        private _lastbuttons: boolean[] = [false, false, false];

        private _element: HTMLElement | null = null;

        private _upHandler: EventListener = this._handleUp.bind(this);
        private _moveHandler: EventListener = this._handleMove.bind(this);
        private _downHandler: EventListener = this._handleDown.bind(this);
        private _wheelHandler: EventListener = this._handleWheel.bind(this);
        private _contextMenuHandler: EventListener = function (event) { event.preventDefault(); };

        /**
         *  
         */
        constructor(element: HTMLElement) {
            super();
            this.attach(element);
        }

        /**
         * @deprecated
         */
        public disableContextMenu() {
            if (!this._element) return;
            this._element.addEventListener("contextmenu", this._contextMenuHandler);
        }

        /**
         * @deprecated
         */
        public enableContextMenu() {
            if (!this._element) return;
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
            if (!this._element) return;
            this._element.removeEventListener("mouseup", this._upHandler, false);
            this._element.removeEventListener("mousemove", this._moveHandler, false);
            this._element.removeEventListener("mousedown", this._downHandler, false);
            this._element.removeEventListener("mousewheel", this._wheelHandler, false); // WebKit
            this._element.removeEventListener("DOMMouseScroll", this._wheelHandler, false); // Gecko
            this._element = null;
        }

        public update() {
            // Copy current button state
            this._lastbuttons[0] = this._buttons[0];
            this._lastbuttons[1] = this._buttons[1];
            this._lastbuttons[2] = this._buttons[2];
            // set wheel to 0
            this.wheel = 0;
        }

        public isPressed(button: number): boolean {
            return this._buttons[button];
        }

        public wasPressed(button: number): boolean {
            return (this._buttons[button] && !this._lastbuttons[button]);
        }

        public wasReleased(button: number): boolean {
            return (!this._buttons[button] && this._lastbuttons[button]);
        }

        private _handleUp(event: MouseEvent) {
            // disable released button
            this._buttons[event.button] = false;
            this.position.set(event.clientX, event.clientY);
            this.convertPosition(this.position, this.position);

            this.dispatchEvent({ type: "mouseup", x: this.position.x, y: this.position.y, identifier: event.button });
        }

        private _handleMove(event: MouseEvent) {
            this.position.set(event.clientX, event.clientY);
            this.convertPosition(this.position, this.position);

            if (this._buttons[event.button]) {
                this.dispatchEvent({ type: "mousemove", x: this.position.x, y: this.position.y, identifier: event.button });
            }
        }

        private _handleDown(event: MouseEvent) {
            // Store which button has affected
            this._buttons[event.button] = true;
            this.position.set(event.clientX, event.clientY);
            this.convertPosition(this.position, this.position);

            this.dispatchEvent({ type: "mousedown", x: this.position.x, y: this.position.y, identifier: event.button });
        }

        private _handleWheel(event: MouseWheelEvent) {
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