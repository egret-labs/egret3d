namespace paper {
    Layer.Default; // egret build bug.
    /**
     * 游戏实体。
     */
    export class GameObject extends Entity {
        /**
         * 创建实体，并添加到当前场景中。
         */
        public static create(name: string = DefaultNames.NoName, tag: string = DefaultTags.Untagged, scene: Scene | null = null): GameObject {
            const gameObect = new GameObject();
            gameObect._enabled = true;
            gameObect._globalEnabled = false;
            gameObect.name = name;
            gameObect.tag = tag;
            gameObect.scene = scene || SceneManager.getInstance().activeScene;
            gameObect.addComponent(egret3d.Transform); //
            Entity.onEntityCreated.dispatch(gameObect);

            return gameObect;
        }
        /**
         * 全局实体。
         * - 全局实体不可被销毁。
         * - 静态组件都会添加到全局实体上。
         */
        public static get globalGameObject(): GameObject {
            return SceneManager.getInstance().globalEntity as GameObject;
        }
        /**
         * 是否是静态模式。
         */
        @serializedField
        @editor.property(editor.EditType.CHECKBOX)
        public isStatic: boolean = false;
        /**
         * 标签。
         */
        @serializedField
        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).DefaultTags) }) // TODO
        public tag: paper.DefaultTags | string = "";
        /**
         * 层级。
         * - 用于各种层遮罩。
         */
        @serializedField
        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).Layer) }) // TODO
        public layer: Layer = Layer.Default;
        /**
         * 
         */
        @serializedField
        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).HideFlags) }) // TODO
        public hideFlags: HideFlags = HideFlags.None;
        /**
         * 变换组件。
         */
        public readonly transform: egret3d.Transform = null!;
        /**
         * 渲染组件。
         */
        public readonly renderer: BaseRenderer | null = null;
        /**
         * @internal
         */
        public _globalEnabled: boolean = false;
        /**
         * @internal
         */
        public _globalEnabledDirty: boolean = true;
        /**
         * @internal
         */
        public _beforeRenderBehaviorCount: uint = 0;

        protected _destroy() {
            for (const child of this.transform.children) {
                child.gameObject._destroy();
            }

            super._destroy();
        }

        protected _addComponent(component: IComponent, config?: any) {
            if (component.constructor === egret3d.Transform) {
                (this.transform as egret3d.Transform) = component as egret3d.Transform;
            }
            else if (component instanceof BaseRenderer) {
                (this.renderer as BaseRenderer) = component;
            }
            else if ((component.constructor as IComponentClass<IComponent>).isBehaviour) {
                if ((component as Behaviour).onBeforeRender) {
                    this._beforeRenderBehaviorCount++;
                }
            }

            component.initialize(config);

            if (this.activeInHierarchy && component.enabled) {
                Component.dispatchEnabledEvent(component, true);
            }
        }

        protected _removeComponent(component: IComponent, groupComponent: GroupComponent | null) {
            super._removeComponent(component, groupComponent);

            if (component === this.transform) {
                (this.transform as egret3d.Transform) = null!;
            }
            else if (component === this.renderer) {
                (this.renderer as BaseRenderer | null) = null;
            }
            else if ((component.constructor as IComponentClass<IComponent>).isBehaviour) {
                if ((component as Behaviour).onBeforeRender) {
                    this._beforeRenderBehaviorCount--;
                }
            }
        }
        /**
         * @internal
         */
        public _updateGlobalEnabledDitry(prevEnabled: boolean, currentEnabled: boolean) {
            this._globalEnabledDirty = true;

            if (prevEnabled !== currentEnabled) {
                for (const component of this._components) {
                    if (!component) {
                        continue;
                    }

                    if (component.constructor === GroupComponent) {
                        for (const componentInGroup of (component as GroupComponent).components) {
                            if (componentInGroup.enabled) {
                                Component.dispatchEnabledEvent(componentInGroup, currentEnabled);
                            }
                        }
                    }
                    else if (component.enabled) {
                        Component.dispatchEnabledEvent(component, currentEnabled);
                    }
                }
            }

            for (const child of this.transform.children) {
                if (child.gameObject._enabled) {
                    child.gameObject._updateGlobalEnabledDitry(prevEnabled, currentEnabled);
                }
            }
        }

        public uninitialize(): void {
            super.uninitialize();

            this.isStatic = false;
            this.hideFlags = HideFlags.None;
            this.layer = Layer.Default;
            this.tag = "";

            this._globalEnabled = false;
            this._globalEnabledDirty = true;
            this._beforeRenderBehaviorCount = 0;
        }
        /**
         * 销毁实体。
         */
        public destroy(): boolean {
            if (super.destroy()) {
                const parent = this.transform.parent;

                if (parent) {
                    parent._children.splice(parent._children.indexOf(this.transform), 1);
                }

                return true;
            }

            return false;
        }
        /**
         * 获取一个自己或父级中指定的组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        public getComponentInParent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false) {
            let result: T | null = null;
            let parent = this.transform.parent;

            while (!result && parent) {
                result = parent.gameObject.getComponent(componentClass, isExtends);
                parent = parent.parent;
            }

            return result;
        }
        /**
         * 获取一个自己或子（孙）级中指定的组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        public getComponentInChildren<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T | null {
            let component = this.getComponent(componentClass, isExtends);
            if (!component) {
                for (const child of this.transform.children) {
                    component = child.gameObject.getComponentInChildren(componentClass, isExtends);
                    if (component) {
                        break;
                    }
                }
            }

            return component;
        }
        /**
         * 获取全部自己和子（孙）级中指定的组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        public getComponentsInChildren<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false, components: T[] | null = null) {
            components = components || [];

            for (const component of this._components) {
                if (!component) {
                    continue;
                }

                if (component.constructor === GroupComponent) {
                    const groupComponent = component as GroupComponent;
                    if (isExtends ?
                        groupComponent.components[0] instanceof componentClass :
                        groupComponent.components[0].constructor === componentClass
                    ) {
                        for (const componentInGroup of groupComponent.components) {
                            components.push(componentInGroup as T);
                        }
                    }
                }
                else if (isExtends ? component instanceof componentClass : component.constructor === componentClass) {
                    components.push(component as T);
                }
            }

            for (const child of this.transform.children) {
                child.gameObject.getComponentsInChildren(componentClass, isExtends, components);
            }

            return components;
        }
        /**
         * 从该实体已注册的全部组件中获取一个指定组件实例，如果未添加该组件，则添加该组件。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         * @param config BaseComponent 组件 `initialize(config?: any)` 方法或 Behaviour 组件 `onAwake(config?: any)` 方法的可选参数。
         */
        public getOrAddComponent<T extends BaseComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false, config?: any) {
            return this.getComponent(componentClass, isExtends) || this.addComponent(componentClass, config);
        }
        /**
         * 向该实体已激活的全部 Behaviour 组件发送消息。
         * @param methodName 
         * @param parameter
         */
        public sendMessage<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver: boolean = true) {
            for (const component of this._components) {
                if (component && (component.constructor as IComponentClass<T>).isBehaviour && (component as T).isActiveAndEnabled) {
                    if (methodName in component) {
                        (component as any)[methodName](parameter);
                    }
                    else if (DEBUG && requireReceiver) {
                        console.warn(this.name, egret.getQualifiedClassName(component), methodName); // TODO
                    }
                }
            }
        }
        /**
         * 向该实体和其父级的 Behaviour 组件发送消息。
         * @param methodName 
         * @param parameter 
         */
        public sendMessageUpwards<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver: boolean = true) {
            this.sendMessage(methodName as any, parameter, requireReceiver);
            //
            const parent = this.transform.parent;
            if (parent && parent.gameObject.activeInHierarchy) {
                parent.gameObject.sendMessage(methodName as any, parameter, requireReceiver);
            }
        }
        /**
         * 向该实体和的其子（孙）级的 Behaviour 组件发送消息。
         * @param methodName 
         * @param parameter 
         */
        public broadcastMessage<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver: boolean = true) {
            this.sendMessage(methodName as any, parameter, requireReceiver);

            for (const child of this.transform.children) {
                if (child.gameObject.activeInHierarchy) {
                    child.gameObject.broadcastMessage(methodName as any, parameter, requireReceiver);
                }
            }
        }

        public set dontDestroy(value: boolean) {
            const sceneManager = SceneManager.getInstance();

            if (this.dontDestroy === value || this === sceneManager.globalEntity) {
                return;
            }

            if (this.transform.parent && this.transform.parent.gameObject.dontDestroy !== value) {
                this.transform.parent = null;
            }

            this.scene = value ? sceneManager.globalScene : sceneManager.activeScene;

            for (const child of this.transform.children) {
                child.gameObject.dontDestroy = value;
            }
        }

        public set enabled(value: boolean) {
            if (this._enabled === value || this.isDestroyed || this === SceneManager.getInstance().globalEntity) {
                return;
            }

            const parent = this.transform.parent;

            if (!parent || parent.gameObject.activeInHierarchy) {
                const prevEnabled = this._enabled;
                this._enabled = value;
                this._updateGlobalEnabledDitry(prevEnabled, value);
            }
            else {
                this._enabled = value;
            }
        }
        /**
         * 该实体自身的激活状态。
         */
        @editor.property(editor.EditType.CHECKBOX)
        public get activeSelf(): boolean {
            return this._enabled;
        }
        public set activeSelf(value: boolean) {
            this.enabled = value;
        }
        /**
         * 该实体在场景中的激活状态。
         */
        public get activeInHierarchy(): boolean {
            if (this._globalEnabledDirty) {
                const parent = this.transform.parent;

                if (!parent || parent.gameObject.activeInHierarchy) {
                    this._globalEnabled = this._enabled;
                }
                else {
                    this._globalEnabled = false;
                }

                this._globalEnabledDirty = false;
            }

            return this._globalEnabled;
        }
        /**
         * 该实体的路径。
         */
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
         * 该实体的父级实体。
         */
        public get parent(): GameObject | null {
            return this.transform.parent ? this.transform.parent.gameObject : null;
        }
        public set parent(gameObject: GameObject | null) {
            this.transform.parent = gameObject ? gameObject.transform : null;
        }

        /**
         * @deprecated
         * @see paper.Scene#find()
         */
        public static find(name: string, scene: Scene | null = null) {
            return (scene || SceneManager.getInstance().activeScene).getEntityByName(name);
        }
        /**
         * @deprecated
         */
        public static raycast(
            ray: Readonly<egret3d.Ray>, gameObjects: ReadonlyArray<GameObject>,
            maxDistance: number = 0.0, cullingMask: Layer = Layer.Everything, raycastMesh: boolean = false
        ) {
            return egret3d.raycastAll(ray, gameObjects, maxDistance, cullingMask, raycastMesh);
        }
        /**
         * @deprecated
         */
        public get globalGameObject(): GameObject {
            return GameObject.globalGameObject;
        }
    }
}
