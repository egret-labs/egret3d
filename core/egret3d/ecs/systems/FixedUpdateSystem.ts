namespace paper {
    /**
     * 固定更新系统。
     * TODO
     */
    export class FixedUpdateSystem extends BaseSystem<GameObject> {

        protected getMatchers() {
            return [
                Matcher.create<GameObject>().extraOf(Behaviour as any)
            ];
        }

        public onTick(delta?: float) {
            const behaviours = this.groups[0].behaviours;

            for (const behaviour of behaviours) {
                if (!behaviour || (behaviour._lifeStates & ComponentLifeState.Started) === 0) {
                    continue;
                }

                behaviour.onFixedUpdate && behaviour.onFixedUpdate(delta);
            }
        }
    }
}
