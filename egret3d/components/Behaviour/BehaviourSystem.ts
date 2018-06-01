namespace paper {
    /**
     * @internal
     */
    export const _executeInEditModeComponents: any[] = [];
    /**
     * 标记组件是否在编辑模式也拥有生命周期。
     */
    export function executeInEditMode<T extends Behaviour>(target: { new(gameObject: paper.GameObject): T }) {
        _executeInEditModeComponents.push(target);
    }
    /**
     * 脚本系统
     * 该系统负责执行脚本逻辑代码
     */
    export class BehaviourSystem extends paper.BaseSystem<Behaviour> {

        /**
         * @inheritDoc
         */
        protected readonly _interests = [
            {
                componentClass: Behaviour as any
            }
        ];

        private readonly _onResetBehaviours: (Behaviour | null)[] = [];
        private readonly _onEnableBehaviours: (Behaviour | null)[] = [];
        private readonly _onStartBehaviours: (Behaviour | null)[] = [];
        private readonly _onDisableBehaviours: (Behaviour | null)[] = [];
        /**
         * @inheritDoc
         */
        protected _onAddComponent(component: Behaviour) {
            // 所有 Behaviour 均被收集，BehaviourSystem 并不是标准的 ecs，仅用来更新 Behaviour 的生命周期。
            let index = this._components.indexOf(component);

            if (index < 0) {
                this._components.push(component);

                if (
                    paper.Application.isEditor &&
                    !paper.Application.isPlaying &&
                    !component._isReseted
                ) {
                    this._onResetBehaviours.push(component);
                }

                this._onEnableBehaviours.push(component);

                if (!component._isStarted) {
                    this._onStartBehaviours.push(component);
                }

                index = this._onDisableBehaviours.indexOf(component);
                if (index >= 0) {
                    this._onDisableBehaviours[index] = null;
                }

                return true;
            }

            console.debug("Add behaviour error.");
            return false;
        }
        /**
         * @inheritDoc
         */
        protected _onRemoveComponent(component: Behaviour) {
            const gameObject = component.gameObject;
            let index = this._components.indexOf(component);

            if (index >= 0) {
                this._components[index] = null as any;
                this._onDisableBehaviours.push(component);

                index = this._onResetBehaviours.indexOf(component);
                if (index >= 0) {
                    this._onResetBehaviours[index] = null;
                }

                index = this._onEnableBehaviours.indexOf(component);
                if (index >= 0) {
                    this._onEnableBehaviours[index] = null;
                }

                index = this._onStartBehaviours.indexOf(component);
                if (index >= 0) {
                    this._onStartBehaviours[index] = null;
                }

                return true;
            }

            console.debug("Remove behaviour error.");
            return false;
        }
        /**
         * @inheritDoc
         */
        public update() {
            let i = 0;
            let l = 0;

            if (paper.Application.isEditor && !paper.Application.isPlaying) {
                if (this._onResetBehaviours.length > 0) {
                    for (const component of this._onResetBehaviours) {
                        if (component) {
                            component._isReseted = true;
                            component.onReset();
                        }
                    }

                    this._onResetBehaviours.length = 0;
                }

                if (this._onEnableBehaviours.length > 0) {
                    for (const component of this._onEnableBehaviours) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onEnable();
                        }
                    }

                    this._onEnableBehaviours.length = 0;
                }

                if (this._onStartBehaviours.length > 0) {
                    for (const component of this._onStartBehaviours) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component._isStarted = true;
                            component.onStart();
                        }
                    }

                    this._onStartBehaviours.length = 0;
                }

                l = this._components.length;

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                        component.onUpdate(paper.Time.deltaTime);
                    }
                }

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                        component.onLateUpdate(paper.Time.deltaTime);
                    }
                }

                if (this._onDisableBehaviours.length > 0) {
                    for (const component of this._onDisableBehaviours) {
                        if (component && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onDisable();
                        }
                    }

                    this._onDisableBehaviours.length = 0;
                }
            }
            else {
                if (this._onEnableBehaviours.length > 0) {
                    for (const component of this._onEnableBehaviours) {
                        if (component) {
                            component.onEnable();
                        }
                    }

                    this._onEnableBehaviours.length = 0;
                }

                if (this._onStartBehaviours.length > 0) {
                    for (const component of this._onStartBehaviours) {
                        if (component) {
                            component._isStarted = true;
                            component.onStart();
                        }
                    }

                    this._onStartBehaviours.length = 0;
                }

                l = this._components.length;

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component) {
                        component.onUpdate(paper.Time.deltaTime);
                    }
                }

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component) {
                        component.onLateUpdate(paper.Time.deltaTime);
                    }
                }

                if (this._onDisableBehaviours.length > 0) {
                    for (const component of this._onDisableBehaviours) {
                        if (component) {
                            component.onDisable();
                        }
                    }

                    this._onDisableBehaviours.length = 0;
                }
            }
        }
    }
}
