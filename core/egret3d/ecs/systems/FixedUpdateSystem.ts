namespace paper {
    /**
     * 固定更新系统。
     * TODO
     */
    export class FixedUpdateSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onUpdate() {
            let currentTimes = 0;
            let fixedTime = this._clock.fixedTime;
            const totalTimes = Math.min(Math.floor(fixedTime / this._clock.fixedDeltaTime), this._clock.maxFixedSubSteps);
            const components = this._groups[0].components as ReadonlyArray<paper.Behaviour>;

            while (fixedTime >= this._clock.fixedDeltaTime && currentTimes++ < this._clock.maxFixedSubSteps) {
                for (const component of components) {
                    if (component) {
                        component.onFixedUpdate && component.onFixedUpdate(currentTimes, totalTimes);
                    }
                }

                fixedTime -= this._clock.fixedDeltaTime;
            }
        }
    }
}