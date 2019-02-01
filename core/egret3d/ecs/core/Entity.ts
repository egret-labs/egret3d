namespace paper {

    const _singletonEntity: IEntity = null!;
    /**
     * 实体。
     */
    export class Entity extends BaseObject implements IEntity {
        /**
         * 当实体的组件被激活时派发事件。
         */
        public static readonly onComponentEnabled: signals.Signal = new signals.Signal();
        /**
         * 当实体的组件被禁用时派发事件。
         */
        public static readonly onComponentDisabled: signals.Signal = new signals.Signal();
        /**
         * 当实体被创建时派发事件。
         */
        public static readonly onCreated: signals.Signal = new signals.Signal();
        /**
         * 当实体将要被销毁时派发事件。
         */
        public static readonly onDestroy: signals.Signal = new signals.Signal();
        /**
         * 名称。
         */
        @serializedField
        @editor.property(editor.EditType.TEXT)
        public name: string = "";
        /**
         * 标签。
         */
        @serializedField
        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).DefaultTags) }) // TODO
        public tag: paper.DefaultTags | string = "";
        /**
         * 
         */
        @serializedField
        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).HideFlags) }) // TODO
        public hideFlags: HideFlags = HideFlags.None;
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        @serializedField
        public extras?: EntityExtras = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        protected _componentsDirty: boolean = false;
        @serializedField("_activeSelf") // TODO 反序列化 bug
        protected _enabled: boolean = true;
        protected readonly _components: (IComponent | undefined)[] = [];
        protected readonly _cachedComponents: (IComponent)[] = [];
        protected _scene: IScene | null = null;
        /**
         * 请使用 `paper.GameObject.create()` 创建实例。
         * @see paper.GameObject.create()
         */
        protected constructor(name: string, tag: string) {
            super();

            this.name = name;
            this.tag = tag;
        }

        protected _destroy() {
            this._scene!._removeEntity(this);

            for (const component of this._components) {
                if (!component) {
                    continue;
                }

                this._removeComponent(component, null);
            }

            // 销毁的第一时间就将组件和场景清除，用场景的有无来判断实体是否已经销毁。
            this._components.length = 0;
            this._scene = null;
            disposeCollecter.gameObjects.push(this);
        }

        protected _addToScene(value: IScene): any {
            if (this._scene) {
                this._scene._removeEntity(this);
            }

            this._scene = value;
            this._scene._addEntity(this);
        }

        protected _setDontDestroy(value: boolean) {
            this._addToScene(value ? Scene.globalScene : Scene.activeScene);
        }

        private _canRemoveComponent(value: BaseComponent) {
            if (value === this.transform) {
                console.warn("Cannot remove the transform component from a game object.");
                return false;
            }

            for (let component of this._components) {
                if (!component) {
                    continue;
                }

                if (component.constructor === GroupComponent) {
                    component = (component as GroupComponent).components[0]; // 只检查第一个。
                }

                const requireComponents = (component.constructor as IComponentClass<BaseComponent>).requireComponents;
                if (requireComponents && requireComponents.indexOf(value.constructor as IComponentClass<BaseComponent>) >= 0) {
                    console.warn(`Cannot remove the ${egret.getQualifiedClassName(value)} component from the game object (${this.path}), because it is required from the ${egret.getQualifiedClassName(component)} component.`);
                    return false;
                }
            }

            return true;
        }

        private _removeComponent(value: BaseComponent, groupComponent: GroupComponent | null) {
            disposeCollecter.components.push(value);

            value.enabled = false;

            if ((value.constructor as IComponentClass<BaseComponent>).__isBehaviour) {
                if ((value as Behaviour)._isAwaked) {
                    (value as Behaviour).onDestroy && (value as Behaviour).onDestroy!();
                }

                if ((value as Behaviour).onBeforeRender) {
                    this._beforeRenderBehaviors.splice(this._beforeRenderBehaviors.indexOf(value as Behaviour), 1);
                }
            }

            value.uninitialize(); //
            (value as any).gameObject = null;

            if (value === this.renderer) {
                this.renderer = null;
            }

            if (groupComponent) {
                groupComponent.removeComponent(value);

                if (groupComponent.components.length === 0) {
                    this._removeComponent(groupComponent, null);
                }
            }
            else if (value.constructor === GroupComponent) {
                groupComponent = value as GroupComponent;
                delete this._components[groupComponent.componentIndex];

                for (const componentInGroup of groupComponent.components) {
                    this._removeComponent(componentInGroup, groupComponent);
                }
            }
            else {
                delete this._components[(value.constructor as IComponentClass<BaseComponent>).__index];
            }

            if (this.transform && value.hasOwnProperty("onTransformChange")) { // TODO 字符串依赖。
                this.transform.unregisterObserver(value as any);
            }
        }

        private _getComponent(componentClass: IComponentClass<BaseComponent>) {
            const componentIndex = componentClass.__index;
            return componentIndex < 0 ? null : this._components[componentIndex];
        }
        /**
         * @internal
         */
        public _activeInHierarchyDirty(prevActive: boolean) {
            this._activeDirty = true;
            const currentActive = this.activeInHierarchy;

            if (currentActive !== prevActive) {
                for (const component of this._components) {
                    if (!component) {
                        continue;
                    }

                    if (component.constructor === GroupComponent) {
                        for (const componentInGroup of (component as GroupComponent).components) {
                            if (
                                (componentInGroup.constructor as IComponentClass<BaseComponent>).__isBehaviour &&
                                !(<any>componentInGroup as Behaviour)._isAwaked &&
                                (Application.playerMode !== PlayerMode.Editor || (componentInGroup.constructor as IComponentClass<Behaviour>).executeInEditMode)
                            ) {
                                (<any>componentInGroup as Behaviour).onAwake && (<any>componentInGroup as Behaviour).onAwake!();
                                (<any>componentInGroup as Behaviour)._isAwaked = true;
                            }

                            if (componentInGroup.enabled) {
                                componentInGroup._dispatchEnabledEvent(currentActive);
                            }
                        }
                    }
                    else {
                        if (
                            (component.constructor as IComponentClass<BaseComponent>).__isBehaviour &&
                            !(<any>component as Behaviour)._isAwaked &&
                            (Application.playerMode !== PlayerMode.Editor || (component.constructor as IComponentClass<Behaviour>).executeInEditMode)
                        ) {
                            (<any>component as Behaviour).onAwake && (<any>component as Behaviour).onAwake!();
                            (<any>component as Behaviour)._isAwaked = true;
                        }

                        if (component.enabled) {
                            component._dispatchEnabledEvent(currentActive);
                        }
                    }
                }
            }

            for (const child of this.transform.children) {
                child.gameObject._activeInHierarchyDirty(prevActive);
            }
        }
        /**
         * 实体被销毁后，内部卸载。
         * @internal
         */
        public uninitialize() {
            this.isStatic = false;
            this.hideFlags = HideFlags.None;
            this.layer = Layer.Default;
            this.name = "";
            this.tag = "";
            this.transform = null!;
            this.renderer = null;

            if (this.extras) { // Editor. TODO
                this.extras = {};
            }

            this._activeSelf = true;
            this._activeInHierarchy = true;
            this._activeDirty = true;

            this._cachedComponents.length = 0;
            this._scene = null;
        }
        /**
         * 销毁实体。
         */
        public destroy() {
            if (this.isDestroyed) {
                console.warn(`The game object has been destroyed.`);
                return false;
            }

            if (this === GameObject._globalGameObject) {
                console.warn("Cannot destroy global game object.");
                return false;
            }

            const parent = this.transform.parent;
            if (parent) {
                parent._children.splice(parent._children.indexOf(this.transform), 1);
            }

            this._destroy();

            return true;
        }
        /**
         * 添加一个指定组件实例。
         * @param componentClass 组件类。
         * @param config BaseComponent 组件 `initialize(config?: any)` 方法或 Behaviour 组件 `onAwake(config?: any)` 方法的可选参数。
         */
        public addComponent<T extends BaseComponent>(componentClass: IComponentClass<T>, config?: any): T {
            if (DEBUG && !componentClass) {
                throw new Error();
            }

            registerClass(componentClass);
            // SingletonComponent.
            if (componentClass.__isSingleton && this !== GameObject._globalGameObject) {
                return GameObject.globalGameObject.getOrAddComponent(componentClass, config);
            }

            const componentIndex = componentClass.__index;
            const existedComponent = this._components[componentIndex];
            // disallowMultipleComponents.
            if (!componentClass.allowMultiple && existedComponent) {
                console.warn(`Cannot add the ${egret.getQualifiedClassName(componentClass)} component to the game object (${this.path}) again.`);
                return existedComponent as T;
            }
            // requireComponents.
            if (componentClass.requireComponents) {
                for (const requireComponentClass of componentClass.requireComponents) {
                    this.getOrAddComponent(requireComponentClass);
                }
            }
            // Linked reference.
            const component = BaseComponent.create(componentClass, this);
            if (componentClass === egret3d.Transform as any) {
                this.transform = <any>component as egret3d.Transform;
            }
            else if (component instanceof BaseRenderer) {
                this.renderer = component;
            }
            else if ((component.constructor as IComponentClass<T>).__isBehaviour) {
                if ((<any>component as Behaviour).onBeforeRender) {
                    this._beforeRenderBehaviors.push(<any>component as Behaviour);
                }
            }
            // Add component.
            if (existedComponent) {
                if (existedComponent.constructor === GroupComponent) {
                    (existedComponent as GroupComponent).addComponent(component);
                }
                else {
                    registerClass(GroupComponent);
                    const groupComponent = BaseComponent.create(GroupComponent as any, this) as GroupComponent;
                    groupComponent.initialize();
                    groupComponent.componentIndex = componentIndex;
                    groupComponent.componentClass = componentClass;
                    groupComponent.addComponent(existedComponent);
                    groupComponent.addComponent(component);
                    this._components[componentIndex] = groupComponent;
                }
            }
            else {
                this._components[componentIndex] = component;
            }

            // Component initialize.
            if (config) {
                component.initialize(config);
            }
            else {
                component.initialize();
            }

            if (this.activeInHierarchy) {
                if (
                    (component.constructor as IComponentClass<BaseComponent>).__isBehaviour &&
                    (Application.playerMode !== PlayerMode.Editor || (component.constructor as IComponentClass<Behaviour>).executeInEditMode)
                ) {
                    (<any>component as Behaviour).onAwake && (<any>component as Behaviour).onAwake!(config);
                    (<any>component as Behaviour)._isAwaked = true;
                }

                if (component.enabled) {
                    component._dispatchEnabledEvent(true);
                }
            }

            return component;
        }
        /**
         * 移除一个指定组件实例。
         * @param componentInstanceOrClass 组件类或组件实例。
         * @param isExtends 是否尝试移除全部派生自此组件的实例。
         */
        public removeComponent<T extends BaseComponent>(componentInstanceOrClass: IComponentClass<T> | T, isExtends: boolean = false): void {
            if (DEBUG && !componentInstanceOrClass) {
                throw new Error();
            }

            if (componentInstanceOrClass instanceof BaseComponent) {
                const componentClass = componentInstanceOrClass.constructor as IComponentClass<T>;
                if (componentClass.__isSingleton && this !== GameObject._globalGameObject) { // SingletonComponent.
                    GameObject.globalGameObject.removeComponent(componentInstanceOrClass, isExtends);
                    return;
                }

                if (!this._canRemoveComponent(componentInstanceOrClass)) {
                    return;
                }

                this._removeComponent(componentInstanceOrClass, null);
            }
            else {
                if (componentInstanceOrClass.__isSingleton && this !== GameObject._globalGameObject) { // SingletonComponent.
                    return GameObject.globalGameObject.removeComponent(componentInstanceOrClass, isExtends);
                }

                if (isExtends) {
                    for (let component of this._components) {
                        if (!component) {
                            continue;
                        }

                        let groupComponent: GroupComponent | null = null;
                        if (component.constructor === GroupComponent) {
                            groupComponent = component as GroupComponent;
                            component = groupComponent.components[0];
                        }

                        if (groupComponent) {
                            if (
                                !(groupComponent.components[0] instanceof componentInstanceOrClass) ||
                                (groupComponent.components.length === 1 && !this._canRemoveComponent(groupComponent.components[0]))
                            ) {
                                continue;
                            }
                        }
                        else if (
                            !(component instanceof componentInstanceOrClass) ||
                            !this._canRemoveComponent(component)
                        ) {
                            continue;
                        }

                        this._removeComponent(component, groupComponent);
                    }
                }
                else {
                    let component = this._getComponent(componentInstanceOrClass);
                    if (!component) {
                        return;
                    }

                    let groupComponent: GroupComponent | null = null;
                    if (component.constructor === GroupComponent) {
                        groupComponent = component as GroupComponent;
                        component = groupComponent.components[0];
                    }

                    if (groupComponent) {
                        if (groupComponent.components.length === 1 && !this._canRemoveComponent(groupComponent.components[0])) {
                            return;
                        }
                    }
                    else if (!this._canRemoveComponent(component)) {
                        return;
                    }

                    this._removeComponent(component, groupComponent);
                }
            }
        }

        public removeAllComponents<T extends IComponent>(componentClass?: IComponentClass<T>, isExtends: boolean = false): boolean {
            if (componentClass) {
                if (componentClass.__isSingleton && this !== _singletonEntity) { // SingletonComponent.
                    return _singletonEntity.removeAllComponents(componentClass, isExtends);
                }

                if (isExtends) {
                    for (const component of this._components) {
                        if (!component) {
                            continue;
                        }

                        if (component.constructor === GroupComponent) {
                            const groupComponent = component as GroupComponent;
                            if (
                                !(groupComponent.components[0] instanceof componentClass) ||
                                !this._canRemoveComponent(groupComponent.components[0])
                            ) {
                                continue;
                            }
                        }
                        else if (!this._canRemoveComponent(component)) {
                            continue;
                        }

                        this._removeComponent(component, null);
                    }
                }
                else {
                    const component = this._getComponent(componentClass);
                    if (!component) {
                        return false;
                    }

                    if (component.constructor === GroupComponent) {
                        const groupComponent = component as GroupComponent;
                        if (!this._canRemoveComponent(groupComponent.components[0])) {
                            return false;
                        }
                    }
                    else if (!this._canRemoveComponent(component)) {
                        return false;
                    }

                    this._removeComponent(component, null);
                }
            }
            else {
                for (const component of this._components) {
                    if (!component) {
                        continue;
                    }

                    this._removeComponent(component, null);
                }
            }

            return true;
        }

        public getComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T | null {
            if (componentClass.__isSingleton && this !== _singletonEntity) { // SingletonComponent.
                return _singletonEntity.getComponent(componentClass, isExtends);
            }

            if (isExtends) {
                for (const component of this._components) {
                    if (!component) {
                        continue;
                    }

                    if (component.constructor === GroupComponent) {
                        const groupComponent = component as GroupComponent;
                        if (groupComponent.components[0] instanceof componentClass) {
                            return groupComponent.components[0] as T;
                        }
                    }
                    else if (component instanceof componentClass) {
                        return component;
                    }
                }

                return null;
            }

            const componentClassIndex = componentClass.__index;
            if (componentClassIndex < 0) {
                return null;
            }

            const component = this._components[componentClassIndex];
            if (!component) {
                return null;
            }

            if (component.constructor === GroupComponent) {
                return (component as GroupComponent).components[0] as T;
            }

            return component as T;
        }

        public getComponents<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T[] {
            if (componentClass.__isSingleton && this !== _singletonEntity) { // SingletonComponent.
                return _singletonEntity.getComponents(componentClass, isExtends);
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

            return components;
        }

        public get isDestroyed() {
            return !this._scene;
        }

        public get dontDestroy(): boolean {
            return this._scene === Scene.globalScene as any;
        }
        public set dontDestroy(value: boolean) {
            if (this.dontDestroy === value) {
                return;
            }

            this._setDontDestroy(value);
        }

        @editor.property(editor.EditType.CHECKBOX)
        public get enabled(): boolean {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled === value) {
                return;
            }

            this._activeInHierarchyDirty(this._enabled);
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

        public get scene(): IScene {
            return this._scene!; // TODO
        }
    }
}
