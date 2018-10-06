namespace egret3d.web {
    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem {
        private readonly _contactCollecter: ContactCollecter = paper.GameObject.globalGameObject.getOrAddComponent(ContactCollecter);
        private readonly _inputCollecter: InputCollecter = paper.GameObject.globalGameObject.getOrAddComponent(InputCollecter);
        private _canvas: HTMLCanvasElement = null!;

        private _onContextMenu = (event: Event) => {
            if (
                this._inputCollecter.downPointers.length > 0 ||
                this._inputCollecter.holdPointers.length > 0 ||
                this._inputCollecter.upPointers.length > 0
            ) {
                event.preventDefault();
            }
        }

        private _pointerUp(pointer: Pointer) {
            if (pointer.event.buttons !== PointerButtonsType.None) {
                return;
            }

            const inputCollecter = this._inputCollecter;
            const holdPointers = inputCollecter.holdPointers;
            const upPointers = inputCollecter.upPointers;
            const index = holdPointers.indexOf(pointer);
            
            if (index >= 0) {
                holdPointers.splice(index, 1);
            }

            if (upPointers.indexOf(pointer) < 0) {
                upPointers.push(pointer);
                inputCollecter.onPointerUp.dispatch(pointer);
            }
        }

        private _onWheelEvent = (event: PointerEvent) => {
            const inputCollecter = this._inputCollecter;
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            if (event.detail) {
                inputCollecter.wheel = -1 * event.detail;
            }
            else if ((event as any).wheelDelta) {
                inputCollecter.wheel = (event as any).wheelDelta / 120;
            }
            else {
                inputCollecter.wheel = 0;
            }
            // TODO
            // event.preventDefault();
        }

        private _onPointerEvent = (event: PointerEvent) => {
            const inputCollecter = this._inputCollecter;
            if (!inputCollecter.isActiveAndEnabled) {
                return;
            }

            const canvas = this._canvas;
            const downPointers = inputCollecter.downPointers;
            const holdPointers = inputCollecter.holdPointers;
            const pointer = inputCollecter.getPointer(event.pointerId);
            pointer.event = event;

            if (event.target === canvas) {
                pointer.position.set(event.clientX, event.clientY, 0.0);
            }
            else {
                pointer.position.set(event.clientX - canvas.clientLeft, event.clientY - canvas.clientTop, 0.0);
            }

            inputCollecter.screenToStage(pointer.position, pointer.position);

            switch (event.type) {
                case "pointerover":
                    if (holdPointers.length > 0 && event.buttons === PointerButtonsType.None) {
                        this._pointerUp(pointer);
                    }

                    inputCollecter.onPointerOver.dispatch(pointer);
                    break;

                case "pointerenter":
                    inputCollecter.onPointerEnter.dispatch(pointer);
                    break;

                case "pointerdown":
                    if (downPointers.indexOf(pointer) < 0 && holdPointers.indexOf(pointer) < 0) {
                        pointer.downPosition.copy(pointer.position);
                        downPointers.push(pointer);
                        inputCollecter.onPointerDown.dispatch(pointer);
                    }
                    break;

                case "pointermove":
                    if (event.target === canvas || holdPointers.length > 0) {
                        inputCollecter.onPointerMove.dispatch(pointer);
                    }
                    break;

                case "pointerup":
                    this._pointerUp(pointer);
                    break;

                case "pointercancel":
                    inputCollecter.onPointerCancel.dispatch(pointer);
                    break;

                case "pointerout":
                    inputCollecter.onPointerOut.dispatch(pointer);
                    break;

                case "pointerleave":
                    inputCollecter.onPointerLeave.dispatch(pointer);
                    break;

                case "gotpointercapture":
                    inputCollecter.onGotPointerCapture.dispatch(pointer);
                    break;

                case "lostpointercapture":
                    inputCollecter.onLostPointerCapture.dispatch(pointer);
                    break;
            }
            // TODO
            // event.preventDefault();
        }

        private _onKeyEvent = (event: KeyboardEvent) => {
            const inputCollecter = this._inputCollecter;
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
                        inputCollecter.onKeyDown.dispatch(key);
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
                        inputCollecter.onKeyUp.dispatch(key);
                    }
                    break;
            }
            // TODO
            // event.preventDefault();
        }

        public onAwake(config: RunEgretOptions) {
            const canvas = this._canvas = config.canvas!;
            canvas.addEventListener("wheel", this._onWheelEvent);
            canvas.addEventListener("pointerover", this._onPointerEvent);
            canvas.addEventListener("pointerenter", this._onPointerEvent);
            canvas.addEventListener("pointerdown", this._onPointerEvent);

            // Window event.
            window.addEventListener("contextmenu", this._onContextMenu);
            window.addEventListener("pointermove", this._onPointerEvent);
            window.addEventListener("pointerup", this._onPointerEvent);

            canvas.addEventListener("pointercancel", this._onPointerEvent);
            canvas.addEventListener("pointerout", this._onPointerEvent);
            canvas.addEventListener("pointerleave", this._onPointerEvent);
            canvas.addEventListener("gotpointercapture", this._onPointerEvent);
            canvas.addEventListener("lostpointercapture", this._onPointerEvent);

            // Window event.
            window.addEventListener("keydown", this._onKeyEvent);
            window.addEventListener("keyup", this._onKeyEvent);
        }

        public onUpdate(deltaTime: number) {
            const contactCollecter = this._contactCollecter;
            if (contactCollecter.isActiveAndEnabled) {
                this._contactCollecter.update(deltaTime);
            }

            const inputCollecter = this._inputCollecter;
            if (inputCollecter.isActiveAndEnabled) {
                inputCollecter.update(deltaTime);
            }

            //
            InputManager.update(deltaTime);
            //

            Performance.updateFPS();
            Performance.endCounter(egret3d.PerformanceType.All);
        }
    }
}
