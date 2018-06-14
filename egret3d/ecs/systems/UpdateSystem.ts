namespace paper {
    /**
     * 
     */
    export class UpdateSystem extends paper.BaseSystem<Behaviour> {
        protected readonly _interests = [{ componentClass: Behaviour as any, isExtends: true }];

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
            let index = 0;
            let removeCount = 0;
            const deltaTime = Time.deltaTime;
            const components = this._components;

            if (this._isEditorUpdate()) {
                for (const component of components) {
                    if (component) {
                        if (_executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onUpdate(deltaTime);
                        }

                        if (removeCount > 0) {
                            components[index - removeCount] = component;
                            components[index] = null as any;
                        }
                    }
                    else {
                        removeCount++;
                    }

                    index++;
                }
            }
            else {
                for (const component of components) {
                    if (component) {
                        component.onUpdate(deltaTime);

                        if (removeCount > 0) {
                            components[index - removeCount] = component;
                            components[index] = null as any;
                        }
                    }
                    else {
                        removeCount++;
                    }

                    index++;
                }
            }

            if (removeCount > 0) {
                components.length -= removeCount;
            }
        }
    }
}
