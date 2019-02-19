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

        protected _setEnabled(value: boolean): void {
            if ((this._lifeStates & ComponentLifeState.Initialized) && this.gameObject.activeInHierarchy) {
                this.dispatchEnabledEvent(value);
            }
        }

        public initialize(config?: any): void {
            super.initialize(config);

            (this.gameObject as GameObject) = this.entity as GameObject;
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
