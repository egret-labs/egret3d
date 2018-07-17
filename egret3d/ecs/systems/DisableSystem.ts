namespace paper {
    /**
     * @internal
     */
    export class DisableSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onRemoveComponent(component: Behaviour) {
            if (!component) {
                return;
            }

            if (this._isEditorUpdate()) {
                if (_executeInEditModeComponents.indexOf(component.constructor as any) < 0) {
                    return;
                }
            }

            component.onDisable && component.onDisable();
        }
    }
}
