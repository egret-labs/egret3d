namespace egret3d {
    /**
     * 全局舞台信息组件。
     */
    @paper.singleton
    export class Stage extends paper.BaseComponent {
        /**
         * 当屏幕尺寸改变时派发事件。
         */
        public readonly onScreenResize: signals.Signal = new signals.Signal();
        /**
         * 当舞台尺寸改变时派发事件。
         */
        public readonly onResize: signals.Signal = new signals.Signal();
        /**
         * 舞台到屏幕的缩放系数。
         */
        public readonly scaler: float = 1.0;

        private _rotated: boolean = false;
        private _matchFactor: float = 1.0;
        private readonly _screenSize: ISize = { w: 1024, h: 1024 };
        private readonly _size: ISize = { w: 1024, h: 1024 };
        private readonly _viewport: Rectangle = Rectangle.create(0.0, 0.0, 1.0, 1.0);

        private _updateViewport() {
            const screenSize = this._screenSize;
            const size = this._size;
            const viewport = this._viewport;

            if (paper.Application.isMobile) {
                let screenW = screenSize.w;
                let screenH = screenSize.h;

                if (this._rotated = (size.w > size.h) ? screenSize.h > screenSize.w : screenSize.w > screenSize.h) {
                    screenW = screenSize.h;
                    screenH = screenSize.w;
                }

                const scalerW = (screenSize.w > size.w ? screenSize.w : Math.min(size.w, screenSize.w)) / screenSize.w;
                // const scalerW = size.w / screenW;
                const scalerH = size.h / screenH;
                (this.scaler as float) = math.lerp(scalerW, scalerH, this._matchFactor);

                viewport.w = Math.ceil(screenW * this.scaler);
                viewport.h = Math.ceil(screenH * this.scaler);
                (this.scaler as float) = screenW / screenSize.w;
            }
            else {
                const scalerW = (screenSize.w > size.w ? screenSize.w : Math.min(size.w, screenSize.w)) / screenSize.w;
                const scalerH = size.h / screenSize.h;
                (this.scaler as float) = math.lerp(scalerW, scalerH, this._matchFactor);

                this._rotated = false;
                viewport.w = Math.ceil(screenSize.w * this.scaler);
                viewport.h = Math.ceil(screenSize.h * this.scaler);
                (this.scaler as float) = viewport.w / screenSize.w;
            }
        }

        public initialize(config: { size: Readonly<ISize>, screenSize: Readonly<ISize> }) {
            super.initialize();

            (stage as Stage) = this;
            this._size.w = config.size.w || 1.0;
            this._size.h = config.size.h || 1.0;
            this._screenSize.w = config.screenSize.w || 1.0;
            this._screenSize.h = config.screenSize.h || 1.0;
            this._updateViewport();
        }
        /**
         * 屏幕到舞台坐标的转换。
         */
        public screenToStage(value: Readonly<Vector3>, out: Vector3): this {
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
            // TODO
         */
        public stageToScreen(value: Readonly<Vector3>, out: Vector3): this {
            return this;
        }
        /**
         * 舞台是否因屏幕尺寸的改变而发生了旋转。
         * - 旋转不会影响渲染视口的宽高交替，引擎通过反向旋转外部画布来抵消屏幕的旋转。
         */
        @paper.editor.property(paper.editor.EditType.CHECKBOX, { readonly: true })
        public get rotated(): boolean {
            return this._rotated;
        }
        /**
         * 以宽或高适配的系数。
         * - `0.0` ~ `1.0`。
         * - `0.0` 以宽适配。
         * - `1.0` 以高适配。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public get matchFactor(): float {
            return this._matchFactor;
        }
        public set matchFactor(value: float) {
            if (this._matchFactor === value) {
                return;
            }

            this._matchFactor = value;
            this._updateViewport();
            this.onResize.dispatch();
        }
        /**
         * 屏幕尺寸。
         */
        @paper.editor.property(paper.editor.EditType.SIZE)
        public get screenSize(): Readonly<ISize> {
            return this._screenSize;
        }
        public set screenSize(value: Readonly<ISize>) {
            this._screenSize.w = value.w || 1.0;
            this._screenSize.h = value.h || 1.0;
            this._updateViewport();
            this.onScreenResize.dispatch();
        }
        /**
         * 舞台初始尺寸。
         */
        @paper.editor.property(paper.editor.EditType.SIZE)
        public get size(): Readonly<ISize> {
            return this._size;
        }
        public set size(value: Readonly<ISize>) {
            this._size.w = value.w || 1.0;
            this._size.h = value.h || 1.0;
            this._updateViewport();
            this.onResize.dispatch();
        }
        /**
         * 渲染视口。
         */
        @paper.editor.property(paper.editor.EditType.RECT, { readonly: true })
        public get viewport(): Readonly<Rectangle> {
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
    export const stage: Stage = null!;
}
