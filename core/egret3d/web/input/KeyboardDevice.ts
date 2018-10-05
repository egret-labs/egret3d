namespace egret3d {

    const _keyCodeToKeyIdentifier: { [key: string]: number } = {
        'TAB': 9,
        'ENTER': 13,
        'SHIFT': 16,
        'CONTROL': 17,
        'ALT': 18,
        'ESCAPE': 27,

        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40,

        'DELETE': 46,

        'WIN': 91
    };

    /**
     * @deprecated
     */
    export class KeyboardDevice {

        private _element: HTMLElement | Window | null = null;

        private preventDefault: boolean;
        private stopPropagation: boolean;

        private _keymap: { [key: string]: boolean } = {};
        private _lastmap: { [key: string]: boolean } = {};

        private _keyDownHandler: EventListener = this._handleKeyDown.bind(this);
        private _keyUpHandler: EventListener = this._handleKeyUp.bind(this);
        private _keyPressHandler: EventListener = this._handleKeyPress.bind(this);

        /**
         *  
         */
        constructor(element: HTMLElement | Window, options: { preventDefault: boolean, stopPropagation: boolean } = { preventDefault: false, stopPropagation: false }) {
            this.attach(element);

            this.preventDefault = options.preventDefault;
            this.stopPropagation = options.stopPropagation;
        }

        private attach(element: HTMLElement | Window) {
            if (this._element) {
                this.detach();
            }
            this._element = element;
            this._element.addEventListener("keydown", this._keyDownHandler, false);
            this._element.addEventListener("keypress", this._keyPressHandler, false);
            this._element.addEventListener("keyup", this._keyUpHandler, false);
        }

        private detach() {
            if (!this._element) return;
            this._element.removeEventListener("keydown", this._keyDownHandler, false);
            this._element.removeEventListener("keypress", this._keyPressHandler, false);
            this._element.removeEventListener("keyup", this._keyUpHandler, false);
            this._element = null;
        }

        private _handleKeyDown(event: KeyboardEvent) {
            let code = event.keyCode || event.charCode;
            let id: string = this._toKeyIdentifier(code);

            this._keymap[id] = true;

            if (this.preventDefault) {
                event.preventDefault();
            }
            if (this.stopPropagation) {
                event.stopPropagation();
            }
        }

        private _handleKeyPress(event: KeyboardEvent) {
            let code = event.keyCode || event.charCode;
            let id: string = this._toKeyIdentifier(code);

            // do nothing

            if (this.preventDefault) {
                event.preventDefault();
            }
            if (this.stopPropagation) {
                event.stopPropagation();
            }
        }

        private _handleKeyUp(event: KeyboardEvent) {
            let code = event.keyCode || event.charCode;
            let id: string = this._toKeyIdentifier(code);

            delete this._keymap[id];

            if (this.preventDefault) {
                event.preventDefault();
            }
            if (this.stopPropagation) {
                event.stopPropagation();
            }
        }

        private _cacheKeyCodeMap: { [key: string]: number } = {};

        private _toKeyIdentifier(keyCode: number | string): string {
            let code: number;

            if (typeof (keyCode) == "string") {
                let upperCode: string = keyCode.toUpperCase();
                if (!this._cacheKeyCodeMap[keyCode]) {
                    let _code = _keyCodeToKeyIdentifier[upperCode] || upperCode.charCodeAt(0);
                    this._cacheKeyCodeMap[upperCode] = _code;
                }
                code = this._cacheKeyCodeMap[upperCode];
            } else {
                code = keyCode;
            }

            // Convert to hex and add leading 0's
            let hex = code.toString(16).toUpperCase();
            let length = hex.length;
            for (let count = 0; count < (4 - length); count++) {
                hex = '0' + hex;
            }

            return 'U+' + hex;
        }

        /**
         *  
         */
        public update() {
            let prop;

            for (prop in this._lastmap) {
                delete this._lastmap[prop];
            }

            for (prop in this._keymap) {
                if (this._keymap.hasOwnProperty(prop)) {
                    this._lastmap[prop] = this._keymap[prop];
                }
            }
        }

        /**
         * @deprecated
         */
        public isPressed(key: number | string): boolean {
            let id = this._toKeyIdentifier(key);
            return this._keymap[id];
        }
        /**
         * @deprecated
         */
        public wasPressed(key: number | string): boolean {
            let id = this._toKeyIdentifier(key);
            return (this._keymap[id] && !this._lastmap[id]);
        }
        /**
         * @deprecated
         */
        public wasReleased(key: number | string): boolean {
            let id = this._toKeyIdentifier(key);
            return (!this._keymap[id] && this._lastmap[id]);
        }

    }

}