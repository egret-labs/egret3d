namespace paper {
    /**
     * 
     */
    export class EndSystem extends paper.BaseSystem<Behaviour> {
        protected readonly _interests = [{ componentClass: Behaviour as any }];

        protected _onAddComponent(component: Behaviour) {
            const index = this._components.indexOf(component);
            if (index >= 0) {
                this._components[index] = null as any;

                return true;
            }

            const gameObject = component.gameObject;
            console.debug("EndSystem remove behaviour error.", gameObject.name, gameObject.hashCode, egret.getQualifiedClassName(component.constructor));

            return false;
        }

        protected _onRemoveComponent(component: Behaviour) {
            if (this._components.indexOf(component) < 0) {
                this._components.push(component);

                return true;
            }

            const gameObject = component.gameObject;
            console.debug("EndSystem add behaviour error.", gameObject.name, gameObject.hashCode, egret.getQualifiedClassName(component.constructor));

            return false;
        }

        public update() {
            if (paper.Application.isEditor && !paper.Application.isPlaying) {
                if (this._components.length > 0) {
                    for (const component of this._components) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onDisable();
                        }
                    }

                    this._components.length = 0;
                }
            }
            else {
                if (this._components.length > 0) {
                    for (const component of this._components) {
                        if (component) {
                            component.onDisable();
                        }
                    }

                    this._components.length = 0;
                }
            }
        }
    }
}
