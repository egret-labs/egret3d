namespace paper {
    /**
     * 固定更新系统。
     * TODO
     */
    export class FixedUpdateSystem extends BaseSystem {
        public readonly interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onUpdate() {
            const clock = this.clock;
            let currentTimes = 0;
            let fixedTime = clock.fixedTime;
            const totalTimes = Math.min(Math.floor(fixedTime / clock.fixedDeltaTime), clock.maxFixedSubSteps);
            const components = this.groups[0].components as ReadonlyArray<paper.Behaviour>;

            while (fixedTime >= clock.fixedDeltaTime && currentTimes++ < clock.maxFixedSubSteps) {
                for (const component of components) {
                    if (component) {
                        component.onFixedUpdate && component.onFixedUpdate(currentTimes, totalTimes);
                    }
                }

                fixedTime -= clock.fixedDeltaTime;
            }
        }
    }
}