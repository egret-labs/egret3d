namespace paper {
    /**
     * SystemManager 是ecs内部的系统管理者，负责每帧循环时轮询每个系统。
     */
    export class SystemManager {
        private static _instance: SystemManager | null = null;
        
        public static getInstance() {
            if (!this._instance) {
                this._instance = new SystemManager();
            }

            return this._instance;
        }

        private constructor() {
        }

        private readonly _systems: BaseSystem[] = [];

        private _preRegister<T extends BaseSystem>(systemClass: { new(): T }) {
            const system = this.getSystem(systemClass);
            if (system) {
                console.warn("The system has been registered.", egret.getQualifiedClassName(systemClass));

                return system;
            }

            return system;
        }
        /**
         * 注册一个系统到管理器中。
         */
        public register<T extends BaseSystem>(systemClass: { new(): T }, after: { new(): BaseSystem } | null = paper.UpdateSystem) {
            let system = this._preRegister(systemClass);
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

            system.initialize();

            return system;
        }
        /**
         * 注册一个系统到管理器中。
         */
        public registerBefore<T extends BaseSystem>(systemClass: { new(): T }, before: { new(): BaseSystem } | null = null) {
            let system = this._preRegister(systemClass);
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

            system.initialize();
        }
        /**
         * 获取一个管理器中指定的系统实例。
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
         * 获取一个管理器中指定的系统实例。
         */
        public getOrRegisterSystem<T extends BaseSystem>(systemClass: { new(): T }) {
            let system = this.getSystem(systemClass);
            if (!system) {
                system = this.register(systemClass);
            }

            return system;
        }
        /**
         * @internal
         */
        public update() {
            for (const system of this._systems) {
                if (system && system.enabled && !system._started) {
                    system._started = true;
                    system.onStart && system.onStart();
                }
            }

            for (const system of this._systems) {
                if (system) {
                    system.update();
                }
            }

            for (const system of this._systems) {
                if (system) {
                    system.lateUpdate();
                }
            }
        }
        /**
         * 
         */
        public get systems(): ReadonlyArray<BaseSystem> {
            return this._systems;
        }
    }
}
