namespace paper {
    /**
     * @internal
     */
    export const enum ComponentLifeState {
        None = 0b00000,
        Reseted = 0b00001,
        Awaked = 0b00010,
        Initialized = 0b00100,
        Started = 0b01000,
    }
    /**
     * 基础组件。
     * - 所有组件的基类。
     * - 在纯粹的实体组件系统中，组件通常应只包含数据，不应有业务逻辑、行为和生命周期。
     */
    export abstract class Component extends BaseObject implements IComponent {
        /**
         * 
         */
        public static createDefaultEnabled: boolean = true;
        /**
         * 当组件被激活时派发事件。
         */
        public static readonly onComponentEnabled: signals.Signal<[Entity, IComponent]> = new signals.Signal();
        /**
         * 当组件被禁用时派发事件。
         */
        public static readonly onComponentDisabled: signals.Signal<[Entity, IComponent]> = new signals.Signal();
        /**
         * 该组件的实例是否在编辑模式拥有生命周期。
         */
        public static readonly executeInEditMode: boolean = false;
        /**
         * 是否允许在同一实体上添加多个该组件的实例。
         */
        public static readonly allowMultiple: boolean = false;
        /**
         * 该组件实例依赖的其他前置组件。
         */
        public static readonly requireComponents: IComponentClass<IComponent>[] | null = null;
        /**
         * 
         */
        public static readonly isAbstract: IComponentClass<IComponent> = Component as any;
        /**
         * 该组件实例是否为单例组件。
         */
        public static readonly isSingleton: boolean = false;
        /**
         * 
         */
        public static readonly isBehaviour: boolean = false;
        /**
         * 该组件实例索引。
         */
        public static readonly componentIndex: int = -1;
        /**
         * 所有已注册的组件类。
         */
        private static readonly _allComponents: IComponentClass<IComponent>[] = [];
        /**
         * 所有已注册的单例组件类。
         */
        private static readonly _allSingletonComponents: IComponentClass<IComponent>[] = [];
        /**
         * 
         */
        public static dispatchEnabledEvent(component: IComponent, enabled: boolean) {
            if (
                (component.constructor as IComponentClass<IComponent>).isBehaviour &&
                (Application.playerMode !== PlayerMode.Editor || (component.constructor as IComponentClass<Behaviour>).executeInEditMode)
            ) {
                if (enabled) {
                    if (((component as Behaviour)._lifeStates & ComponentLifeState.Awaked) === 0) {
                        (component as Behaviour).onAwake && (component as Behaviour).onAwake!();
                        (component as Behaviour)._lifeStates |= ComponentLifeState.Awaked;
                    }

                    (component as Behaviour).onEnable && (component as Behaviour).onEnable!();
                }
                else {
                    (component as Behaviour).onDisable && (component as Behaviour).onDisable!();
                }
            }

            if (enabled) {
                Component.onComponentEnabled.dispatch([component.entity, component]);
            }
            else {
                Component.onComponentDisabled.dispatch([component.entity, component]);
            }
        }
        /**
         * @internal
         */
        public static __onRegister() {
            if (!BaseObject.__onRegister.call(this) || this.isAbstract === this as any) { // Super.
                return false;
            }

            if ((this.isSingleton ? this._allSingletonComponents : this._allComponents).indexOf(this as any) >= 0) {
                console.warn("Register component class again.", egret.getQualifiedClassName(this));
                return false;
            }

            if (this.requireComponents) { // Inherited parent class require components.
                (this.requireComponents as any) = this.requireComponents.concat();
            }
            else {
                (this.requireComponents as any) = [];
            }

            if (this.isSingleton) {
                (this.componentIndex as uint) = this._allSingletonComponents.length + 256; // This means that a maximum of 256 non-singleton components can be added.
                this._allSingletonComponents.push(this as any);
            }
            else {
                (this.componentIndex as uint) = this._allComponents.length;
                this._allComponents.push(this as any);
            }

            return true;
        }
        /**
         * @internal
         */
        public static create<T extends IComponent>(entity: Entity, componentClass: IComponentClass<T>): T {
            const component = <any>new componentClass() as Component;
            (component.entity as Entity) = entity;
            component._enabled = this.createDefaultEnabled;

            return <any>component as T;
        }

        @serializedField
        public hideFlags: HideFlags = HideFlags.None;

        public readonly entity: Entity = null!;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        @paper.serializedField
        public extras?: ComponentExtras = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        @serializedField
        protected _enabled: boolean = false;

        protected _lifeStates: ComponentLifeState = ComponentLifeState.None;
        /**
         * 禁止实例化组件。
         * @protected
         */
        public constructor() {
            super();
        }
        /**
         * @internal
         */
        public _destroy() {
            (this.entity as Entity) = null!;
        }

        public initialize(config?: any): void {
            this._lifeStates |= ComponentLifeState.Initialized;
        }

        public uninitialize(): void {
            this._lifeStates = ComponentLifeState.None;
        }

        public get isDestroyed(): boolean {
            return !this.entity;
        }

        @editor.property(editor.EditType.CHECKBOX)
        public get enabled(): boolean {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled === value || this.isDestroyed) {
                return;
            }

            this._enabled = value;

            if ((this._lifeStates & ComponentLifeState.Initialized)) {
                Component.dispatchEnabledEvent(this, value);
            }
        }
    }
}
