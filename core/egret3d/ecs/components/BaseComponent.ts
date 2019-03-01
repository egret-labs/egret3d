namespace paper {
    /**
     * 传统的基础组件。
     */
    @abstract
    export abstract class BaseComponent extends Component {
        /**
         * 该组件的游戏实体。
         */
        public readonly gameObject: GameObject = null!;

        protected _setEnabled(value: boolean): void {
            if ((this._lifeStates & ComponentLifeState.Initialized) && this.gameObject.activeInHierarchy) {
                this.dispatchEnabledEvent(value);
            }
        }

        public initialize(config?: any): void {
            super.initialize(config);

            (this.gameObject as GameObject) = this.entity as GameObject;
        }

        public uninitialize(): void {
            super.uninitialize();

            (this.gameObject as GameObject) = null!;
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
