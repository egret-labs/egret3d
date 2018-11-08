namespace paper {
    /**
     * 全局时钟信息组件。
     */
    export class Clock extends SingletonComponent {
        public maxFixedSubSteps: uint = 3;
        public fixedDeltaTime: number = 1.0 / 50.0; // TODO same as fps.
        public timeScale = 1.0;

        private _frameCount: uint = 0;
        private _beginTime: number = 0.0;
        private _lastTime: number = 0.0;
        private _delayTime: number = 0.0;
        private _unscaledTime: number = 0.0;
        private _unscaledDeltaTime: number = 0.0;
        private _fixedTime: number = 0.0;

        public initialize() {
            super.initialize();
            Time = clock = this;
            this._beginTime = this.now * 0.001;
        }
        /**
         * @internal
         */
        public update(time?: number) {
            if (this._unscaledTime !== 0.0) {
                this._lastTime = this._unscaledTime;

                if (this._fixedTime < this.fixedDeltaTime) {
                }
                else if (this._fixedTime < this.fixedDeltaTime * this.maxFixedSubSteps) {
                    this._fixedTime %= this.fixedDeltaTime;
                }
                else {
                    this._fixedTime -= this.fixedDeltaTime * this.maxFixedSubSteps;
                }
            }

            const now = time || this.now * 0.001;
            this._frameCount += 1;
            this._unscaledTime = now - this._beginTime;
            this._unscaledDeltaTime = this._unscaledTime - this._lastTime;

            this._fixedTime += this._unscaledDeltaTime;
        }

        public get frameCount(): uint {
            return this._frameCount;
        }
        /**
         * 系统时间。（以毫秒为单位）
         */
        public get now(): uint {
            if (Date.now) {
                return Date.now();
            }

            return new Date().getTime();
        }
        /**
         * 从程序开始运行时的累计时间。（以秒为单位）
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
         * 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public get deltaTime(): number {
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
    }
    /**
     * 全局时钟信息组件实例。
     */
    export let clock: Clock = null!;

    /**
     * @deprecated 
     * @see paper.clock
     */
    export let Time: Clock = null!;
}
