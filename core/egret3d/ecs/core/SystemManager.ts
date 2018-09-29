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

        private constructor() {
        }

        private readonly _preSystems: { systemClass: { new(): BaseSystem }, order: number }[] = [];
        private readonly _systems: BaseSystem[] = [];

        private _getSystemInsertIndex(order: SystemOrder) {
            let index = -1;
            const systemCount = this._systems.length;

            if (systemCount > 0) {
                if (order < this._systems[0]._order) {
                    return 0;
                }
                else if (order >= this._systems[systemCount - 1]._order) {
                    return systemCount;
                }
            }

            for (let i = 0; i < systemCount - 1; ++i) {
                if (this._systems[i]._order <= order && order < this._systems[i + 1]._order) {
                    index = i + 1;
                    break;
                }
            }

            return index < 0 ? this._systems.length : index;
        }

        private _checkRegister<T extends BaseSystem>(systemClass: { new(): T }) {
            const system = this.getSystem(systemClass);
            if (system) {
                console.warn("The system has been registered.", egret.getQualifiedClassName(systemClass));

                return system;
            }

            return system;
        }
        /**
         * @internal
         */
        public _preRegisterSystems() {
            this._preSystems.sort((a, b) => { return a.order - b.order });

            for (const pair of this._preSystems) {
                this.register(pair.systemClass, pair.order);
            }

            this._preSystems.length = 0;
        }
        /**
         * @internal
         */
        public _update() {
            for (const system of this._systems) {
                if (system && system.enabled && !system._started) {
                    system._started = true;
                    system.onStart && system.onStart();
                }
            }

            for (const system of this._systems) {
                if (system) {
                    system._update();
                }
            }

            for (const system of this._systems) {
                if (system) {
                    system._lateUpdate();
                }
            }
        }
        /**
         * 在程序启动之前预注册一个指定的系统。
         */
        public preRegister<T extends BaseSystem>(systemClass: { new(): T }, order: SystemOrder = SystemOrder.Update) {
            if (this._systems.length > 0) {
                this.register(systemClass, order);
                return this;
            }

            this._preSystems.unshift({ systemClass, order });

            return this;
        }
        /**
         * 为程序注册一个指定的系统。
         */
        public register<T extends BaseSystem>(systemClass: { new(): T }, order: SystemOrder = SystemOrder.Update) {
            let system = this._checkRegister(systemClass);
            if (system) {
                return system;
            }

            system = BaseSystem.create(systemClass, order) as T;
            this._systems.splice(this._getSystemInsertIndex(order), 0, system);
            system._initialize();

            return system;
        }
        /**
         * 从程序已注册的全部系统中获取一个指定的系统。
         */
        public getSystem<T extends BaseSystem>(systemClass: { new(): T }) {
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    return system as T;
                }
            }

            return null;
        }
        /**
         * 从程序已注册的全部系统中获取一个指定的系统，如果尚未注册，则注册该系统。
         */
        public getOrRegisterSystem<T extends BaseSystem>(systemClass: { new(): T }, order: SystemOrder = SystemOrder.Update) {
            let system = this.getSystem(systemClass);
            if (!system) {
                system = this.register(systemClass, order);
            }

            return system;
        }
        /**
         * 程序已注册的全部系统。
         */
        public get systems(): ReadonlyArray<BaseSystem> {
            return this._systems;
        }
    }
}
