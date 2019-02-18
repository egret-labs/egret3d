namespace paper {
    /**
     * 程序系统管理器。
     */
    export class SystemManager {
        private static _instance: SystemManager | null = null;
        /**
         * 程序系统管理器单例。
         */
        public static getInstance() {
            if (!this._instance) {
                this._instance = new SystemManager();
            }

            return this._instance;
        }

        private readonly _preSystems: [{ new(context: Context<IEntity>, order?: SystemOrder): BaseSystem<IEntity> }, Context<IEntity>, int][] = [];
        private readonly _systems: BaseSystem<IEntity>[] = [];
        private readonly _enableOrDisableSystems: BaseSystem<IEntity>[] = [];
        private readonly _startSystems: BaseSystem<IEntity>[] = [];
        private readonly _reactiveSystems: BaseSystem<IEntity>[] = [];
        private readonly _updateSystems: BaseSystem<IEntity>[] = [];
        private readonly _lateUpdateSystems: BaseSystem<IEntity>[] = [];

        private constructor() {
        }

        private _getSystemInsertIndex(systems: BaseSystem<IEntity>[], order: SystemOrder) {
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
        /**
         * 
         */
        public preRegisterSystems() {
            const preSystems = this._preSystems;
            preSystems.sort((a, b) => { return a[2] - b[2]; });

            for (const pair of preSystems) {
                this.register.apply(this, pair);
            }

            preSystems.length = 0;
        }
        /**
         * 
         */
        public update() {
            clock && clock.update(); // TODO

            for (const system of this._enableOrDisableSystems) {
                if (system._enabled === system.enabled || !system.enabled || !system.onEnable) {
                    continue;
                }

                system.onEnable();

                if (DEBUG) {
                    console.debug(egret.getQualifiedClassName(this), "enabled.");
                }
            }

            for (const system of this._startSystems) {
                if (!system._started) {
                    continue;
                }

                system.onStart!();
                system._started = true;
            }

            for (const system of this._reactiveSystems) {
                if (!system.enabled) {
                    continue;
                }

                const collectors = system.collectors;

                if (system.onEntityAdded) {
                    for (const collector of collectors) {
                        for (const entity of collector.addedEntities) {
                            if (entity) {
                                system.onEntityAdded(entity, collector);
                            }
                        }
                    }
                }

                if (system.onComponentAdded) {
                    for (const collector of collectors) {
                        for (const component of collector.addedComponentes) {
                            if (component) {
                                system.onComponentAdded(component, collector);
                            }
                        }
                    }
                }

                if (system.onComponentRemoved) {
                    for (const collector of collectors) {
                        for (const component of collector.removedComponentes) {
                            if (component) {
                                system.onComponentRemoved(component, collector);
                            }
                        }
                    }
                }

                if (system.onEntityRemoved) {
                    for (const collector of collectors) {
                        for (const entity of collector.removedEntities) {
                            if (entity) {
                                system.onEntityRemoved(entity, collector);
                            }
                        }
                    }
                }
            }

            for (const system of this._updateSystems) {
                let startTime = 0;

                if (DEBUG) {
                    (system.deltaTime as uint) = 0;
                    startTime = clock.now;
                }

                if (!system.enabled) {
                    continue;
                }

                system.onUpdate!(clock.deltaTime);

                if (DEBUG) {
                    (system.deltaTime as uint) += clock.now - startTime;
                }
            }

            for (const system of this._lateUpdateSystems) {
                if (!system.enabled) {
                    continue;
                }

                let startTime = 0;

                if (DEBUG) {
                    startTime = clock.now;
                }

                system.onLateUpdate!(clock.deltaTime);

                if (DEBUG) {
                    (system.deltaTime as uint) += clock.now - startTime;
                }
            }

            for (const system of this._enableOrDisableSystems) {
                if (system._enabled === system.enabled) {
                    continue;
                }

                system._enabled = system.enabled;

                if (system.enabled || !system.onDisable) {
                    continue;
                }

                system.onDisable();

                if (DEBUG) {
                    console.debug(egret.getQualifiedClassName(this), "disabled.");
                }
            }
        }
        /**
         * 在程序启动之前预注册一个指定的系统。
         */
        public preRegister<TEntity extends IEntity, TSystem extends BaseSystem<TEntity>>(systemClass: { new(context: Context<TEntity>, order?: SystemOrder): TSystem }, context: Context<TEntity>, order: SystemOrder = SystemOrder.Update): SystemManager {
            if (this._systems.length > 0) {
                this.register(systemClass, context, order);

                return this;
            }

            this._preSystems.unshift([systemClass as any, context, order]);

            return this;
        }
        /**
         * 为程序注册一个指定的系统。
         */
        public register<TEntity extends IEntity, TSystem extends BaseSystem<TEntity>>(systemClass: { new(context: Context<TEntity>, order?: SystemOrder): TSystem }, context: Context<TEntity>, order: SystemOrder = SystemOrder.Update, config?: any): TSystem | null {
            let system = this.getSystem(systemClass);

            if (system) {
                console.warn("The system has been registered.", egret.getQualifiedClassName(systemClass));

                return system;
            }

            system = BaseSystem.create<TEntity, TSystem>(systemClass, context, order);

            if (system.onEnable || system.onDisable) {
                this._enableOrDisableSystems.splice(this._getSystemInsertIndex(this._enableOrDisableSystems, order), 0, system);
            }

            if (system.onStart) {
                this._startSystems.splice(this._getSystemInsertIndex(this._startSystems, order), 0, system);
            }

            if (system.onEntityAdded || system.onComponentAdded || system.onComponentRemoved || system.onEntityRemoved) {
                this._reactiveSystems.splice(this._getSystemInsertIndex(this._reactiveSystems, order), 0, system);
            }

            if (system.onUpdate) {
                this._updateSystems.splice(this._getSystemInsertIndex(this._updateSystems, order), 0, system);
            }

            if (system.onLateUpdate) {
                this._lateUpdateSystems.splice(this._getSystemInsertIndex(this._lateUpdateSystems, order), 0, system);
            }

            this._systems.splice(this._getSystemInsertIndex(this._systems, order), 0, system);

            system.initialize(config);

            return system;
        }
        /**
         * 从程序已注册的全部系统中获取一个指定的系统。
         */
        public getSystem<TEntity extends IEntity, TSystem extends BaseSystem<TEntity>>(systemClass: { new(context: Context<TEntity>, order?: SystemOrder): TSystem }): TSystem | null {
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    return system as TSystem;
                }
            }

            return null;
        }
        /**
         * 程序已注册的全部系统。
         */
        public get systems(): ReadonlyArray<BaseSystem<IEntity>> {
            return this._systems;
        }
    }
}
