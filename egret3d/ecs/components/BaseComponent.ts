namespace paper {
    /**
     * 组件基类
     */
    export abstract class BaseComponent extends SerializableObject {
        /**
         * 
         */
        public static index: number = -1;
        /**
         * @internal
         */
        public static readonly _componentClasses: any[] = [];
        private static _injectGameObject: GameObject = null as any;
        /**
         * @internal
         */
        public static create<T extends BaseComponent>(componentClass: { new(): T }, gameObject: GameObject): T {
            this._injectGameObject = gameObject;
            return new componentClass();
        }

        /**
         * @internal
         */
        @paper.serializedField
        public assetID: string = createAssetID();
        /**
         * 组件挂载的 GameObject
         */
        public readonly gameObject: GameObject = BaseComponent._injectGameObject;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        @paper.serializedField
        public extras?: any;

        @serializedField
        protected _enabled: boolean = true;
        /**
         * 禁止实例化组件实例。
         * @protected
         */
        public constructor() {
            super();

            if (BaseComponent._injectGameObject) {
                if (this.constructor["index"] < 0) {
                    this.constructor["index"] = BaseComponent._componentClasses.length;
                    BaseComponent._componentClasses.push(this.constructor);
                }

                BaseComponent._injectGameObject = null as any;
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

        public serialize(): any {
            const target = createReference(this, false);
            target._enabled = this._enabled;

            if (this.assetID) {
                target.assetID = this.assetID;
            }

            if (this.extras) {
                target.extras = {};

                for (const k in this.extras) {
                    target.extras[k] = this.extras[k];
                }
            }

            return target;
        }

        public deserialize(element: any) {
            this._enabled = element._enabled === false ? false : true;

            if (element.uuid) {
                this.uuid = element.uuid;
            }

            if (element.assetID) {
                this.assetID = element.assetID;
            }

            if (element.extras) {
                this.extras = {};

                for (const k in element.extras) {
                    this.extras[k] = element.extras[k];
                }
            }
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
                EventPool.dispatchEvent(
                    currentEnabled ? EventPool.EventType.Enabled : EventPool.EventType.Disabled,
                    this
                );
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
