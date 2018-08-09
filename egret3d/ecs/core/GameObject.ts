namespace paper {
    /**
     * 
     */
    export type GameObjectExtras = { linkedID?: string, prefabRootId?: string, prefab?: Prefab };
    /**
     * 可以挂载Component的实体类。
     */
    export class GameObject extends BaseObject {
        /**
         * 创建 GameObject，并添加到当前场景中。
         */
        public static create(name: string = DefaultNames.NoName, tag: string = DefaultTags.Untagged, scene: Scene | null = null) {
            const gameObect = new GameObject(name, tag, scene);
            // gameObect.addComponent(egret3d.Transform);
            // gameObect._addToScene(Application.sceneManager.activeScene);
            return gameObect;
        }

        /**
         * 是否是静态，启用这个属性可以提升性能
         */
        @serializedField
        @editor.property(editor.EditType.CHECKBOX)
        public isStatic: boolean = false;
        /**
         * 
         */
        @serializedField
        public hideFlags: HideFlags = HideFlags.None;
        /**
         * 层级
         */
        @serializedField
        @deserializedIgnore // TODO remove
        public layer: Layer = Layer.Default;
        /**
         * 名称
         */
        @serializedField
        @editor.property(editor.EditType.TEXT)
        public name: string = "";
        /**
         * 标签
         */
        @serializedField
        public tag: string = "";
        /**
         * 变换组件
         */
        public transform: egret3d.Transform = null as any;
        /**
         * 
         */
        public renderer: BaseRenderer | null = null;
        /**
         * 额外数据，仅保存在编辑器环境，项目发布该数据将被移除。
         */
        @serializedField
        public extras?: GameObjectExtras = Application.isEditor && !Application.isPlaying ? {} : undefined;

        @serializedField
        private _activeSelf: boolean = true;
        /**
         * @internal
         */
        public _activeInHierarchy: boolean = true;
        /**
         * @internal
         */
        public _activeDirty: boolean = true;
        private readonly _components: ComponentArray = [];
        private readonly _cachedComponents: BaseComponent[] = [];
        private _scene: Scene | null = null;
        /**
         * @deprecated
         */
        public constructor(name: string = DefaultNames.NoName, tag: string = DefaultTags.Untagged, scene: Scene | null = null) {
            super();

            this.name = name;
            this.tag = tag;
            //
            this._addToScene(scene || Application.sceneManager.activeScene);
            //
            this.addComponent(egret3d.Transform);
        }

        private _destroy() {
            const destroySystem = Application.systemManager.getSystem(DisableSystem);
            if (destroySystem) {
                destroySystem.bufferGameObject(this);
            }

            for (const child of this.transform.children) {
                child.gameObject._destroy();
            }

            for (const component of this._components) {
                if (!component) {
                    continue;
                }

                this._removeComponent(component, null);
            }

            this.transform = null as any;
            this.renderer = null;

            this._components.length = 0;
            this._scene!._removeGameObject(this);
            this._scene = null as any;
        }

        private _addToScene(value: Scene): any {
            if (this._scene) {
                this._scene._removeGameObject(this);
            }

            this._scene = value;
            this._scene._addGameObject(this);
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

                const requireComponents = (component.constructor as ComponentClass<BaseComponent>).requireComponents;
                if (requireComponents && requireComponents.indexOf(value.constructor as ComponentClass<BaseComponent>) >= 0) {
                    console.warn(`Cannot remove the ${egret.getQualifiedClassName(value)} component from the game object (${this.path}), because it is required from the ${egret.getQualifiedClassName(component)} component.`);
                    return false;
                }
            }

            return true;
        }

        private _removeComponent(value: BaseComponent, groupComponent: GroupComponent | null) {
            value.enabled = false;
            (value as any).gameObject = null;

            if (value === this.renderer) {
                this.renderer = null;
            }

            const destroySystem = Application.systemManager.getSystem(DisableSystem);
            if (destroySystem) {
                destroySystem.bufferComponent(value);
            }

            if (groupComponent) {
                groupComponent._removeComponent(value);

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
                delete this._components[(value.constructor as ComponentClass<BaseComponent>).index];
            }
        }

        private _getComponentsInChildren(componentClass: ComponentClass<BaseComponent>, child: GameObject, components: BaseComponent[], isExtends: boolean = false) {
            for (const component of child._components) {
                if (!component) {
                    continue;
                }

                if (component.constructor === GroupComponent) {
                    const groupComponent = component as GroupComponent;
                    if (isExtends ? groupComponent.components[0] instanceof componentClass : groupComponent.componentClass === componentClass) {
                        for (const componentInGroup of groupComponent.components) {
                            components.push(componentInGroup);
                        }
                    }
                }
                else if (isExtends ? component instanceof componentClass : component.constructor === componentClass) {
                    components.push(component);
                }
            }

            for (const childOfChild of child.transform.children) {
                this._getComponentsInChildren(componentClass, childOfChild.gameObject, components, isExtends);
            }
        }

        private _getComponent(componentClass: ComponentClass<BaseComponent>) {
            const componentIndex = componentClass.index;
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

                    if (component.enabled) {
                        EventPool.dispatchEvent(currentActive ? EventPool.EventType.Enabled : EventPool.EventType.Disabled, component);
                    }

                    if (component.constructor === GroupComponent) {
                        for (const componentInGroup of (component as GroupComponent).components) {
                            if (componentInGroup.enabled) {
                                EventPool.dispatchEvent(currentActive ? EventPool.EventType.Enabled : EventPool.EventType.Disabled, componentInGroup);
                            }
                        }
                    }
                }
            }

            for (const child of this.transform.children) {
                child.gameObject._activeInHierarchyDirty(prevActive);
            }
        }
        /**
         * 
         */
        public destroy() {
            if (this.isDestroyed) {
                console.warn(`The game object (${this.path}) has been destroyed.`);
                return;
            }

            if (this === Application.sceneManager.globalGameObject) {
                console.warn("Cannot destroy global game object.");
                return;
            }

            const parent = this.transform.parent;
            if (parent) {
                parent._children.splice(parent._children.indexOf(this.transform), 1);
            }

            this._destroy();
        }
        /**
         * 添加组件。
         */
        public addComponent<T extends BaseComponent>(componentClass: ComponentClass<T>, config?: any): T {
            BaseComponent.register(componentClass);
            const componentIndex = componentClass.index;
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
            // Add component.
            if (existedComponent) {
                if (existedComponent.constructor === GroupComponent) {
                    (existedComponent as GroupComponent)._addComponent(component);
                }
                else {
                    const groupComponent = BaseComponent.create(GroupComponent as any, this) as GroupComponent;
                    groupComponent.initialize();
                    groupComponent.componentIndex = componentIndex;
                    groupComponent.componentClass = componentClass;
                    groupComponent._addComponent(existedComponent);
                    groupComponent._addComponent(component);
                    this._components[componentIndex] = groupComponent;
                }
            }
            else {
                this._components[componentIndex] = component;
            }

            if (config) {
                component.initialize(config);
            }
            else {
                component.initialize();
            }

            if (component.isActiveAndEnabled) {
                EventPool.dispatchEvent(EventPool.EventType.Enabled, component);
            }

            return component;
        }
        /**
         * 移除组件。
         */
        public removeComponent<T extends BaseComponent>(componentInstanceOrClass: ComponentClass<T> | T, isExtends: boolean = false) {
            if (componentInstanceOrClass instanceof BaseComponent) {
                if (!this._canRemoveComponent(componentInstanceOrClass)) {
                    return;
                }

                this._removeComponent(componentInstanceOrClass, null);
            }
            else if (isExtends) {
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
        /**
         * 移除所有组件。
         */
        public removeAllComponents<T extends BaseComponent>(componentClass?: ComponentClass<T>, isExtends: boolean = false) {
            if (componentClass) {
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
                        return;
                    }

                    if (component.constructor === GroupComponent) {
                        const groupComponent = component as GroupComponent;
                        if (!this._canRemoveComponent(groupComponent.components[0])) {
                            return;
                        }
                    }
                    else if (!this._canRemoveComponent(component)) {
                        return;
                    }

                    this._removeComponent(component, null);
                }
            }
            else {
                for (const component of this._components) {
                    if (!component || component.constructor === egret3d.Transform) {
                        continue;
                    }

                    this._removeComponent(component, null);
                }
            }
        }
        /**
         * 获取组件。
         */
        public getComponent<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends: boolean = false) {
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
                        return component as T;
                    }
                }

                return null;
            }

            const componentClassIndex = componentClass.index;
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
        /**
         * 
         */
        public getComponents<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends: boolean = false) {
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

            return components;
        }
        /**
         * 搜索自己和父节点中所有特定类型的组件
         */
        public getComponentInParent<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends: boolean = false) {
            let result: T | null = null;
            let parent = this.transform.parent;

            while (!result && parent) {
                result = parent.gameObject.getComponent(componentClass, isExtends) as T | null; // 
                parent = parent.parent;
            }

            return result;
        }
        /**
         * 搜索自己和子节点中所有特定类型的组件
         */
        public getComponentsInChildren<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends: boolean = false) {
            const components: T[] = [];
            this._getComponentsInChildren(componentClass, this, components, isExtends);

            return components;
        }
        /**
         * 获取组件，如果未添加该组件，则添加该组件。
         */
        public getOrAddComponent<T extends BaseComponent>(componentClass: ComponentClass<T>, isExtends: boolean = false) {
            return this.getComponent(componentClass, isExtends) || this.addComponent(componentClass, isExtends);
        }
        /**
         * 针对同级的组件发送消息
         * @param methodName 
         * @param parameter
         */
        public sendMessage(methodName: string, parameter?: any, requireReceiver: boolean = true) {
            for (const component of this._components) {
                if (component && component.isActiveAndEnabled && component.constructor instanceof Behaviour) {
                    if (methodName in component) {
                        (component as any)[methodName](parameter);
                    }
                    else if (requireReceiver) {
                        console.warn(this.name, egret.getQualifiedClassName(component), methodName); // TODO
                    }
                }
            }
        }
        /**
         * 针对直接父级发送消息
         * @param methodName 
         * @param parameter 
         */
        public sendMessageUpwards(methodName: string, parameter?: any, requireReceiver: boolean = true) {
            this.sendMessage(methodName, parameter, requireReceiver);
            //
            const parent = this.transform.parent;
            if (parent && parent.gameObject.activeInHierarchy) {
                parent.gameObject.sendMessage(methodName, parameter, requireReceiver);
            }
        }
        /**
         * 群发消息
         * @param methodName 
         * @param parameter 
         */
        public broadcastMessage(methodName: string, parameter?: any, requireReceiver: boolean = true) {
            this.sendMessage(methodName, parameter, requireReceiver);

            for (const child of this.transform.children) {
                if (child.gameObject.activeInHierarchy) {
                    child.gameObject.broadcastMessage(methodName, parameter, requireReceiver);
                }
            }
        }
        /**
         * 
         */
        public get isDestroyed() {
            return !this._scene;
        }
        /**
         * 
         */
        public get dontDestroy() {
            return this._scene === Application.sceneManager.globalScene;
        }
        public set dontDestroy(value: boolean) {
            if (this.dontDestroy === value) {
                return;
            }

            if (this.transform.parent && this.transform.parent.gameObject.dontDestroy !== value) {
                this.transform.parent = null;
            }

            if (value) {
                this._addToScene(Application.sceneManager.globalScene);
            }
            else {
                if (this === Application.sceneManager.globalGameObject) {
                    console.warn("Cannot change the `dontDestroy` value of the global game object.", this.name, this.uuid);
                    return;
                }

                this._addToScene(Application.sceneManager.activeScene);
            }

            for (const child of this.transform.children) {
                child.gameObject.dontDestroy = value;
            }
        }

        /**
         * 当前GameObject对象自身激活状态
         */
        public get activeSelf() {
            return this._activeSelf;
        }
        public set activeSelf(value: boolean) {
            if (this._activeSelf === value) {
                return;
            }

            const parent = this.transform.parent;
            if (!parent || parent.gameObject.activeInHierarchy) {
                const prevActive = this._activeSelf;
                this._activeSelf = value;
                this._activeInHierarchyDirty(prevActive);
            }
        }

        /**
         * 获取当前GameObject对象在场景中激活状态。
         * 如果当前对象父级的activeSelf为false，那么当前GameObject对象在场景中为禁用状态。
         */
        public get activeInHierarchy() {
            if (this._activeDirty) {
                const parent = this.transform.parent;

                if (!parent || parent.gameObject.activeInHierarchy) {
                    this._activeInHierarchy = this._activeSelf;
                }
                else {
                    this._activeInHierarchy = false;
                }

                this._activeDirty = false;
            }

            return this._activeInHierarchy;
        }

        public get path(): string {
            let path = this.name;

            if (this.transform) {
                let parent: egret3d.Transform | null = this.transform.parent;
                while (parent) {
                    path = parent.gameObject.name + "/" + path;
                    parent = parent.parent;
                }

                return this._scene!.name + "/" + path;
            }

            return path;
        }
        /**
         * 
         */
        @serializedField
        @deserializedIgnore
        public get components(): ReadonlyArray<BaseComponent> {
            this._cachedComponents.length = 0;

            for (const component of this._components) {
                if (!component) {
                    continue;
                }

                if (component.constructor === GroupComponent) {
                    for (const componentInGroup of (component as GroupComponent).components) {
                        this._cachedComponents.push(componentInGroup);
                    }
                }
                else {
                    this._cachedComponents.push(component);
                }
            }

            return this._cachedComponents;
        }
        /**
         * 
         */
        public get parent() {
            return this.transform.parent ? this.transform.parent.gameObject : null;
        }
        public set parent(gameObject: GameObject | null) {
            this.transform.parent = gameObject ? gameObject.transform : null;
        }
        /**
         * 获取物体所在场景实例。
         */
        public get scene() {
            return this._scene!;
        }

        /**
         * @deprecated
         * @see paper.Scene#find()
         */
        public static find(name: string, scene: Scene | null = null) {
            return (scene || Application.sceneManager.activeScene).find(name);
        }
        /**
         * @deprecated
         * @see paper.Scene#findWithTag()
         */
        public static findWithTag(tag: string, scene: Scene | null = null) {
            return (scene || Application.sceneManager.activeScene).findWithTag(tag);
        }
        /**
         * @deprecated
         * @see paper.Scene#findGameObjectsWithTag()
         */
        public static findGameObjectsWithTag(tag: string, scene: Scene | null = null) {
            return (scene || Application.sceneManager.activeScene).findGameObjectsWithTag(tag);
        }
    }
}
