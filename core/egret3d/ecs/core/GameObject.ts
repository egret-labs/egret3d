namespace paper {
    Layer.Default; // egret build bug.
    /**
     * 游戏实体。
     */
    export class GameObject extends Entity {
        /**
         * 创建游戏实体，并添加到当前场景中。
         */
        public static create(name: string = DefaultNames.NoName, tag: string = DefaultTags.Untagged, scene: Scene | null = null): GameObject {
            const gameObect = new GameObject();
            gameObect._isDestroyed = false;
            gameObect._enabled = Entity.createDefaultEnabled;
            gameObect.name = name;
            gameObect.tag = tag;
            gameObect._setScene(scene || Application.sceneManager.activeScene, true);
            gameObect.addComponent(egret3d.Transform); //

            return gameObect;
        }
        /**
         * 是否是静态模式。
         */
        @serializedField
        @editor.property(editor.EditType.CHECKBOX)
        public isStatic: boolean = false;
        /**
         * 层级。
         * - 用于各种层遮罩。
         */
        @serializedField
        @editor.property(editor.EditType.LIST, { listItems: editor.getItemsFromEnum((paper as any).Layer) }) // TODO
        public layer: Layer = Layer.Default;
        /**
         * 该实体的变换组件。
         */
        public readonly transform: egret3d.Transform = null!;
        /**
         * 渲染组件。
         */
        public readonly renderer: BaseRenderer | null = null;
        /**
         * @internal
         */
        public _beforeRenderBehaviorCount: uint = 0;

        protected _destroy() {
            for (const component of this._components) {
                if (component && component !== this.transform) {
                    this._removeComponent(component, null);
                }
            }

            this._removeComponent(this.transform, null); // Remove transform at last.
        }

        protected _setScene(value: Scene | null, dispatchEvent: boolean) {
            if (this.transform && this.transform.parent && this.transform.parent.entity.scene !== value) { // TODO
                this.transform.parent = null;
            }

            super._setScene(value, false);

            if (this.transform) {
                for (const child of this.transform.children) {
                    (child.entity as this)._setScene(value, false);
                }
            }

            if (dispatchEvent) {
                super._setScene(null, true);

                if (this.transform) {
                    for (const child of this.transform.children) {
                        (child.entity as this)._setScene(null, true);
                    }
                }
            }
        }

        protected _setEnabled(value: boolean) {
            const transformParent = this.transform ? this.transform.parent : null;

            if (!transformParent || transformParent.isActiveAndEnabled) {
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
            }
        }

        protected _addComponent(component: IComponent, config?: any) {
            if (component instanceof BaseTransform) {
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

            super._addComponent(component, config);
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

        public uninitialize(): void {
            super.uninitialize();

            this.isStatic = false;
            this.hideFlags = HideFlags.None;
            this.layer = Layer.Default;
            this.tag = "";

            this._beforeRenderBehaviorCount = 0;
        }
        /**
         * 获取一个自己或父级中指定的组件实例。
         * - 仅查找处于激活状态的父级实体。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        public getComponentInParent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T | null {
            if (this._isDestroyed) {
                return null;
            }

            let component = this.getComponent(componentClass, isExtends);

            if (!component) {
                let parent = this.transform.parent;

                while (!component && parent && parent.enabled && parent.entity.enabled) {
                    component = parent.gameObject.getComponentInParent(componentClass, isExtends);
                    parent = parent.parent;
                }
            }

            return component;
        }
        /**
         * 获取一个自己或子（孙）级中指定的组件实例。
         * - 仅查找处于激活状态的子（孙）级实体。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        public getComponentInChildren<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false): T | null {
            if (this._isDestroyed) {
                return null;
            }

            let component = this.getComponent(componentClass, isExtends);

            if (!component && this.transform.enabled) {
                for (const child of this.transform.children) {
                    if (child.enabled && child.entity.enabled) {
                        component = child.gameObject.getComponentInChildren(componentClass, isExtends);

                        if (component) {
                            break;
                        }
                    }
                }
            }

            return component;
        }
        /**
         * 获取全部自己和子（孙）级中指定的组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         * @param includeInactive 是否尝试查找处于未激活状态的子（孙）级实体。（默认 `false`）
         */
        public getComponentsInChildren<T extends IComponent>(componentClass: IComponentClass<T>, isExtends: boolean = false, includeInactive: boolean = false, components: T[] | null = null) {
            components = components || [];

            if (this._isDestroyed) {
                return components;
            }

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

            if (this.transform.enabled) {
                for (const child of this.transform.children) {
                    if (includeInactive || (child.enabled && child.entity.enabled)) {
                        child.gameObject.getComponentsInChildren(componentClass, isExtends, includeInactive, components);
                    }
                }
            }

            return components;
        }
        /**
         * 向该实体已激活的全部 Behaviour 组件发送消息。
         * @param methodName 
         * @param parameter
         */
        public sendMessage<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver: boolean = true): this {
            if (this._isDestroyed) {
                return this;
            }

            for (const component of this._components) {
                if (component && (component.constructor as IComponentClass<T>).isBehaviour && (component as T).enabled) {
                    if (methodName in component) {
                        (component as any)[methodName](parameter);
                    }
                    else if (requireReceiver && DEBUG) {
                        console.warn(this.name, egret.getQualifiedClassName(component), methodName); // TODO
                    }
                }
            }

            return this;
        }
        /**
         * 向该实体和其父级的 Behaviour 组件发送消息。
         * @param methodName 
         * @param parameter 
         */
        public sendMessageUpwards<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver: boolean = true): this {
            if (this._isDestroyed) {
                return this;
            }

            this.sendMessage(methodName as any, parameter, requireReceiver);
            //
            const parent = this.transform.parent;

            if (parent && parent.enabled) {
                parent.gameObject.sendMessageUpwards(methodName as any, parameter, requireReceiver);
            }

            return this;
        }
        /**
         * 向该实体和的其子（孙）级的 Behaviour 组件发送消息。
         * @param methodName 
         * @param parameter 
         */
        public broadcastMessage<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver: boolean = true): this {
            if (this._isDestroyed) {
                return this;
            }

            this.sendMessage(methodName as any, parameter, requireReceiver);

            for (const child of this.transform.children) {
                if (child.enabled) {
                    child.gameObject.broadcastMessage(methodName as any, parameter, requireReceiver);
                }
            }

            return this;
        }
        /**
         * 该实体自身的激活状态。
         */
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
            const transformParent = this.transform ? this.transform.parent : null;

            return this._enabled && (!transformParent || transformParent.isActiveAndEnabled);
        }
        /**
         * 该实体的路径。
         */
        public get path(): string {
            let path = this.name;

            if (this.transform) {
                let transformParent = this.transform.parent;

                while (transformParent) {
                    path = transformParent.entity.name + "/" + path;
                    transformParent = transformParent.parent;
                }

                return this._scene!.name + "/" + path;
            }

            return path;
        }
        /**
         * 该实体的父级实体。
         */
        public get parent(): this | null {
            return (this.transform && this.transform.parent) ? (this.transform.parent.gameObject as this) : null;
        }
        public set parent(value: this | null) {
            if (this.transform) {
                this.transform.parent = value ? value.transform : null;
            }
        }

        /**
         * @deprecated
         * @see paper.Scene#find()
         */
        public static find(name: string, scene: Scene | null = null) {
            return (scene || Application.sceneManager.activeScene).find<GameObject>(name);
        }
        /**
         * @deprecated
         */
        public static get globalGameObject(): GameObject {
            return Application.sceneManager.globalEntity as GameObject;
        }
        /**
         * @deprecated
         */
        public get globalGameObject(): this {
            return Application.sceneManager.globalEntity as this;
        }
    }
}
