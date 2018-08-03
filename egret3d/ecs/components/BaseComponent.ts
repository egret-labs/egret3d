namespace paper {
    /**
     * 
     */
    export type ComponentClass<T extends BaseComponent> = {
        new(): T;
        executeInEditMode: boolean;
        disallowMultiple: boolean;
        /**
         * @internal
         */
        index: number;
        requireComponents: ComponentClass<BaseComponent>[] | null;
    };
    /**
     * 
     */
    export type SingletonComponentClass<T extends SingletonComponent> = ComponentClass<T> & { instance: T | null };
    /**
     * 
     */
    export type ComponentClassArray = (ComponentClass<BaseComponent> | undefined)[];
    /**
     * 
     */
    export type ComponentArray = (BaseComponent | undefined)[];
    /**
     * 组件基类
     */
    export abstract class BaseComponent extends BaseObject {
        /**
         * 是否在编辑模式拥有生命周期。
         */
        public static executeInEditMode: boolean = false;
        /**
         * 是否禁止在同一实体上添加多个实例。
         */
        public static disallowMultiple: boolean = false;
        /**
         * @internal
         */
        public static level: number = -1;
        /**
         * @internal
         */
        public static componentIndex: number = -1;
        /**
         * @internal
         */
        public static index: number = -1;
        /**
         * 依赖的其他组件。
         */
        public static requireComponents: ComponentClass<BaseComponent>[] | null = null;

        private static _createEnabled: GameObject | null = null;
        private static _componentCount: number = 0;
        private static readonly _componentClasses: ComponentClass<BaseComponent>[] = [];
        /**
         * @internal
         */
        public static register(target: ComponentClass<BaseComponent>) {
            if (target === BaseComponent as any) {
                return;
            }

            if (this._componentClasses.indexOf(target) < 0) {
                target.index = this._componentClasses.length;
                this._componentClasses.push(target);
            }
        }
        /**
         * @internal
         */
        public static create<T extends BaseComponent>(componentClass: ComponentClass<T>, gameObject: GameObject): T {
            this.register(componentClass);
            BaseComponent._createEnabled = gameObject;

            return new componentClass();
        }

        @paper.serializedField
        public assetID?: string = createAssetID();
        /**
         * 组件挂载的 GameObject
         */
        public readonly gameObject: GameObject = null as any;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        @paper.serializedField
        public extras?: any;

        @serializedField
        protected _enabled: boolean = true;
        /**
         * 禁止实例化组件。
         * @protected
         */
        public constructor() {
            super();

            if (BaseComponent._createEnabled) {
                this.gameObject = BaseComponent._createEnabled;
                BaseComponent._createEnabled = null;
            }
            else {
                throw new Error("Create an instance of a component is not allowed.");
            }

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
        public get enabled() {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled === value) {
                return;
            }

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
    }
}
