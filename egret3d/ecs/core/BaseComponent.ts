namespace paper {
    /**
     * 
     */
    export abstract class BaseComponent extends SerializableObject {
        /**
         * @internal
         */
        public static _injectGameObject: GameObject;

        /**
         * 组件挂载的 GameObject
         */
        public readonly gameObject: GameObject = BaseComponent._injectGameObject;

        @paper.serializedField
        protected _enabled: boolean = true;

        /**
         * 添加组件后，内部初始化，在反序列化后被调用。
         */
        public initialize() {
        }

        /**
         * 移除组件后调用。
         */
        public uninitialize() {
            (this as any).gameObject = null;
        }
        /**
         * @inheritDoc
         */
        public serialize(): any {
            const target = serializeRC(this);
            target._enabled = this._enabled;

            return target;
        }
        /**
         * @inheritDoc
         */
        public deserialize(element: any): void {
            this._enabled = element._enabled === false ? false : true;
        }

        /**
         * 组件自身的激活状态
         */
        public get enabled() {
            return this._enabled;
        }
        public set enabled(value: boolean) {
            if (this._enabled !== value) {
                const prevActiveAndEnabled = this.isActiveAndEnabled;
                this._enabled = value;
                const currentActiveAndEnabled = this.isActiveAndEnabled;

                if (currentActiveAndEnabled !== prevActiveAndEnabled) {
                    paper.EventPool.dispatchEvent(
                        currentActiveAndEnabled ? paper.EventPool.EventType.Enabled : paper.EventPool.EventType.Disabled,
                        this
                    );
                }
            }
        }

        /**
         * 获取组件在场景中的激活状态
         */
        public get isActiveAndEnabled() {
            return this._enabled && this.gameObject.activeInHierarchy;
        }
    }
}
