namespace paper {
    /**
     * 全局销毁信息收集组件。
     */
    export class DisposeCollecter extends SingletonComponent {
        /**
         * 当前帧销毁的全部场景。
         */
        public readonly scenes: Scene[] = [];
        /**
         * 当前帧销毁的全部实体。
         */
        public readonly gameObjects: GameObject[] = [];
        /**
         * 当前帧销毁的全部组件。
         */
        public readonly components: BaseComponent[] = [];
        /**
         * @internal
         */
        public clear() {
            this.scenes.length = 0;
            this.gameObjects.length = 0;
            this.components.length = 0;
        }
    }
}