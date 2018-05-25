namespace paper {

    export class Time {

        public static timeScale: number = 1.0;

        private static _frameCount: number = 0;
        private static _lastTimer: number = 0.0;
        private static _beginTimer: number = 0.0;
        private static _unscaledTime: number = 0.0;
        private static _unscaledDeltaTime: number = 0.0;


        public static initialize(): void {
            this._lastTimer = this._beginTimer = this.now;
        }


        public static update(timer?: number): void {
            const now = timer || this.now;
            this._frameCount += 1;
            this._unscaledTime = now - this._beginTimer;
            this._unscaledDeltaTime = now - this._lastTimer;
            this._lastTimer = now;
        }


        public static get now(): number {
            if (window.performance) {
                return window.performance.now() * 0.001;
            }
            else if (Date.now) {
                return Date.now() * 0.001;
            }

            return new Date().getTime() * 0.001;
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
