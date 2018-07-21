namespace paper {
    /**
     * 组件基类
     */
    export abstract class BaseComponent extends SerializableObject {
        /**
         * @internal
         */
        public static _injectGameObject: GameObject;

        /**
         * @internal
         */
        @paper.serializedField
        public assetID: string = createAssetID();
        /**
         * 组件挂载的 GameObject
         */
        public readonly gameObject: GameObject = BaseComponent._injectGameObject;

        @serializedField
        protected _enabled: boolean = true;
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
