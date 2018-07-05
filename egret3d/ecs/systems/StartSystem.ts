namespace paper {
    /**
     * 
     */
    export class StartSystem extends BaseSystem<Behaviour> {
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
            console.debug("StartSystem add behaviour error.", gameObject.name, gameObject.uuid, egret.getQualifiedClassName(component));
        }

        protected _onRemoveComponent(component: Behaviour) {
            const index = this._components.indexOf(component);
            if (index >= 0) {
                this._components[index] = null as any;

                return;
            }

            const gameObject = component.gameObject;
            console.debug("StartSystem remove behaviour error.", gameObject.name, gameObject.uuid, egret.getQualifiedClassName(component));
        }

        public onUpdate() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            egret3d.stage.update();

            // Update behaviours.
            if (this._isEditorUpdate()) {
                if (this._components.length > 0) {
                    for (const component of this._components) {
                        if (!component) {
                            continue;
                        }

                        if (!component._isReseted) {
                            component._isReseted = true;
                            component.onReset && component.onReset();
                        }

                        if (_executeInEditModeComponents.indexOf(component.constructor as any) < 0) {
                            continue;
                        }

                        component.onEnable && component.onEnable();

                        if (!component._isStarted && component.isActiveAndEnabled) {
                            component._isStarted = true;
                            component.onStart && component.onStart();
                        }
                    }

                    this._components.length = 0;
                }
            }
            else if (this._components.length > 0) {
                for (const component of this._components) {
                    if (!component) {
                        continue;
                    }

                    component.onEnable && component.onEnable();

                    if (!component._isStarted && component.isActiveAndEnabled) {
                        component._isStarted = true;
                        component.onStart && component.onStart();
                    }
                }

                this._components.length = 0;
            }
        }
    }
}