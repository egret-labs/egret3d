namespace paper {
    /**
     * TODO
     * @internal
     */
    export const _parentChangedGameObjects: GameObject[] = [];
    /**
     * 全局销毁信息收集组件。
     */
    export class DisposeCollecter extends SingletonComponent {
        /**
         * 缓存此帧销毁的全部场景。
         */
        public readonly scenes: Scene[] = [];
        /**
         * 缓存此帧销毁的全部实体。
         */
        public readonly gameObjects: GameObject[] = [];
        /**
         * 缓存此帧更改过父级的实体。
         */
        public readonly parentChangedGameObjects: GameObject[] = _parentChangedGameObjects;
        /**
         * 缓存此帧销毁的全部组件。
         */
        public readonly components: BaseComponent[] = [];
        /**
         * 缓存此帧结束时释放的对象。
         */
        public readonly releases: BaseRelease<any>[] = [];

        public initialize() {
            super.initialize();

            (disposeCollecter as DisposeCollecter) = this;
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
    export const disposeCollecter: DisposeCollecter = null!;
}