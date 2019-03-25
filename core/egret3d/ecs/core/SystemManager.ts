namespace paper {
    type PreSystemPair = [
        ISystemClass<ISystem<IEntity>, IEntity>,
        Context<IEntity>,
        SystemOrder,
        any | null
    ];
    type CacheSystemPair = [
        ISystem<IEntity>,
        any | null
    ];
    /**
     * 程序系统管理器。
     */
    export class SystemManager {
        private static _instance: SystemManager | null = null;
        /**
         * 程序系统管理器单例。
         */
        public static getInstance() {
            if (this._instance === null) {
                this._instance = new SystemManager();
            }

            return this._instance;
        }

        private _isStarted: boolean = false;
        /**
         * 程序启动前缓存。
         * - 系统不能直接实例化。
         */
        private readonly _preSystems: PreSystemPair[] = [];
        /**
         * 程序启动后缓存。
         * - 系统需要直接实例化，但不能立即初始化。
         */
        private readonly _cacheSystems: CacheSystemPair[] = [];
        private readonly _systems: ISystem<IEntity>[] = [];
        private readonly _startSystems: ISystem<IEntity>[] = [];
        private readonly _reactiveSystems: ISystem<IEntity>[] = [];
        private readonly _frameSystems: ISystem<IEntity>[] = [];
        private readonly _frameCleanupSystems: ISystem<IEntity>[] = [];
        private readonly _tickSystems: ISystem<IEntity>[] = [];
        private readonly _tickCleanupSystems: ISystem<IEntity>[] = [];

        private constructor() {
        }

        private _sortPreSystem(a: PreSystemPair, b: PreSystemPair) {
            return a[2] - b[2];
        }

        private _getSystemInsertIndex(systems: ISystem<IEntity>[], order: SystemOrder) {
            let index = -1;
            const systemCount = systems.length;

            if (systemCount > 0) {
                if (order < systems[0].order) {
                    return 0;
                }
                else if (order >= systems[systemCount - 1].order) {
                    return systemCount;
                }
            }

            for (let i = 0; i < systemCount - 1; ++i) {
                if (systems[i].order <= order && order < systems[i + 1].order) {
                    index = i + 1;
                    break;
                }
            }

            return index < 0 ? systems.length : index;
        }

        private _register(system: ISystem<IEntity>, config: any | null = null) {
            const order = system.order;

            this._systems.splice(this._getSystemInsertIndex(this._systems, order), 0, system);

            if (system.onStart) {
                this._startSystems.splice(this._getSystemInsertIndex(this._startSystems, order), 0, system);
            }

            if (system.onEntityAdded || system.onComponentAdded || system.onComponentRemoved || system.onEntityRemoved) {
                this._reactiveSystems.splice(this._getSystemInsertIndex(this._reactiveSystems, order), 0, system);
            }

            if (system.onTick) {
                this._tickSystems.splice(this._getSystemInsertIndex(this._tickSystems, order), 0, system);
            }

            if (system.onTickCleanup) {
                this._tickCleanupSystems.splice(this._getSystemInsertIndex(this._tickCleanupSystems, order), 0, system);
            }

            if (system.onFrame) {
                this._frameSystems.splice(this._getSystemInsertIndex(this._frameSystems, order), 0, system);
            }

            if (system.onFrameCleanup) {
                this._frameCleanupSystems.splice(this._getSystemInsertIndex(this._frameCleanupSystems, order), 0, system);
            }

            system.initialize(config);
        }

        private _reactive(system: ISystem<IEntity>) {
            for (const collector of system.collectors) {
                if (system.onComponentRemoved) {
                    for (const component of collector.removedComponentes) {
                        if (component !== null) {
                            system.onComponentRemoved(component, collector.group);
                        }
                    }
                }

                if (system.onEntityRemoved) {
                    for (const entity of collector.removedEntities) {
                        if (entity !== null) {
                            system.onEntityRemoved(entity, collector.group);
                        }
                    }
                }

                if (system.onEntityAdded) {
                    for (const entity of collector.addedEntities) {
                        if (entity !== null) {
                            system.onEntityAdded(entity, collector.group);
                        }
                    }
                }

                if (system.onComponentAdded) {
                    for (const component of collector.addedComponentes) {
                        if (component !== null) {
                            system.onComponentAdded(component, collector.group);
                        }
                    }
                }

                collector.clear();
            }
        }
        /**
         * @internal
         */
        public _start() {
            const preSystems = this._preSystems;

            if (preSystems.length > 0) {
                preSystems.sort(this._sortPreSystem);

                for (const pair of preSystems) {
                    this.register.apply(this, pair);
                }

                preSystems.length = 0;
            }

            this._isStarted = true;
        }
        /**
         * @internal
         */
        public _startup() {
            const playerMode = Application.playerMode;
            const cacheSystems = this._cacheSystems;

            if (cacheSystems.length > 0) {
                for (const pair of cacheSystems) {
                    this._register.apply(this, pair);
                }

                cacheSystems.length = 0;
            }

            for (const system of this._systems) {
                if (((system.constructor as ISystemClass<ISystem<IEntity>, IEntity>).executeMode & playerMode) !== 0) {
                    if ((system as BaseSystem<IEntity>)._executeEnabled && !system.enabled) {
                        system.enabled = true;
                    }
                }
                else if (system.enabled) {
                    system.enabled = false;
                    (system as BaseSystem<IEntity>)._executeEnabled = true;
                }

                if ((system as BaseSystem<IEntity>)._lastEnabled === system.enabled || !system.enabled) {
                    continue;
                }

                system.onEnable && system.onEnable();

                if (DEBUG) {
                    console.debug(egret.getQualifiedClassName(system), "enabled.");
                }

                if (system.onEntityAdded) {
                    for (const group of system.groups) {
                        for (const entity of group.entities) {
                            system.onEntityAdded(entity, group);
                        }
                    }
                }
            }

            for (const system of this._startSystems) {
                if (!system.enabled) {
                    continue;
                }

                if (system.onStart) {
                    system.onStart();
                    system.onStart = undefined;
                }
            }
        }
        /**
         * @internal
         */
        public _execute(tickCount: uint, frameCount: uint) {
            const reactiveSystems = this._reactiveSystems;
            let startTime = 0;

            for (let i = 0; i < tickCount; ++i) {
                for (const system of this._systems) { // this._tickSystems
                    if (!system.enabled) {
                        continue;
                    }

                    if (DEBUG) {
                        (system.deltaTime as uint) = 0;
                        startTime = clock.timestamp();
                    }

                    if (
                        i === 0 && // 第一帧响应。
                        reactiveSystems.indexOf(system) >= 0
                    ) {
                        this._reactive(system);
                    }

                    system.onTick && system.onTick(clock.lastTickDelta);

                    if (DEBUG) {
                        (system.deltaTime as uint) += clock.timestamp() - startTime;
                    }
                }
            }

            if (frameCount > 0) {
                for (const system of this._systems) { // this._frameSystems
                    if (!system.enabled) {
                        continue;
                    }

                    if (DEBUG) {
                        startTime = clock.timestamp();
                    }

                    if (reactiveSystems.indexOf(system) >= 0) {
                        this._reactive(system);
                    }

                    system.onFrame && system.onFrame(clock.lastFrameDelta);

                    if (DEBUG) {
                        (system.deltaTime as uint) += clock.timestamp() - startTime;
                    }
                }
            }
        }
        /**
         * @internal
         */
        public _cleanup(frameCount: uint) {
            let startTime = 0;
            let i = 0;

            if (frameCount > 0) {
                i = this._frameCleanupSystems.length;

                while (i--) {
                    const system = this._frameCleanupSystems[i];
                    if (!system.enabled) {
                        continue;
                    }

                    if (DEBUG) {
                        startTime = clock.timestamp();
                    }

                    system.onFrameCleanup!(clock.lastFrameDelta);

                    if (DEBUG) {
                        (system.deltaTime as uint) += clock.timestamp() - startTime;
                    }
                }
            }

            i = this._tickCleanupSystems.length;

            while (i--) {
                const system = this._tickCleanupSystems[i];
                if (!system.enabled) {
                    continue;
                }

                if (DEBUG) {
                    startTime = clock.timestamp();
                }

                system.onTickCleanup!(clock.lastFrameDelta);

                if (DEBUG) {
                    (system.deltaTime as uint) += clock.timestamp() - startTime;
                }
            }
        }
        /**
         * @internal
         */
        public _teardown() {
            for (const system of this._systems) {
                if ((system as BaseSystem<IEntity>)._lastEnabled === system.enabled) {
                    continue;
                }

                (system as BaseSystem<IEntity>)._lastEnabled = system.enabled;

                if (system.enabled) {
                    continue;
                }

                if (system.onEntityRemoved) {
                    for (const group of system.groups) {
                        for (const entity of group.entities) {
                            system.onEntityRemoved(entity, group);
                        }
                    }
                }

                system.onDisable && system.onDisable();

                if (DEBUG) {
                    console.debug(egret.getQualifiedClassName(system), "disabled.");
                }
            }
        }
        /**
         * 在程序启动之前预注册一个指定的系统。
         */
        public preRegister<TEntity extends IEntity, TSystem extends ISystem<TEntity>>(
            systemClass: ISystemClass<TSystem, TEntity>,
            context: Context<TEntity>, order: SystemOrder = SystemOrder.Update, config: any | null = null
        ): SystemManager {
            if (this._isStarted) {
                this.register(systemClass, context, order, config);
            }
            else { // 程序启动前，延时实例化系统。
                this._preSystems.push([systemClass, context, order, config]);
            }

            return this;
        }
        /**
         * 为程序注册一个指定的系统。
         */
        public register<TEntity extends IEntity, TSystem extends ISystem<TEntity>>(
            systemClass: ISystemClass<TSystem, TEntity>,
            context: Context<TEntity>, order: SystemOrder = SystemOrder.Update, config: any | null = null
        ): TSystem {
            let system = this.getSystem(systemClass);

            if (system !== null) {
                console.warn("The system has been registered.", egret.getQualifiedClassName(systemClass));

                return system;
            }

            system = BaseSystem.create<TEntity, TSystem>(systemClass, context, order);

            if (this._isStarted) { // 程序启动后，延时初始化系统。
                this._cacheSystems.push([system, config]);
            }
            else { //
                this._register(system, config);
            }

            return system;
        }
        /**
         * 从程序已注册的全部系统中获取一个指定的系统。
         */
        public getSystem<TEntity extends IEntity, TSystem extends ISystem<TEntity>>(
            systemClass: ISystemClass<TSystem, TEntity>,
        ): TSystem | null {
            for (const system of this._systems) {
                if (system.constructor === systemClass) {
                    return system as TSystem;
                }
            }

            return null;
        }
        /**
         * 程序已注册的全部系统。
         */
        public get systems(): ReadonlyArray<ISystem<IEntity>> {
            return this._systems;
        }
    }
}
