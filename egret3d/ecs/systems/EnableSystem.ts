namespace paper {
    /**
     * @internal
     */
    export class EnableSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onAddComponent(component: Behaviour) {
            if (!component) {
                return;
            }

            if (this._isEditorUpdate()) {
                if (!_executeInEditModeComponents[(component.constructor as ComponentClass<Behaviour>).index]) {
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