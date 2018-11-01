namespace paper {
    /**
     * 全局销毁信息收集组件。
     */
    export class DisposeCollecter extends SingletonComponent {
        /**
         * 暂存此帧销毁的全部场景。
         */
        public readonly scenes: Scene[] = [];
        /**
         * 暂存此帧销毁的全部实体。
         */
        public readonly gameObjects: GameObject[] = [];
        /**
         * 暂存此帧更改过父级的实体。
         */
        public readonly parentChangedGameObjects: GameObject[] = [];
        /**
         * 暂存此帧销毁的全部组件。
         */
        public readonly components: BaseComponent[] = [];
        /**
         * 暂存需要在此帧结束时释放的对象。
         */
        public readonly releases: BaseRelease<any>[] = [];

        public initialize() {
            super.initialize();

            disposeCollecter = this;
        }
        /**
         * @internal
         */
        public clear() {
            this.scenes.length = 0;
            this.gameObjects.length = 0;
            this.parentChangedGameObjects.length = 0;
            this.components.length = 0;
            this.releases.length = 0;
        }
    }
    /**
     * @internal
     */
    export let disposeCollecter: DisposeCollecter = null!;
}