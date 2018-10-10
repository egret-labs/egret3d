namespace egret3d {
    /**
     * 全局舞台信息组件。
     */
    export class Stage extends paper.SingletonComponent {
        /**
         * 当舞台或屏幕尺寸的改变时派发事件。
         */
        public static onResize: signals.Signal = new signals.Signal();
        /**
         * 是否允许因屏幕尺寸的改变而旋转舞台。
         */
        public rotateEnabled: boolean = true;
        /**
         * 舞台是否因屏幕尺寸的改变而发生了旋转。
         * - 旋转不会影响渲染视口的宽高交替，引擎通过反向旋转外部画布来抵消屏幕的旋转，即无论是否旋转，渲染视口的宽度始终等于渲染尺寸宽度。
         */
        public rotated: boolean = false;

        private readonly _screenSize: egret3d.ISize = { w: 1024, h: 1024 };
        private readonly _size: egret3d.ISize = { w: 1024, h: 1024 };
        private readonly _viewport: egret3d.IRectangle = { x: 0, y: 0, w: 0, h: 0 };

        private _updateViewport() {
            const screenSize = this._screenSize;
            const size = this._size;
            const viewport = this._viewport;
            viewport.w = Math.ceil(size.w);

            if (this.rotateEnabled && (this.rotated = size.w > size.h ? screenSize.h > screenSize.w : screenSize.w > screenSize.h)) {
                viewport.h = Math.ceil(size.w / screenSize.h * screenSize.w);
            }
            else {
                viewport.h = Math.ceil(size.w / screenSize.w * screenSize.h);
            }
        }

        public initialize(config: { size: Readonly<ISize>, screenSize: Readonly<ISize> }) {
            super.initialize();

            stage = this;

            this._size.w = config.size.w;
            this._size.h = config.size.h;
            this._screenSize.w = config.screenSize.w;
            this._screenSize.h = config.screenSize.h;
            this._updateViewport();
        }
        /**
         * 屏幕尺寸。
         */
        public get screenSize(): Readonly<egret3d.ISize> {
            return this._screenSize;
        }
        public set screenSize(value: Readonly<egret3d.ISize>) {
            this._screenSize.w = value.w;
            this._screenSize.h = value.h;
            this._updateViewport();

            Stage.onResize.dispatch(this);
        }
        /**
         * 渲染尺寸。
         */
        public get size(): Readonly<egret3d.ISize> {
            return this._size;
        }
        public set size(value: Readonly<egret3d.ISize>) {
            this._size.w = value.w;
            this._size.h = value.h;
            this._updateViewport();

            Stage.onResize.dispatch(this);
        }
        /**
         * 渲染视口。
         */
        public get viewport(): Readonly<egret3d.IRectangle> {
            return this._viewport;
        }

        /**
         * @deprecated
         */
        public get screenViewport() {
            return this._viewport;
        }
    }
    /**
     * @deprecated
     */
    export let stage: Stage = null!;
}
