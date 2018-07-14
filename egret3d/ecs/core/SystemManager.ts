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

        private _currentSystem: BaseSystem = null as any;
        private readonly _registerSystems: (BaseSystem | null)[] = [];
        private readonly _systems: (BaseSystem | null)[] = [];
        private readonly _unregisterSystems: (BaseSystem | null)[] = [];

        private _preRegister(systemClass: { new(): BaseSystem }) {
            // TODO 移除可能正在注销但并未反初始化的系统。

            if (this.getSystem(systemClass)) {
                console.warn("The system has been registered.", egret.getQualifiedClassName(systemClass));

                return true;
            }

            return false;
        }
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param level 系统的优先级，越小越早执行。
         */
        public register(systemClass: { new(): BaseSystem }, level: number = 0) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let isAdded = false;
            const system = BaseSystem.create(systemClass);
            system._level = level;

            for (let i = 0, l = this._systems.length; i < l; ++i) {
                const eachSystem = this._systems[i];
                if (eachSystem && eachSystem._level > system._level) {
                    isAdded = true;
                    this._systems.splice(i, 0, system);
                    break;
                }
            }

            if (!isAdded) {
                this._systems.push(system);
            }

            this._registerSystems.push(system);
        }
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param target 加入到目标系统的前面。
         */
        public registerBefore(systemClass: { new(): BaseSystem }, target: { new(): BaseSystem }) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let isAdded = false;
            const system = BaseSystem.create(systemClass);

            for (let i = 0, l = this._systems.length; i < l; ++i) {
                const eachSystem = this._systems[i];
                if (eachSystem && eachSystem.constructor === target) {
                    isAdded = true;
                    system._level = eachSystem.level;
                    this._systems.splice(i, 0, system);
                    break;
                }
            }

            if (!isAdded) {
                if (this._systems.length > 0) {
                    const lastSystem = this._systems[this._systems.length - 1];
                    if (lastSystem) {
                        system._level = lastSystem.level;
                    }
                }

                this._systems.push(system);
            }

            this._registerSystems.push(system);
        }
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param target 加入到目标系统的后面。
         */
        public registerAfter(systemClass: { new(): BaseSystem }, target: { new(): BaseSystem }) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let isAdded = false;
            const system = BaseSystem.create(systemClass);

            for (let i = 0, l = this._systems.length; i < l; ++i) {
                const eachSystem = this._systems[i];
                if (eachSystem && eachSystem.constructor === target) {
                    isAdded = true;
                    system._level = eachSystem.level;
                    this._systems.splice(i + 1, 0, system);
                    break;
                }
            }

            if (!isAdded) {
                if (this._systems.length > 0) {
                    const lastSystem = this._systems[this._systems.length - 1];
                    if (lastSystem) {
                        system._level = lastSystem.level;
                    }
                }

                this._systems.push(system);
            }

            this._registerSystems.push(system);
        }
        /**
         * 注销一个管理器中的系统
         * @param systemClass 要注销的系统
         */
        public unregister(systemClass: { new(): BaseSystem }) {
            // TODO 移除可能正在注册但并未初始化的系统。
            let index = 0;
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    system.enabled = false;

                    if (!system.enabled) {
                        this._unregisterSystems.push(system);
                        this._systems[index] = null;
                    }

                    return;
                }

                index++;
            }

            console.warn("The system has not been registered.", egret.getQualifiedClassName(systemClass));
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
            Group.begin();

            if (this._registerSystems.length > 0) {
                for (const system of this._registerSystems) {
                    if (system) {
                        this._currentSystem = system;
                        system.initialize();
                    }
                }

                for (const system of this._registerSystems) {
                    if (system && system.enabled && !system._started) {
                        this._currentSystem = system;
                        system._started = true;
                        system.onStart && system.onStart();
                    }
                }

                this._registerSystems.length = 0;
            }

            // Enable.

            for (const system of this._systems) {
                if (system) {
                    this._currentSystem = system;
                    system.update();
                }
            }

            let index = 0;
            let removeCount = 0;

            for (const system of this._systems) {
                if (system) {
                    if (removeCount > 0) {
                        this._systems[index - removeCount] = system;
                        this._systems[index] = null;
                    }

                    this._currentSystem = system;
                    system.lateUpdate();
                }
                else {
                    removeCount++;
                }

                index++;
            }

            // Disable.

            if (removeCount > 0) {
                this._systems.length -= removeCount;

                if (this._unregisterSystems.length > 0) {
                    for (const system of this._unregisterSystems) {
                        if (system) {
                            this._currentSystem = system;
                            system.uninitialize();
                        }
                    }

                    this._unregisterSystems.length = 0;
                }
            }

            Group.end();
        }
        /**
         * 
         */
        public get system() {
            return this._currentSystem;
        }
        /**
         * 
         */
        public get systems(): ReadonlyArray<BaseSystem | null> {
            return this._systems;
        }
    }
}
