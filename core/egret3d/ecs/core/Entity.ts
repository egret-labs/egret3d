namespace paper {
    /**
     * 基础实体。
     */
    export abstract class Entity extends BaseObject implements IEntity {
        /**
         * 当实体添加到场景时派发事件。
         */
        public static readonly onEntityAddedToScene: signals.Signal<IEntity> = new signals.Signal();
        /**
         * 当实体将要被销毁时派发事件。
         */
        public static readonly onEntityDestroy: signals.Signal<IEntity> = new signals.Signal();
        /**
         * 当实体被销毁时派发事件。
         */
        public static readonly onEntityDestroyed: signals.Signal<IEntity> = new signals.Signal();
        /**
         * 
         */
        public static createDefaultEnabled: boolean = true;

        @serializedField
        @editor.property(editor.EditType.TEXT)
        public name: string = "";
        @serializedField

        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).DefaultTags) }) // TODO
        public tag: DefaultTags | string = "";

        @serializedField
        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).HideFlags) }) // TODO
        public hideFlags: HideFlags = HideFlags.None;

        @serializedField
        public extras?: EntityExtras = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        protected _componentsDirty: boolean = false;
        protected _isDestroyed: boolean = true;
        @serializedField("_activeSelf") // TODO 反序列化 bug
        protected _enabled: boolean = false;
        protected readonly _components: (IComponent | undefined)[] = [];
        protected readonly _cachedComponents: IComponent[] = [];
        protected _scene: Scene | null = null;
        /**
         * 禁止实例化实体。
         * @protected
         */
        public constructor() {
            super();
        }

        protected _destroy() {
            for (const component of this._components) {
                if (component) {
                    this._removeComponent(component, null);
                }
            }

            this._scene!._removeEntity(this);

            this._isDestroyed = true;
            this._components.length = 0;
            this._scene = null;
            Entity.onEntityDestroyed.dispatch(this);
        }

        protected _addComponent(component: IComponent, config?: any) {
            component.initialize(config);

            Component.onComponentCreated.dispatch([this, component]);

            if (this._enabled && component.enabled) {
                component.dispatchEnabledEvent(true);
            }
        }

        protected _removeComponent(component: IComponent, groupComponent: GroupComponent | null): void {
            component.enabled = false;
            //
            Component.onComponentDestroy.dispatch([this, component]);
            component._destroy();

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
                delete this._components[(component.constructor as IComponentClass<IComponent>).componentIndex];
            }

            Component.onComponentDestroyed.dispatch([this, component]);
            this._componentsDirty = true;
        }

        protected _setScene(value: Scene | null, dispatchEvent: boolean) {
            if (value) {
                if (this._scene) {
                    this._scene._removeEntity(this);
                }

                value._addEntity(this);
                this._scene = value;
            }

            if (dispatchEvent) {
                Entity.onEntityAddedToScene.dispatch(this);
            }
        }

        private _getComponent(componentClass: IComponentClass<IComponent>) {
            const componentIndex = componentClass.componentIndex;

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
            this.tag = "";
            this.hideFlags = HideFlags.None;

            if (this.extras) { // Editor. TODO
                this.extras = {};
            }

            this._componentsDirty = false;
            this._cachedComponents.length = 0;
            this._scene = null;
        }

        public destroy(): boolean {
            if (this._isDestroyed) {
                if (DEBUG) {
                    console.warn("The entity has been destroyed.");
                }

                return false;
            }

            if (this === Application.sceneManager._globalEntity) {
                if (DEBUG) {
                    console.warn("Cannot destroy global entity.");
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

            //
            registerClass(componentClass);

            // Singleton component.
            const globalEntity = Application.sceneManager._globalEntity;

            if (componentClass.isSingleton && globalEntity && this !== globalEntity) {
                return globalEntity.getComponent(componentClass) || globalEntity.addComponent(componentClass, config);
            }

            const componentIndex = componentClass.componentIndex;
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
                    groupComponent.addComponent(existedComponent);
                    groupComponent.addComponent(component);
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
            const globalEntity = Application.sceneManager._globalEntity;

            if (componentInstanceOrClass instanceof BaseComponent) { // Remove component by instance.
                const componentClass = componentInstanceOrClass.constructor as IComponentClass<T>;

                if (componentClass.isSingleton && globalEntity && this !== globalEntity) { // Singleton component.
                    return globalEntity.removeComponent(componentInstanceOrClass);
                }

                if (!this._isRequireComponent(componentClass)) {
                    this._removeComponent(componentInstanceOrClass, null);
                    result = true;
                }
            }
            else { // Remove component by class.
                const componentClass = componentInstanceOrClass as IComponentClass<T>;

                if (componentClass.isSingleton && globalEntity && this !== globalEntity) { // Singleton component.
                    return globalEntity.removeComponent(componentClass, isExtends);
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
                const globalEntity = Application.sceneManager._globalEntity;

                if (componentClass.isSingleton && globalEntity && this !== globalEntity) { // Singleton component.
                    return globalEntity.removeAllComponents(componentClass, isExtends);
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

        public getOrAddComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T {
            return this.getComponent(componentClass, isExtends) || this.addComponent(componentClass);
        }

        public getComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T | null {
            if (componentClass.isSingleton && this !== Application.sceneManager._globalEntity) { // SingletonComponent.
                return Application.sceneManager._globalEntity!.getComponent(componentClass, isExtends);
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
                            return component as T;
                        }
                    }
                }
            }
            else {
                const componentIndex = componentClass.componentIndex;

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
            if (componentClass.isSingleton && this !== Application.sceneManager._globalEntity) { // SingletonComponent.
                return Application.sceneManager._globalEntity!.getComponents(componentClass, isExtends);
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
                        components.push(component as T);
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
                        components.push(component as T);
                    }
                }
            }

            return components;
        }

        public hasComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean {
            const components = this._components;

            for (let i = 0, l = componentClasses.length; i < l; ++i) {
                const index = componentClasses[i].componentIndex;

                if (index < 0) {
                    return false;
                }

                const component = components[index];

                if (!component || (componentEnabled && !component.enabled)) {
                    return false;
                }
            }

            return true;
        }

        public hasAnyComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean {
            const components = this._components;

            for (let i = 0, l = componentClasses.length; i < l; ++i) {
                const index = componentClasses[i].componentIndex;

                if (index >= 0) {
                    const component = components[index];

                    if (component && (!componentEnabled || component.enabled)) {
                        return true;
                    }
                }
            }

            return false;
        }

        public get isDestroyed(): boolean {
            return this._isDestroyed;
        }

        public get dontDestroy(): boolean {
            return this._scene === Application.sceneManager.globalScene;
        }
        public set dontDestroy(value: boolean) {
            const sceneManager = Application.sceneManager;

            if (this.dontDestroy === value || this._isDestroyed || this === sceneManager._globalEntity) {
                return;
            }

            this.scene = value ? sceneManager.globalScene : sceneManager.activeScene;
        }

        @editor.property(editor.EditType.CHECKBOX)
        public get enabled(): boolean {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled === value || this._isDestroyed || this === Application.sceneManager._globalEntity) {
                return;
            }

            for (const component of this._components) {
                if (!component) {
                    continue;
                }

                if (component.constructor === GroupComponent) {
                    for (const componentInGroup of (component as GroupComponent).components) {
                        if (componentInGroup.enabled) {
                            componentInGroup.dispatchEnabledEvent(value);
                        }
                    }
                }
                else if (component.enabled) {
                    component.dispatchEnabledEvent(value);
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

        public get scene(): Scene {
            return this._scene!;
        }
        public set scene(value: Scene) {
            if (this._scene === value || this._isDestroyed || this === Application.sceneManager._globalEntity) {
                return;
            }

            this._setScene(value, true);
        }
    }
}
