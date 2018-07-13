namespace paper {
    /**
     * 系统基类。
     */
    export abstract class BaseSystem {
        private static _createEnabled: boolean = false;
        /**
         * @internal
         */
        public static create(systemClass: { new(): BaseSystem }) {
            this._createEnabled = true;
            return new systemClass();
        }
        /**
         * @internal
         */
        public _started: boolean = true;
        /**
         * @internal
         */
        public _enabled: boolean = true;
        /**
         * @internal
         */
        public _level: number = 0;
        /**
         * 
         */
        protected readonly _interests: ReadonlyArray<InterestConfig> | ReadonlyArray<ReadonlyArray<InterestConfig>> = [];
        /**
         * 
         */
        protected readonly _groups: Group[] = [];
        /**
         * 
         */
        protected readonly _globalGameObject: GameObject = Application.sceneManager.globalGameObject;
        /**
         * 
         */
        protected readonly _clock: Clock = this._globalGameObject.getComponent(Clock) || this._globalGameObject.addComponent(Clock);
        /**
         * 禁止实例化系统实例。
         * @protected
         */
        public constructor() {
            if (!BaseSystem._createEnabled) {
                throw new Error("Create an instance of a system is not allowed.");
            }

            BaseSystem._createEnabled = false;
        }
        /**
         * TODO 宏定义。
         * @internal
         */
        protected _isEditorUpdate() {
            return Application.isEditor && !Application.isPlaying;
        }
        /**
         * 系统内部初始化。
         * @internal
         */
        public initialize() {
            if (this._interests.length > 0) {
                let interests: ReadonlyArray<ReadonlyArray<InterestConfig>>;

                if (Array.isArray(this._interests[0])) {
                    interests = this._interests as ReadonlyArray<ReadonlyArray<InterestConfig>>;
                }
                else {
                    interests = [this._interests as ReadonlyArray<InterestConfig>];
                }

                for (const interest of interests) {
                    for (const config of interest) {
                        if (!config.listeners) {
                            continue;
                        }

                        for (const listenerConfig of config.listeners) {
                            if (Array.isArray(config.componentClass)) {
                                for (const componentClass of config.componentClass) {
                                    EventPool.addEventListener(listenerConfig.type, componentClass, listenerConfig.listener);
                                }
                            }
                            else {
                                EventPool.addEventListener(listenerConfig.type, config.componentClass, listenerConfig.listener);
                            }
                        }
                    }

                    this._groups.push(Group.getGroup(interest));
                }
            }

            this.onAwake && this.onAwake();
            this.onEnable && this.onEnable();
        }
        /**
         * 系统内部卸载。
         * @internal
         */
        public uninitialize() {
            this.onDestroy && this.onDestroy();

            if (this._interests.length > 0) {
                let interests: ReadonlyArray<ReadonlyArray<InterestConfig>>;

                if (Array.isArray(this._interests[0])) {
                    interests = this._interests as ReadonlyArray<ReadonlyArray<InterestConfig>>;
                }
                else {
                    interests = [this._interests as ReadonlyArray<InterestConfig>];
                }

                for (const interest of interests) {
                    for (const config of interest) {
                        if (!config.listeners) {
                            continue;
                        }

                        for (const listenerConfig of config.listeners) {
                            if (Array.isArray(config.componentClass)) {
                                for (const componentClass of config.componentClass) {
                                    EventPool.removeEventListener(listenerConfig.type, componentClass, listenerConfig.listener);
                                }
                            }
                            else {
                                EventPool.removeEventListener(listenerConfig.type, config.componentClass, listenerConfig.listener);
                            }
                        }
                    }
                }
            }
        }
        /**
         * 系统初始化时调用。
         */
        public onAwake?(): void;
        /**
         * 系统被激活时调用。
         * @see paper.BaseSystem#enabled
         */
        public onEnable?(): void;
        /**
         * 系统开始运行时调用。
         */
        public onStart?(): void;
        /**
         * 实体被添加到系统时调用。
         * @see paper.GameObject#addComponent()
         */
        public onAddGameObject?(gameObject: GameObject, group: Group): void;
        /**
         * 
         * @see paper.GameObject#addComponent()
         */
        public onAddComponent?(component: BaseComponent, group: Group): void;
        /**
         * 系统更新时调用。
         */
        public onUpdate?(deltaTime?: number): void;
        /**
         * 
         * @see paper.GameObject#removeComponent()
         */
        public onRemoveComponent?(component: BaseComponent, group: Group): void;
        /**
         * 实体从系统移除时调用。
         * @see paper.GameObject#removeComponent()
         */
        public onRemoveGameObject?(gameObject: GameObject, group: Group): void;
        /**
         * 
         */
        public onLateUpdate?(deltaTime?: number): void;
        /**
         * 系统被禁用时调用。
         * @see paper.BaseSystem#enabled
         */
        public onDisable?(): void;
        /**
         * 系统被注销时调用。
         * @see paper.SystemManager#unregister()
         * @see paper.Application#systemManager
         */
        public onDestroy?(): void;
        /**
         * 该系统是否被激活。
         * - 当禁用时，仅停止 onUpdate 生命周期。
         */
        public get enabled() {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled === value) {
                return;
            }

            this._enabled = value;

            if (this._enabled) {
                this.onEnable && this.onEnable();
            }
            else {
                this.onDisable && this.onDisable();
            }
        }
        /**
         * 
         */
        public get level() {
            return this._level;
        }
        /**
         * 
         */
        public get groups(): ReadonlyArray<Group> {
            return this._groups;
        }
    }
}