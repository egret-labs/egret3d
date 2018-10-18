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

            const downPointers = inputCollecter.downPointers;
            const holdPointers = inputCollecter.holdPointers;
            const upPointers = inputCollecter.upPointers;
            let index = holdPointers.indexOf(pointer);

            if (index >= 0) {
                holdPointers.splice(index, 1);
            }
            else {
                index = downPointers.indexOf(pointer);
            }

            if (index >= 0 && upPointers.indexOf(pointer) < 0) {
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

            const canvas = this._canvas;
            const downPointers = inputCollecter.downPointers;
            const holdPointers = inputCollecter.holdPointers;
            const pointer = inputCollecter.getPointer(event.pointerId);
            const prevEvent = pointer.event;
            pointer.event = event;

            // if (event.target !== canvas) {
            //     (event as any).clientX -= canvas.clientLeft;
            //     (event as any).clientY -= canvas.clientTop;
            // }

            pointer.position.set(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 0.0);
            stage.screenToStage(pointer.position, pointer.position);

            switch (event.type) {
                case "pointerover":
                    if (holdPointers.length > 0 && event.buttons === PointerButtonsType.None) {
                        this._pointerUp(pointer, true);
                    }

                    inputCollecter.onPointerOver.dispatch(pointer, inputCollecter.onPointerOver);
                    break;

                case "pointerenter":
                    inputCollecter.onPointerEnter.dispatch(pointer, inputCollecter.onPointerEnter);
                    break;

                case "pointerdown":
                    if (downPointers.indexOf(pointer) < 0 && holdPointers.indexOf(pointer) < 0) { // TODO
                        pointer.downPosition.copy(pointer.position);
                        downPointers.push(pointer);
                        inputCollecter.onPointerDown.dispatch(pointer, inputCollecter.onPointerDown);
                    }
                    break;

                case "pointermove":
                    if (event.target === canvas || holdPointers.length > 0) {
                        inputCollecter.onPointerMove.dispatch(pointer, inputCollecter.onPointerMove);
                    }
                    else {
                        pointer.event = prevEvent;
                    }
                    break;

                case "pointerup":
                    if (!this._pointerUp(pointer, false)) {
                        pointer.event = prevEvent;
                    }
                    break;

                case "pointercancel":
                    if (!this._pointerUp(pointer, true)) {
                        pointer.event = prevEvent;
                    }
                    break;

                case "pointerout":
                    inputCollecter.onPointerOut.dispatch(pointer, inputCollecter.onPointerOut);
                    break;

                case "pointerleave":
                    inputCollecter.onPointerLeave.dispatch(pointer, inputCollecter.onPointerLeave);
                    break;
            }

            // event.preventDefault();
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

            const pointerEvent = event as PointerEvent;
            const canvas = this._canvas;
            const downPointers = inputCollecter.downPointers;
            const holdPointers = inputCollecter.holdPointers;
            const pointer = inputCollecter.getPointer(pointerEvent.pointerId);
            const prevEvent = pointer.event;
            pointer.event = pointerEvent;

            // if (event.target !== canvas) {
            //     (pointerEvent as any).clientX -= canvas.clientLeft;
            //     (pointerEvent as any).clientY -= canvas.clientTop;
            // }

            pointer.position.set(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop, 0.0);
            stage.screenToStage(pointer.position, pointer.position);

            switch (event.type) {
                case "mouseover":
                    if (holdPointers.length > 0 && event.buttons === PointerButtonsType.None) {
                        (event as any).type = "pointerup";
                        this._pointerUp(pointer, true);
                    }
                    
                    (event as any).type = "pointerover";
                    inputCollecter.onPointerOver.dispatch(pointer, inputCollecter.onPointerOver);
                    break;

                case "mouseenter":
                    (event as any).type = "pointerenter";
                    inputCollecter.onPointerEnter.dispatch(pointer, inputCollecter.onPointerEnter);
                    break;

                case "mousedown":
                    if (downPointers.indexOf(pointer) < 0 && holdPointers.indexOf(pointer) < 0) { // TODO
                        pointer.downPosition.copy(pointer.position);
                        downPointers.push(pointer);
                        (event as any).type = "pointerdown";
                        inputCollecter.onPointerDown.dispatch(pointer, inputCollecter.onPointerDown);
                    }
                    break;

                case "mousemove":
                    if (event.target === canvas || holdPointers.length > 0) {
                        (event as any).type = "pointermove";
                        inputCollecter.onPointerMove.dispatch(pointer, inputCollecter.onPointerMove);
                    }
                    else {
                        pointer.event = prevEvent;
                    }
                    break;

                case "mouseup":
                    (event as any).type = "pointerup";
                    if (!this._pointerUp(pointer, false)) {
                        pointer.event = prevEvent;
                    }
                    break;

                case "mousecancel":
                    (event as any).type = "pointercancel";
                    if (!this._pointerUp(pointer, true)) {
                        pointer.event = prevEvent;
                    }
                    break;

                case "mouseout":
                    (event as any).type = "pointerout";
                    inputCollecter.onPointerOut.dispatch(pointer, inputCollecter.onPointerOut);
                    break;

                case "mouseleave":
                    (event as any).type = "pointerleave";
                    inputCollecter.onPointerLeave.dispatch(pointer, inputCollecter.onPointerLeave);
                    break;
            }

            // event.preventDefault();
        }

        private _onTouchEvent = (event: TouchEvent) => {
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            if (!this._hasTouch) {
                this._hasTouch = true;
                this._removeMouseEvent();
            }

            const touch = event.changedTouches[0];

            (event as any).isPrimary = true; // TODO
            (event as any).pointerId = touch.identifier + 2;
            (event as any).pressure = touch.force || 0.5;
            (event as any).tangentialPressure = 0;
            (event as any).twist = 0;
            (event as any).width = (touch.radiusX || 0) * 2;
            (event as any).height = (touch.radiusY || 0) * 2;
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

            const pointerEvent = <any>event as PointerEvent;
            const canvas = this._canvas;
            const downPointers = inputCollecter.downPointers;
            const holdPointers = inputCollecter.holdPointers;
            const pointer = inputCollecter.getPointer(pointerEvent.pointerId);
            const prevEvent = pointer.event;
            pointer.event = pointerEvent;

            // if (event.target !== canvas) {
            //     (pointerEvent as any).clientX -= canvas.clientLeft;
            //     (pointerEvent as any).clientY -= canvas.clientTop;
            // }

            pointer.position.set(pointerEvent.clientX - canvas.offsetLeft, pointerEvent.clientY - canvas.offsetTop, 0.0);
            stage.screenToStage(pointer.position, pointer.position);

            switch (event.type) {
                case "touchstart":
                    if (downPointers.indexOf(pointer) < 0 && holdPointers.indexOf(pointer) < 0) { // TODO
                        pointer.downPosition.copy(pointer.position);
                        downPointers.push(pointer);
                        (event as any).type = "pointerdown";
                        inputCollecter.onPointerDown.dispatch(pointer, inputCollecter.onPointerDown);
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

                                (eachPointerEvent as any).pressure = eachTouch.force || 0.5;
                                (eachPointerEvent as any).width = (eachTouch.radiusX || 0) * 2;
                                (eachPointerEvent as any).height = (eachTouch.radiusY || 0) * 2;

                                (eachPointerEvent as any).clientX = eachTouch.clientX;
                                (eachPointerEvent as any).clientY = eachTouch.clientY;
                                (eachPointerEvent as any).pageX = eachTouch.pageX;
                                (eachPointerEvent as any).pageY = eachTouch.pageY;
                                (eachPointerEvent as any).screenX = eachTouch.screenX;
                                (eachPointerEvent as any).screenY = eachTouch.screenY;
                                (eachPointerEvent as any).type = "pointermove";

                                if (event.target !== canvas) {
                                    (eachPointerEvent as any).clientX -= canvas.clientLeft;
                                    (eachPointerEvent as any).clientY -= canvas.clientTop;
                                }

                                eachPointer.position.set(eachPointerEvent.clientX, eachPointerEvent.clientY, 0.0);
                                stage.screenToStage(eachPointer.position, eachPointer.position);
                                inputCollecter.onPointerMove.dispatch(eachPointer, inputCollecter.onPointerMove);
                            }
                        }
                    }
                    else {
                        pointer.event = prevEvent;
                    }
                    break;

                case "touchend":
                    (event as any).type = "pointerup";
                    if (!this._pointerUp(pointer, false)) {
                        pointer.event = prevEvent;
                    }
                    break;

                case "touchcancel":
                    (event as any).type = "pointercancel";
                    if (!this._pointerUp(pointer, true)) {
                        pointer.event = prevEvent;
                    }
                    break;
            }

            // event.preventDefault();
        }

        private _onContextMenu = (event: Event) => {
            if (
                inputCollecter.downPointers.length > 0 ||
                inputCollecter.holdPointers.length > 0 ||
                inputCollecter.upPointers.length > 0
            ) {
                event.preventDefault();
            }
        }

        private _onKeyEvent = (event: KeyboardEvent) => {
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            const downKeys = inputCollecter.downKeys;
            const holdKeys = inputCollecter.holdKeys;
            const upKeys = inputCollecter.upKeys;
            const key = inputCollecter.getKey(event.code);
            key.event = event;

            switch (event.type) {
                case "keydown":
                    if (downKeys.indexOf(key) < 0 && holdKeys.indexOf(key) < 0) {
                        downKeys.push(key);
                        inputCollecter.onKeyDown.dispatch(key, inputCollecter.onKeyDown);
                    }
                    break;

                case "keyup":
                    let index = downKeys.indexOf(key);
                    if (index >= 0) {
                        downKeys.splice(index, 1);
                    }
                    else {
                        index = holdKeys.indexOf(key);
                        if (index >= 0) {
                            holdKeys.splice(index, 1);
                        }
                    }

                    if (index >= 0 && upKeys.indexOf(key) < 0) {
                        upKeys.push(key);
                        inputCollecter.onKeyUp.dispatch(key, inputCollecter.onKeyUp);
                    }
                    break;
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
            canvas.addEventListener("mousewheel", this._onMouseWheelEvent);
            // Key events.
            window.addEventListener("keydown", this._onKeyEvent);
            window.addEventListener("keyup", this._onKeyEvent);
        }

        public onDisable() {
            const canvas = this._canvas;

            // if ((window as any).PointerEvent) {
            //     // Pointer events.
            //     canvas.removeEventListener("pointerover", this._onPointerEvent);
            //     canvas.removeEventListener("pointerenter", this._onPointerEvent);
            //     canvas.removeEventListener("pointerdown", this._onPointerEvent);
            //     window.removeEventListener("pointermove", this._onPointerEvent);
            //     window.removeEventListener("pointerup", this._onPointerEvent);
            //     canvas.removeEventListener("pointercancel", this._onPointerEvent);
            //     canvas.removeEventListener("pointerout", this._onPointerEvent);
            //     canvas.removeEventListener("pointerleave", this._onPointerEvent);
            // }
            // else {
            // Mouse events.
            this._removeMouseEvent();
            // Touch events.
            canvas.removeEventListener("touchstart", this._onTouchEvent);
            canvas.removeEventListener("touchmove", this._onTouchEvent);
            canvas.removeEventListener("touchend", this._onTouchEvent);
            window.removeEventListener("touchcancel", this._onTouchEvent);
            // }
            // Context menu event.
            window.removeEventListener("contextmenu", this._onContextMenu);
            // Mouse wheel event.
            canvas.removeEventListener("mousewheel", this._onMouseWheelEvent);
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
