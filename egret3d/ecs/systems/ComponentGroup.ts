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
        componentClass: ComponentClass<BaseComponent>[] | ComponentClass<BaseComponent>;
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
    export class ComponentGroup {
        private static readonly _groups: ComponentGroup[] = [];
        /**
         * @internal
         */
        public static create(interestConfig: ReadonlyArray<InterestConfig>): ComponentGroup {
            interestConfig = Array.isArray(interestConfig) ? interestConfig : [interestConfig];

            for (const group of this._groups) {
                if (group._interestConfig.length !== interestConfig.length) {
                    continue;
                }

                let isSame = true;
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

            const group = new ComponentGroup(interestConfig);
            this._groups.push(group);

            return group;
        }
        /**
         * @internal
         */
        public static update() {
            for (const group of this._groups) {
                group._update();
            }
        }
        /**
         * 
         */
        public locked: boolean = false;
        public readonly name: string = "";

        private _isRemoved: boolean = false;
        private readonly _isBehaviour: boolean = false;
        private readonly _bufferedGameObjects: (GameObject)[] = [];
        /**
         * @internal
         */
        public readonly _addedGameObjects: (GameObject | null)[] = [];
        private _gameObjects: GameObject[] = [];
        private readonly _bufferedComponents: (BaseComponent)[] = [];
        /**
         * @internal
         */
        public readonly _addedComponents: (BaseComponent | null)[] = [];
        private _behaviourComponents: BaseComponent[] = [];
        private readonly _interestConfig: ReadonlyArray<InterestConfig> = null as any;

        private constructor(interestConfig: ReadonlyArray<InterestConfig>) {
            this._isBehaviour = interestConfig.length === 1 && interestConfig[0].type !== undefined && (interestConfig[0].type as InterestType & InterestType.Unessential) !== 0;
            this._interestConfig = interestConfig;
            this._onAddComponent = this._onAddComponent.bind(this);
            this._onRemoveComponent = this._onRemoveComponent.bind(this);
            this._onAddUnessentialComponent = this._onAddUnessentialComponent.bind(this);
            this._onRemoveUnessentialComponent = this._onRemoveUnessentialComponent.bind(this);

            for (const config of this._interestConfig) {
                const isUnessential = config.type && (config.type & InterestType.Unessential);

                if (Array.isArray(config.componentClass)) {
                    for (const componentClass of config.componentClass) {
                        EventPool.addEventListener(EventPool.EventType.Disabled, componentClass, this._onRemoveUnessentialComponent);

                        if (!isUnessential) {
                            EventPool.addEventListener(EventPool.EventType.Enabled, componentClass, this._onAddComponent);
                            EventPool.addEventListener(EventPool.EventType.Disabled, componentClass, this._onRemoveComponent);
                        }

                        EventPool.addEventListener(EventPool.EventType.Enabled, componentClass, this._onAddUnessentialComponent);
                    }
                }
                else {
                    EventPool.addEventListener(EventPool.EventType.Disabled, config.componentClass, this._onRemoveUnessentialComponent);

                    if (!isUnessential) {
                        EventPool.addEventListener(EventPool.EventType.Enabled, config.componentClass, this._onAddComponent);
                        EventPool.addEventListener(EventPool.EventType.Disabled, config.componentClass, this._onRemoveComponent);
                    }

                    EventPool.addEventListener(EventPool.EventType.Enabled, config.componentClass, this._onAddUnessentialComponent);
                }
            }

            for (const scene of paper.Application.sceneManager.scenes) {
                for (const gameObject of scene.gameObjects) {
                    this._addGameObject(gameObject);
                }
            }
        }

        private _onAddComponent(component: BaseComponent) {
            this._addGameObject(component.gameObject);
        }

        private _onAddUnessentialComponent(component: BaseComponent) {
            const gameObject = component.gameObject;

            if (!this._isBehaviour) {
                if (gameObject === GameObject.globalGameObject) { // Pass global game object.
                    return;
                }

                if (this._bufferedGameObjects.indexOf(gameObject) < 0 && this._gameObjects.indexOf(gameObject) < 0) {// Uninclude.
                    return;
                }
            }

            if (this._bufferedComponents.indexOf(component) >= 0 || this._behaviourComponents.indexOf(component) >= 0) { // Buffered or added.
                return;
            }

            this._bufferedComponents.push(component);
        }

        private _onRemoveUnessentialComponent(component: BaseComponent) {
            const gameObject = component.gameObject;

            let index = this._bufferedComponents.indexOf(component);
            if (index >= 0) { // Buffered.
                this._bufferedComponents.splice(index, 1);
                return;
            }

            if (this._isBehaviour) {
                index = this._behaviourComponents.indexOf(component);
                if (index < 0) { // Uninclude.
                    return;
                }

                this._isRemoved = true;
                this._behaviourComponents[index] = null as any;

                index = this._addedComponents.indexOf(component);
                if (index >= 0) {
                    this._addedComponents[index] = null;
                }
            }
            else {
                if (gameObject === GameObject.globalGameObject) { // Pass global game object.
                    return;
                }

                if (this._gameObjects.indexOf(gameObject) < 0) { // Uninclude.
                    return;
                }

                index = this._addedComponents.indexOf(component);
                if (index >= 0) {
                    this._addedComponents[index] = null;
                }
            }

            for (const system of Application.systemManager.systems) {
                if (!system.onRemoveComponent || system.groups.indexOf(this) < 0) {
                    continue;
                }

                system.onRemoveComponent(component, this);
            }
        }

        private _onRemoveComponent(component: BaseComponent) {
            this._removeGameObject(component.gameObject);
        }

        private _addGameObject(gameObject: GameObject) {
            if (!this._isBehaviour && gameObject === GameObject.globalGameObject) { // Pass global game object.
                return;
            }

            if (
                this._bufferedGameObjects.indexOf(gameObject) >= 0 ||
                this._gameObjects.indexOf(gameObject) >= 0
            ) { // Buffered or added.
                return;
            }

            for (const config of this._interestConfig) {
                if (config.type && (config.type & InterestType.Unessential)) {
                    continue;
                }

                const isExtends = config.type && (config.type & InterestType.Extends) !== 0;
                const isExculde = config.type && (config.type & InterestType.Exculde) !== 0;
                let insterestComponent: BaseComponent | null = null;

                if (Array.isArray(config.componentClass)) {
                    for (const componentClass of config.componentClass) {
                        insterestComponent = gameObject.getComponent(componentClass as any, isExtends);
                        if (insterestComponent) { // Anyone.
                            break;
                        }
                    }
                }
                else {
                    insterestComponent = gameObject.getComponent(config.componentClass as any, isExtends);
                }

                if (isExculde ? insterestComponent : !insterestComponent) {
                    return;
                }
            }

            this._bufferedGameObjects.push(gameObject);
        }

        private _removeGameObject(gameObject: GameObject) {
            let index = this._bufferedGameObjects.indexOf(gameObject);
            if (index >= 0) {
                this._bufferedGameObjects.splice(index, 1);
            }
            else {
                index = this._gameObjects.indexOf(gameObject);
                if (index >= 0) {

                    if (this.locked) {
                        this.locked = false;
                        this._gameObjects = this._gameObjects.concat();
                    }

                    this._gameObjects.splice(index, 1);

                    index = this._addedGameObjects.indexOf(gameObject);
                    if (index >= 0) {
                        this._addedGameObjects[index] = null;
                    }

                    for (const system of Application.systemManager.systems) {
                        if (!system.onRemoveGameObject || system.groups.indexOf(this) < 0) {
                            continue;
                        }

                        system.onRemoveGameObject(gameObject, this);
                    }
                }
            }
        }

        private _update() {
            this.locked = false;

            if (this._addedGameObjects.length > 0) {
                this._addedGameObjects.length = 0;
            }

            if (this._addedComponents.length > 0) {
                this._addedComponents.length = 0;
            }

            if (this._isRemoved) {
                let index = 0;
                let removeCount = 0;
                this._isRemoved = false;

                for (const component of this._behaviourComponents) {
                    if (component) {
                        if (removeCount > 0) {
                            this._behaviourComponents[index - removeCount] = component;
                            this._behaviourComponents[index] = null as any;
                        }
                    }
                    else {
                        removeCount++;
                    }

                    index++;
                }

                if (removeCount > 0) {
                    this._behaviourComponents.length -= removeCount;
                }
            }

            if (this._bufferedGameObjects.length > 0) {
                for (const gameObject of this._bufferedGameObjects) {
                    if (!gameObject) {
                        continue;
                    }

                    this._addedGameObjects.push(gameObject);
                    this._gameObjects.push(gameObject);
                }

                this._bufferedGameObjects.length = 0;
            }

            if (this._bufferedComponents.length > 0) {
                for (const component of this._bufferedComponents) {
                    if (!component) {
                        continue;
                    }

                    this._addedComponents.push(component);

                    if (component instanceof Behaviour) {
                        if (component.gameObject.getComponent(egret3d.Camera)) { // Camera component update first.
                            this._behaviourComponents.unshift(component);
                        }
                        else {
                            this._behaviourComponents.push(component);
                        }
                    }
                }

                this._bufferedComponents.length = 0;
            }
        }
        /**
         * 判断实体是否被收集。
         */
        public hasGameObject(gameObject: GameObject) {
            return this._gameObjects.indexOf(gameObject) >= 0;
        }
        /**
         * 
         */
        public get gameObjects(): ReadonlyArray<GameObject> {
            return this._gameObjects;
        }
        /**
         * 
         */
        public get components(): ReadonlyArray<BaseComponent> {
            return this._behaviourComponents;
        }
    }
}