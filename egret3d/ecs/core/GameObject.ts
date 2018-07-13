namespace paper {

    /**
     * 可以挂载Component的实体类。
     */
    export class GameObject extends SerializableObject {
        /**
         * 是否是静态，启用这个属性可以提升性能
         */
        @serializedField
        @editor.property(editor.EditType.CHECKBOX)
        public isStatic: boolean = false;

        /**
         * 层级
         */
        @serializedField
        @deserializedIgnore
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
        public renderer: BaseRenderer | null = null as any;

        /**
         * 预制体
         */
        @serializedField
        public prefab: egret3d.Prefab | null = null;

        /**
         * @internal
         */
        @serializedField
        private prefabEditInfo: boolean | string | null = null;

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
        /**
         * @internal
         */
        public readonly _components: BaseComponent[] = [];
        private _scene: Scene = null as any;

        /**
         * 创建GameObject，并添加到当前场景中
         */
        public constructor(name: string = "NoName", tag: string = "") {
            super();

            this.name = name;
            this.tag = tag;
            this.addComponent(egret3d.Transform);

            this._addToScene(Application.sceneManager.activeScene);
        }
        /**
         * @internal
         */
        public _activeInHierarchyDirty(prevActive: boolean) {
            this._activeDirty = true;
            const currentActive = this.activeInHierarchy;

            if (currentActive !== prevActive) {
                for (const component of this._components) {
                    if (component.enabled) {
                        EventPool.dispatchEvent(currentActive ? EventPool.EventType.Enabled : EventPool.EventType.Disabled, component);
                    }
                }
            }

            for (const child of this.transform.children) {
                child.gameObject._activeInHierarchyDirty(prevActive);
            }
        }

        private _addToScene(value: Scene): any {
            if (this._scene) {
                this._scene._removeGameObject(this);
            }

            this._scene = value;
            this._scene._addGameObject(this);
        }

        private _canRemoveComponent<T extends BaseComponent>(value: T) {
            if (value === this.transform as any) {
                console.warn("Cannot remove the transform component from a game object.");
                return false;
            }

            for (const component of this._components) {
                const className = egret.getQualifiedClassName(component);
                if (className in _requireComponents) {
                    const requireComponents = _requireComponents[className];
                    if (requireComponents.indexOf(value.constructor as any) >= 0) {
                        console.warn(`Cannot remove the ${egret.getQualifiedClassName(value)} component from the game object (${this.path}), because it is required from the ${className} component.`);
                        return false;
                    }
                }
            }

            return true;
        }

        private _removeComponentReference(component: BaseComponent) {
            component.enabled = false;
            (component as any).gameObject = null;

            if (component === this.renderer) {
                this.renderer = null;
            }

            const destroySystem = Application.systemManager.getSystem(EndSystem);
            if (destroySystem) {
                destroySystem.bufferComponent(component);
            }
        }

        private _getComponentsInChildren<T extends BaseComponent>(componentClass: { new(): T }, child: GameObject, array: T[], isExtends: boolean = false) {
            const components = child._components;

            for (const component of components) {
                if (isExtends ? egret.is(component, egret.getQualifiedClassName(componentClass)) : component.constructor === componentClass) {
                    array.push(component as T);
                }
            }

            for (const childOfChild of child.transform.children) {
                this._getComponentsInChildren(componentClass, childOfChild.gameObject, array, isExtends);
            }
        }

        private _destroy() {
            const destroySystem = Application.systemManager.getSystem(EndSystem);
            if (destroySystem) {
                destroySystem.bufferGameObject(this);
            }

            for (const child of this.transform.children) {
                child.gameObject._destroy();
            }

            for (const component of this._components) {
                this._removeComponentReference(component);
            }

            this.transform = null as any;
            this.renderer = null;

            this._components.length = 0;
            this._scene._removeGameObject(this);
            this._scene = null as any;
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
         * 根据类型名获取组件
         */
        public addComponent<T extends BaseComponent>(componentClass: { new(): T }, config?: any): T {
            if (_disallowMultipleComponents.indexOf(componentClass) >= 0) {
                for (const component of this._components) {
                    if (component instanceof componentClass) {
                        console.warn(`Cannot add the ${egret.getQualifiedClassName(componentClass)} component to the game object (${this.path}) again.`);
                        return;
                    }
                }
            }

            const index = _requireComponents.indexOf(componentClass);
            if (index >= 0) {
                const requireComponents = _requireComponentss[index];
                for (const requireComponentClass of requireComponents) {
                    this.getComponent(requireComponentClass) || this.addComponent(requireComponentClass);
                }
            }

            BaseComponent._injectGameObject = this;
            const component = new componentClass();

            if (component instanceof egret3d.Transform) {
                this.transform = component;
            }
            else if (component instanceof BaseRenderer) {
                this.renderer = component;
            }

            this._components.push(component);

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
         * 移除组件
         */
        public removeComponent<T extends BaseComponent>(componentInstanceOrClass: { new(): T } | T, isExtends: boolean = false) {
            if (componentInstanceOrClass instanceof BaseComponent) {
                let index = 0;
                for (const component of this._components) {
                    if (component === componentInstanceOrClass) {
                        if (!this._canRemoveComponent(component)) {
                            return;
                        }

                        this._removeComponentReference(component);
                        this._components.splice(index, 1);

                        return;
                    }

                    index++;
                }
            }
            else {
                let i = this._components.length;
                while (i--) {
                    const component = this._components[i];
                    if (isExtends ? egret.is(component, egret.getQualifiedClassName(componentInstanceOrClass)) : component.constructor === componentInstanceOrClass) {
                        if (!this._canRemoveComponent(component)) {
                            return;
                        }

                        this._removeComponentReference(component);
                        this._components.splice(i, 1);

                        return;
                    }
                }
            }
        }

        /**
         * 移除自身的所有组件
         */
        public removeAllComponents<T extends BaseComponent>(componentClass?: { new(): T }, isExtends: boolean = false) {
            if (componentClass) {
                let i = this._components.length;
                while (i--) {
                    const component = this._components[i];
                    if (isExtends ? egret.is(component, egret.getQualifiedClassName(componentClass)) : component.constructor === componentClass) {
                        if (!this._canRemoveComponent(component)) {
                            return;
                        }

                        this._removeComponentReference(component);
                        this._components.splice(i, 1);
                    }
                }
            }
            else {
                for (const component of this._components) {
                    if (component instanceof egret3d.Transform) {
                        continue;
                    }

                    this._removeComponentReference(component);
                    this._components.length = 0;
                    this._components.push(this.transform);
                }
            }
        }

        /**
         * 根据类型名获取组件
         */
        public getComponent<T extends BaseComponent>(componentClass: { new(): T }, isExtends: boolean = false) {
            if (isExtends) {
                for (const component of this._components) {
                    if (egret.is(component, egret.getQualifiedClassName(componentClass))) {
                        return component as T;
                    }
                }
            }
            else {
                for (const component of this._components) {
                    if (component.constructor === componentClass) {
                        return component as T;
                    }
                }
            }

            return null;
        }

        public getComponents<T extends BaseComponent>(componentClass: { new(): T }, isExtends: boolean = false) {
            const components: T[] = [];
            for (const component of this._components) {
                if (isExtends ? egret.is(component, egret.getQualifiedClassName(componentClass)) : component.constructor === componentClass) {
                    components.push(component as any);
                }
            }

            return components;
        }

        /**
         * 搜索自己和父节点中所有特定类型的组件
         */
        public getComponentInParent<T extends BaseComponent>(componentClass: { new(): T }, isExtends: boolean = false) {
            let result: T | null = null;
            let parent = this.transform.parent;

            while (!result && parent) {
                result = parent.gameObject.getComponent(componentClass, isExtends);
                parent = parent.parent;
            }

            return result;
        }

        /**
         * 搜索自己和子节点中所有特定类型的组件
         */
        public getComponentsInChildren<T extends BaseComponent>(componentClass: { new(): T }, isExtends: boolean = false) {
            const components: T[] = [];
            this._getComponentsInChildren(componentClass, this, components, isExtends);

            return components;
        }

        /**
         * 针对同级的组件发送消息
         * @param methodName 
         * @param parameter
         */
        public sendMessage(methodName: string, parameter?: any, requireReceiver: boolean = true) {
            for (const component of this._components) {
                if (component.isActiveAndEnabled && component.constructor instanceof Behaviour) {
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

            for (const child of this.transform.children) {
                child.gameObject.dontDestroy = value;
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
                    parent = parent.gameObject.transform;
                }

                return this._scene.name + "/" + path;
            }

            return path;
        }

        /**
         * 组件列表
         */
        @serializedField
        public get components(): ReadonlyArray<BaseComponent> {
            return this._components;
        }
        /**
         * 仅用于反序列化。
         * @internal
         */
        public set components(value: ReadonlyArray<BaseComponent>) {
            this._components.length = 0;
            for (const component of value) {
                if (component instanceof MissingObject) {
                    this.addComponent(MissingComponent).missingObject = component;
                }
                else {
                    if (component instanceof BaseRenderer) {
                        this.renderer = component;
                    }

                    this._components.push(component);
                }
            }

            this.transform = this.getComponent(egret3d.Transform) || this.addComponent(egret3d.Transform);
        }

        /**
         * 获取物体所在场景实例。
         */
        public get scene(): Scene {
            return this._scene;
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
