namespace paper {
    let _createEnabled: GameObject | null = null;
    /**
     * 基础组件。
     * - 所有组件的基类。
     */
    export abstract class BaseComponent extends BaseObject {
        /**
         * 该组件的实例是否在编辑模式拥有生命周期。
         * @internal
         */
        public static executeInEditMode: boolean = false;
        /**
         * 是否允许在同一实体上添加多个该组件的实例。
         * @internal
         */
        public static allowMultiple: boolean = false;
        /**
         * 该组件实例依赖的其他前置组件。
         * @internal
         */
        public static requireComponents: IComponentClass<BaseComponent>[] | null = null;
        /**
         * 当该组件被激活时派发事件。
         * @internal
         */
        public static onComponentEnabled: signals.Signal = null!;
        /**
         * 当该组件被禁用时派发事件。
         * @internal
         */
        public static onComponentDisabled: signals.Signal = null!;
        // TODO 基类标记，以阻止注册基类。
        /**
         * 该组件实例是否为单例组件。
         * @internal
         */
        public static readonly __isSingleton: boolean = false;
        /**
         * 该组件实例索引。
         * @internal
         */
        public static __index: number = -1;
        /**
         * 所有已注册的组件类。
         */
        private static readonly _allComponents: IComponentClass<BaseComponent>[] = [];
        /**
         * 所有已注册的单例组件类。
         */
        private static readonly _allSingletonComponents: IComponentClass<BaseComponent>[] = [];
        /**
         * @internal
         */
        public static __onRegister() {
            if (!BaseObject.__onRegister.call(this)) { // Super.
                return false;
            }

            if ((this.__isSingleton ? this._allSingletonComponents : this._allComponents).indexOf(this as any) >= 0) {
                console.warn("Register component class again.", egret.getQualifiedClassName(this));
                return false;
            }

            if (this.requireComponents) { // Inherited parent class require components.
                this.requireComponents = this.requireComponents.concat();
            }
            else {
                this.requireComponents = [];
            }

            this.onComponentEnabled = new signals.Signal();
            this.onComponentDisabled = new signals.Signal();

            if (this.__isSingleton) {
                this.__index = this._allSingletonComponents.length + 300; // This means that a maximum of 300 non-singleton components can be added.
                this._allSingletonComponents.push(this as any);
            }
            else {
                this.__index = this._allComponents.length;
                this._allComponents.push(this as any);
            }

            return true;
        }
        /**
         * @internal
         */
        public static create<T extends BaseComponent>(componentClass: IComponentClass<T>, gameObject: GameObject): T {
            _createEnabled = gameObject;

            return new componentClass();
        }
        /**
         * 该组件的实体。
         */
        public readonly gameObject: GameObject = null!;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        @paper.serializedField
        public extras?: ComponentExtras = Application.playerMode === PlayerMode.Editor ? {} : undefined;

        @serializedField
        protected _enabled: boolean = true;
        /**
         * 禁止实例化。
         * @protected
         */
        public constructor() {
            super();

            if (!_createEnabled) {
                throw new Error("Component instantiation through constructor is not allowed.");
            }

            this.gameObject = _createEnabled;
            _createEnabled = null;

        }
        /**
         * @internal
         */
        public _dispatchEnabledEvent(value: boolean) {
            const componentClass = this.constructor as IComponentClass<this>;
            if (value) {
                componentClass.onComponentEnabled.dispatch(this);
            }
            else {
                componentClass.onComponentDisabled.dispatch(this);
            }
        }
        /**
         * 添加组件后，组件内部初始化时执行。
         * - 重写此方法时，必须调用 `super.initialize()`。
         * @param config 实体添加该组件时可以传递的初始化数据。
         */
        public initialize(config?: any) {
            if (config) { // TODO enabled 

            }
        }
        /**
         * 移除组件后，组件内部卸载时执行。
         * - 重写此方法时，必须调用 `super.uninitialize()`。
         */
        public uninitialize() {
        }
        /**
         * 该组件是否已被销毁。
         */
        public get isDestroyed() {
            return !this.gameObject;
        }
        /**
         * 该组件自身的激活状态。
         */
        @editor.property(editor.EditType.CHECKBOX)
        public get enabled() {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled === value) {
                return;
            }

            // if (!value && this.constructor === egret3d.Transform) { TODO
            //     console.warn("Cannot disable transform compnent.");
            //     return;
            // }

            const prevEnabled = this.isActiveAndEnabled;
            this._enabled = value;
            const currentEnabled = this.isActiveAndEnabled;

            if (currentEnabled !== prevEnabled) {
                this._dispatchEnabledEvent(currentEnabled);
            }
        }
        /**
         * 该组件在场景的激活状态。
         */
        public get isActiveAndEnabled() {
            // return this._enabled && this.gameObject.activeInHierarchy;
            return this._enabled && (this.gameObject._activeDirty ? this.gameObject.activeInHierarchy : this.gameObject._activeInHierarchy);
        }
    }
}
