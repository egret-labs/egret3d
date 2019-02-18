namespace paper {
    /**
     * 固定更新系统。
     * TODO
     */
    export class FixedUpdateSystem extends BaseSystem<GameObject> {

        public getMatchers() {
            return [
                Matcher.create<GameObject>().extraOf(Behaviour as any)
            ];
        }

        public onUpdate() {
            const clock = this.clock;
            let currentTimes = 0;
            let fixedTime = clock.fixedTime;
            const totalTimes = Math.min(Math.floor(fixedTime / clock.fixedDeltaTime), clock.maxFixedSubSteps);
            const behaviours = this.groups[0].behaviours;

            while (fixedTime >= clock.fixedDeltaTime && currentTimes++ < clock.maxFixedSubSteps) {
                for (const behaviour of behaviours) {
                    if (!behaviour || (behaviour._lifeStates & ComponentLifeState.Started) === 0) {
                        continue;
                    }

                    behaviour.onFixedUpdate && behaviour.onFixedUpdate(currentTimes, totalTimes);
                }

                fixedTime -= clock.fixedDeltaTime;
            }
        }
    }
}
