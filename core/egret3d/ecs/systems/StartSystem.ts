namespace paper {
    /**
     * @internal
     */
    export class StartSystem extends BaseSystem {
        public readonly interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onAddComponent(component: Behaviour) {
            if (!component || component._isStarted) {
                return;
            }

            if (
                Application.playerMode === PlayerMode.Editor &&
                !(component.constructor as IComponentClass<Behaviour>).executeInEditMode
            ) {
                return;
            }

            component._isStarted = true;
            component.onStart && component.onStart();
        }
    }
}