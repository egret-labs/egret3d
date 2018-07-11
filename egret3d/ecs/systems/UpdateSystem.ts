namespace paper {
    /**
     * 
     */
    export class UpdateSystem extends BaseSystem<Behaviour> {
        public onUpdate(deltaTime: number) {
            const components = (Application.systemManager.getSystem(StartSystem) as StartSystem).components;

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
