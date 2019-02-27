namespace paper {

    export interface ClockUpdateFlags {
        frameCount: number;
        tickCount: number;
    }

    /**
     * 全局时钟信息组件。
     */
    export class Clock extends Component {
        /**
         * 逻辑帧补偿速度
         */
        public tickCompensateSpeed: uint = 3;
        /**
         * 逻辑帧时间(秒), 例如设置为 1.0 / 60.0 为每秒 60 帧
         */
        public tickInterval: number = 1.0 / 60.0;
        /**
         * 渲染帧时间(秒), 例如设置为 1.0 / 60.0 为每秒 60 帧
         */
        public frameInterval: number = 1.0 / 60.0;
        /**
         * 运行倍速
         * 
         * 为了保证平滑的效果, 不会影响逻辑/渲染帧频
         */
        public timeScale: number = 1.0;

        /**
         * 程序启动后运行的总渲染帧数 
         */
        private _frameCount: uint = 0;
        /**
         * 程序启动后运行的总逻辑帧数 
         */
        private _tickCount: uint = 0;
        private _beginTime: number = 0.0;
        private _unscaledTime: number = 0.0;
        private _unscaledDeltaTime: number = 0.0;
        private _fixedTime: number = 0.0;

        private _needReset: boolean = false;
        private _unusedFrameDelta: number = 0.0;
        private _unusedTickDelta: number = 0.0;

        public initialize() {
            super.initialize();

            (Time as Clock) = (clock as Clock) = this;
            this._beginTime = performance.now() * 0.001;
        }
        /**
         * @internal
         * @returns 此次生成的渲染帧和逻辑帧数量, @see `ClockResult`
         */
        public update(time?: number): ClockUpdateFlags {
            const now = (time || performance.now()) * 0.001;

            if (this._needReset) { // 刚刚恢复, 需要重置间隔
                this._unscaledTime = now - this._beginTime;
                this._unscaledDeltaTime = 0;
                this._needReset = false;
            } else { // 计算和上此的间隔
                const lastTime = this._unscaledTime;
                this._unscaledTime = now - this._beginTime;
                this._unscaledDeltaTime = this._unscaledTime - lastTime;
            }

            const returnValue: ClockUpdateFlags = { frameCount: 0, tickCount: 0 };

            // if (this.tickInterval < this.frameInterval) { // 逻辑值的执行频率不能低于渲染帧。
            //     this.tickInterval = this.frameInterval;
            // }

            // 判断是否够一个逻辑帧
            if (this.tickInterval) {
                this._unusedTickDelta += this._unscaledDeltaTime;
                if (this._unusedTickDelta >= this.tickInterval) {
                    // 逻辑帧需要补帧, 最多一次补 `this.maxFixedSubSteps` 帧
                    while (this._unusedTickDelta >= this.tickInterval && returnValue.tickCount < this.tickCompensateSpeed) {
                        this._unusedTickDelta -= this.tickInterval;
                        returnValue.tickCount++;
                        this._tickCount++;
                    }
                }
            } else { // tickInterval 未设置或者其值为零, 则表示跟随浏览器的帧率
                returnValue.tickCount = 1;
                this._tickCount++;
            }

            // 判断渲染帧
            if (this.frameInterval) { // 确保执行过一次逻辑帧之后再执行第一次渲染
                this._unusedFrameDelta += this._unscaledDeltaTime;
                if (this._unusedFrameDelta >= this.frameInterval) {
                    // 渲染帧不需要补帧
                    this._unusedFrameDelta = this._unusedFrameDelta % this.frameInterval;
                    returnValue.frameCount = 1;
                    this._frameCount++;
                }
            } else { // frameInterval 未设置或者其值为零, 则表示跟随浏览器的帧率
                returnValue.frameCount = 1;
                this._frameCount++;
            }

            return returnValue;
        }

        /**
         * 程序启动后运行的总渲染帧数
         */
        public get frameCount(): uint {
            return this._frameCount;
        }
        /**
         * 程序启动后运行的总逻辑帧数
         */
        public get tickCount(): uint {
            return this._tickCount;
        }
        /**
         * 系统时间(毫秒)
         */
        public get now(): uint {
            if (Date.now) {
                return Date.now();
            }

            return new Date().getTime();
        }
        /**
         * 从程序开始运行时的累计时间(秒)
         */
        public get time(): number {
            return this._unscaledTime * this.timeScale;
        }
        /**
         * 
         */
        public get fixedTime(): number {
            return this._fixedTime;
        }
        /**
         * 此次逻辑帧的时长
         */
        public get lastTickDelta(): number {
            return (this.tickInterval || this._unscaledDeltaTime) * this.timeScale;
        }
        /**
         * 此次渲染帧的时长
         */
        public get lastFrameDelta(): number {
            return this._unscaledDeltaTime * this.timeScale;
        }
        /**
         * 
         */
        public get unscaledTime(): number {
            return this._unscaledTime;
        }
        /**
         * 
         */
        public get unscaledDeltaTime(): number {
            return this._unscaledDeltaTime;
        }
        /**
         * reset
         */
        public reset(): void {
            this._needReset = true;
        }
    }
    /**
     * 全局时钟信息组件实例。
     */
    export const clock: Clock = null!;
}
