
namespace paper {
    /**
     * 脚本组件。
     * 生命周期的顺序。
     * - onAwake();
     * - onReset();
     * - onEnable();
     * - onStart();
     * - onFixedUpdate();
     * - onUpdate();
     * - onLateUpdate();
     * - onDisable();
     * - onDestroy();
     */
    export abstract class Behaviour extends BaseComponent {
        /**
         * @internal
         */
        public _isReseted: boolean = false;
        /**
         * @internal
         */
        public _isStarted: boolean = false;

        public initialize(config?: any) {
            super.initialize(config);

            if (!Application.isEditor || _executeInEditModeComponents.indexOf(this.constructor as any) >= 0) {
                this.onAwake && this.onAwake(config);
            }
        }

        public uninitialize() {
            if (!Application.isEditor || _executeInEditModeComponents.indexOf(this.constructor as any) >= 0) {
                this.onDestroy && this.onDestroy(); // TODO onDestroy 如果不是 enabled 就不派发
            }

            super.uninitialize();
        }
        /**
         * 组件被初始化时调用。
         * @see paper.GameObject#addComponent()
         */
        public onAwake?(config: any): void;
        /**
         * 
         */
        public onReset?(): void;
        /**
         * 组件被激活或实体被激活时调用。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        public onEnable?(): void;
        /**
         * 组件开始运行时调用。
         * - 在整个生命周期中只执行一次。
         */
        public onStart?(): void;
        /**
         * 
         */
        public onFixedUpdate?(currentTimes: number, totalTimes: number): void;
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
         * 
         */
        public onUpdate?(deltaTime: number): void;
        /**
         * 
         */
        public onAnimationEvent?(type: string, animationState: egret3d.AnimationState, eventObject: any): void;
        /**
         * 
         */
        public onLateUpdate?(deltaTime: number): void;
        /**
         * 组件被禁用或实体被禁用时调用。
         * @see paper.BaseComponent#enabled
         * @see paper.GameObject#activeSelf
         */
        public onDisable?(): void;
        /**
         * 组件被移除或实体被销毁时调用。
         * @see paper.GameObject#removeComponent()
         * @see paper.GameObject#destroy()
         */
        public onDestroy?(): void;

        /**
         * @deprecated
         */
        public onCollide(collider: any) { }
    }
}