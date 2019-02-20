namespace paper {
    /**
     * @internal
     */
    export class StartSystem extends BaseSystem<GameObject> {

        protected getMatchers() {
            return [
                Matcher.create<GameObject>().extraOf(Behaviour as any)
            ];
        }

        public onComponentAdded(component: Behaviour) {
            if (component._lifeStates & ComponentLifeState.Started) {
                return;
            }

            if (
                ECS.getInstance().playerMode === PlayerMode.Editor &&
                !(component.constructor as IComponentClass<Behaviour>).executeInEditMode
            ) {
                return;
            }

            component._lifeStates |= ComponentLifeState.Started;
            component.onStart && component.onStart();
        }
    }
}