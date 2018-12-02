namespace egret3d {
    /**
     * 全局碰撞信息收集组件。
     */
    export class ContactCollecter extends paper.SingletonComponent {
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
        public _update() {
            if (this.begin.length > 0) {
                this.begin.length = 0;
            }

            if (this.end.length > 0) {
                this.end.length = 0;
            }
        }
    }
}
