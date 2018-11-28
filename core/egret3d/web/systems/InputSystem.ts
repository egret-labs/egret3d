namespace egret3d.web {
    /**
     * @internal
     */
    export class InputSystem extends paper.BaseSystem {
        private _hasTouch: boolean = false;
        private _canvas: HTMLCanvasElement = null!;

        private _pointerUp(pointer: Pointer, isCancel: boolean) {
            if (pointer.event!.buttons !== PointerButtonsType.None) {
                return false;
            }

            let isDown = false;
            const downPointers = inputCollecter._downPointers;
            const holdPointers = inputCollecter._holdPointers;
            const upPointers = inputCollecter._upPointers;

            let index = downPointers.indexOf(pointer);
            if (index >= 0) {
                isDown = true;
                downPointers.splice(index, 1);
            }

            index = holdPointers.indexOf(pointer);
            if (index >= 0) {
                isDown = true;
                holdPointers.splice(index, 1);
            }

            if (isDown && upPointers.indexOf(pointer) < 0) {
                inputCollecter.removePointer(pointer.event!.pointerId);
                upPointers.push(pointer);

                if (isCancel) {
                    inputCollecter.onPointerCancel.dispatch(pointer, inputCollecter.onPointerCancel);
                }
                else {
                    inputCollecter.onPointerUp.dispatch(pointer, inputCollecter.onPointerUp);
                }

                return true;
            }

            return false;
        }

        private _removeMouseEvent() {
            const canvas = this._canvas;
            canvas.removeEventListener("mouseover", this._onMouseEvent);
            canvas.removeEventListener("mouseenter", this._onMouseEvent);
            canvas.removeEventListener("mousedown", this._onMouseEvent);
            window.removeEventListener("mousemove", this._onMouseEvent);
            window.removeEventListener("mouseup", this._onMouseEvent);
            canvas.removeEventListener("mouseout", this._onMouseEvent);
            canvas.removeEventListener("mouseleave", this._onMouseEvent);
        }

        private _onPointerEvent = (event: PointerEvent) => {
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            const rotated = stage.rotated;
            const canvas = this._canvas;
            const downPointers = inputCollecter._downPointers;
            const holdPointers = inputCollecter._holdPointers;
            const pointer = inputCollecter.getPointer(event.pointerId);
            const prevEvent = pointer.event;
            pointer.event = event;

            pointer.position.set(event.clientX - (canvas.offsetLeft || 0.0), event.clientY - (canvas.offsetTop || 0.0), 0.0);

            if (rotated) {
                pointer.position.x += stage.screenSize.w;
            }

            stage.screenToStage(pointer.position, pointer.position);

            switch (event.type) {
                case "pointerover":
                    if (holdPointers.length > 0 && event.buttons === PointerButtonsType.None) {
                        this._pointerUp(pointer, true);
                    }

                    inputCollecter.onPointerOver.dispatch(pointer, inputCollecter.onPointerOver);
                    event.preventDefault();
                    break;

                case "pointerenter":
                    inputCollecter.onPointerEnter.dispatch(pointer, inputCollecter.onPointerEnter);
                    event.preventDefault();
                    break;

                case "pointerdown":
                    if (downPointers.indexOf(pointer) < 0 && holdPointers.indexOf(pointer) < 0) { // TODO
                        pointer.downPosition.copy(pointer.position);
                        downPointers.push(pointer);
                        holdPointers.push(pointer);
                        inputCollecter.onPointerDown.dispatch(pointer, inputCollecter.onPointerDown);
                        event.preventDefault();
                    }
                    break;

                case "pointermove":
                    if (event.target === canvas || holdPointers.length > 0) {
                        inputCollecter.onPointerMove.dispatch(pointer, inputCollecter.onPointerMove);
                        event.preventDefault();
                    }
                    else {
                        pointer.event = prevEvent;
                    }
                    break;

                case "pointerup":
                    if (!this._pointerUp(pointer, false)) {
                        pointer.event = prevEvent;
                        event.preventDefault();
                    }
                    break;

                case "pointercancel":
                    if (!this._pointerUp(pointer, true)) {
                        pointer.event = prevEvent;
                        event.preventDefault();
                    }
                    break;

                case "pointerout":
                    inputCollecter.onPointerOut.dispatch(pointer, inputCollecter.onPointerOut);
                    event.preventDefault();
                    break;

                case "pointerleave":
                    inputCollecter.onPointerLeave.dispatch(pointer, inputCollecter.onPointerLeave);
                    event.preventDefault();
                    break;
            }
        }

        private _onMouseWheelEvent = (event: PointerEvent) => {
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            if (event.detail) {
                inputCollecter.mouseWheel = -1 * event.detail;
            }
            else if ((event as any).wheelDelta) {
                inputCollecter.mouseWheel = (event as any).wheelDelta / 120;
            }
            else {
                inputCollecter.mouseWheel = 0;
            }

            inputCollecter.onMouseWheel.dispatch(this);

            event.preventDefault();
        }

        private _onMouseEvent = (event: MouseEvent) => {
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            (event as any).isPrimary = true;
            (event as any).pointerId = 1;
            (event as any).pressure = 0;
            (event as any).tangentialPressure = 0;
            (event as any).twist = 0;
            (event as any).width = 1;
            (event as any).height = 1;
            (event as any).tiltX = 0;
            (event as any).tiltY = 0;
            (event as any).pointerType = "mouse";

            const rotated = stage.rotated;
            const pointerEvent = event as PointerEvent;
            const canvas = this._canvas;
            const downPointers = inputCollecter._downPointers;
            const holdPointers = inputCollecter._holdPointers;
            const pointer = inputCollecter.getPointer(pointerEvent.pointerId);
            const prevEvent = pointer.event;
            pointer.event = pointerEvent;

            pointer.position.set(event.clientX - (canvas.offsetLeft || 0.0), event.clientY - (canvas.offsetTop || 0.0), 0.0);

            if (rotated) {
                pointer.position.x += stage.screenSize.w;
            }

            stage.screenToStage(pointer.position, pointer.position);

            switch (event.type) {
                case "mouseover":
                    if (holdPointers.length > 0 && event.buttons === PointerButtonsType.None) {
                        (event as any).type = "pointerup";
                        this._pointerUp(pointer, true);
                    }

                    (event as any).type = "pointerover";
                    inputCollecter.onPointerOver.dispatch(pointer, inputCollecter.onPointerOver);
                    event.preventDefault();
                    break;

                case "mouseenter":
                    (event as any).type = "pointerenter";
                    inputCollecter.onPointerEnter.dispatch(pointer, inputCollecter.onPointerEnter);
                    event.preventDefault();
                    break;

                case "mousedown":
                    if (downPointers.indexOf(pointer) < 0 && holdPointers.indexOf(pointer) < 0) { // TODO
                        pointer.downPosition.copy(pointer.position);
                        downPointers.push(pointer);
                        holdPointers.push(pointer);
                        (event as any).type = "pointerdown";
                        inputCollecter.onPointerDown.dispatch(pointer, inputCollecter.onPointerDown);
                        event.preventDefault();
                    }
                    break;

                case "mousemove":
                    if (event.target === canvas || holdPointers.length > 0) {
                        (event as any).type = "pointermove";
                        inputCollecter.onPointerMove.dispatch(pointer, inputCollecter.onPointerMove);
                        event.preventDefault();
                    }
                    else {
                        pointer.event = prevEvent;
                    }
                    break;

                case "mouseup":
                    (event as any).type = "pointerup";
                    if (!this._pointerUp(pointer, false)) {
                        pointer.event = prevEvent;
                        event.preventDefault();
                    }
                    break;

                case "mousecancel":
                    (event as any).type = "pointercancel";
                    if (!this._pointerUp(pointer, true)) {
                        pointer.event = prevEvent;
                        event.preventDefault();
                    }
                    break;

                case "mouseout":
                    (event as any).type = "pointerout";
                    inputCollecter.onPointerOut.dispatch(pointer, inputCollecter.onPointerOut);
                    event.preventDefault();
                    break;

                case "mouseleave":
                    (event as any).type = "pointerleave";
                    inputCollecter.onPointerLeave.dispatch(pointer, inputCollecter.onPointerLeave);
                    event.preventDefault();
                    break;
            }
        }

        private _onTouchEvent = (event: TouchEvent) => {
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            if (!this._hasTouch) {
                this._hasTouch = true;
                this._removeMouseEvent(); // TODO 同时支持 mouse 和 touch.
            }

            const touch = event.changedTouches[0];

            if (!touch) {
                // WX BUG.
                console.error("WX touch error.", event.type);
                return;
            }

            (event as any).isPrimary = true; // TODO
            (event as any).pointerId = touch.identifier + 2;
            (event as any).pressure = (touch as any).force || 0.5; // TODO egret build bug
            (event as any).tangentialPressure = 0;
            (event as any).twist = 0;
            (event as any).width = ((touch as any).radiusX || 0) * 2; // TODO egret build bug
            (event as any).height = ((touch as any).radiusY || 0) * 2; // TODO egret build bug
            (event as any).tiltX = 0;
            (event as any).tiltY = 0;
            (event as any).pointerType = "touch";

            (event as any).button = 0;
            (event as any).buttons = (event.type === "touchstart" || event.type === "touchmove") ? 1 : 0;

            (event as any).clientX = touch.clientX;
            (event as any).clientY = touch.clientY;
            (event as any).pageX = touch.pageX;
            (event as any).pageY = touch.pageY;
            (event as any).screenX = touch.screenX;
            (event as any).screenY = touch.screenY;

            const rotated = stage.rotated;
            const pointerEvent = <any>event as PointerEvent;
            const canvas = this._canvas;
            const downPointers = inputCollecter._downPointers;
            const holdPointers = inputCollecter._holdPointers;
            const pointer = inputCollecter.getPointer(pointerEvent.pointerId);
            const prevEvent = pointer.event;
            pointer.event = pointerEvent;

            pointer.position.set(pointerEvent.clientX - (canvas.offsetLeft || 0.0), pointerEvent.clientY - (canvas.offsetTop || 0.0), 0.0);

            if (rotated) {
                pointer.position.x += stage.screenSize.w;
            }

            stage.screenToStage(pointer.position, pointer.position);

            switch (event.type) {
                case "touchstart":
                    if (downPointers.indexOf(pointer) < 0 && holdPointers.indexOf(pointer) < 0) { // TODO
                        pointer.downPosition.copy(pointer.position);
                        downPointers.push(pointer);
                        holdPointers.push(pointer);
                        (event as any).type = "pointerdown";
                        inputCollecter.onPointerDown.dispatch(pointer, inputCollecter.onPointerDown);
                        event.preventDefault();
                    }
                    break;

                case "touchmove":
                    if (event.target === canvas || holdPointers.length > 0) {
                        (event as any).type = "pointermove";
                        inputCollecter.onPointerMove.dispatch(pointer, inputCollecter.onPointerMove);

                        for (let i = 0, l = event.targetTouches.length; i < l; ++i) {
                            const eachTouch = event.targetTouches[i];
                            if (eachTouch !== touch) {
                                const eachPointer = inputCollecter.getPointer(eachTouch.identifier + 2);
                                const eachPointerEvent = eachPointer.event!;

                                (eachPointerEvent as any).pressure = (eachTouch as any).force || 0.5; // TODO egret build bug
                                (eachPointerEvent as any).width = ((eachTouch as any).radiusX || 0) * 2; // TODO egret build bug
                                (eachPointerEvent as any).height = ((eachTouch as any).radiusY || 0) * 2; // TODO egret build bug

                                (eachPointerEvent as any).clientX = eachTouch.clientX;
                                (eachPointerEvent as any).clientY = eachTouch.clientY;
                                (eachPointerEvent as any).pageX = eachTouch.pageX;
                                (eachPointerEvent as any).pageY = eachTouch.pageY;
                                (eachPointerEvent as any).screenX = eachTouch.screenX;
                                (eachPointerEvent as any).screenY = eachTouch.screenY;
                                (eachPointerEvent as any).type = "pointermove";

                                eachPointer.position.set(eachPointerEvent.clientX - (canvas.offsetLeft || 0.0), eachPointerEvent.clientY - (canvas.offsetTop || 0.0), 0.0);

                                if (rotated) {
                                    eachPointer.position.x += stage.screenSize.w;
                                }

                                stage.screenToStage(eachPointer.position, eachPointer.position);
                                inputCollecter.onPointerMove.dispatch(eachPointer, inputCollecter.onPointerMove);
                            }
                        }

                        event.preventDefault();
                    }
                    else {
                        pointer.event = prevEvent;
                    }
                    break;

                case "touchend":
                    (event as any).type = "pointerup";
                    if (!this._pointerUp(pointer, false)) {
                        pointer.event = prevEvent;
                        event.preventDefault();
                    }
                    break;

                case "touchcancel":
                    (event as any).type = "pointercancel";
                    if (!this._pointerUp(pointer, true)) {
                        pointer.event = prevEvent;
                        event.preventDefault();
                    }
                    break;
            }
        }

        private _onContextMenu = (event: Event) => {
            if (
                inputCollecter._downPointers.length > 0 ||
                inputCollecter._holdPointers.length > 0 ||
                inputCollecter._upPointers.length > 0
            ) {
                event.preventDefault();
            }
        }

        private _onKeyEvent = (event: KeyboardEvent) => {
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            const downKeys = inputCollecter._downKeys;
            const holdKeys = inputCollecter._holdKeys;
            const upKeys = inputCollecter._upKeys;
            const key = inputCollecter.getKey(event.code as KeyCode);
            key.event = event;

            switch (event.type) {
                case "keydown":
                    if (downKeys.indexOf(key) < 0 && holdKeys.indexOf(key) < 0) {
                        downKeys.push(key);
                        holdKeys.push(key);
                        inputCollecter.onKeyDown.dispatch(key, inputCollecter.onKeyDown);
                    }
                    break;

                case "keyup": {
                    let isDown = false;
                    let index = downKeys.indexOf(key);
                    if (index >= 0) {
                        isDown = true;
                        downKeys.splice(index, 1);
                    }

                    index = holdKeys.indexOf(key);
                    if (index >= 0) {
                        isDown = true;
                        holdKeys.splice(index, 1);
                    }

                    if (isDown && upKeys.indexOf(key) < 0) {
                        upKeys.push(key);
                        inputCollecter.onKeyUp.dispatch(key, inputCollecter.onKeyUp);
                    }
                    break;
                }
            }
        }

        public onAwake(config: RunEgretOptions) {
            this._canvas = config.canvas!;
        }

        public onEnable() {
            const canvas = this._canvas;

            // if ((window as any).PointerEvent) { // TODO 会无故触发 pointercancel （PVP 项目）
            //     Pointer events.
            //     canvas.addEventListener("pointerover", this._onPointerEvent);
            //     canvas.addEventListener("pointerenter", this._onPointerEvent);
            //     canvas.addEventListener("pointerdown", this._onPointerEvent);
            //     window.addEventListener("pointermove", this._onPointerEvent);
            //     window.addEventListener("pointerup", this._onPointerEvent);
            //     canvas.addEventListener("pointercancel", this._onPointerEvent);
            //     canvas.addEventListener("pointerout", this._onPointerEvent);
            //     canvas.addEventListener("pointerleave", this._onPointerEvent);
            // }
            // else {
            // Mouse events.
            if (!this._hasTouch) {
                canvas.addEventListener("mousedown", this._onMouseEvent);
                canvas.addEventListener("mouseover", this._onMouseEvent);
                canvas.addEventListener("mouseenter", this._onMouseEvent);
                window.addEventListener("mousemove", this._onMouseEvent);
                window.addEventListener("mouseup", this._onMouseEvent);
                canvas.addEventListener("mouseout", this._onMouseEvent);
                canvas.addEventListener("mouseleave", this._onMouseEvent);
            }
            // Touch events.
            canvas.addEventListener("touchstart", this._onTouchEvent);
            canvas.addEventListener("touchmove", this._onTouchEvent);
            canvas.addEventListener("touchend", this._onTouchEvent);
            window.addEventListener("touchcancel", this._onTouchEvent);
            // }
            // Context menu event.
            window.addEventListener("contextmenu", this._onContextMenu);
            // Mouse wheel event.
            canvas.addEventListener("mousewheel", this._onMouseWheelEvent as any);
            // Key events.
            window.addEventListener("keydown", this._onKeyEvent);
            window.addEventListener("keyup", this._onKeyEvent);
        }

        public onDisable() {
            const canvas = this._canvas;

            // Pointer events.
            canvas.removeEventListener("pointerover", this._onPointerEvent);
            canvas.removeEventListener("pointerenter", this._onPointerEvent);
            canvas.removeEventListener("pointerdown", this._onPointerEvent);
            window.removeEventListener("pointermove", this._onPointerEvent);
            window.removeEventListener("pointerup", this._onPointerEvent);
            canvas.removeEventListener("pointercancel", this._onPointerEvent);
            canvas.removeEventListener("pointerout", this._onPointerEvent);
            canvas.removeEventListener("pointerleave", this._onPointerEvent);
            // Mouse events.
            this._removeMouseEvent();
            // Touch events.
            canvas.removeEventListener("touchstart", this._onTouchEvent);
            canvas.removeEventListener("touchmove", this._onTouchEvent);
            canvas.removeEventListener("touchend", this._onTouchEvent);
            window.removeEventListener("touchcancel", this._onTouchEvent);
            // Context menu event.
            window.removeEventListener("contextmenu", this._onContextMenu);
            // Mouse wheel event.
            canvas.removeEventListener("mousewheel", this._onMouseWheelEvent as any);
            // Key events.
            window.removeEventListener("keydown", this._onKeyEvent);
            window.removeEventListener("keyup", this._onKeyEvent);
            inputCollecter.clear();
        }

        public onUpdate(deltaTime: number) {
            if (inputCollecter.isActiveAndEnabled) {
                inputCollecter.update(deltaTime).clear();
            }
        }
    }
}
