
namespace paper {
    /**
     * 脚本组件。
     * - 为了开发的便捷，允许使用脚本组件实现组件生命周期。
     * - 生命周期的顺序如下：
     * - onAwake();
     * - onReset();
     * - onEnable();
     * - onStart();
     * - onFixedUpdate();
     * - onUpdate();
     * - onAnimationEvent();
     * - onLateUpdate();
     * - onBeforeRender();
     * - onDisable();
     * - onDestroy();
     */
    @abstract
    export abstract class Behaviour extends BaseComponent {
        /**
         * @internal
         */
        public static readonly isBehaviour: boolean = true;
        /**
         * @internal
         */
        public _destroy() {
            if (Application.playerMode !== PlayerMode.Editor || (this.constructor as IComponentClass<Behaviour>).executeInEditMode) {
                if (this._lifeStates & ComponentLifeState.Awaked) {
                    this.onDestroy && this.onDestroy();
                }
            }

            super._destroy();
        }

        public initialize(config?: any): void {
            if (Application.playerMode !== PlayerMode.Editor || (this.constructor as IComponentClass<Behaviour>).executeInEditMode) {
                (this.gameObject as GameObject) = this.entity as GameObject; //

                if (this.isActiveAndEnabled) {
                    this.onAwake && this.onAwake!(config);
                    this._lifeStates |= ComponentLifeState.Awaked;
                }
            }

            super.initialize(config);
        }

        public dispatchEnabledEvent(enabled: boolean): void {
            if (Application.playerMode !== PlayerMode.Editor || (this.constructor as IComponentClass<Behaviour>).executeInEditMode) {
                if (enabled) {
                    if ((this._lifeStates & ComponentLifeState.Awaked) === 0) {
                        this.onAwake && this.onAwake();
                        this._lifeStates |= ComponentLifeState.Awaked;
                    }

                    this.onEnable && this.onEnable();
                }
                else {
                    this.onDisable && this.onDisable();
                }
            }

            super.dispatchEnabledEvent(enabled);
        }
        /**
         * 该组件被初始化时执行。
         * - 在该组件的整个生命周期中只执行一次。
         * @param config 该组件被添加时可以传递的初始化数据。
         * @see paper.GameObject#addComponent()
         */
        public onAwake?(config?: any): void;
        /**
         * TODO
         */
        public onReset?(): void;
        /**
         * 该组件或所属的实体被激活时调用。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        public onEnable?(): void;
        /**
         * 该组件开始运行时执行。
         * - 在该组件的整个生命周期中只执行一次。
         */
        public onStart?(): void;
        /**
         * 程序运行时以固定间隔被执行。
         * @param delta 本帧距离上一帧的时长。
         * @see paper.Clock
         */
        public onFixedUpdate?(delta?: number): void;
        /**
         * 
         */
        public onTriggerEnter?(collider: any): void;
        /**
         * 
         */
        public onTriggerStay?(collider: any): void;
        /**
         * 
         */
        public onTriggerExit?(collider: any): void;
        /**
         * 
         */
        public onCollisionEnter?(collider: any): void;
        /**
         * 
         */
        public onCollisionStay?(collider: any): void;
        /**
         * 
         */
        public onCollisionExit?(collider: any): void;
        /**
         * 程序运行时每帧执行。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onUpdate?(deltaTime: number): void;
        /**
         * 
         */
        public onAnimationEvent?(animationEvent: egret3d.AnimationEvent): void;
        /**
         * 程序运行时每帧执行。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onLateUpdate?(deltaTime: number): void;
        /**
         * 该组件的实体拥有的渲染组件被渲染时执行。
         * - 不能在该周期更改渲染组件的材质或其他可能引起绘制信息改变的操作。
         */
        public onBeforeRender?(): boolean;
        /**
         * 该组件或所属的实体被禁用时执行。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        public onDisable?(): void;
        /**
         * 该组件或所属的实体被销毁时执行。
         * - 在该组件的整个生命周期中只执行一次。
         * @see paper.GameObject#removeComponent()
         * @see paper.GameObject#destroy()
         */
        public onDestroy?(): void;
    }
}
