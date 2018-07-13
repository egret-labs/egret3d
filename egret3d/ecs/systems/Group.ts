namespace paper {
    /**
     * 
     */
    export const enum InterestType {
        /**
         * 
         */
        Extends = 0b000001,
        /**
         * 
         */
        Exculde = 0b000010,
        /**
         * 
         */
        Unessential = 0b000100,
    }
    /**
     * 关心组件的配置。
     */
    export type InterestConfig = {
        /**
         * 关心的组件或组件列表。
         */
        componentClass: { new(): BaseComponent }[] | { new(): BaseComponent };
        /**
         * 
         */
        isBehaviour?: boolean;
        /**
         * 
         */
        type?: InterestType;
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
            listener: (component: BaseComponent) => void;
        }[];
    };
    /**
     * 
     */
    export class Group {
        private static readonly _groups: Group[] = [];

        public static getGroup(interestConfig: ReadonlyArray<InterestConfig>): Group {
            let isSame = true;
            let isBehaviour = false;
            interestConfig = Array.isArray(interestConfig) ? interestConfig : [interestConfig];

            for (const config of interestConfig) {
                if (config.isBehaviour) {
                    isBehaviour = true;
                    break;
                }
            }

            for (const group of this._groups) {
                if (group._interestConfig.length !== interestConfig.length) {
                    isSame = false;
                    continue;
                }

                for (let i = 0, l = interestConfig.length; i < l; ++i) {
                    const configA = interestConfig[i];
                    const configB = group._interestConfig[i];

                    if (configA.type !== configB.type) {
                        isSame = false;
                        break;
                    }

                    if (Array.isArray(configA.componentClass) && Array.isArray(configB.componentClass)) {
                        if (configA.componentClass.length !== configB.componentClass.length) {
                            isSame = false;
                            break;
                        }
                    }
                    else if (configA.componentClass !== configB.componentClass) {
                        isSame = false;
                        break;
                    }
                }

                if (isSame) {
                    return group;
                }
            }

            const group = new Group(interestConfig, isBehaviour);
            this._groups.push(group);

            return group;
        }
        /**
         * @internal
         */
        public static begin() {
            for (const group of this._groups) {
                group._begin();
            }
        }
        /**
         * @internal
         */
        public static end() {
            for (const group of this._groups) {
                group._end();
            }
        }
        /**
         * 每个实体关心的组件总数。
         */
        public readonly interestCount: number = 0;

        private readonly _isBehaviour: boolean = false;
        private readonly _bufferedComponents: BaseComponent[] = [];
        private readonly _bufferedUnessentialComponents: BaseComponent[] = [];
        /**
         * @internal
         */
        public readonly _addedComponents: BaseComponent[] = [];
        /**
         * @internal
         */
        public readonly _addedUnessentialComponents: BaseComponent[] = [];
        private readonly _components: BaseComponent[] = [];
        /**
         * @internal
         */
        public readonly _removedUnessentialComponents: BaseComponent[] = [];
        /**
         * @internal
         */
        public readonly _removedComponents: BaseComponent[] = [];
        private readonly _bufferedGameObjects: { [key: string]: number } = {};
        private readonly _addedGameObjects: { [key: string]: number } = {};
        private readonly _gameObjects: { [key: string]: number } = {};
        private readonly _removedGameObjects: { [key: string]: number } = {};
        private readonly _interestConfig: ReadonlyArray<InterestConfig> = null as any;

        private constructor(interestConfig: ReadonlyArray<InterestConfig>, isBehaviour: boolean) {
            this._isBehaviour = isBehaviour;
            this._interestConfig = interestConfig;
            this._onAddComponent = this._onAddComponent.bind(this);
            this._onRemoveComponent = this._onRemoveComponent.bind(this);
            this._onAddUnessentialComponent = this._onAddUnessentialComponent.bind(this);
            this._onRemoveUnessentialComponent = this._onRemoveUnessentialComponent.bind(this);

            for (const config of this._interestConfig) {
                if (config.type && (config.type & InterestType.Unessential)) {
                    if (Array.isArray(config.componentClass)) {
                        for (const componentClass of config.componentClass) {
                            EventPool.addEventListener(EventPool.EventType.Enabled, componentClass, this._onAddUnessentialComponent);
                            EventPool.addEventListener(EventPool.EventType.Disabled, componentClass, this._onRemoveUnessentialComponent);
                        }
                    }
                    else {
                        EventPool.addEventListener(EventPool.EventType.Enabled, config.componentClass, this._onAddUnessentialComponent);
                        EventPool.addEventListener(EventPool.EventType.Disabled, config.componentClass, this._onRemoveUnessentialComponent);
                    }
                }
                else {
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

                    this.interestCount++;
                }
            }
        }

        private _addGameObjectTo(
            uuid: string,
            fromComponents: BaseComponent[], fromOffsets: { [key: string]: number },
            toComponents: BaseComponent[], toOffsets: { [key: string]: number },
        ) {
            const interestCount = this.interestCount;
            const offset = fromOffsets[uuid];
            toOffsets[uuid] = toComponents.length;

            for (let i = 0, l = interestCount; i < l; ++i) {
                const component = fromComponents[offset + i];
                toComponents.push(component);
            }
        }

        private _removeGameObjectFrom(
            uuid: string,
            components: BaseComponent[], offsets: { [key: string]: number }
        ) {
            const interestCount = this.interestCount;
            const offset = offsets[uuid];
            const backupLength = components.length;

            if (backupLength > interestCount) {
                let lastGameObject: GameObject | null = null;

                for (let i = 0; i < interestCount; ++i) {
                    if (!lastGameObject) {
                        lastGameObject = components[backupLength - interestCount].gameObject;
                    }

                    components[offset + i] = components[backupLength - interestCount + i];
                }

                if (lastGameObject) {
                    offsets[lastGameObject.uuid] = offset;
                }
            }

            components.length -= interestCount;

            delete offsets[uuid];
        }

        private _onAddComponent(component: BaseComponent) {
            const gameObject = component.gameObject;
            const uuid = gameObject.uuid;

            if (uuid in this._bufferedGameObjects || uuid in this._gameObjects) { // Buffered or added.
                return;
            }

            if (uuid in this._removedGameObjects) { // Removed.
                console.warn("Add gameObject to group error.", gameObject.path);
                this._removeGameObjectFrom(uuid, this._removedComponents, this._removedGameObjects);
            }

            const backupLength = this._bufferedComponents.length;

            for (const config of this._interestConfig) {
                if (config.type && (config.type & InterestType.Unessential)) {
                    continue;
                }

                const isExtends = config.type && (config.type & InterestType.Extends) !== 0;
                const isExculde = config.type && (config.type & InterestType.Exculde) !== 0;
                let insterestComponent: BaseComponent | null = null;

                if (Array.isArray(config.componentClass)) {
                    for (const componentClass of config.componentClass) {
                        insterestComponent = gameObject.getComponent(componentClass, isExtends); // TODO 更快的查找方式
                        if (insterestComponent) { // Anyone.
                            break;
                        }
                    }
                }
                else {
                    insterestComponent = gameObject.getComponent(config.componentClass, isExtends); // TODO 更快的查找方式
                }

                if (isExculde ? insterestComponent : !insterestComponent) {
                    this._bufferedComponents.length = backupLength;
                    return;
                }

                this._bufferedComponents.push(insterestComponent);
            }

            this._bufferedGameObjects[uuid] = backupLength;
        }

        private _onAddUnessentialComponent(component: BaseComponent) {
            if (this._isBehaviour) {
                if (this._bufferedUnessentialComponents.indexOf(component) >= 0 || this._components.indexOf(component) >= 0) { // Buffered or added.
                    return;
                }

                let index = this._removedUnessentialComponents.indexOf(component);
                if (index >= 0) { // Removed.
                    this._removedUnessentialComponents.splice(index, 1);
                }

                this._bufferedUnessentialComponents.push(component);
                return;
            }

            const gameObject = component.gameObject;
            const uuid = gameObject.uuid;

            if (
                !(uuid in this._bufferedGameObjects || uuid in this._gameObjects) || // Uninclude.
                this._bufferedUnessentialComponents.indexOf(component) >= 0 || this._addedUnessentialComponents.indexOf(component) >= 0 // Buffered or added.
            ) {
                return;
            }

            const index = this._removedUnessentialComponents.indexOf(component);
            if (index >= 0) { // Removed.
                this._removedUnessentialComponents.splice(index, 1);
            }

            this._bufferedUnessentialComponents.push(component);
        }

        private _onRemoveUnessentialComponent(component: BaseComponent) {
            if (this._isBehaviour) {
                let index = this._components.indexOf(component);
                if (
                    index < 0 ||
                    this._removedUnessentialComponents.indexOf(component) >= 0
                ) {
                    return;
                }

                this._removedUnessentialComponents.push(component);
                this._components[index] = null as any;

                index = this._addedUnessentialComponents.indexOf(component);
                if (index >= 0) {
                    this._addedUnessentialComponents[index] = null as any;
                }

                return;
            }

            const gameObject = component.gameObject;
            const uuid = gameObject.uuid;

            if (
                !(uuid in this._bufferedGameObjects || uuid in this._gameObjects) || // Uninclude.
                this._removedUnessentialComponents.indexOf(component) >= 0 // Removed.
            ) {
                return;
            }

            const index = this._addedUnessentialComponents.indexOf(component);
            if (index >= 0) { // Added.
                this._addedUnessentialComponents.splice(index, 1);
            }

            this._removedUnessentialComponents.push(component);
        }

        private _onRemoveComponent(component: BaseComponent) {
            const gameObject = component.gameObject;
            const uuid = gameObject.uuid;

            if (uuid in this._bufferedGameObjects) {
                this._removeGameObjectFrom(uuid, this._bufferedComponents, this._bufferedGameObjects);
            }
            else if (uuid in this._gameObjects) {
                if (uuid in this._addedGameObjects) {
                    this._removeGameObjectFrom(uuid, this._addedComponents, this._addedGameObjects);
                }

                this._addGameObjectTo(uuid, this._components, this._gameObjects, this._removedComponents, this._removedGameObjects);
                this._removeGameObjectFrom(uuid, this._components, this._gameObjects);
            }
        }

        private _begin() {
            if (this._bufferedComponents.length > 0) {
                for (const k in this._bufferedGameObjects) {
                    this._addGameObjectTo(k, this._bufferedComponents, this._bufferedGameObjects, this._addedComponents, this._addedGameObjects);
                    this._addGameObjectTo(k, this._bufferedComponents, this._bufferedGameObjects, this._components, this._gameObjects);
                    delete this._bufferedGameObjects[k];
                }

                this._bufferedComponents.length = 0;
            }

            if (this._bufferedUnessentialComponents.length > 0) {
                for (const component of this._bufferedUnessentialComponents) {
                    this._addedUnessentialComponents.push(component);

                    if (this._isBehaviour) {
                        this._components.push(component);
                    }
                }

                this._bufferedUnessentialComponents.length = 0;
            }
        }

        private _end() {
            if (this._addedComponents.length > 0) {
                this._addedComponents.length = 0;

                for (const k in this._addedGameObjects) {
                    delete this._addedGameObjects[k];
                }
            }

            if (this._addedUnessentialComponents.length > 0) {
                this._addedUnessentialComponents.length = 0;
            }

            if (this._removedUnessentialComponents.length > 0) {
                this._removedUnessentialComponents.length = 0;

                if (this._isBehaviour) {
                    let index = 0;
                    let removeCount = 0;

                    for (const component of this._components) {
                        if (component) {
                            if (removeCount > 0) {
                                this._components[index - removeCount] = component;
                                this._components[index] = null as any;
                            }
                        }
                        else {
                            removeCount++;
                        }

                        index++;
                    }

                    if (removeCount > 0) {
                        this._components.length -= removeCount;
                    }
                }
            }

            if (this._removedComponents.length > 0) {
                this._removedComponents.length = 0;

                for (const k in this._removedGameObjects) {
                    delete this._removedGameObjects[k];
                }
            }
        }
        /**
         * 根据关心列表的顺序快速查找指定组件。
         * - 需要确保被查找组件的实体已经被收集。
         */
        public getComponent(gameObject: GameObject, componentOffset: number) {
            return this._components[this._gameObjects[gameObject.uuid] + componentOffset];
        }
        /**
         * 判断实体是否被收集。
         */
        public hasGameObject(gameObject: GameObject) {
            return gameObject.uuid in this._gameObjects;
        }
        /**
         * 
         */
        public get components(): ReadonlyArray<BaseComponent> {
            return this._components;
        }
    }
}