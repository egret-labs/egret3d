namespace paper {
    /**
     * 
     */
    export class LaterSystem extends paper.BaseSystem<paper.BaseComponent> {
        private readonly _laterCalls: (() => void)[] = [];
        /**
         * @inheritDoc
         */
        public update() {
            egret.ticker.update(); // TODO 帧频

            if (this._laterCalls.length > 0) {
                for (const callback of this._laterCalls) {
                    callback();
                }

                this._laterCalls.length = 0;
            }
        }
        /**
         * 
         */
        public callLater(callback: () => void): void {
            this._laterCalls.push(callback);
        }
    }
}
