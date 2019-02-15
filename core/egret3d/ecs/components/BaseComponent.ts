namespace paper {
    /**
     * 传统的基础组件。
     */
    export abstract class BaseComponent extends Component {
        /**
         * @internal
         */
        public static readonly isAbstract: IComponentClass<IComponent> = BaseComponent as any;
        /**
         * 该组件的游戏实体。
         */
        public readonly gameObject: GameObject = null!;
        /**
         * @internal
         */
        public _destroy() {
            super._destroy();

            (this.gameObject as GameObject) = null!;
        }

        public initialize(config?: any): void {
            super.initialize(config);

            (this.gameObject as GameObject) = this.entity as GameObject;
        }

        public set enabled(value: boolean) {
            if (this._enabled === value || this.isDestroyed) {
                return;
            }

            this._enabled = value;

            if ((this._lifeStates & ComponentLifeState.Initialized) && this.gameObject.activeInHierarchy) {
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
