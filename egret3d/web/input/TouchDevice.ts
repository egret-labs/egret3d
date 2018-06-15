namespace egret3d {

    /**
     * touch phase type
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 触摸状态
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export enum TouchPhase {
        /**
         * touch began
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸开始
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        BEGAN,
        /**
         * touch moved
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸移动
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        MOVED,
        /**
         * touch stationary
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸静止
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        STATIONARY,
        /**
         * touch ended
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸结束
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        ENDED,
        /**
         * touch canceled
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 触摸取消
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        CANCELED
    }

    /**
     * touch point
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 触摸点信息
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class TouchPoint {

        public altitudeAngle:number = Math.PI / 2; // Value of 0 radians indicates that the stylus is parallel to the surface, pi/2 indicates that it is perpendicular.
        public azimuthAngle:number = 0; // Value of 0 radians indicates that the stylus is pointed along the x-axis of the device.
        public deltaPosition:Vector2 = new Vector2(); // The position delta since last change.
        // public deltaTime:number = 0; // TODO Amount of time that has passed since the last recorded change in Touch values.
        public fingerId:number = 0; // The unique index for the touch.
        public maximumPossiblePressure:number = 1.0; // The maximum possible pressure value for a platform. If Input.touchPressureSupported returns false, the value of this property will always be 1.0f.
        public phase:TouchPhase; //	Describes the phase of the touch.
        public position:Vector2 = new Vector2(); // The position of the touch in pixel coordinates.
        public pressure = 1.0; //	The current amount of pressure being applied to a touch. 1.0f is considered to be the pressure of an average touch. If Input.touchPressureSupported returns false, the value of this property will always be 1.0f.

        public radius:Vector2 = new Vector2(); // ADD: different from Unity
        // public radius:number = 0; // DELETE: An estimated value of the radius of a touch. Add radiusletiance to get the maximum touch size, subtract it to get the minimum touch size.
        // public radiusletiance:number = 0; // DELETE: The amount that the radius leties by for a touch.
        // public rawPosition:Vector2 = new Vector2(); // DELETE: The raw position used for the touch.

        // public tapCount:number = 0; // TODO Number of taps.
        public type:string = "Direct"; // A value that indicates whether a touch was of Direct, Indirect (or remote), or Stylus type.

        /**
         *  
         */
        public set(touch:any, phase:TouchPhase, device:TouchDevice) {
            this.altitudeAngle = touch.rotationAngle;
            this.azimuthAngle = touch.rotationAngle;

            if(phase == TouchPhase.BEGAN || phase == TouchPhase.STATIONARY) {
                this.deltaPosition.x = 0;
                this.deltaPosition.y = 0;
            } else {
                device.convertPosition(touch, this.deltaPosition);
                Vector2.subtract(this.deltaPosition, this.position, this.deltaPosition);
            }

            // this.deltaTime;
            this.fingerId = touch.identifier;
            this.phase = phase;
            device.convertPosition(touch, this.position);
            this.pressure = touch.force;
            this.radius.x = touch.radiusX;
            this.radius.y = touch.radiusY;
            // this.tapCount;
        }

        private static _pointPool:TouchPoint[] = [];

        /**
         *  
         */
        public static create():TouchPoint {
            return this._pointPool.pop() || new TouchPoint();
        }

        /**
         *  
         */
        public static release(touchPoint:TouchPoint) {
            this._pointPool.push(touchPoint);
        }

    }

    /**
     * touch input
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 触摸输入
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    export class TouchDevice extends EventDispatcher {

        private _offsetX:number = 0;
        private _offsetY:number = 0;
        private _scalerX:number = 1;
        private _scalerY:number = 1;
        /**
         *  
         */
        public updateOffsetAndScale(offsetX:number, offsetY:number, scalerX:number, scalerY:number) {
            this._offsetX = offsetX;
            this._offsetY = offsetY;
            this._scalerX = scalerX;
            this._scalerY = scalerY;
        }
        /**
         *  
         */
        public convertPosition(e:Touch, out:Vector2) {
            out.x = (e.clientX - this._offsetX) * this._scalerX;
            out.y = (e.clientY - this._offsetY) * this._scalerY;
        }

        private _touchesMap:{[key:number]:TouchPoint} = {};

        private _touches:TouchPoint[] = [];
        
        /**
         * touch count
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前触摸点的数量
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public touchCount = 0;

        private _startHandler:EventListener = this._handleTouchStart.bind(this);
        private _endHandler:EventListener = this._handleTouchEnd.bind(this);
        private _moveHandler:EventListener = this._handleTouchMove.bind(this);
        private _cancelHandler:EventListener = this._handleTouchCancel.bind(this);

        private _element: HTMLElement | null = null;

        private preventDefault: boolean;
        private stopPropagation: boolean;

        /**
         *  
         */
        constructor(element: HTMLElement, options: { preventDefault: boolean, stopPropagation: boolean } = { preventDefault: true, stopPropagation: true }) {
            super();
            this.attach(element);

            this.preventDefault = options.preventDefault;
            this.stopPropagation = options.stopPropagation;
        }

        private attach(element: HTMLElement) {
            if (this._element) {
                this.detach();
            }
            this._element = element;
            this._element.addEventListener('touchstart', this._startHandler, false);
            this._element.addEventListener('touchend', this._endHandler, false);
            this._element.addEventListener('touchmove', this._moveHandler, false);
            this._element.addEventListener('touchcancel', this._cancelHandler, false);
        }

        private detach() {
            if(!this._element) return;
            this._element.removeEventListener('touchstart', this._startHandler, false);
            this._element.removeEventListener('touchend', this._endHandler, false);
            this._element.removeEventListener('touchmove', this._moveHandler, false);
            this._element.removeEventListener('touchcancel', this._cancelHandler, false);
            this._element = null;
        }

        /**
         *  
         */
        public update() {
            for(let i in this._touchesMap) {
                let touch = this._touchesMap[i];

                if(touch.phase === TouchPhase.BEGAN) {
                    touch.phase = TouchPhase.STATIONARY;
                }

                if(touch.phase === TouchPhase.MOVED) {
                    touch.phase = TouchPhase.STATIONARY;
                }

                if(touch.phase === TouchPhase.ENDED || touch.phase === TouchPhase.CANCELED) {
                    delete this._touchesMap[i];
                    let index = this._touches.indexOf(touch);
                    if(index > -1) {
                        this._touches.splice(index, 1);
                    }
                    this.touchCount--;
                }
            }
        }

        /**
         * get touch point
         * @param index touch index
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 获取触摸点
         * @param index 触摸点的索引
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public getTouch(index:number):TouchPoint {
            return this._touches[index];
        }

        private _getTouch(identifier:number):TouchPoint {
            let touchPoint = this._touchesMap[identifier];
            if(!touchPoint) {
                touchPoint = TouchPoint.create();
                this._touchesMap[identifier] = touchPoint;
                this._touches.push(touchPoint);
                this.touchCount++;
            }

            return touchPoint;
        }

        private _handleTouchStart(event:TouchEvent) {
            // call preventDefault to avoid issues in Chrome Android:
            // http://wilsonpage.co.uk/touch-events-in-chrome-android/
            if (event["isScroll"] != true && !this._element['userTyping']) {
                event.preventDefault();
            }

            for(let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                let identifier = touch.identifier;
                let touchPoint = this._getTouch(identifier);

                touchPoint.set(touch, TouchPhase.BEGAN, this);

                this.dispatchEvent({type: "touchstart", x: touchPoint.position.x, y: touchPoint.position.y, identifier: identifier});
            }

            if (this.preventDefault) {
                event.preventDefault();
            }
            if (this.stopPropagation) {
                event.stopPropagation();
            }
        }

        private _handleTouchEnd(event:TouchEvent) {
            for(let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                let identifier = touch.identifier;
                let touchPoint = this._getTouch(identifier);

                touchPoint.set(touch, TouchPhase.ENDED, this);

                this.dispatchEvent({type: "touchend", x: touchPoint.position.x, y: touchPoint.position.y, identifier: identifier});
            }

            if (this.preventDefault) {
                event.preventDefault();
            }
            if (this.stopPropagation) {
                event.stopPropagation();
            }
        }

        private _handleTouchMove(event:TouchEvent) {
            // call preventDefault to avoid issues in Chrome Android:
            // http://wilsonpage.co.uk/touch-events-in-chrome-android/
            if (event["isScroll"] != true && !this._element['userTyping']) {
                event.preventDefault();
            }

            for(let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                let identifier = touch.identifier;
                let touchPoint = this._getTouch(identifier);

                touchPoint.set(touch, TouchPhase.MOVED, this);

                this.dispatchEvent({type: "touchmove", x: touchPoint.position.x, y: touchPoint.position.y, identifier: identifier});
            }

            if (this.preventDefault) {
                event.preventDefault();
            }
            if (this.stopPropagation) {
                event.stopPropagation();
            }
        }

        private _handleTouchCancel(event:TouchEvent) {
            for(let i = 0; i < event.changedTouches.length; i++) {
                let touch = event.changedTouches[i];
                let identifier = touch.identifier;
                let touchPoint = this._getTouch(identifier);

                touchPoint.set(touch, TouchPhase.CANCELED, this);

                this.dispatchEvent({type: "touchend", x: touchPoint.position.x, y: touchPoint.position.y, identifier: identifier});
            }

            if (this.preventDefault) {
                event.preventDefault();
            }
            if (this.stopPropagation) {
                event.stopPropagation();
            }
        }
    }

}