namespace paper {
    /**
     * 
     */
    export type InterestConfig<T extends BaseComponent> = {
        componentClass: { new(): T } | ({ new(): T }[]);

        listeners?: {
            type: string;
            listener: (component: T) => void;
        }[];
    };
    /**
     * 基础系统。
     */
    export abstract class BaseSystem<T extends BaseComponent> {
        /**
         * 防止生成未经管理的系统实例。
         * @internal
         */
        public static _createEnabled: boolean = false;
        /**
         * 是否更新该系统。
         */
        public enable: boolean = true;
        /**
         * @internal
         */
        public _level: number = 0;
        /**
         * 系统对于每个实体关心的组件总数。
         */
        protected _interestComponentCount: number = 0;
        /**
         * 关心列表。
         */
        protected readonly _interests: InterestConfig<T>[] = [];
        /**
         * 
         */
        protected readonly _components: T[] = [];
        /**
         * 
         */
        private readonly _gameObjectOffsets: { [key: string]: number } = {};
        /**
         * @internal
         */
        public constructor() {
            if (!BaseSystem._createEnabled) {
                throw new Error("Create an instance of a system is not allowed.");
            }

            BaseSystem._createEnabled = false;
        }

        private readonly _addListener = (component: T) => {
            this._onAddComponent(component as any);
        }
        /**
         * 
         */
        protected _onAddComponent(component: T) {
            if (!this.enable) {
                return false;
            }

            const components = this._components;
            const backupLength = components.length;
            const gameObject = component.gameObject;

            for (const config of this._interests) {
                let insterestComponent: T | null = null;

                if (Array.isArray(config.componentClass)) {
                    for (const componentClass of config.componentClass) {
                        insterestComponent = gameObject.getComponent(componentClass); // TODO 更快的查找方式
                        if (insterestComponent) {
                            break;
                        }
                    }
                }
                else {
                    insterestComponent = gameObject.getComponent(config.componentClass); // TODO 更快的查找方式
                }

                if (!insterestComponent || components.indexOf(insterestComponent) >= 0) {
                    components.length = backupLength;

                    return false;
                }

                components.push(insterestComponent);
            }

            this._gameObjectOffsets[gameObject.hashCode] = backupLength;

            return true;
        }
        /**
         * 
         */
        protected _onRemoveComponent(component: T) {
            const gameObject = component.gameObject;

            if (!(gameObject.hashCode in this._gameObjectOffsets)) {
                return false;
            }

            const interestCount = this._interestComponentCount;
            const components = this._components;
            const backupLength = components.length;
            const gameObjectOffset = this._gameObjectOffsets[gameObject.hashCode];

            if (backupLength > interestCount) {
                let lastGameObject: GameObject | null = null;

                for (let i = 0; i < interestCount; ++i) {
                    if (!lastGameObject) {
                        lastGameObject = components[backupLength - interestCount].gameObject;
                    }

                    components[gameObjectOffset + i] = components[backupLength - interestCount + i];
                }

                if (lastGameObject) {
                    this._gameObjectOffsets[lastGameObject.hashCode] = gameObjectOffset;
                }
            }

            components.length -= interestCount;
            delete this._gameObjectOffsets[gameObject.hashCode];

            return true;
        }
        /**
         * 系统内部根据关心列表的顺序快速查找指定组件。
         */
        protected _getComponent(gameObject: GameObject, componentOffset: number) {
            if (gameObject.hashCode in this._gameObjectOffsets) {
                return this._components[this._gameObjectOffsets[gameObject.hashCode] + componentOffset];
            }

            return null;
        }
        /**
         * @protected
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
        }
        /**
         * @protected
         */
        public uninitialize() {
            this._components.length = 0;

            for (const k in this._gameObjectOffsets) {
                delete this._gameObjectOffsets[k];
            }
        }
        /**
         * @protected
         */
        public abstract update(): void;
        /**
         * 该系统所关心的所有组件。
         */
        public get components(): ReadonlyArray<T> {
            return this._components;
        }
    }
}