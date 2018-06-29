namespace paper {
    /**
     * 系统关心组件的配置。
     */
    export type InterestConfig<T extends BaseComponent> = {
        /**
         * 关心的组件或组件列表。
         */
        componentClass: { new(): T } | ({ new(): T }[]);
        /**
         * 是否排除关心的组件。
         */
        isExclude?: boolean;
        /**
         * 是否关心派生的组件。
         */
        isExtends?: boolean;
        /**
         * 关心该组件的事件。
         */
        listeners?: {
            /**
             * 事件类型。
             */
            type: string;
            /**
             * 事件监听。
             */
            listener: (component: T) => void;
        }[];
    };
    /**
     * 系统基类。
     */
    export abstract class BaseSystem<T extends BaseComponent> {
        /**
         * 防止生成未经管理的系统实例。
         * @internal
         */
        public static _createEnabled: boolean = false;
        protected _enabled: boolean = true;
        protected _bufferedCount: number = 0;
        /**
         * @internal
         */
        public _level: number = 0;
        /**
         * 系统对于每个实体关心的组件总数。
         */
        protected _interestComponentCount = 0;
        /**
         * 关心列表。
         */
        protected readonly _interests: ReadonlyArray<InterestConfig<T>> = [];
        /**
         * 系统根据关心列表收集的组件列表。
         */
        protected readonly _components: T[] = [];
        /**
         * 系统收集的实体。
         */
        protected readonly _gameObjectOffsets: { [key: string]: number } = {};
        /**
         * 缓冲的实体组件，将在下个逻辑循环中加入到系统。
         */
        protected readonly _waittingComponents: { [key: string]: T[] } = {};
        /**
         * @internal
         */
        public constructor() {
            if (!BaseSystem._createEnabled) {
                throw new Error("Create an instance of a system is not allowed.");
            }

            BaseSystem._createEnabled = false;
        }
        /**
         * 当关心的组件被添加时。
         */
        protected _onAddComponent(component: T) {
            const gameObject = component.gameObject;
            const uuid = gameObject.uuid;

            if (
                uuid in this._gameObjectOffsets ||
                uuid in this._waittingComponents
            ) {
                return;
            }

            const components = new Array<T>();

            for (const config of this._interests) {
                let insterestComponent: T | null = null;

                if (Array.isArray(config.componentClass)) {
                    for (const componentClass of config.componentClass) {
                        insterestComponent = gameObject.getComponent(componentClass, config.isExtends); // TODO 更快的查找方式
                        if (insterestComponent) {
                            break;
                        }
                    }
                }
                else {
                    insterestComponent = gameObject.getComponent(config.componentClass, config.isExtends); // TODO 更快的查找方式
                }

                if (config.isExclude ? insterestComponent : !insterestComponent) {
                    return;
                }

                components.push(insterestComponent as any); // ts 不能推断。
            }

            this._bufferedCount++;
            this._waittingComponents[uuid] = components;
        }
        /**
         * 当关心的组件被移除时。
         */
        protected _onRemoveComponent(component: T) {
            const gameObject = component.gameObject;
            const uuid = gameObject.uuid;

            if (uuid in this._gameObjectOffsets) {
                const interestCount = this._interestComponentCount;
                const components = this._components;
                const backupLength = components.length;
                const gameObjectOffset = this._gameObjectOffsets[gameObject.uuid];

                if (backupLength > interestCount) {
                    let lastGameObject: GameObject | null = null;

                    for (let i = 0; i < interestCount; ++i) {
                        if (!lastGameObject) {
                            lastGameObject = components[backupLength - interestCount].gameObject;
                        }

                        components[gameObjectOffset + i] = components[backupLength - interestCount + i];
                    }

                    if (lastGameObject) {
                        this._gameObjectOffsets[lastGameObject.uuid] = gameObjectOffset;
                    }
                }

                components.length -= interestCount;
                delete this._gameObjectOffsets[gameObject.uuid];

                this.onRemoveGameObject && this.onRemoveGameObject(gameObject);
            }
            else if (uuid in this._waittingComponents) {
                this._bufferedCount++;
                delete this._waittingComponents[uuid];
            }
        }
        /**
         * 判断实体是否在系统内。
         */
        protected _hasGameObject(gameObject: GameObject) {
            return gameObject.uuid in this._gameObjectOffsets;
        }
        /**
         * 根据关心列表的顺序快速查找指定组件。
         */
        protected _getComponent(gameObject: GameObject, componentOffset: number) {
            if (gameObject.uuid in this._gameObjectOffsets) {
                return this._components[this._gameObjectOffsets[gameObject.uuid] + componentOffset];
            }

            return null;
        }
        /**
         * @internal
         */
        protected _isEditorUpdate() {
            return Application.isEditor && !Application.isPlaying;
        }
        /**
         * 系统内部初始化。
         * @internal
         */
        public initialize() {
            this._onAddComponent = this._onAddComponent.bind(this);
            this._onRemoveComponent = this._onRemoveComponent.bind(this);

            for (const config of this._interests) {
                if (config.listeners) {
                    for (const listenerConfig of config.listeners) {
                        if (Array.isArray(config.componentClass)) {
                            for (const componentClass of config.componentClass) {
                                EventPool.addEventListener(listenerConfig.type, componentClass, listenerConfig.listener);
                            }
                        }
                        else {
                            EventPool.addEventListener(listenerConfig.type, config.componentClass, listenerConfig.listener);
                        }
                    }
                }

                this._interestComponentCount++;

                if (Array.isArray(config.componentClass)) {
                    for (const componentClass of config.componentClass) {
                        EventPool.addEventListener(EventPool.EventType.Enabled, componentClass, this._onAddComponent);
                        EventPool.addEventListener(EventPool.EventType.Disabled, componentClass, this._onRemoveComponent);
                    }
                }
                else {
                    EventPool.addEventListener(EventPool.EventType.Enabled, config.componentClass, this._onAddComponent);
                    EventPool.addEventListener(EventPool.EventType.Disabled, config.componentClass, this._onRemoveComponent);
                }
            }

            this.onAwake && this.onAwake();
            this.onEnable && this.onEnable();
        }
        /**
         * 系统内部卸载。
         * @internal
         */
        public uninitialize() {
            this.onDestroy && this.onDestroy();

            for (const config of this._interests) {
                if (config.listeners) {
                    for (const listenerConfig of config.listeners) {
                        if (Array.isArray(config.componentClass)) {
                            for (const componentClass of config.componentClass) {
                                EventPool.removeEventListener(listenerConfig.type, componentClass, listenerConfig.listener);
                            }
                        }
                        else {
                            EventPool.removeEventListener(listenerConfig.type, config.componentClass, listenerConfig.listener);
                        }
                    }
                }

                this._interestComponentCount++;

                if (Array.isArray(config.componentClass)) {
                    for (const componentClass of config.componentClass) {
                        EventPool.removeEventListener(EventPool.EventType.Enabled, componentClass, this._onAddComponent);
                        EventPool.removeEventListener(EventPool.EventType.Disabled, componentClass, this._onRemoveComponent);
                    }
                }
                else {
                    EventPool.removeEventListener(EventPool.EventType.Enabled, config.componentClass, this._onAddComponent);
                    EventPool.removeEventListener(EventPool.EventType.Disabled, config.componentClass, this._onRemoveComponent);
                }
            }

            this._components.length = 0;

            for (const k in this._gameObjectOffsets) {
                delete this._gameObjectOffsets[k];
            }

            for (const k in this._waittingComponents) {
                delete this._waittingComponents[k];
            }
        }
        /**
         * 系统内部更新。
         * @internal
         */
        public update() {
            if (this._bufferedCount > 0) {
                for (const k in this._waittingComponents) {
                    const components = this._waittingComponents[k];
                    const gameObject = components[0].gameObject;
                    this._gameObjectOffsets[k] = this._components.length;
                    delete this._waittingComponents[k];

                    for (const component of components) {
                        this._components.push(component);
                    }

                    this.onAddGameObject && this.onAddGameObject(gameObject);
                }

                this._bufferedCount = 0;
            }

            if (this._enabled) {
                this.onUpdate && this.onUpdate();
            }
        }
        /**
         * 系统初始化时调用。
         */
        public onAwake?(): void;
        /**
         * 系统被激活时调用。
         * @see paper.BaseSystem#enabled
         */
        public onEnable?(): void;
        /**
         * 系统开始运行时调用。
         */
        public onStart?(): void;
        /**
         * 实体被添加到系统时调用。
         * @see paper.GameObject#addComponent()
         */
        public onAddGameObject?(gameObject: GameObject): void;
        /**
         * 实体从系统移除时调用。
         * @see paper.GameObject#removeComponent()
         */
        public onRemoveGameObject?(gameObject: GameObject): void;
        /**
         * 系统更新时调用。
         */
        public onUpdate?(): void;
        /**
         * 系统被禁用时调用。
         * @see paper.BaseSystem#enabled
         */
        public onDisable?(): void;
        /**
         * 系统被注销时调用。
         * @see paper.SystemManager#unregister()
         * @see paper.Application#systemManager
         */
        public onDestroy?(): void;
        /**
         * 该系统是否被激活。
         * - 当禁用时，仅停止 onUpdate 生命周期。
         */
        public get enabled() {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled === value) {
                return;
            }

            this._enabled = value;

            if (this._enabled) {
                this.onEnable && this.onEnable();
            }
            else {
                this.onDisable && this.onDisable();
            }
        }
        /**
         * 
         */
        public get level() {
            return this._level;
        }
        /**
         * 该系统所关心的所有组件。
         */
        public get components(): ReadonlyArray<T> {
            return this._components;
        }
    }
}