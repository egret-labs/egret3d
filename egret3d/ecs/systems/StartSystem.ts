namespace paper {
    /**
     * 
     */
    export class StartSystem extends BaseSystem<Behaviour> {
        protected readonly _interests = [{ componentClass: Behaviour as any, isExtends: true }];
        private readonly _onResetBehaviours: (Behaviour | null)[] = [];

        protected _onAddComponent(component: Behaviour) {
            if (this._isEditorUpdate() && !component._isReseted) {
                this._onResetBehaviours.push(component);
            }

            if (this._components.indexOf(component) < 0) {
                this._components.push(component);

                return true;
            }

            const gameObject = component.gameObject;
            console.debug("StartSystem add behaviour error.", gameObject.name, gameObject.hashCode, egret.getQualifiedClassName(component.constructor));

            return false;
        }

        protected _onRemoveComponent(component: Behaviour) {
            const index = this._components.indexOf(component);
            if (index >= 0) {
                this._components[index] = null as any;

                return true;
            }

            const gameObject = component.gameObject;
            console.debug("StartSystem remove behaviour error.", gameObject.name, gameObject.hashCode, egret.getQualifiedClassName(component.constructor));

            return false;
        }

        public update() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            egret3d.stage.update();
            const { x, y, w, h } = egret3d.stage.absolutePosition;
            const scaleX = egret3d.stage.screenViewport.w / w;
            const scaleY = egret3d.stage.screenViewport.h / h;
            egret3d.InputManager.touch.updateOffsetAndScale(x, y, scaleX, scaleY);
            egret3d.InputManager.mouse.updateOffsetAndScale(x, y, scaleX, scaleY);

            // Update behaviours.
            if (this._isEditorUpdate()) {
                if (this._onResetBehaviours.length > 0) {
                    for (const component of this._onResetBehaviours) {
                        if (component) {
                            component._isReseted = true;
                            component.onReset();
                        }
                    }

                    this._onResetBehaviours.length = 0;
                }

                if (this._components.length > 0) {
                    for (const component of this._components) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onEnable();

                            if (!component._isStarted && component.isActiveAndEnabled) {
                                component._isStarted = true;
                                component.onStart();
                            }
                        }
                    }

                    this._components.length = 0;
                }
            }
            else {
                if (this._components.length > 0) {
                    for (const component of this._components) {
                        if (component) {
                            component.onEnable();

                            if (!component._isStarted && component.isActiveAndEnabled) {
                                component._isStarted = true;
                                component.onStart();
                            }
                        }
                    }

                    this._components.length = 0;
                }
            }
        }
    }
}
