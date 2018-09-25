namespace paper {
    /**
     * 全局碰撞信息收集组件。
     */
    export class ContactColliders extends SingletonComponent {
        /**
         * 当前帧开始碰撞的。
         */
        public readonly begin: any[] = [];
        /**
         * 当前帧维持碰撞的。
         */
        public readonly stay: any[] = [];
        /**
         * 当前帧结束碰撞的。
         */
        public readonly end: any[] = [];
        /**
         * @internal
         */
        public clear() {
            this.begin.length = 0;
            this.end.length = 0;
        }
    }
}
