namespace paper {
    /**
     * 
     */
    export class UpdateSystem extends BaseSystem {
        protected readonly _interests = [
            { componentClass: Behaviour as any, type: InterestType.Extends | InterestType.Unessential, isBehaviour: true }
        ];

        public onUpdate(deltaTime: number) {
            const components = this._groups[0].components as ReadonlyArray<Behaviour | null>;

            if (this._isEditorUpdate()) {
                for (const component of components) {
                    if (component && _executeInEditModeComponents.indexOf(component.constructor as any) >= 0) {
                        component.onUpdate && component.onUpdate(deltaTime);
                    }
                }
            }
            else {
                for (const component of components) {
                    if (component) {
                        component.onUpdate && component.onUpdate(deltaTime);
                    }
                }
            }
        }
    }
}
