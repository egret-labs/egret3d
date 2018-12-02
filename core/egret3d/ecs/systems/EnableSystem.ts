namespace paper {
    /**
     * @internal
     */
    export class EnableSystem extends BaseSystem {
        public readonly interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onAddComponent(component: Behaviour) {
            if (!component) {
                return;
            }

            if (Application.playerMode === PlayerMode.Editor) {
                if (!(component.constructor as IComponentClass<Behaviour>).executeInEditMode) {
                    return;
                }

                if (!component._isReseted) {
                    component._isReseted = true;
                    component.onReset && component.onReset();
                }
            }

            component.onEnable && component.onEnable();
        }
    }
}