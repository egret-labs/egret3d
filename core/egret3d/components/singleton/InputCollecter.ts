namespace egret3d {
    /**
     * Pointer 按钮的类型。
     * - https://www.w3.org/TR/pointerevents/#the-button-property
     */
    export const enum PointerButtonType {
        None = -1,
        LeftMouse = 0,
        TouchContact = 0,
        Pencontac = 0,
        MiddleMouse = 1,
        RightMouse = 2,
        PenBarrel = 2,
        Back = 3,
        X1 = 3,
        Forward = 4,
        X2 = 4,
        PenEraser = 5,
    }
    /**
     * Pointer 按钮的状态类型。
     * - https://www.w3.org/TR/pointerevents/#the-buttons-property
     */
    export const enum PointerButtonsType {
        None = 0b000000,
        LeftMouse = 0b000001,
        TouchContact = 0b000001,
        PenContac = 0b000001,
        MiddleMouse = 0b000100,
        RightMouse = 0b000010,
        PenBarrel = 0b000010,
        Back = 0b001000,
        X1 = 0b001000,
        Forward = 0b010000,
        X2 = 0b010000,
        PenEraser = 0b100000,
    }
    /**
     * 按键枚举。
     */
    export const enum KeyCode {
        Unknown = "Unknown",

        F1 = "F1",
        F2 = "F2",
        F3 = "F3",
        F4 = "F4",
        F5 = "F5",
        F6 = "F6",
        F7 = "F7",
        F8 = "F8",
        F9 = "F9",
        F10 = "F10",
        F11 = "F11",
        F12 = "F12",

        Digit0 = "Digit0",
        Digit1 = "Digit1",
        Digit2 = "Digit2",
        Digit3 = "Digit3",
        Digit4 = "Digit4",
        Digit5 = "Digit5",
        Digit6 = "Digit6",
        Digit7 = "Digit7",
        Digit8 = "Digit8",
        Digit9 = "Digit9",

        KeyA = "KeyA",
        KeyB = "KeyB",
        KeyC = "KeyC",
        KeyD = "KeyD",
        KeyE = "KeyE",
        KeyF = "KeyF",
        KeyG = "KeyG",
        KeyH = "KeyH",
        KeyI = "KeyI",
        KeyJ = "KeyJ",
        KeyK = "KeyK",
        KeyL = "KeyL",
        KeyM = "KeyM",
        KeyN = "KeyN",
        KeyO = "KeyO",
        KeyP = "KeyP",
        KeyQ = "KeyQ",
        KeyR = "KeyR",
        KeyS = "KeyS",
        KeyT = "KeyT",
        KeyU = "KeyU",
        KeyV = "KeyV",
        KeyW = "KeyW",
        KeyX = "KeyX",
        KeyY = "KeyY",
        KeyZ = "KeyZ",

        Backquote = "Backquote",
        Minus = "Minus",
        Equal = "Equal",
        BracketLeft = "BracketLeft",
        BracketRight = "BracketRight",
        Backslash = "Backslash",
        Semicolon = "Semicolon",
        Quote = "Quote",
        Comma = "Comma",
        Period = "Period",
        Slash = "Slash",

        Escape = "Escape",
        ScrollLock = "ScrollLock",
        Pause = "Pause",
        Backspace = "Backspace",
        Tab = "Tab",
        CapsLock = "CapsLock",
        Space = "Space",
        ContextMenu = "ContextMenu",

        ShiftLeft = "ShiftLeft",
        ControlLeft = "ControlLeft",
        AltLeft = "AltLeft",
        MetaLeft = "MetaLeft",

        ShiftRight = "ShiftRight",
        ControlRight = "ControlRight",
        AltRight = "AltRight",
        MetaRight = "MetaRight",

        Insert = "Insert",
        Delete = "Delete",
        Home = "Home",
        End = "End",
        PageUp = "PageUp",
        PageDown = "PageDown",

        ArrowUp = "ArrowUp",
        ArrowDown = "ArrowDown",
        ArrowLeft = "ArrowLeft",
        ArrowRight = "ArrowRight",

        NumpadLock = "NumLock",
        NumpadDivide = "NumpadDivide",
        NumpadMultiply = "NumpadMultiply",
        NumpadSubtract = "NumpadSubtract",
        NumpadAdd = "NumpadAdd",
        NumpadEnter = "NumpadEnter",
        NumpadDecimal = "NumpadDecimal",

        Numpad0 = "Numpad0",
        Numpad1 = "Numpad1",
        Numpad2 = "Numpad2",
        Numpad3 = "Numpad3",
        Numpad4 = "Numpad4",
        Numpad5 = "Numpad5",
        Numpad6 = "Numpad6",
        Numpad7 = "Numpad7",
        Numpad8 = "Numpad8",
        Numpad9 = "Numpad9",
    }

    const _keyToCode = [
        "`", KeyCode.Backquote,
        "1", KeyCode.Digit1,
        "2", KeyCode.Digit2,
        "3", KeyCode.Digit3,
        "4", KeyCode.Digit4,
        "5", KeyCode.Digit5,
        "6", KeyCode.Digit6,
        "7", KeyCode.Digit7,
        "8", KeyCode.Digit8,
        "9", KeyCode.Digit9,
        "0", KeyCode.Digit0,
        "-", KeyCode.Minus,
        "=", KeyCode.Equal,
        "[", KeyCode.BracketLeft,
        "]", KeyCode.BracketRight,
        "\\", KeyCode.Backslash,
        ";", KeyCode.Semicolon,
        "'", KeyCode.Quote,
        ",", KeyCode.Comma,
        ".", KeyCode.Period,
        "/", KeyCode.Slash,

        "~", KeyCode.Backquote,
        "!", KeyCode.Digit1,
        "@", KeyCode.Digit2,
        "#", KeyCode.Digit3,
        "$", KeyCode.Digit4,
        "%", KeyCode.Digit5,
        "^", KeyCode.Digit6,
        "&", KeyCode.Digit7,
        "*", KeyCode.Digit8,
        "(", KeyCode.Digit9,
        ")", KeyCode.Digit0,
        "_", KeyCode.Minus,
        "+", KeyCode.Equal,
        "{", KeyCode.BracketLeft,
        "}", KeyCode.BracketRight,
        "|", KeyCode.Backslash,
        ":", KeyCode.Semicolon,
        '"', KeyCode.Quote,
        "<", KeyCode.Comma,
        ">", KeyCode.Period,
        "?", KeyCode.Slash,

        "a", KeyCode.KeyA,
        "b", KeyCode.KeyB,
        "c", KeyCode.KeyC,
        "d", KeyCode.KeyD,
        "e", KeyCode.KeyE,
        "f", KeyCode.KeyF,
        "g", KeyCode.KeyG,
        "h", KeyCode.KeyH,
        "i", KeyCode.KeyI,
        "j", KeyCode.KeyJ,
        "k", KeyCode.KeyK,
        "l", KeyCode.KeyL,
        "m", KeyCode.KeyM,
        "n", KeyCode.KeyN,
        "o", KeyCode.KeyO,
        "p", KeyCode.KeyP,
        "q", KeyCode.KeyQ,
        'r', KeyCode.KeyR,
        "s", KeyCode.KeyS,
        "t", KeyCode.KeyT,
        "u", KeyCode.KeyU,
        "v", KeyCode.KeyV,
        "w", KeyCode.KeyW,
        "x", KeyCode.KeyX,
        "y", KeyCode.KeyY,
        "z", KeyCode.KeyZ,
    ];

    const _keyCodeToCode = [
        48, KeyCode.Digit0,
        49, KeyCode.Digit1,
        50, KeyCode.Digit2,
        51, KeyCode.Digit3,
        52, KeyCode.Digit4,
        53, KeyCode.Digit5,
        54, KeyCode.Digit6,
        55, KeyCode.Digit7,
        56, KeyCode.Digit8,
        57, KeyCode.Digit9,

        65, KeyCode.KeyA,
        66, KeyCode.KeyB,
        67, KeyCode.KeyC,
        68, KeyCode.KeyD,
        69, KeyCode.KeyE,
        70, KeyCode.KeyF,
        71, KeyCode.KeyG,
        72, KeyCode.KeyH,
        73, KeyCode.KeyI,
        74, KeyCode.KeyJ,
        75, KeyCode.KeyK,
        76, KeyCode.KeyL,
        77, KeyCode.KeyM,
        78, KeyCode.KeyN,
        79, KeyCode.KeyO,
        80, KeyCode.KeyP,
        81, KeyCode.KeyQ,
        82, KeyCode.KeyR,
        83, KeyCode.KeyS,
        84, KeyCode.KeyT,
        85, KeyCode.KeyU,
        86, KeyCode.KeyV,
        87, KeyCode.KeyW,
        88, KeyCode.KeyX,
        89, KeyCode.KeyY,
        90, KeyCode.KeyZ,

        96, KeyCode.Digit0,
        97, KeyCode.Digit1,
        98, KeyCode.Digit2,
        99, KeyCode.Digit3,
        100, KeyCode.Digit4,
        101, KeyCode.Digit5,
        102, KeyCode.Digit6,
        103, KeyCode.Digit7,
        104, KeyCode.Digit8,
        105, KeyCode.Digit9,
    ];
    /**
     * 鼠标、笔、触控等的信息。
     */
    export class Pointer extends paper.BaseRelease<Pointer> {
        private static readonly _instances: Pointer[] = [];
        /**
         * 创建一个 Pointer 实例。
         */
        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new Pointer();
        }
        /**
         * 该 Pointer 持续按下的时间。
         */
        public holdedTime: number = 0.0;
        /**
         * 该 Pointer 的舞台坐标。
         */
        public readonly position: egret3d.Vector3 = egret3d.Vector3.create();
        /**
         * 该 Pointer 按下的舞台坐标。
         */
        public readonly downPosition: egret3d.Vector3 = egret3d.Vector3.create();
        /**
         * 该 Pointer 此帧的移动速度。
         */
        public readonly speed: egret3d.Vector3 = egret3d.Vector3.create();
        /**
         * 该 Pointer 最近的事件。
         */
        public event: PointerEvent | null = null;
        /**
         * @internal
         */
        public _prevButtons: PointerButtonsType = PointerButtonsType.None;
        /**
         * @internal
         */
        public readonly _prevPosition: egret3d.Vector3 = egret3d.Vector3.create();

        private constructor() {
            super();
        }
        /**
         * 该 Pointer 此帧按下的状态。
         * @param value 
         */
        public isDown(value: PointerButtonsType = PointerButtonsType.TouchContact, isPlayerMode: boolean = true) {
            if (!this.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return false;
            }

            return (this.event.buttons & value) !== 0 && (this._prevButtons & value) === 0;
        }
        /**
         * 该 Pointer 此帧持续按下的状态。
         * @param value 
         */
        public isHold(value: PointerButtonsType = PointerButtonsType.TouchContact, isPlayerMode: boolean = true) {
            if (!this.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return false;
            }

            return (this.event.buttons & value) !== 0 && (this._prevButtons & value) !== 0;
        }
        /**
         * 该 Pointer 此帧抬起的状态。
         * @param value 
         */
        public isUp(value: PointerButtonsType = PointerButtonsType.TouchContact, isPlayerMode: boolean = true) {
            if (!this.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return false;
            }

            return (this.event.buttons & value) === 0 && (this._prevButtons & value) !== 0;
        }
        /**
         * 该 Pointer 此帧移动的状态。
         * @param value 
         */
        public isMove(distance: number = 5, isPlayerMode: boolean = true) {
            if (!this.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return Math.abs(this.speed.x) > distance || Math.abs(this.speed.y) > distance;
        }
    }
    /**
     * 按键的信息。
     */
    export class Key {
        /**
         * 该按键持续按下的时间。
         */
        public holdedTime: number = 0.0;
        /**
         * 该按键最近的事件。
         */
        public event: KeyboardEvent | null = null;
        /**
         * 该按键此帧按下的状态。
         * @param value 
         */
        public isDown(isPlayerMode: boolean = true) {
            if (!this.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return false;
            }

            return inputCollecter._downKeys.indexOf(this) >= 0;
        }
        /**
         * 该按键此帧持续按下的状态。
         * @param value 
         */
        public isHold(isPlayerMode: boolean = true) {
            if (!this.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return false;
            }

            return inputCollecter._holdKeys.indexOf(this) >= 0;
        }
        /**
         * 该按键此帧抬起的状态。
         * @param value 
         */
        public isUp(isPlayerMode: boolean = true) {
            if (!this.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return false;
            }

            return inputCollecter._upKeys.indexOf(this) >= 0;
        }
    }
    /**
     * 全局输入信息组件。
     * - https://www.w3.org/TR/pointerevents/
     * - https://github.com/millermedeiros/js-signals/
     */
    // @requireComponent(Stage) TODO
    export class InputCollecter extends paper.SingletonComponent {
        /**
         * 滚轮当前值。
         */
        public mouseWheel: number = 0;
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerOver: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerEnter: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerDown: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerMove: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerUp: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerCancel: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerOut: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onPointerLeave: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onMouseWheel: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onKeyDown: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onKeyUp: signals.Signal = new signals.Signal();
        /**
         * @internal
         */
        public readonly _downPointers: Pointer[] = [];
        /**
         * @internal
         */
        public readonly _holdPointers: Pointer[] = [];
        /**
         * @internal
         */
        public readonly _upPointers: Pointer[] = [];
        /**
         * @internal
         */
        public readonly _downKeys: Key[] = [];
        /**
         * @internal
         */
        public readonly _holdKeys: Key[] = [];
        /**
         * @internal
         */
        public readonly _upKeys: Key[] = [];
        /**
         * 默认的 Pointer 实例。
         */
        public readonly defaultPointer: Pointer = Pointer.create();

        private readonly _pointers: { [key: string]: Pointer } = {};
        private readonly _keys: { [key: string]: Key } = {};
        /**
         * @internal
         */
        public update(deltaTime: number) {
            for (const pointer of this._downPointers) {
                pointer.holdedTime = 0.0;
            }

            for (const pointer of this._holdPointers) {
                if (this._downPointers.indexOf(pointer) >= 0) {
                    continue;
                }

                pointer.holdedTime += deltaTime;
            }

            for (const key of this._downKeys) {
                key.holdedTime = 0.0;
            }

            for (const key of this._holdKeys) {
                if (this._downKeys.indexOf(key) >= 0) {
                    continue;
                }

                key.holdedTime += deltaTime;
            }

            return this;
        }
        /**
         * @internal
         */
        public clear() {
            this.mouseWheel = 0;

            for (const k in this._pointers) {
                const pointer = this._pointers[k];
                if (pointer.event) {
                    pointer.speed.subtract(pointer.position, pointer._prevPosition);
                    pointer._prevButtons = pointer.event.buttons;
                    pointer._prevPosition.copy(pointer.position);
                }
            }

            if (this._upPointers.length > 0) {
                this._upPointers.length = 0;
            }

            if (this._downPointers.length > 0) {
                this._downPointers.length = 0;
            }

            if (this._upKeys.length > 0) {
                this._upKeys.length = 0;
            }

            if (this._downKeys.length > 0) {
                this._downKeys.length = 0;
            }

            return this;
        }

        public initialize() {
            super.initialize();

            inputCollecter = this;
            this._pointers[1] = this.defaultPointer;
        }
        /**
         * 此帧按下的全部 Pointer。
         */
        public getDownPointers(isPlayerMode: boolean = true): ReadonlyArray<Pointer> {
            if (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player) {
                return [];
            }

            return this._downPointers;
        }
        /**
         * 此帧持续按下的全部 Pointer。
         */
        public getHoldPointers(isPlayerMode: boolean = true): ReadonlyArray<Pointer> {
            if (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player) {
                return [];
            }

            return this._holdPointers;
        }
        /**
         * 此帧抬起的全部 Pointer。
         */
        public getUpPointers(isPlayerMode: boolean = true): ReadonlyArray<Pointer> {
            if (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player) {
                return [];
            }

            return this._upPointers;
        }
        /**
         * 此帧按下的全部按键。
         */
        public getDownKeys(isPlayerMode: boolean = true): ReadonlyArray<Key> {
            if (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player) {
                return [];
            }

            return this._downKeys;
        }
        /**
         * 此帧持续按下的全部按键。
         */
        public getHoldKeys(isPlayerMode: boolean = true): ReadonlyArray<Key> {
            if (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player) {
                return [];
            }

            return this._holdKeys;
        }
        /**
         * 此帧抬起的全部按键。
         */
        public getUpKeys(isPlayerMode: boolean = true): ReadonlyArray<Key> {
            if (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player) {
                return [];
            }

            return this._upKeys;
        }
        /**
         * @internal
         */
        public getPointer(pointerID: uint) {
            const pointers = this._pointers;
            if (!(pointerID in pointers)) {
                if (this._downPointers.length === 0 && this._holdPointers.length === 0) {
                    pointers[pointerID] = this.defaultPointer;
                }
                else {
                    pointers[pointerID] = Pointer.create();
                }
            }

            return pointers[pointerID];
        }
        /**
         * @internal
         */
        public removePointer(pointerID: uint) {
            if (pointerID === 1) {
                return;
            }

            const pointers = this._pointers;
            if (pointerID in pointers) {
                const pointer = pointers[pointerID];
                if (pointer !== this.defaultPointer) {
                    pointer.release();
                }

                delete pointers[pointerID];
            }
        }
        /**
         * 通过键名称创建或获取一个按键实例。
         */
        public getKey(code: string | number) {
            if (typeof code === "number") { // KeyCode.
                const index = _keyCodeToCode.indexOf(code);
                if (index >= 0) {
                    code = _keyCodeToCode[index + 1] as string;
                }
                else {
                    if (DEBUG) {
                        console.error(`Unsupported keyCode "${code}", use egret3d.keyCode enumeration instead.`);
                    }

                    code = KeyCode.Unknown;
                }
            }
            else if (code.length === 1) { // Key.
                const index = _keyToCode.indexOf(code);
                if (index >= 0) {
                    code = _keyToCode[index + 1];
                }
                else {
                    if (DEBUG) {
                        console.error(`Unsupported key "${code}", use egret3d.keyCode enumeration instead.`);
                    }

                    code = KeyCode.Unknown;
                }
            }
            else if (!code) {
                if (DEBUG) {
                    console.error(`Invalid code.`);
                }

                code = KeyCode.Unknown;
            }

            code = code.toLowerCase();

            const keys = this._keys;
            if (!(code in keys)) {
                keys[code] = new Key();
            }

            return keys[code];
        }
        /**
         * 设备最大可支持的多点触摸数量。
         */
        public get maxTouchPoints(): uint {
            if (window.navigator) {
                return window.navigator.maxTouchPoints;
            }

            return 0;
        }
    }
    /**
     * 全局输入信息组件实例。
     */
    export let inputCollecter: InputCollecter = null!;
}
