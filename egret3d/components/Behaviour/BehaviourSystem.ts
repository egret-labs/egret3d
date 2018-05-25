namespace paper {
    /**
     * 
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
                componentClass: Behaviour as any,
                listeners: [
                    {
                        type: paper.EventPool.EventType.Enabled,
                        listener: (component: Behaviour) => {
                            if (component.isActiveAndEnabled) {
                                // Add to enable list.
                                if (this._onEnableBehaviours.indexOf(component) < 0) {
                                    this._onEnableBehaviours.push(component);
                                }
                            }
                            else {
                                // Add to disable list.
                                if (this._onDisableBehaviours.indexOf(component) < 0) {
                                    this._onDisableBehaviours.push(component);
                                }
                            }
                        }
                    }
                ]
            }
        ];

        private readonly _onEnableBehaviours: (Behaviour)[] = [];
        private readonly _resetBehaviours: (Behaviour)[] = [];
        private readonly _startBehaviours: (Behaviour)[] = [];
        private readonly _onDisableBehaviours: (Behaviour)[] = [];
        /**
         * @inheritDoc
         */
        protected _onCreateComponent(component: Behaviour) {
            // 所有 Behaviour 均被收集，BehaviourSystem 并不是标准的 ecs，仅用来更新 Behaviour 的生命周期。
            this._gameObjectOffsets[component.gameObject.hashCode] = this._components.length;
            this._components.push(component);

            this._onEnableBehaviours.push(component);

            if (paper.Application.isEditor && !paper.Application.isPlaying) {
                this._resetBehaviours.push(component);
            }

            this._startBehaviours.push(component);

            return true;
        }
        /**
         * @inheritDoc
         */
        protected _onDestroyComponent(component: Behaviour) {
            const gameObject = component.gameObject;

            for (let i = 0; i < this._components.length; i++) {
                if (this._components[i] === component) {
                    this._components.splice(i, 1);
                    break;
                }
            }

            delete this._gameObjectOffsets[gameObject.hashCode];

            return true;
        }
        /**
         * @inheritDoc
         */
        public update() {
            let i = 0;
            let l = 0;

            if (paper.Application.isEditor && !paper.Application.isPlaying) {
                if (this._onEnableBehaviours.length > 0) {
                    for (const component of this._onEnableBehaviours) {
                        if (component.isActiveAndEnabled && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onEnable();
                        }
                    }

                    this._onEnableBehaviours.length = 0;
                }

                if (this._resetBehaviours.length > 0) {
                    for (const component of this._resetBehaviours) {
                        component.onReset();
                    }

                    this._resetBehaviours.length = 0;
                }

                i = this._startBehaviours.length;
                if (i > 0) {
                    while (i--) {
                        const component = this._startBehaviours[i];
                        if (!component || component.isActiveAndEnabled) {
                            if (component.isActiveAndEnabled && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                                component.onStart();
                            }

                            this._startBehaviours.splice(i, 1);
                        }
                    }
                }

                l = this._components.length;

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component.isActiveAndEnabled && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                        component.onUpdate(paper.Time.deltaTime);
                    }
                }

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component.isActiveAndEnabled && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                        component.onLateUpdate(paper.Time.deltaTime);
                    }
                }

                if (this._onDisableBehaviours.length > 0) {
                    for (const component of this._onDisableBehaviours) {
                        if (!component.isActiveAndEnabled && _executeInEditModeComponents.indexOf(component.constructor) >= 0) {
                            component.onDisable();
                        }
                    }

                    this._onDisableBehaviours.length = 0;
                }
            }
            else {
                if (this._onEnableBehaviours.length > 0) {
                    for (const component of this._onEnableBehaviours) {
                        if (component.isActiveAndEnabled) {
                            component.onEnable();
                        }
                    }

                    this._onEnableBehaviours.length = 0;
                }

                i = this._startBehaviours.length;
                if (i > 0) {
                    while (i--) {
                        const component = this._startBehaviours[i];
                        if (!component || component.isActiveAndEnabled) {
                            if (component.isActiveAndEnabled) {
                                component.onStart();
                            }

                            this._startBehaviours.splice(i, 1);
                        }
                    }
                }

                l = this._components.length;

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component.isActiveAndEnabled) {
                        component.onUpdate(paper.Time.deltaTime);
                    }
                }

                for (i = 0; i < l; ++i) {
                    const component = this._components[i];
                    if (component.isActiveAndEnabled) {
                        component.onLateUpdate(paper.Time.deltaTime);
                    }
                }

                if (this._onDisableBehaviours.length > 0) {
                    for (const component of this._onDisableBehaviours) {
                        if (!component.isActiveAndEnabled) {
                            component.onDisable();
                        }
                    }

                    this._onDisableBehaviours.length = 0;
                }
            }
        }
    }
}
