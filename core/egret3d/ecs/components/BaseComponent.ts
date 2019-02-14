namespace paper {
    /**
     * 传统的基础组件。
     */
    export abstract class BaseComponent extends Component {
        /**
         * 该组件的游戏实体。
         */
        public readonly gameObject: GameObject = null!; // 该属性由 GameObject 设置。

        public set enabled(value: boolean) {
            if (this._isDestroyed || this._enabled === value) {
                return;
            }

            this._enabled = value;

            if (this.gameObject.activeInHierarchy) {
                Component.dispatchEnabledEvent(this, value);
            }
        }
        /**
         * 该组件在场景的激活状态。
         */
        public get isActiveAndEnabled(): boolean {
            return this._enabled && this.gameObject.activeInHierarchy;
        }
        /**
         * 
         */
        public get transform(): egret3d.Transform {
            return this.gameObject.transform;
        }
    }
}
