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

        private readonly _preSystems: { new(): BaseSystem }[] = [];
        private readonly _preBeforeSystems: { new(): BaseSystem }[] = [];
        private readonly _systems: BaseSystem[] = [];

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
            for (let i = 0, l = this._preSystems.length; i < l; i += 2) {
                this.register(this._preSystems[i], this._preSystems[i + 1]);
            }

            for (let i = 0, l = this._preBeforeSystems.length; i < l; i += 2) {
                this.register(this._preBeforeSystems[i], this._preBeforeSystems[i + 1]);
            }

            this._preSystems.length = 0;
            this._preBeforeSystems.length = 0;
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
        public preRegister<T extends BaseSystem>(systemClass: { new(): T }, afterOrBefore: { new(): BaseSystem } | null = paper.UpdateSystem, isBefore: boolean = false) {
            if (this._systems.length > 0) {
                console.warn("Can not pre-register system after framework running.");
                return this;
            }

            if (isBefore) {
                this._preSystems.push(systemClass, afterOrBefore);
            }
            else {
                this._preBeforeSystems.push(systemClass, afterOrBefore);
            }

            return this;
        }
        /**
         * 为程序注册一个指定的系统。
         */
        public register<T extends BaseSystem>(systemClass: { new(): T }, after: { new(): BaseSystem } | null = paper.UpdateSystem) {
            let system = this._checkRegister(systemClass);
            if (system) {
                return system;
            }

            let index = -1;
            system = BaseSystem.create(systemClass) as T;

            if (after) {
                for (let i = 0, l = this._systems.length; i < l; ++i) {
                    const eachSystem = this._systems[i];
                    if (eachSystem && eachSystem.constructor === after) {
                        index = i + 1;
                        this._systems.splice(index, 0, system);
                        break;
                    }
                }
            }

            if (index < 0) {
                this._systems.push(system);
            }

            system._initialize();

            return system;
        }
        /**
         * 为程序注册一个指定的系统。
         */
        public registerBefore<T extends BaseSystem>(systemClass: { new(): T }, before: { new(): BaseSystem } | null = null) {
            let system = this._checkRegister(systemClass);
            if (system) {
                return system;
            }

            let index = -1;
            system = BaseSystem.create(systemClass) as T;

            if (before) {
                for (let i = 0, l = this._systems.length; i < l; ++i) {
                    const eachSystem = this._systems[i];
                    if (eachSystem && eachSystem.constructor === before) {
                        index = i;
                        this._systems.splice(index, 0, system);
                        break;
                    }
                }
            }

            if (index < 0) {
                this._systems.unshift(system);
            }

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
         *  从程序已注册的全部系统中获取一个指定的系统，如果尚未注册，则注册该系统。
         */
        public getOrRegisterSystem<T extends BaseSystem>(systemClass: { new(): T }) {
            let system = this.getSystem(systemClass);
            if (!system) {
                system = this.register(systemClass);
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
