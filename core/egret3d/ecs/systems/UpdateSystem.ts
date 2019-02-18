namespace paper {
    /**
     * 更新系统。
     */
    export class UpdateSystem extends BaseSystem<GameObject> {

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
        }
    }
}
