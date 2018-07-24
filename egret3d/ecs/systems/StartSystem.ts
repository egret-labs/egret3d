namespace paper {
    /**
     * @internal
     */
    export class StartSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onAddComponent(component: Behaviour) {
            if (!component || component._isStarted) {
                return;
            }

            if (this._isEditorUpdate()) {
                if (_executeInEditModeComponents.indexOf(component.constructor as any) < 0) {
                    return;
                }
            }

            component._isStarted = true;
            component.onStart && component.onStart();
        }
    }
}