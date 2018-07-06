
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
        @serializedField
        public _isReseted: boolean = false;
        /**
         * @internal
         */
        public _isStarted: boolean = false;
        /**
         * @internal
         */
        public _isTriggerEnabled: boolean = false;
        /**
         * @internal
         */
        public _isCollisionEnabled: boolean = false;

        public initialize(config?: any) {
            super.initialize(config);

            this._isTriggerEnabled = Boolean(this.onTriggerEnter || this.onTriggerStay || this.onTriggerExit);
            this._isCollisionEnabled = Boolean(this.onCollisionEnter || this.onCollisionStay || this.onCollisionExit);

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
        public onAwake?(config?: any): void;
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
        public onFixedUpdate?(): void;
        /**
         * 
         */
        public onTriggerEnter?(collisionObject: any): void;
        /**
         * 
         */
        public onTriggerStay?(collisionObject: any): void;
        /**
         * 
         */
        public onTriggerExit?(collisionObject: any): void;
        /**
         * 
         */
        public onCollisionEnter?(collisionObject: any): void;
        /**
         * 
         */
        public onCollisionStay?(collisionObject: any): void;
        /**
         * 
         */
        public onCollisionExit?(collisionObject: any): void;
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