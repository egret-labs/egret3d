namespace paper {
    /**
     * Late 更新系统。
     */
    export class LateUpdateSystem extends BaseSystem<GameObject> {

        private readonly _laterCalls: (() => void)[] = [];

        public getMatchers() {
            return [
                Matcher.create<GameObject>().extraOf(Behaviour as any)
            ];
        }

        public onUpdate(deltaTime: number) {
            for (const behaviour of this.groups[0].behaviours) {
                if (!behaviour || (behaviour._lifeStates & ComponentLifeState.Started) === 0) {
                    continue;
                }

                behaviour.onUpdate && behaviour.onUpdate(deltaTime);
            }

            //
            egret.ticker.update(); // TODO 帧频
            //
            const laterCalls = this._laterCalls;
            if (laterCalls.length > 0) {
                for (const callback of laterCalls) {
                    callback();
                }

                laterCalls.length = 0;
            }
        }
        /**
         * 在 `paper.Behaviour.onLateUpdate()` 生命周期之后回调指定方法。
         * @param callback 需要回调的方法。
         */
        public callLater(callback: () => void): void {
            this._laterCalls.push(callback);
        }
    }
}
