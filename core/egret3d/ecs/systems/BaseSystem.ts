namespace paper {
    let _createEnabled = false;
    /**
     * 基础系统。
     * - 全部系统的基类。
     */
    export abstract class BaseSystem {
        /**
         * 创建一个指定系统。
         * @internal
         */
        public static create<T extends BaseSystem>(systemClass: { new(order?: SystemOrder): T }, order: SystemOrder) {
            _createEnabled = true;
            return new systemClass(order);
        }
        /**
         * 该系统是否被激活。
         */
        public enabled: boolean = true;
        /**
         * 该系统的执行顺序。
         */
        public readonly order: SystemOrder = -1;
        /**
         * 该系统在调试模式时每帧消耗的时间，仅用于性能统计。（以毫秒为单位）
         */
        public readonly deltaTime: uint = 0;
        /**
         * 全局时钟信息组件实例。
         */
        public readonly clock: Clock = GameObject.globalGameObject.getOrAddComponent(Clock);
        /**
         * 
         */
        public readonly interests: ReadonlyArray<InterestConfig | ReadonlyArray<InterestConfig>> = [];
        /**
         * 该系统关心的实体组。
         */
        public readonly groups: ReadonlyArray<GameObjectGroup> = [];
        /**
         * @private
         */
        public _started: boolean = false;
        private _enabled: boolean = false;
        /**
         * 禁止实例化系统。
         * @protected
         */
        public constructor(order: SystemOrder = -1) {
            if (!_createEnabled) {
                throw new Error("Create an instance of a system is not allowed.");
            }
            _createEnabled = false;

            this.order = order;
        }
        /**
         * 系统内部初始化。
         * @private
         */
        public initialize(config?: any) {
            (this.interests as any) = this.interests || (this as any)["_interests"]; // TODO
            if (this.interests.length > 0) {
                let interests: ReadonlyArray<ReadonlyArray<InterestConfig>>;

                if (Array.isArray(this.interests[0])) {
                    interests = this.interests as ReadonlyArray<ReadonlyArray<InterestConfig>>;
                }
                else {
                    interests = [this.interests as ReadonlyArray<InterestConfig>];
                }

                const groups = this.groups as GameObjectGroup[];

                for (const interest of interests) {
                    for (const config of interest) {
                        if (config.listeners) {
                            for (const listenerConfig of config.listeners) {
                                listenerConfig.type.add(listenerConfig.listener, this);
                            }
                        }
                    }

                    groups.push(GameObjectGroup.create(interest));
                }
            }

            this.onAwake && this.onAwake(config);
        }
        /**
         * 系统内部卸载。
         * @private
         */
        public uninitialize() {
            this.onDestroy && this.onDestroy();

            if (this.interests.length > 0) {
                let interests: ReadonlyArray<ReadonlyArray<InterestConfig>>;

                if (Array.isArray(this.interests[0])) {
                    interests = this.interests as ReadonlyArray<ReadonlyArray<InterestConfig>>;
                }
                else {
                    interests = [this.interests as ReadonlyArray<InterestConfig>];
                }

                for (const interest of interests) {
                    for (const config of interest) {
                        if (config.listeners) {
                            for (const listenerConfig of config.listeners) {
                                listenerConfig.type.remove(listenerConfig.listener);
                            }
                        }
                    }
                }
            }
        }
        /**
         * 系统内部更新。
         * @private
         */
        public update() {
            const enabled = this.enabled;

            if (this._enabled !== enabled) {
                if (enabled) {
                    this.onEnable && this.onEnable();
                    if (DEBUG) {
                        console.info(egret.getQualifiedClassName(this), "enabled.");
                    }
                }
            }

            if (enabled && this._started) {
                let startTime = 0;
                const clock = this.clock;

                if (DEBUG) {
                    (this.deltaTime as uint) = 0;
                    startTime = clock.now;
                }

                for (const group of this.groups) {
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

                this.onUpdate && this.onUpdate(clock.deltaTime);

                if (DEBUG) {
                    (this.deltaTime as uint) += clock.now - startTime;
                }
            }

            if (this._enabled !== enabled) {
                this._enabled = enabled;

                if (!enabled) {
                    this.onDisable && this.onDisable();
                    if (DEBUG) {
                        console.info(egret.getQualifiedClassName(this), "disabled.");
                    }
                }
            }
        }
        /**
         * 系统内部更新。
         * @private
         */
        public lateUpdate() {
            if (this.enabled && this._started) {
                let startTime = 0;
                const clock = this.clock;

                if (DEBUG) {
                    startTime = clock.now;
                }

                this.onLateUpdate && this.onLateUpdate(clock.deltaTime);

                if (DEBUG) {
                    (this.deltaTime as uint) += clock.now - startTime;
                }
            }
        }
        /**
         * 该系统初始化时调用。
         * @param config 该系统被注册时可以传递的初始化数据。
         */
        public onAwake?(config?: any): void;
        /**
         * 该系统被激活时调用。
         * @see paper.BaseSystem#enabled
         */
        public onEnable?(): void;
        /**
         * 该系统开始运行时调用。
         */
        public onStart?(): void;
        /**
         * 实体被添加到系统时调用。
         * - 注意，该调用并不是立即的，而是等到添加到组的下一帧才被调用。
         * @param gameObject 收集的实体。
         * @param group 收集实体的实体组。
         * @see paper.GameObject#addComponent()
         */
        public onAddGameObject?(gameObject: GameObject, group: GameObjectGroup): void;
        /**
         * 充分非必要组件添加到实体时调用。
         * - 注意，该调用并不是立即的，而是等到添加到实体的下一帧才被调用。
         * @param component 收集的实体组件。
         * @param group 收集实体组件的实体组。
         * @see paper.GameObject#addComponent()
         */
        public onAddComponent?(component: BaseComponent, group: GameObjectGroup): void;
        /**
         * 充分非必要组件从实体移除时调用。
         * @param component 移除的实体组件。
         * @param group 移除实体组件的实体组。
         * @see paper.GameObject#removeComponent()
         */
        public onRemoveComponent?(component: BaseComponent, group: GameObjectGroup): void;
        /**
         * 实体从系统移除时调用。
         * @param gameObject 移除的实体。
         * @param group 移除实体的实体组。
         * @see paper.GameObject#removeComponent()
         */
        public onRemoveGameObject?(gameObject: GameObject, group: GameObjectGroup): void;
        /**
         * 该系统更新时调用。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onUpdate?(deltaTime?: number): void;
        /**
         * 该系统更新时调用。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onLateUpdate?(deltaTime?: number): void;
        /**
         * 该系统被禁用时调用。
         * @see paper.BaseSystem#enabled
         */
        public onDisable?(): void;
        /**
         * 该系统被注销时调用。
         * @see paper.SystemManager#unregister()
         * @see paper.Application#systemManager
         */
        public onDestroy?(): void;
    }
}