
namespace paper {
    /**
     * 脚本组件。
     * - 生命周期的顺序。
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
        /**
         * @internal
         */
        public initialize(config?: any) {
            super.initialize(config);

            if (Application.playerMode !== PlayerMode.Editor || (this.constructor as ComponentClass<Behaviour>).executeInEditMode) {
                this.onAwake && this.onAwake(config);
            }
        }
        /**
         * @internal
         */
        public uninitialize() {
            if (Application.playerMode !== PlayerMode.Editor || (this.constructor as ComponentClass<Behaviour>).executeInEditMode) {
                this.onDestroy && this.onDestroy(); // TODO onDestroy 如果不是 enabled 就不派发
            }

            super.uninitialize();
        }
        /**
         * 该组件被初始化时执行。
         * - 在该组件的整个生命周期中只执行一次。
         * @param config 实体添加该组件时可以传递的初始化数据。
         * @see paper.GameObject#addComponent()
         */
        public onAwake?(config: any): void;
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
         * @param currentTimes 本帧被执行的计数。
         * @param totalTimes 本帧被执行的总数。
         * @see paper.Clock
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
         * 程序运行时每帧执行。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onUpdate?(deltaTime: number): void;
        /**
         * 
         */
        public onAnimationEvent?(type: string, animationState: egret3d.AnimationState, eventObject: any): void;
        /**
         * 程序运行时每帧执行。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onLateUpdate?(deltaTime: number): void;
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