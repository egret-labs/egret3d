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
     * 鼠标、笔、触控等的信息。
     */
    export class Pointer {
        /**
         * 该 Pointer 持续按下的时间。
         */
        public holdedTime: number = 0.0;
        /**
         * 该 Pointer 的舞台坐标。
         * TODO
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
    }
    /**
     * 全局输入信息收集组件。
     * - https://www.w3.org/TR/pointerevents/
     * - https://github.com/millermedeiros/js-signals/
     */
    // @requireComponent(Stage) TODO
    export class InputCollecter extends paper.SingletonComponent {
        /**
         * 滚轮当前值。
         */
        public wheel: number = 0;
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
        public readonly onGotPointerCapture: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onLostPointerCapture: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onKeyDown: signals.Signal = new signals.Signal();
        /**
         * 通常不需要使用该事件。
         */
        public readonly onKeyUp: signals.Signal = new signals.Signal();
        /**
         * 此帧按下的全部 Pointer。
         */
        public readonly downPointers: Pointer[] = [];
        /**
         * 此帧持续按下的全部 Pointer。
         */
        public readonly holdPointers: Pointer[] = [];
        /**
         * 此帧抬起的全部 Pointer。
         */
        public readonly upPointers: Pointer[] = [];
        /**
         * 此帧按下的全部按键。
         */
        public readonly downKeys: Key[] = [];
        /**
         * 此帧持续按下的全部按键。
         */
        public readonly holdKeys: Key[] = [];
        /**
         * 此帧抬起的全部按键。
         */
        public readonly upKeys: Key[] = [];

        private readonly _pointers: { [key: string]: Pointer } = {};
        private readonly _keys: { [key: string]: Key } = {};
        /**
         * @internal
         */
        public update(deltaTime: number) {
            const pointers = this._pointers;
            for (const k in pointers) {
                const pointer = pointers[k];
                if (pointer.event) {
                    pointer.speed.subtract(pointer.position, pointer._prevPosition);
                    pointer._prevButtons = pointer.event.buttons;
                    pointer._prevPosition.copy(pointer.position);
                }
            }

            for (const pointer of this.downPointers) {
                if (this.upPointers.indexOf(pointer) >= 0){
                    continue;
                }

                pointer.holdedTime = 0.0;
                this.holdPointers.push(pointer);
            }

            for (const pointer of this.holdPointers) {
                pointer.holdedTime += deltaTime;
            }

            for (const key of this.downKeys) {
                if (this.holdKeys.indexOf(key) >= 0){
                    continue;
                }

                key.holdedTime = 0.0;
                this.holdKeys.push(key);
            }

            for (const key of this.holdKeys) {
                key.holdedTime += deltaTime;
            }

            this.wheel = 0;

            if (this.upPointers.length > 0) {
                this.upPointers.length = 0;
            }

            if (this.downPointers.length > 0) {
                this.downPointers.length = 0;
            }

            if (this.upKeys.length > 0) {
                this.upKeys.length = 0;
            }

            if (this.downKeys.length > 0) {
                this.downKeys.length = 0;
            }
        }
        /**
         * 屏幕到舞台坐标的转换。
         */
        public screenToStage(value: Readonly<egret3d.Vector3>, out: egret3d.Vector3) {
            const stage = this.gameObject.getComponent(Stage)!;
            const screenSize = stage.screenSize;
            const viewPort = stage.viewport;
            const { x, y } = value;

            if (stage.rotated) {
                out.y = (screenSize.w - (x - viewPort.x)) * (viewPort.w / screenSize.h);
                out.x = (y - viewPort.y) * (viewPort.h / screenSize.w);
            }
            else {
                out.x = (x - viewPort.x) * (viewPort.w / screenSize.w);
                out.y = (y - viewPort.y) * (viewPort.h / screenSize.h);
            }

            return this;
        }
        /**
         * 舞台到屏幕坐标的转换。
         */
        public stageToScreen(value: Readonly<egret3d.Vector3>, out: egret3d.Vector3) {
            // TODO

            return this;
        }
        /**
         * 该 Pointer 此帧按下的状态。
         * @param value 
         */
        public isPointerDown(pointerID: uint = 1, value: PointerButtonsType = PointerButtonsType.TouchContact, isPlayerMode: boolean = true) {
            const pointer = this.getPointer(pointerID);
            if (!pointer.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return (pointer.event.buttons & value) !== 0 && (pointer._prevButtons & value) === 0 ? pointer : null;
        }
        /**
         * 该 Pointer 此帧持续按下的状态。
         * @param value 
         */
        public isPointerHold(pointerID: uint = 1, value: PointerButtonsType = PointerButtonsType.TouchContact, isPlayerMode: boolean = true) {
            const pointer = this.getPointer(pointerID);
            if (!pointer.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return (pointer.event.buttons & value) !== 0 && (pointer._prevButtons & value) !== 0 ? pointer : null;
        }
        /**
         * 该 Pointer 此帧移动的状态。
         * @param value 
         */
        public isPointerMove(pointerID: uint = 1, isPlayerMode: boolean = true) {
            const pointer = this.getPointer(pointerID);
            if (!pointer.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return Math.abs(pointer.event.movementX) > 5 || Math.abs(pointer.event.movementY) > 5 ? pointer : null;
        }
        /**
         * 该 Pointer 此帧抬起的状态。
         * @param value 
         */
        public isPointerUp(pointerID: uint = 1, value: PointerButtonsType = PointerButtonsType.TouchContact, isPlayerMode: boolean = true) {
            const pointer = this.getPointer(pointerID);
            if (!pointer.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return (pointer.event.buttons & value) === 0 && (pointer._prevButtons & value) !== 0 ? pointer : null;
        }
        /**
         * 该按键此帧按下的状态。
         * @param value 
         */
        public isKeyDown(code: string, isPlayerMode: boolean = true) {
            const key = this.getKey(code);
            if (!key.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return this.downKeys.indexOf(key) >= 0 ? key : null;
        }
        /**
         * 该按键此帧持续按下的状态。
         * @param value 
         */
        public isKeyHold(code: string, isPlayerMode: boolean = true) {
            const key = this.getKey(code);
            if (!key.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return this.holdKeys.indexOf(key) >= 0 ? key : null;
        }
        /**
         * 该按键此帧抬起的状态。
         * @param value 
         */
        public isKeyUp(code: string, isPlayerMode: boolean = true) {
            const key = this.getKey(code);
            if (!key.event || (isPlayerMode && paper.Application.playerMode !== paper.PlayerMode.Player)) {
                return null;
            }

            return this.upKeys.indexOf(key) >= 0 ? key : null;
        }
        /**
         * 通过 pointerID 创建或获取一个 Pointer 实例。
         * - 默认获取鼠标或笔的 Pointer 实例。
         */
        public getPointer(pointerID: uint = 1) {
            const pointers = this._pointers;
            if (!(pointerID in pointers)) {
                pointers[pointerID] = new Pointer();
            }

            return pointers[pointerID];
        }
        /**
         * 通过键名称创建或获取一个按键实例。
         */
        public getKey(code: string) {
            const keys = this._keys;
            if (!(code in keys)) {
                keys[code] = new Key();
            }

            return keys[code];
        }
        /**
         * 最大可支持的多点触摸数量。
         */
        public get maxTouchPoints(): uint {
            if (window.navigator) {
                return window.navigator.maxTouchPoints;
            }

            return 0;
        }
    }
}
