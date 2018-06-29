namespace paper {
    /**
     * 
     */
    export class UpdateSystem extends BaseSystem<Behaviour> {
        protected readonly _interests: ReadonlyArray<InterestConfig<Behaviour>> = [
            {
                componentClass: Behaviour as any,
                isExtends: true
            }
        ];

        protected _onAddComponent(component: Behaviour) {
            if (this._components.indexOf(component) < 0) {
                this._components.push(component);
                return;
            }

            const gameObject = component.gameObject;
            console.debug("UpdateSystem add behaviour error.", gameObject.name, gameObject.uuid, egret.getQualifiedClassName(component.constructor));
        }

        protected _onRemoveComponent(component: Behaviour) {
            const index = this._components.indexOf(component);
            if (index >= 0) {
                this._components[index] = null as any;

                return;
            }

            const gameObject = component.gameObject;
            console.debug("UpdateSystem remove behaviour error.", gameObject.name, gameObject.uuid, egret.getQualifiedClassName(component.constructor));
        }

        public onUpdate() {
            let index = 0;
            let removeCount = 0;
            const deltaTime = Time.deltaTime;
            const components = this._components;

            if (this._isEditorUpdate()) {
                for (const component of components) {
                    if (component) {
                        if (component._isStarted && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onUpdate && component.onUpdate(deltaTime);
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
                        if (component._isStarted) {
                            component.onUpdate && component.onUpdate(deltaTime);
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

            if (removeCount > 0) {
                components.length -= removeCount;
            }
        }
    }
}
