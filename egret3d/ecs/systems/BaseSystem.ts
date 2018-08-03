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
        private _locked: boolean = false;
        protected _enabled: boolean = true;
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
        protected readonly _clock: Clock = this._globalGameObject.getOrAddComponent(Clock);
        /**
         * 禁止实例化系统。
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

                    this._groups.push(Group.create(interest));
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
         * 系统内部更新。
         * @internal
         */
        public update() {
            if (!this._enabled) {
                return;
            }

            this._locked = true;

            for (const group of this._groups) {
                if (this.onAddGameObject) {
                    for (const gameObject of group._addedGameObjects) {
                        if (gameObject) {
                            this.onAddGameObject(gameObject, group);
                        }
                    }
                }

                if (this.onAddComponent) {
                    for (const component of group._addedComponents) {
                        if (component) {
                            this.onAddComponent(component, group);
                        }
                    }
                }
            }

            this.onUpdate && this.onUpdate(this._clock.deltaTime);

            this._locked = false;
        }
        /**
         * 系统内部更新。
         * @internal
         */
        public lateUpdate() {
            if (!this._enabled) {
                return;
            }

            this._locked = true;
            this.onLateUpdate && this.onLateUpdate(this._clock.deltaTime);
            this._locked = false;
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
         * 实体被添加到组时调用。
         * - 注意，该调用并不是立即的，而是等到添加到组的下一帧才被调用。
         * @see paper.GameObject#addComponent()
         */
        public onAddGameObject?(gameObject: GameObject, group: Group): void;
        /**
         * 充分非必要组件添加到实体时调用。
         * - 注意，该调用并不是立即的，而是等到添加到实体的下一帧才被调用。
         * @see paper.GameObject#addComponent()
         */
        public onAddComponent?(component: BaseComponent, group: Group): void;
        /**
         * 充分非必要组件从实体移除时调用。
         * @see paper.GameObject#removeComponent()
         */
        public onRemoveComponent?(component: BaseComponent, group: Group): void;
        /**
         * 实体从系统移除时调用。
         * @see paper.GameObject#removeComponent()
         */
        public onRemoveGameObject?(gameObject: GameObject, group: Group): void;
        /**
         * 系统更新时调用。
         */
        public onUpdate?(deltaTime?: number): void;
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
         */
        public get enabled() {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._locked) {
                console.warn("Cannot change the enabled value when the system is updating.", egret.getQualifiedClassName(this));
                return;
            }

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
        public get groups(): ReadonlyArray<Group> {
            return this._groups;
        }
    }
}