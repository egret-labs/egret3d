
namespace paper {

    /**
     * 脚本组件。
     * 生命周期的顺序。
     * - onAwake();
     * - System._onCreateComponent();
     * - onEnable();
     * - onReset();
     * - onStart();
     * - onFixedUpdate();
     * - onUpdate();
     * - onLateUpdate();
     * - onDisable();
     * - System._onDestroyComponent();
     * - onDestroy();
 */
    export class Behaviour extends BaseComponent {

        public initialize(): void {
            super.initialize();

            if (!paper.Application.isEditor || _executeInEditModeComponents.indexOf(this.constructor) >= 0) {
                this.onAwake();
            }
        }

        public uninitialize(): void {
            if (!paper.Application.isEditor || _executeInEditModeComponents.indexOf(this.constructor) >= 0) {
                this.onDestroy(); // TODO onDestroy 如果不是 enabled 就不派发
            }

            super.uninitialize();
        }

        /**
         * 当一个脚本实例被载入时Awake被调用，要先于Start。
         */
        public onAwake(): void {

        }

        /**
         * 物体启用时被调用
         */
        public onEnable() {

        }

        /**
         * 
         */
        public onReset(): void {

        }

        /**
         * Start仅在物体实例化完成后，Update函数第一次被调用前调用。
         */
        public onStart() {

        }

        /**
         * 这个函数会在每个固定的物理时间片被调用一次.这是放置游戏基本物理行为代码的地方。
         * （暂未实现）
         */
        public onFixedUpdate() {

        }

        /**
         * 当Behaviour启用时,其Update在每一帧被调用
         */
        public onUpdate(delta: number) {

        }

        /**
         * 
         */
        public onLateUpdate(delta: number) {

        }

        /**
         * 物体被禁用时调用
         */
        public onDisable() {

        }

        /**
         * 物体被删除时调用
         */
        public onDestroy() {

        }
    }
}