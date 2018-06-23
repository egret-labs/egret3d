namespace paper {
    /**
     * SystemManager 是ecs内部的系统管理者，负责每帧循环时轮询每个系统。
     */
    export class SystemManager {
        private readonly _systems: (BaseSystem<any> | null)[] = [];
        private readonly _unregisterSystems: (BaseSystem<any>)[] = [];


        private _checkRegistered(systemClass: { new(): BaseSystem<any> }) {
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    console.warn("The system has been registed.", egret.getQualifiedClassName(systemClass));
                    return true;
                }
            }

            return false;
        }
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param level 系统的优先级，越小越早执行。
         */
        public register(systemClass: { new(): BaseSystem<any> }, level: number = 0) {
            if (this._checkRegistered(systemClass)) {
                return;
            }

            let isAdded = false;
            BaseSystem._createEnabled = true;
            const system = new systemClass();
            system._level = level;

            for (let i = 0, l = this._systems.length; i < l; ++i) {
                const eachSystem = this._systems[i];
                if (eachSystem._level > system._level) {
                    isAdded = true;
                    this._systems.splice(i, 0, system);
                    break;
                }
            }

            if (!isAdded) {
                this._systems.push(system);
            }
            //
            system.initialize();
        }
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param target 加入到目标系统的前面。
         */
        public registerBefore(systemClass: { new(): BaseSystem<any> }, target: { new(): BaseSystem<any> }) {
            if (this._checkRegistered(systemClass)) {
                return;
            }

            let isAdded = false;
            BaseSystem._createEnabled = true;
            const system = new systemClass();

            for (let i = 0, l = this._systems.length; i < l; ++i) {
                const eachSystem = this._systems[i];
                if (eachSystem.constructor === target) {
                    isAdded = true;
                    this._systems.splice(i, 0, system);
                    break;
                }
            }

            if (!isAdded) {
                this._systems.push(system);
            }
            //
            system.initialize();
        }
        /**
         * 注册一个系统到管理器中
         * @param systemClass 要注册的系统
         * @param target 加入到目标系统的后面。
         */
        public registerAfter(systemClass: { new(): BaseSystem<any> }, target: { new(): BaseSystem<any> }) {
            if (this._checkRegistered(systemClass)) {
                return;
            }

            let isAdded = false;
            BaseSystem._createEnabled = true;
            const system = new systemClass();

            for (let i = 0, l = this._systems.length; i < l; ++i) {
                const eachSystem = this._systems[i];
                if (eachSystem.constructor === target) {
                    isAdded = true;
                    this._systems.splice(i + 1, 0, system);
                    break;
                }
            }

            if (!isAdded) {
                this._systems.push(system);
            }
            //
            system.initialize();
        }
        /**
         * 注销一个管理器中的系统
         * @param systemClass 要注销的系统
         */
        public unregister(systemClass: { new(): BaseSystem<any> }) {
            let index = 0;
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    this._unregisterSystems.push(system);
                    this._systems[index] = null;
                    return;
                }

                index++;
            }
        }
        /**
         * 
         */
        public enableSystem(systemClass: { new(): BaseSystem<any> }) {
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    system.enabled = true;
                }
            }
        }
        /**
         * 
         */
        public disableSystem(systemClass: { new(): BaseSystem<any> }) {
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    system.enabled = false;
                }
            }
        }
        /**
         * 
         */
        public getSystemEnabled(systemClass: { new(): BaseSystem<any> }) {
            for (const system of this._systems) {
                if (system && system.constructor === systemClass) {
                    return system.enabled;
                }
            }

            return false;
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
         * 
         */
        public update() {
            let index = 0;
            let removeCount = 0;

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
                        system.uninitialize();
                    }

                    this._unregisterSystems.length = 0;
                }
            }
        }
    }
}
