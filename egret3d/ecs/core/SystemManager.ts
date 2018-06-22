namespace paper {
    /**
     * SystemManager 是ecs内部的系统管理者，负责每帧循环时轮询每个系统。
     */
    export class SystemManager {
        private readonly _registerSystems: (BaseSystem<any> | null)[] = [];
        private readonly _systems: (BaseSystem<any> | null)[] = [];
        private readonly _unregisterSystems: (BaseSystem<any> | null)[] = [];

        private _preRegister(systemClass: { new(): BaseSystem<any> }) {
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
        public register(systemClass: { new(): BaseSystem<any> }, level: number = 0) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let isAdded = false;
            BaseSystem._createEnabled = true;
            const system = new systemClass();
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
        public registerBefore(systemClass: { new(): BaseSystem<any> }, target: { new(): BaseSystem<any> }) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let isAdded = false;
            BaseSystem._createEnabled = true;
            const system = new systemClass();

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
        public registerAfter(systemClass: { new(): BaseSystem<any> }, target: { new(): BaseSystem<any> }) {
            if (this._preRegister(systemClass)) {
                return;
            }

            let isAdded = false;
            BaseSystem._createEnabled = true;
            const system = new systemClass();

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
        public unregister(systemClass: { new(): BaseSystem<any> }) {
            // TODO 移除可能正在注册但并未初始化的系统。
            let index = 0;
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    this._unregisterSystems.push(system);
                    this._systems[index] = null;
                    return;
                }

                index++;
            }

            console.warn("The system has not been registered.", egret.getQualifiedClassName(systemClass));
        }
        /**
         * 
         */
        public enableSystem(systemClass: { new(): BaseSystem<any> }) {
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
        public disableSystem(systemClass: { new(): BaseSystem<any> }) {
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
        public getSystem<T extends BaseSystem<any>>(systemClass: { new(): T }) {
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
            let index = 0;
            let removeCount = 0;

            if (this._registerSystems.length > 0) {
                for (const system of this._registerSystems) {
                    if (system) {
                        system.initialize();
                    }
                }

                this._registerSystems.length = 0;
            }

            for (const system of this._systems) {
                if (system) {
                    const systemName = (system.constructor as any).name;
                    egret3d.Profile.startTime(systemName);
                    if (removeCount > 0) {
                        this._systems[index - removeCount] = system;
                        this._systems[index] = null;
                    }

                    if (system.enabled) {
                        system.update();
                    }
                    egret3d.Profile.endTime(systemName);
                }
                else {
                    removeCount++;
                }

                index++;
            }

            if (removeCount > 0) {
                this._systems.length -= removeCount;

                if (this._unregisterSystems.length > 0) {
                    for (const system of this._unregisterSystems) {
                        if (system) {
                            system.uninitialize();
                        }
                    }

                    this._unregisterSystems.length = 0;
                }
            }
        }
    }
}
