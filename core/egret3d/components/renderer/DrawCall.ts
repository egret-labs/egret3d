namespace egret3d {
    /**
     * 绘制信息。
     */
    export class DrawCall extends paper.BaseRelease<DrawCall> {
        private static _instances = [] as DrawCall[];
        /**
         * 创建一个绘制信息。
         * - 只有在扩展渲染系统时才需要手动创建绘制信息。
         */
        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new DrawCall();
        }
        /**
         * 绘制次数。
         * - 用于调试模式下检测重复绘制的情况。
         */
        public drawCount: int = -1;
        /**
         * 此次绘制的渲染组件。
         */
        public renderer: paper.BaseRenderer | null = null;
        /**
         * 此次绘制的世界矩阵。
         */
        public matrix: Matrix4 = null!;
        /**
         * 此次绘制的子网格索引。
         */
        public subMeshIndex: number = -1;
        /**
         * 此次绘制的网格资源。
         */
        public mesh: Mesh = null!;
        /**
         * 此次绘制的材质资源。
         */
        public material: Material = null!;
        /**
         * 
         */
        public zdist: number = -1;
        /**
         * TODO
         */
        public count?: number = 0;

        private constructor() {
            super();
        }

        public onClear() {
            this.drawCount = -1;
            this.renderer = null;
            this.matrix = null!;
            this.subMeshIndex = -1;
            this.mesh = null!;
            this.material = null!;
            this.zdist = -1;
        }
    }
}