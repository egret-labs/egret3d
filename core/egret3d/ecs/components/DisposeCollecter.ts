namespace paper {
    /**
     * 
     */
    export class DisposeCollecter extends SingletonComponent {
        /**
         * 移除的场景数组。
         */
        public readonly scenes: Scene[] = [];
        /**
         * 移除的实体数组。
         */
        public readonly gameObjects: GameObject[] = [];
        /**
         * 移除的组件数组。
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