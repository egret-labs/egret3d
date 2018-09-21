namespace paper {
    /**
     * 组件基类
     */
    export abstract class BaseComponent extends BaseObject {
        /**
         * 是否在编辑模式拥有生命周期。
         */
        public static executeInEditMode: boolean = false;
        /**
         * 是否允许在同一实体上添加多个实例。
         */
        public static allowMultiple: boolean = false;
        /**
         * 依赖的其他组件。
         */
        public static requireComponents: ComponentClass<BaseComponent>[] | null = null;
        /**
         * // TODO 基类标记，以阻止注册基类。
         * @internal
         */
        public static readonly __isSingleton: boolean = false;
        /**
         * @internal
         */
        public static __index: number = -1;
        private static readonly _allComponents: ComponentClass<BaseComponent>[] = [];
        private static readonly _allSingletonComponents: ComponentClass<BaseComponent>[] = [];
        private static _createEnabled: GameObject | null = null;
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
        public static create<T extends BaseComponent>(componentClass: ComponentClass<T>, gameObject: GameObject): T {
            this._createEnabled = gameObject;

            return new componentClass();
        }
        /**
         * 组件挂载的 GameObject
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
         * 禁止实例化组件。
         * @protected
         */
        public constructor() {
            super();

            if (!BaseComponent._createEnabled) {
                throw new Error("Component instantiation through constructor is not allowed.");
            }

            this.gameObject = BaseComponent._createEnabled;
            BaseComponent._createEnabled = null;

        }
        /**
         * 添加组件后，组件内部初始化。
         * - 重载此方法时，必须调用 `super.initialize()`。
         */
        public initialize(config?: any) {
        }
        /**
         * 移除组件后，组件内部卸载。
         * - 重载此方法时，必须调用 `super.uninitialize()`。
         */
        public uninitialize() {
        }
        /**
         * 
         */
        public get isDestroyed() {
            return !this.gameObject;
        }
        /**
         * 组件的激活状态。
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
                EventPool.dispatchEvent(currentEnabled ? EventPool.EventType.Enabled : EventPool.EventType.Disabled, this);
            }
        }
        /**
         * 组件在场景的激活状态。
         */
        public get isActiveAndEnabled() {
            // return this._enabled && this.gameObject.activeInHierarchy;
            return this._enabled && (this.gameObject._activeDirty ? this.gameObject.activeInHierarchy : this.gameObject._activeInHierarchy);
        }
        /**
         * 
         */
        public get transform() {
            return this.gameObject.transform;
        }
    }
}
