namespace paper {

    /**
     * 可以挂载Component的实体类。
     */
    export class GameObject extends paper.SerializableObject {
        /**
         * 返回当前激活场景中查找对应名称的GameObject
         * @param name 
         */
        public static find(name: string): GameObject | null {
            for (const gameObject of Application.sceneManager.getActiveScene().gameObjects) {
                if (gameObject.name === name) {
                    return gameObject;
                }
            }

            return null;
        }

        /**
         * 返回一个在当前激活场景中查找对应tag的GameObject
         * @param tag 
         */
        public static findWithTag(tag: string): GameObject | null {
            for (const gameObject of Application.sceneManager.getActiveScene().gameObjects) {
                if (gameObject.tag === tag) {
                    return gameObject;
                }
            }

            return null;
        }

        /**
         * 返回所有在当前激活场景中查找对应tag的GameObject
         * @param name 
         */
        public static findGameObjectsWithTag(tag: string): GameObject[] {
            const gameObjects: GameObject[] = [];
            for (const gameObject of Application.sceneManager.getActiveScene().gameObjects) {
                if (gameObject.tag === tag) {
                    gameObjects.push(gameObject);
                }
            }

            return gameObjects;
        }

        /**
         * 是否是静态，启用这个属性可以提升性能
         */
        @paper.serializedField
        @editor.property(editor.EditType.CHECKBOX)
        public isStatic: boolean = false;


        /**
         * 层级
         */
        @paper.serializedField
        @deserializedIgnore
        public layer: Layer = Layer.Default;

        /**
         * 名称
         */
        @paper.serializedField
        @editor.property(editor.EditType.TEXT)
        public name: string = "";


        /**
         * 标签
         */
        @paper.serializedField
        public tag: string = "";

        /**
         * 变换组件
         */
        public transform: egret3d.Transform = null as any;

        /**
         * 预制体
         */
        @paper.serializedField
        public readonly prefab: egret3d.Prefab | null = null;

        private _destroyed = false;
        @paper.serializedField
        private _activeSelf = true;
        private _activeInHierarchy = true;
        private _activeDirty = true;
        private readonly _components: BaseComponent[] = [];
        private _scene: Scene = null as any;

        /**
         * 创建GameObject，并添加到当前场景中
         */
        public constructor(name: string = "NoName", tag: string = "") {
            super();

            this._scene = Application.sceneManager.getActiveScene();
            this._scene.$addGameObject(this);
            this.name = name;
            this.tag = tag;
            // 自动创建transform
            this.addComponent(egret3d.Transform);
        }
        /**
         * @internal
         */
        public _activeInHierarchyDirty(prevActive: boolean) {
            // if (this._activeDirty) {
            //     return;
            // }

            this._activeDirty = true;
            const currentActive = this.activeInHierarchy;

            if (currentActive !== prevActive) {
                for (const component of this._components) {
                    if (component.enabled) {
                        paper.EventPool.dispatchEvent(currentActive ? paper.EventPool.EventType.Enabled : paper.EventPool.EventType.Disabled, component);
                    }
                }
            }

            for (const child of this.transform.children) {
                child.gameObject._activeInHierarchyDirty(prevActive);
            }
        }

        private _removeComponentReference(component: BaseComponent) {
            component.enabled = false; // TODO remove flag.

            const destroySystem = paper.Application.systemManager.getSystem(paper.DestroySystem);
            if (destroySystem) {
                destroySystem.bufferComponent(component);
            }
        }

        private _getComponentsInChildren<T extends paper.BaseComponent>(componentClass: { new(gameObject: GameObject): T }, child: GameObject, array: T[]) {
            const components = child._components;

            for (const component of components) {
                if (egret.is(component, egret.getQualifiedClassName(componentClass))) {
                    array.push(component as T);
                }
            }

            for (const childOfChild of child.transform.children) {
                this._getComponentsInChildren(componentClass, childOfChild.gameObject, array);
            }
        }

        /**
         * 
         */
        public destroy() {
            if (this._destroyed) {
                console.warn("The game object has been destroyed.", this.hashCode);
                return;
            }

            this._destroyed = true;
            this.removeAllComponents();
            this._scene.$removeGameObject(this);
            this._scene = null as any;

            const destroySystem = paper.Application.systemManager.getSystem(paper.DestroySystem);
            if (destroySystem) {
                destroySystem.bufferGameObject(this);
            }
        }


        /**
         * 根据类型名获取组件
         */
        public addComponent<T extends paper.BaseComponent>(componentClass: { new(): T }): T {
            paper.BaseComponent._injectGameObject = this;
            const component = new componentClass();

            if (component instanceof egret3d.Transform) {
                this.transform = component;
            }

            this._components.push(component);
            component.initialize();
            if (component.isActiveAndEnabled) {
                paper.EventPool.dispatchEvent(paper.EventPool.EventType.Enabled, component);
            }

            return component;
        }

        /**
         * 移除组件
         */
        public removeComponent<T extends paper.BaseComponent>(componentInstanceOrClass: { new(): T } | T) {
            if (componentInstanceOrClass instanceof paper.BaseComponent) {
                if (componentInstanceOrClass === this.transform as any) {
                    return;
                }

                let index = 0;
                for (const component of this._components) {
                    if (component === componentInstanceOrClass) {
                        this._removeComponentReference(component);
                        this._components.splice(index, 1);

                        return;
                    }

                    index++;
                }
            }
            else {
                if (componentInstanceOrClass === egret3d.Transform as any) {
                    return;
                }

                let index = 0;
                for (const component of this._components) {
                    if (egret.is(component, egret.getQualifiedClassName(componentInstanceOrClass))) {
                        this._removeComponentReference(component);
                        this._components.splice(index, 1);

                        return;
                    }

                    index++;
                }
            }
        }


        /**
         * 移除自身的所有组件
         */
        public removeAllComponents() {
            for (const component of this._components) {
                this._removeComponentReference(component);
            }

            this._components.length = 0;
        }

        /**
         * 根据类型名获取组件
         */
        public getComponent<T extends paper.BaseComponent>(componentClass: { new(): T }) {
            for (const component of this._components) {
                if (egret.is(component, egret.getQualifiedClassName(componentClass))) {
                    return component as T;
                }
            }
            return null;
        }

        /**
         * 搜索自己和父节点中所有特定类型的组件
         */
        public getComponentInParent<T extends paper.BaseComponent>(componentClass: { new(): T }) {
            let result: T | null = null;
            let parent = this.transform.parent;

            while (!result && parent) {
                result = parent.gameObject.getComponent(componentClass);
                parent = parent.parent;
            }

            return result;
        }

        /**
         * 搜索自己和子节点中所有特定类型的组件
         */
        public getComponentsInChildren<T extends paper.BaseComponent>(componentClass: { new(): T }) {
            const components: T[] = [];
            this._getComponentsInChildren(componentClass, this, components);

            return components;
        }

        /**
         * 针对同级的组件发送消息
         * @param methodName 
         * @param parameter
         */
        public sendMessage(methodName: string, parameter?: any, requireReceiver: boolean = true) {
            for (const component of this._components) {
                if (component.isActiveAndEnabled && component.constructor instanceof paper.Behaviour) {
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
         * 当前GameObject对象自身激活状态
         */
        public get activeSelf() {
            return this._activeSelf;
        }
        public set activeSelf(value: boolean) {
            if (this._activeSelf !== value) {
                const prevActive = this.activeInHierarchy;
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

                if (parent && !parent.gameObject.activeInHierarchy) {
                    this._activeInHierarchy = false;
                }
                else {
                    this._activeInHierarchy = this._activeSelf;
                }

                this._activeDirty = false;
            }

            return this._activeInHierarchy;
        }

        /**
         * 组件列表
         */
        @paper.serializedField
        public get components(): ReadonlyArray<BaseComponent> {
            return this._components;
        }
        /**
         * 仅用于反序列化。
         * 
         */
        public set components(value: ReadonlyArray<BaseComponent>) {
            this._components.length = 0;
            for (const component of value) {
                this._components.push(component);
            }
            // Transform 必须存在。
            this.transform = this.getComponent(egret3d.Transform) as any;
        }

        /**
         * 获取物体所在场景实例。
         */
        public get scene(): Scene {
            return this._scene;
        }
    }
}
