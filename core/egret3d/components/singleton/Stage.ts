namespace egret3d {
    /**
     * 全局舞台信息组件。
     * TODO 调整文件结构，标记接口源码链接。
     */
    export class Stage extends paper.SingletonComponent {
        /**
         * 当屏幕尺寸改变时派发事件。
         */
        public readonly onScreenResize: signals.Signal = new signals.Signal();
        /**
         * 当舞台尺寸改变时派发事件。
         */
        public readonly onResize: signals.Signal = new signals.Signal();
        /**
         * 渲染视口与舞台尺寸之间的缩放系数。
         * - scaler = viewport.w / size.w
         */
        public scaler: number = 1.0;

        private _isLandspace: boolean = false;
        private _rotated: boolean = false;
        private readonly _screenSize: egret3d.ISize = { w: 1024, h: 1024 };
        private readonly _size: egret3d.ISize = { w: 1024, h: 1024 };
        private readonly _viewport: egret3d.IRectangle = { x: 0, y: 0, w: 0, h: 0 };

        private _updateViewport() {
            const screenSize = this._screenSize;
            const size = this._size;
            const viewport = this._viewport;

            if (paper.Application.isMobile) {
                viewport.w = Math.ceil(size.w);

                if (this._rotated = this._isLandspace ? screenSize.h > screenSize.w : screenSize.w > screenSize.h) {
                    viewport.h = Math.ceil(viewport.w / screenSize.h * screenSize.w);

                    if (viewport.h !== viewport.h) {
                        viewport.h = screenSize.w;
                    }
                }
                else {
                    viewport.h = Math.ceil(viewport.w / screenSize.w * screenSize.h);

                    if (viewport.h !== viewport.h) {
                        viewport.h = screenSize.h;
                    }
                }

                this.scaler = 1.0;
            }
            else {
                this._rotated = false;
                viewport.w = Math.ceil(Math.min(size.w, screenSize.w));
                viewport.h = Math.ceil(viewport.w / screenSize.w * screenSize.h);

                if (viewport.h !== viewport.h) {
                    viewport.h = screenSize.h;
                }

                this.scaler = viewport.w / size.w;
            }

            size.h = viewport.h / this.scaler;
        }

        public initialize(config: { size: Readonly<ISize>, screenSize: Readonly<ISize> }) {
            super.initialize();

            stage = this;
            this._size.w = config.size.w || 2.0;
            this._size.h = config.size.h || 2.0;
            this._screenSize.w = config.screenSize.w || 2.0;
            this._screenSize.h = config.screenSize.h || 2.0;
            this._isLandspace = this._size.w > this._size.h;
            this._updateViewport();
        }
        /**
         * 屏幕到舞台坐标的转换。
         */
        public screenToStage(value: Readonly<egret3d.Vector3>, out: egret3d.Vector3) {
            const screenSize = this._screenSize;
            const viewPort = this._viewport;
            const { x, y } = value;

            if (this._rotated) {
                out.y = (screenSize.w - (x - viewPort.x)) * (viewPort.w / screenSize.h);
                out.x = (y - viewPort.y) * (viewPort.h / screenSize.w);
            }
            else {
                out.x = (x - viewPort.x) * (viewPort.w / screenSize.w);
                out.y = (y - viewPort.y) * (viewPort.h / screenSize.h);
            }

            return this;
        }
        /**
         * 舞台到屏幕坐标的转换。
         */
        public stageToScreen(value: Readonly<egret3d.Vector3>, out: egret3d.Vector3) {
            // TODO

            return this;
        }
        /**
         * 舞台是否因屏幕尺寸的改变而发生了旋转。
         * - 旋转不会影响渲染视口的宽高交替，引擎通过反向旋转外部画布来抵消屏幕的旋转，即无论是否旋转，渲染视口的宽度始终以舞台宽度为依据。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX, { readonly: true })
        public get rotated() {
            return this._rotated;
        }
        /**
         * 屏幕尺寸。
         */
        @paper.editor.property(paper.editor.EditType.SIZE)
        public get screenSize(): Readonly<egret3d.ISize> {
            return this._screenSize;
        }
        public set screenSize(value: Readonly<egret3d.ISize>) {
            this._screenSize.w = value.w || 2.0;
            this._screenSize.h = value.h || 2.0;
            this._updateViewport();

            this.onScreenResize.dispatch();
        }
        /**
         * 舞台尺寸。
         */
        @paper.editor.property(paper.editor.EditType.SIZE)
        public get size(): Readonly<egret3d.ISize> {
            return this._size;
        }
        public set size(value: Readonly<egret3d.ISize>) {
            this._size.w = value.w || 2.0;
            this._size.h = value.h || 2.0;
            this._isLandspace = this._size.w > this._size.h;
            this._updateViewport();

            this.onResize.dispatch();
        }
        /**
         * 渲染视口。
         */
        @paper.editor.property(paper.editor.EditType.RECT, { readonly: true })
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
     * 全局舞台信息组件实例。
     */
    export let stage: Stage = null!;
}
