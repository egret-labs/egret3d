namespace paper {
    /**
     * 全局销毁信息收集组件。
     */
    @singleton
    export class DisposeCollecter extends Component {
        /**
         * 缓存此帧销毁的全部场景。
         */
        public readonly scenes: Scene[] = [];
        /**
         * 缓存此帧销毁的全部实体。
         */
        public readonly entities: IEntity[] = [];
        /**
         * 缓存此帧销毁的全部组件。
         */
        public readonly components: IComponent[] = [];
        /**
         * 缓存此帧结束时释放的对象。
         */
        public readonly releases: BaseRelease<any>[] = [];
        /**
         * 缓存此帧结束时释放的资源。
         */
        public readonly assets: Asset[] = [];

        public initialize() {
            super.initialize();

            (disposeCollecter as DisposeCollecter) = this;
        }
        /**
         * @internal
         */
        public clear() {
            if (this.scenes.length > 0) {
                this.scenes.length = 0;
            }
            
            if (this.entities.length > 0) {
                this.entities.length = 0;
            }

            if (this.components.length > 0) {
                this.components.length = 0;
            }

            if (this.releases.length > 0) {
                this.releases.length = 0;
            }

            if (this.assets.length > 0) {
                this.assets.length = 0;
            }
        }
    }
    /**
     * 全局销毁信息收集组件实例。
     */
    export const disposeCollecter: DisposeCollecter = null!;
}