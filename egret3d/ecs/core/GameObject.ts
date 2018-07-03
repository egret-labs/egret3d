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
        public renderer: paper.BaseRenderer | null = null as any;

        /**
         * 预制体
         */
        @serializedField
        public prefab: egret3d.Prefab | null = null;

        /**
         * 用于确定整个预制体结构
         * true:prefabroot,string:root uuid
         */
        @serializedField
        private prefabEditInfo:boolean | string | null = null;

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
        private readonly _components: BaseComponent[] = [];
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

        private _removeComponentReference(component: BaseComponent) {
            component.enabled = false; // TODO remove flag.

            const destroySystem = Application.systemManager.getSystem(DestroySystem);
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

        /**
         * 
         */
        public destroy() {
            if (!this._scene) {
                console.warn("The game object has been destroyed.", this.name, this.uuid);
                return;
            }

            if (this === Application.sceneManager.globalGameObject) {
                console.warn("Cannot destroy global game object.", this.name, this.uuid);
                return;
            }

            const destroySystem = Application.systemManager.getSystem(DestroySystem);
            if (destroySystem) {
                destroySystem.bufferGameObject(this);
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
         * 根据类型名获取组件
         */
        public addComponent<T extends BaseComponent>(componentClass: { new(): T }): T {
            BaseComponent._injectGameObject = this;
            const component = new componentClass();

            if (component instanceof egret3d.Transform) {
                this.transform = component;
            }
            else if (component instanceof paper.BaseRenderer) {
                this.renderer = component;
            }

            this._components.push(component);
            component.initialize();

            if (component.isActiveAndEnabled) {
                EventPool.dispatchEvent(EventPool.EventType.Enabled, component);
            }

            return component;
        }

        /**
         * 移除组件
         */
        public removeComponent<T extends BaseComponent>(componentInstanceOrClass: { new(): T } | T, isExtends: boolean = false, isAll: boolean = false) {
            if (componentInstanceOrClass instanceof BaseComponent) {
                if (componentInstanceOrClass === this.transform as any) {
                    return;
                }

                let index = 0;
                for (const component of this._components) {
                    if (component === componentInstanceOrClass) {
                        this._removeComponentReference(component);
                        this._components.splice(index, 1);

                        if (component === this.renderer) {
                            this.renderer = null;
                        }

                        return;
                    }

                    index++;
                }
            }
            else {
                if (componentInstanceOrClass === egret3d.Transform as any) {
                    return;
                }

                let i = this._components.length;
                while (i--) {
                    const component = this._components[i];
                    if (isExtends ? egret.is(component, egret.getQualifiedClassName(componentInstanceOrClass)) : component.constructor === componentInstanceOrClass) {
                        this._removeComponentReference(component);
                        this._components.splice(i, 1);

                        if (component === this.renderer) {
                            this.renderer = null;
                        }

                        if (!isAll) {
                            return;
                        }
                    }
                }
            }
        }

        /**
         * 移除自身的所有组件
         */
        public removeAllComponents() {
            for (const component of this._components) {
                if (component instanceof egret3d.Transform) {
                    continue;
                }

                if (component === this.renderer) {
                    this.renderer = null;
                }

                this._removeComponentReference(component);
            }

            this._components.length = 0;
            this._components.push(this.transform);
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
        public get dontDestroy() {
            return this._scene === Application.sceneManager.globalScene;
        }
        public set dontDestroy(value: boolean) {
            if (this.dontDestroy === value) {
                return;
            }

            if (value) {
                this._addToScene(Application.sceneManager.globalScene);
            }
            else {
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
                    if (component instanceof paper.BaseRenderer) {
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
