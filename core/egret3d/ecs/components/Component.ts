namespace paper {
    let _createEnabled: boolean = false;
    /**
     * 基础组件。
     * - 所有组件的基类。
     * - 在纯粹的实体组件系统中，组件通常应只包含数据，不应有业务逻辑、行为和生命周期。
     */
    export abstract class Component extends BaseObject implements IComponent {
        /**
         * 当组件被激活时派发事件。
         */
        public static readonly onComponentEnabled: signals.Signal<[IEntity, IComponent]> = new signals.Signal();
        /**
         * 当组件被禁用时派发事件。
         */
        public static readonly onComponentDisabled: signals.Signal<[IEntity, IComponent]> = new signals.Signal();
        /**
         * 该组件的实例是否在编辑模式拥有生命周期。
         * @internal
         */
        public static readonly executeInEditMode: boolean = false;
        /**
         * 是否允许在同一实体上添加多个该组件的实例。
         * @internal
         */
        public static readonly allowMultiple: boolean = false;
        /**
         * 该组件实例依赖的其他前置组件。
         * @internal
         */
        public static readonly requireComponents: IComponentClass<IComponent>[] | null = null;
        /**
         * 该组件实例是否为单例组件。
         * @internal
         */
        public static readonly __isSingleton: boolean = false;
        /**
         * @internal
         */
        public static readonly __isBehaviour: boolean = false;
        /**
         * 该组件实例索引。
         * @internal
         */
        public static readonly __index: int = -1;
        /**
         * @internal
         */
        public static readonly __isAbstract: IComponentClass<IComponent> = BaseComponent as any;
        /**
         * 所有已注册的组件类。
         */
        private static readonly _allComponents: IComponentClass<IComponent>[] = [];
        /**
         * 所有已注册的单例组件类。
         */
        private static readonly _allSingletonComponents: IComponentClass<IComponent>[] = [];
        /**
         * @internal
         */
        public static __onRegister() {
            if (!BaseObject.__onRegister.call(this) || this.__isAbstract === this as any) { // Super.
                return false;
            }

            if ((this.__isSingleton ? this._allSingletonComponents : this._allComponents).indexOf(this as any) >= 0) {
                console.warn("Register component class again.", egret.getQualifiedClassName(this));
                return false;
            }

            if (this.requireComponents) { // Inherited parent class require components.
                (this.requireComponents as any) = this.requireComponents.concat();
            }
            else {
                (this.requireComponents as any) = [];
            }

            if (this.__isSingleton) {
                (this.__index as uint) = this._allSingletonComponents.length + 256; // This means that a maximum of 256 non-singleton components can be added.
                this._allSingletonComponents.push(this as any);
            }
            else {
                (this.__index as uint) = this._allComponents.length;
                this._allComponents.push(this as any);
            }

            return true;
        }
        /**
         * @internal
         */
        public static create<T extends IComponent>(entity: IEntity, componentClass: IComponentClass<T>): T {
            _createEnabled = true;

            const component = <any>new componentClass() as Component;
            (component.entity as IEntity) = entity;
            component._enabled = true;
            component._isDestroyed = false;

            return <any>component as T;
        }
        /**
         * @internal
         */
        public static dispatchEnabledEvent(component: IComponent, enabled: boolean) {
            if (enabled) {
                this.onComponentEnabled.dispatch([component.entity, component]);
            }
            else {
                this.onComponentDisabled.dispatch([component.entity, component]);
            }
        }
        /**
         * TODO
         */
        @serializedField
        public hideFlags: HideFlags = HideFlags.None;

        public readonly entity: IEntity = null!;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        @paper.serializedField
        public extras?: ComponentExtras = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        @serializedField
        protected _enabled: boolean = false;
        /**
         * 该属性由实体设置。
         * @internal
         */
        public _isDestroyed: boolean = true;
        /**
         * 禁止实例化组件。
         * @protected
         */
        public constructor() {
            super();

            if (!_createEnabled) {
                throw new Error();
            }

            _createEnabled = false;
        }

        public initialize(config?: any): void {
        }

        public uninitialize(): void {
        }

        public get isDestroyed(): boolean {
            return this._isDestroyed;
        }

        @editor.property(editor.EditType.CHECKBOX)
        public get enabled(): boolean {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._isDestroyed || this._enabled === value) {
                return;
            }

            this._enabled = value;
            Component.dispatchEnabledEvent(this, value);
        }
    }
}
