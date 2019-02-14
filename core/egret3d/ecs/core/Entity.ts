namespace paper {
    /**
     * 实体。
     */
    export class Entity extends BaseObject implements IEntity {
        /**
         * 当实体被创建时派发事件。
         */
        public static readonly onEntityCreated: signals.Signal<IEntity> = new signals.Signal();
        /**
         * 当实体将要被销毁时派发事件。
         */
        public static readonly onEntityDestroy: signals.Signal<IEntity> = new signals.Signal();
        /**
         * 当实体被销毁时派发事件。
         */
        public static readonly onEntityDestroyed: signals.Signal<IEntity> = new signals.Signal();
        /**
         * @internal
         */
        public static _globalEntity: IEntity = null!;

        public static create(name: string = DefaultNames.NoName): Entity {
            const entity = new Entity();
            entity._isDestroyed = false;
            entity._enabled = true;
            entity.name = name;
            entity.scene = SceneManager.getInstance().activeScene;

            return entity;
        }

        @serializedField
        @editor.property(editor.EditType.TEXT)
        public name: string = DefaultNames.NoName;
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        @serializedField
        public extras?: EntityExtras = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        protected _componentsDirty: boolean = false;
        protected _isDestroyed: boolean = true;
        @serializedField("_activeSelf") // TODO 反序列化 bug
        protected _enabled: boolean = false;
        protected readonly _components: (IComponent | undefined)[] = [];
        protected readonly _cachedComponents: IComponent[] = [];
        // public _context: IContext<this> | null = null;
        protected _scene: IScene | null = null;
        /**
         * 禁止实例化实体。
         * @protected
         */
        protected constructor() {
            super();
        }

        protected _destroy() {
            for (const component of this._components) {
                if (component) {
                    this._removeComponent(component, null);
                }
            }

            this._isDestroyed = true;
            this._components.length = 0;
            this._scene = null;
            Entity.onEntityDestroyed.dispatch(this);
        }

        protected _addComponent(component: IComponent, config?: any) {
            component.initialize(config);

            if (this._enabled) {
                Component.dispatchEnabledEvent(component, component.enabled);
            }
        }

        protected _removeComponent(component: IComponent, groupComponent: GroupComponent | null): void {
            // disposeCollecter.components.push(component); TODO

            component.enabled = false;

            (component as Component)._isDestroyed = true;

            if (groupComponent) {
                groupComponent.removeComponent(component);

                if (groupComponent.components.length === 0) {
                    this._removeComponent(groupComponent, null);
                }
            }
            else if (component.constructor === GroupComponent) {
                groupComponent = component as GroupComponent;

                for (const componentInGroup of groupComponent.components) {
                    this._removeComponent(componentInGroup, groupComponent);
                }

                delete this._components[groupComponent.componentIndex];
            }
            else {
                delete this._components[(component.constructor as IComponentClass<IComponent>).__index];
            }

            this._componentsDirty = true;
        }

        private _getComponent(componentClass: IComponentClass<IComponent>) {
            const componentIndex = componentClass.__index;

            return componentIndex < 0 ? undefined : this._components[componentIndex];
        }

        private _isRequireComponent(componentClass: IComponentClass<IComponent>) {
            for (const component of this._components) {
                if (component) {
                    const requireComponents = ((
                        (component.constructor === GroupComponent) ?
                            (component as GroupComponent).components[0] :
                            component
                    ).constructor as IComponentClass<IComponent>).requireComponents;

                    if (
                        requireComponents &&
                        requireComponents.indexOf(componentClass) >= 0
                    ) {
                        // TODO
                        // console.warn(`Cannot remove the ${egret.getQualifiedClassName(value)} component from the game object (${this.path}), because it is required from the ${egret.getQualifiedClassName(component)} component.`);
                        return true;
                    }
                }
            }

            return false;
        }

        public initialize(): void {
        }

        public uninitialize(): void {
            this.name = "";

            if (this.extras) { // Editor. TODO
                this.extras = {};
            }

            this._componentsDirty = false;
            this._cachedComponents.length = 0;
            // this._context = null;
            this._scene = null;
        }

        public destroy(): boolean {
            if (this._isDestroyed) {
                if (DEBUG) {
                    console.warn("The entity has been destroyed.");
                }

                return false;
            }

            if (this === Entity._globalEntity) {
                if (DEBUG) {
                    console.warn("Cannot destroy singleton entity.");
                }

                return false;
            }

            Entity.onEntityDestroy.dispatch(this);
            this._destroy();

            return true;
        }

        public addComponent<T extends IComponent>(componentClass: IComponentClass<T>, config?: any): T {
            if (!componentClass) {
                throw new Error();
            }

            if (this._isDestroyed) {
                throw new Error("The entity has been destroyed.");
            }

            if (this.constructor === Entity && componentClass.__isBehaviour) {
                throw new Error("Can not add behaviour to entity.");
            }

            //
            registerClass(componentClass);

            // Singleton component.
            if (componentClass.__isSingleton && this !== Entity._globalEntity) {
                return this.getComponent(componentClass) || this.addComponent(componentClass, config);
            }

            const componentIndex = componentClass.__index;
            const components = this._components;
            const existedComponent = components[componentIndex];

            // Check multiple component.
            if (!componentClass.allowMultiple && existedComponent) {
                if (DEBUG) {
                    console.warn(`Cannot add the ${egret.getQualifiedClassName(componentClass)} component to the entity (${this.name}) again.`);
                }

                return existedComponent as T;
            }

            // Require components.
            if (componentClass.requireComponents) {
                for (const requireComponentClass of componentClass.requireComponents) {
                    this.getComponent(requireComponentClass) || this.addComponent(requireComponentClass);
                }
            }

            // Create and add component.
            const component = Component.create(this, componentClass);

            if (existedComponent) {
                if (existedComponent.constructor === GroupComponent) {
                    (existedComponent as GroupComponent).addComponent(component);
                }
                else {
                    registerClass(GroupComponent); // TODO
                    //
                    const groupComponent = Component.create(this, GroupComponent);
                    groupComponent.initialize(componentIndex);
                    groupComponent.addComponent(existedComponent).addComponent(component);
                    components[componentIndex] = groupComponent;
                }
            }
            else {
                components[componentIndex] = component;
            }

            this._componentsDirty = true;
            this._addComponent(component, config);

            return component;
        }

        public removeComponent<T extends IComponent>(componentInstanceOrClass: IComponentClass<T> | T, isExtends: boolean = false): boolean {
            if (DEBUG && !componentInstanceOrClass) {
                throw new Error();
            }

            let result = false;

            if (componentInstanceOrClass instanceof BaseComponent) { // Remove component by instance.
                const componentClass = componentInstanceOrClass.constructor as IComponentClass<T>;

                if (componentClass.__isSingleton && this !== Entity._globalEntity) { // Singleton component.
                    return Entity._globalEntity.removeComponent(componentInstanceOrClass);
                }

                if (!this._isRequireComponent(componentClass)) {
                    this._removeComponent(componentInstanceOrClass, null);
                    result = true;
                }
            }
            else { // Remove component by class.
                const componentClass = componentInstanceOrClass as IComponentClass<T>;

                if (componentClass.__isSingleton && this !== Entity._globalEntity) { // Singleton component.
                    return Entity._globalEntity.removeComponent(componentClass, isExtends);
                }

                if (isExtends) {
                    for (let component of this._components) {
                        if (component) {
                            let groupComponent: GroupComponent | null = null;

                            if (component.constructor === GroupComponent) {
                                groupComponent = component as GroupComponent;
                                component = groupComponent.components[0];
                            }

                            if (
                                component instanceof componentClass &&
                                (
                                    groupComponent && groupComponent.components.length > 1 || // 多组件实例时，不用检查依赖。
                                    !this._isRequireComponent(component.constructor as IComponentClass<T>)
                                )
                            ) {
                                this._removeComponent(component, groupComponent);
                                result = true;
                            }
                        }
                    }
                }
                else {
                    let component = this._getComponent(componentClass);

                    if (component) {
                        let groupComponent: GroupComponent | null = null;

                        if (component.constructor === GroupComponent) {
                            groupComponent = component as GroupComponent;
                            component = groupComponent.components[0];
                        }

                        if (
                            groupComponent && groupComponent.components.length > 1 || // 多组件实例时，不用检查依赖。
                            !this._isRequireComponent(componentClass)
                        ) {
                            this._removeComponent(component, groupComponent);
                            result = true;
                        }
                    }
                }
            }

            return result;
        }

        public removeAllComponents<T extends IComponent>(componentClass?: IComponentClass<T>, isExtends: boolean = false): boolean {
            let result = false;

            if (componentClass) {
                if (componentClass.__isSingleton && this !== Entity._globalEntity) { // Singleton component.
                    return Entity._globalEntity.removeAllComponents(componentClass, isExtends);
                }

                if (isExtends) {
                    for (let component of this._components) {
                        if (component) {
                            let groupComponent: GroupComponent | null = null;

                            if (component.constructor === GroupComponent) {
                                groupComponent = component as GroupComponent;
                                component = groupComponent.components[0];
                            }

                            if (
                                component instanceof componentClass &&
                                !this._isRequireComponent(component.constructor as IComponentClass<T>)
                            ) {
                                this._removeComponent(groupComponent || component, null);
                                result = true;
                            }
                        }
                    }
                }
                else {
                    const component = this._getComponent(componentClass);

                    if (component && !this._isRequireComponent(componentClass)) {
                        this._removeComponent(component, null);
                        result = true;
                    }
                }
            }
            else {
                for (const component of this._components) {
                    if (component) {
                        this._removeComponent(component, null);
                        result = true;
                    }
                }
            }

            return result;
        }

        public getComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T | null {
            if (componentClass.__isSingleton && this !== Entity._globalEntity) { // SingletonComponent.
                return Entity._globalEntity.getComponent(componentClass, isExtends);
            }

            if (isExtends) {
                for (const component of this._components) {
                    if (component) {
                        if (component.constructor === GroupComponent) {
                            if ((component as GroupComponent).components[0] instanceof componentClass) {
                                return (component as GroupComponent).components[0] as T;
                            }
                        }
                        else if (component instanceof componentClass) {
                            return component;
                        }
                    }
                }
            }
            else {
                const componentIndex = componentClass.__index;

                if (componentIndex > 0) {
                    const component = this._components[componentIndex];

                    if (component) {
                        if (component.constructor === GroupComponent) {
                            return (component as GroupComponent).components[0] as T;
                        }

                        return component as T;
                    }
                }
            }

            return null;
        }

        public getComponents<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T[] {
            if (componentClass.__isSingleton && this !== Entity._globalEntity) { // SingletonComponent.
                return Entity._globalEntity.getComponents(componentClass, isExtends);
            }

            const components: T[] = [];

            if (isExtends) {
                for (const component of this._components) {
                    if (!component) {
                        continue;
                    }

                    if (component.constructor === GroupComponent && (component as GroupComponent).components[0] instanceof componentClass) {
                        for (const componentInGroup of (component as GroupComponent).components) {
                            components.push(componentInGroup as T);
                        }
                    }
                    else if (component instanceof componentClass) {
                        components.push(component);
                    }
                }
            }
            else {
                const component = this._getComponent(componentClass);

                if (component) {
                    if (component.constructor === GroupComponent) {
                        if ((component as GroupComponent).components[0] instanceof componentClass) {
                            for (const componentInGroup of (component as GroupComponent).components) {
                                components.push(componentInGroup as T);
                            }
                        }
                    }
                    else if (component instanceof componentClass) {
                        components.push(component);
                    }
                }
            }

            return components;
        }

        public hasComponents(componentClasses: IComponentClass<IComponent>[]): boolean {
            const components = this._components;

            for (let i = 0, l = componentClasses.length; i < l; ++i) {
                const index = componentClasses[i].__index;

                if (index < 0 || !components[index]) {
                    return false;
                }
            }

            return true;
        }

        public hasAnyComponents(componentClasses: IComponentClass<IComponent>[]): boolean {
            const components = this._components;

            for (let i = 0, l = componentClasses.length; i < l; ++i) {
                const index = componentClasses[i].__index;

                if (index >= 0 && components[index]) {
                    return true;
                }
            }

            return false;
        }

        public get isDestroyed(): boolean {
            return this._isDestroyed;
        }

        public get dontDestroy(): boolean {
            return this._scene === Scene.globalScene as any;
        }
        public set dontDestroy(value: boolean) {
            if (this._isDestroyed || this.dontDestroy === value || this === Entity._globalEntity) {
                return;
            }

            this.scene = value ? Scene.globalScene : Scene.activeScene;
        }

        @editor.property(editor.EditType.CHECKBOX)
        public get enabled(): boolean {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._isDestroyed || this._enabled === value || this === Entity._globalEntity) {
                return;
            }

            for (const component of this._components) {
                if (!component) {
                    continue;
                }

                if (component.constructor === GroupComponent) {
                    for (const componentInGroup of (component as GroupComponent).components) {
                        if (componentInGroup.enabled) {
                            Component.dispatchEnabledEvent(componentInGroup, value);
                        }
                    }
                }
                else if (component.enabled) {
                    Component.dispatchEnabledEvent(component, value);
                }
            }

            this._enabled = value;
        }

        @serializedField
        @deserializedIgnore
        public get components(): ReadonlyArray<IComponent> {
            const cachedComponents = this._cachedComponents;

            if (this._componentsDirty) {
                let index = 0;

                for (const component of this._components) {
                    if (component) {
                        if (component.constructor === GroupComponent) {
                            for (const componentInGroup of (component as GroupComponent).components) {
                                cachedComponents[index++] = componentInGroup;
                            }
                        }
                        else {
                            cachedComponents[index++] = component;
                        }
                    }
                }

                if (cachedComponents.length !== index) {
                    cachedComponents.length = index;
                }

                this._componentsDirty = false;
            }

            return cachedComponents;
        }

        public get scene(): IScene | null {
            return this._scene;
        }
        public set scene(value: IScene | null) {
            const sceneManager = SceneManager.getInstance();

            if (!value) {
                value = sceneManager.globalScene;
            }

            if (this._scene === value) {
                return;
            }

            if (this._scene) {
                value.addEntity(this);
            }
            else {
                this._scene = value;
            }
        }
    }
}
