namespace paper {
    /**
     * 
     */
    export class StartSystem extends BaseSystem<Behaviour> {
        protected readonly _interests = [
            {
                componentClass: Behaviour as any,
                isExtends: true
            }
        ];
        private readonly _resetConmponents: Behaviour[] = [];
        private readonly _enableConmponents: Behaviour[] = [];
        private readonly _startConmponents: Behaviour[] = [];

        protected _onAddComponent(component: Behaviour) {
            if (this._isEditorUpdate() && !component._isReseted && this._resetConmponents.indexOf(component) < 0) {
                this._resetConmponents.push(component);
            }

            if (this._enableConmponents.indexOf(component) < 0) {
                this._enableConmponents.push(component);
            }

            if (!component._isStarted && this._startConmponents.indexOf(component) < 0) {
                this._startConmponents.push(component);
            }

            if (this._components.indexOf(component) < 0) {
                this._components.push(component);
                return;
            }

            const gameObject = component.gameObject;
            console.debug("StartSystem add behaviour error.", gameObject.path, egret.getQualifiedClassName(component));
        }

        protected _onRemoveComponent(component: Behaviour) {
            let index = 0;

            index = this._enableConmponents.indexOf(component);
            if (index >= 0) {
                this._enableConmponents[index] = null as any;
            }

            index = this._startConmponents.indexOf(component);
            if (index >= 0) {
                this._startConmponents[index] = null as any;
            }

            index = this._components.indexOf(component);
            if (index >= 0) {
                this._components[index] = null as any;
                return;
            }

            const gameObject = component.gameObject;
            console.debug("StartSystem remove behaviour error.", gameObject.path, egret.getQualifiedClassName(component));
        }

        public onUpdate() {
            //
            this._clock.update();
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            egret3d.stage.update();

            // Update behaviours.

            if (this._isEditorUpdate()) {
                if (this._resetConmponents.length > 0) {
                    for (const component of this._resetConmponents) {
                        if (component) {
                            component._isReseted = true;
                            component.onReset && component.onReset();
                        }
                    }

                    this._resetConmponents.length = 0;
                }

                if (this._enableConmponents.length > 0) {
                    for (const component of this._enableConmponents) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor as any) >= 0) {
                            component.onEnable && component.onEnable();
                        }
                    }

                    this._enableConmponents.length = 0;
                }

                if (this._startConmponents.length > 0) {
                    for (const component of this._startConmponents) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor as any) >= 0) {
                            component._isStarted = true;
                            component.onStart && component.onStart();
                        }
                    }

                    this._startConmponents.length = 0;
                }
            }
            else {
                if (this._enableConmponents.length > 0) {
                    for (const component of this._enableConmponents) {
                        if (component) {
                            component.onEnable && component.onEnable();
                        }
                    }

                    this._enableConmponents.length = 0;
                }

                if (this._startConmponents.length > 0) {
                    for (const component of this._startConmponents) {
                        if (component) {
                            component._isStarted = true;
                            component.onStart && component.onStart();
                        }
                    }

                    this._startConmponents.length = 0;
                }
            }

            // Remove null from components.
            let index = 0;
            let removeCount = 0;

            for (const component of this._components) {
                if (component) {
                    if (removeCount > 0) {
                        this._components[index - removeCount] = component;
                        this._components[index] = null as any;
                    }
                }
                else {
                    removeCount++;
                }

                index++;
            }

            if (removeCount > 0) {
                this._components.length -= removeCount;
            }
        }
    }
}