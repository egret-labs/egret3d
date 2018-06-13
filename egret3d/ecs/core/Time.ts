namespace paper {

    export class Time {

        public static maxFixedSubSteps: number = 3;
        public static timeScale = 1.0;
        public static fixedTimeStep: number = 1 / 30.0;

        private static _frameCount = 0;
        private static _lastTimer = 0.0;
        private static _beginTimer = 0.0;
        private static _unscaledTime = 0.0;
        private static _unscaledDeltaTime = 0.0;

        public static initialize() {
            this._lastTimer = this._beginTimer = Date.now() * 0.001;
        }

        public static update(timer?: number) {
            const now = timer || Date.now() * 0.001;
            this._frameCount += 1;
            this._unscaledTime = now - this._beginTimer;
            this._unscaledDeltaTime = now - this._lastTimer;
            this._lastTimer = now;
        }

        public static get frameCount() {
            return this._frameCount;
        }

        public static get time() {
            return this._unscaledTime * this.timeScale;
        }

        public static get unscaledTime() {
            return this._unscaledTime;
        }

        public static get deltaTime() {
            return this._unscaledDeltaTime * this.timeScale;
        }

        public static get unscaledDeltaTime() {
            return this._unscaledDeltaTime;
        }
    }
}
