namespace paper {
    /**
     * 
     */
    export class EndSystem extends BaseSystem<Behaviour> {
        protected readonly _interests = [{ componentClass: Behaviour as any, isExtends: true }];

        protected _onAddComponent(component: Behaviour) {
            const index = this._components.indexOf(component);
            if (index >= 0) {
                this._components[index] = null as any;

                return;
            }

            const gameObject = component.gameObject;
            console.debug("EndSystem remove behaviour error.", gameObject.name, gameObject.uuid, egret.getQualifiedClassName(component));
        }

        protected _onRemoveComponent(component: Behaviour) {
            if (this._components.indexOf(component) < 0) {
                this._components.push(component);

                return;
            }

            const gameObject = component.gameObject;
            console.debug("EndSystem add behaviour error.", gameObject.name, gameObject.uuid, egret.getQualifiedClassName(component));
        }

        public onUpdate() {
            if (this._isEditorUpdate()) {
                if (this._components.length > 0) {
                    for (const component of this._components) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor as any) >= 0) {
                            component.onDisable && component.onDisable();
                        }
                    }

                    this._components.length = 0;
                }
            }
            else if (this._components.length > 0) {
                for (const component of this._components) {
                    if (component) {
                        component.onDisable && component.onDisable();
                    }
                }

                this._components.length = 0;
            }
        }
    }
}
