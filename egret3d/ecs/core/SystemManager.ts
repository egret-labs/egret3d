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

        private readonly _systems: (BaseSystem | null)[] = [];
        private _currentSystem: BaseSystem = null as any;

        private _preRegister(systemClass: { new(): BaseSystem }) {
            if (this.getSystem(systemClass)) {
                console.warn("The system has been registered.", egret.getQualifiedClassName(systemClass));

                return true;
            }

            return false;
        }
        /**
         * 注册一个系统到管理器中。
         */
        public register(systemClass: { new(): BaseSystem }, after: { new(): BaseSystem } | null = null) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let index = -1;
            const system = BaseSystem.create(systemClass);

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
        }
        /**
         * 注册一个系统到管理器中。
         */
        public registerBefore(systemClass: { new(): BaseSystem }, before: { new(): BaseSystem } | null = null) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let index = -1;
            const system = BaseSystem.create(systemClass);

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
         * 
         */
        public enableSystem(systemClass: { new(): BaseSystem }) {
            const system = this.getSystem(systemClass);
            if (system) {
                system.enabled = true;
            }
            else {
                console.warn("Enable system error.", egret.getQualifiedClassName(systemClass));
            }
        }
        /**
         * 
         */
        public disableSystem(systemClass: { new(): BaseSystem }) {
            const system = this.getSystem(systemClass);
            if (system) {
                system.enabled = false;
            }
            else {
                console.warn("Disable system error.", egret.getQualifiedClassName(systemClass));
            }
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
         * @internal
         */
        public update() {
            for (const system of this._systems) {
                if (system && system.enabled && !system._started) {
                    this._currentSystem = system;
                    system._started = true;
                    system.onStart && system.onStart();
                }
            }

            for (const system of this._systems) {
                if (system) {
                    this._currentSystem = system;
                    system.update();
                }
            }

            for (const system of this._systems) {
                if (system) {
                    this._currentSystem = system;
                    system.lateUpdate();
                }
            }
        }
        /**
         * 
         */
        public get systems(): ReadonlyArray<BaseSystem | null> {
            return this._systems;
        }
    }
}
