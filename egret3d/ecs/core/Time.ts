namespace paper {
    /**
     * 
     */
    export class Clock extends SingletonComponent {
        public maxFixedSubSteps: number = 3;
        public fixedTimeStep: number = 1.0 / 30.0;
        public timeScale = 1.0;

        private _frameCount: number = 0;
        private _beginTime: number = 0.0;
        private _lastTime: number = 0.0;
        private _unscaledTime: number = 0.0;
        private _unscaledDeltaTime: number = 0.0;
        /**
         * @internal
         */
        public _fixedTime: number = 0.0;

        public initialize() {
            super.initialize();

            this._lastTime = this._beginTime = Date.now() * 0.001;
        }
        /**
         * @internal
         */
        public update(time?: number) {
            const now = time || Date.now() * 0.001;
            this._frameCount += 1;
            this._unscaledTime = now - this._beginTime;
            this._unscaledDeltaTime = now - this._lastTime;
            this._lastTime = now;

            this._fixedTime += this._unscaledDeltaTime;
        }

        public get frameCount() {
            return this._frameCount;
        }

        public get time() {
            return this._unscaledTime * this.timeScale;
        }

        public get deltaTime() {
            return this._unscaledDeltaTime * this.timeScale;
        }

        public get unscaledTime() {
            return this._unscaledTime;
        }

        public get unscaledDeltaTime() {
            return this._unscaledDeltaTime;
        }
    }

    /**
     * 
     */
    export let Time: Clock;
}
