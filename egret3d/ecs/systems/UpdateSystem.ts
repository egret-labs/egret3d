namespace paper {
    /**
     * 
     */
    export class UpdateSystem extends paper.BaseSystem<Behaviour> {
        protected readonly _interests = [{ componentClass: Behaviour as any }];

        protected _onAddComponent(component: Behaviour) {
            if (this._components.indexOf(component) < 0) {
                this._components.push(component);

                return true;
            }

            const gameObject = component.gameObject;
            console.debug("UpdateSystem add behaviour error.", gameObject.name, gameObject.hashCode, egret.getQualifiedClassName(component.constructor));

            return false;
        }

        protected _onRemoveComponent(component: Behaviour) {
            const index = this._components.indexOf(component);
            if (index >= 0) {
                this._components[index] = null as any;

                return true;
            }

            const gameObject = component.gameObject;
            console.debug("UpdateSystem remove behaviour error.", gameObject.name, gameObject.hashCode, egret.getQualifiedClassName(component.constructor));

            return false;
        }

        public update() {
            const deltaTime = Time.deltaTime;

            if (this._isEditorUpdate()) {
                for (const component of this._components) {
                    if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                        component.onUpdate(deltaTime);
                    }
                }
            }
            else {
                for (const component of this._components) {
                    if (component) {
                        component.onUpdate(deltaTime);
                    }
                }
            }
        }
    }
}
