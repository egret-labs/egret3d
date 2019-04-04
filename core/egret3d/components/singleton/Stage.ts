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
            const allowRotated = paper.Application.isMobile;

            let screenW = screenSize.w;
            let screenH = screenSize.h;

            if (
                allowRotated &&
                (this._rotated = (size.w > size.h) ? screenH > screenW : screenW > screenH)
            ) {
                screenW = screenSize.h;
                screenH = screenSize.w;
            }
            else {
                this._rotated = false;
            }

            const scalerW = Math.min(size.w, screenW) / screenW;
            const scalerH = Math.min(size.h, screenH) / screenH;
            (this.scaler as float) = math.lerp(scalerW, scalerH, this._matchFactor);

            viewport.w = Math.ceil(screenW * this.scaler);
            viewport.h = Math.ceil(screenH * this.scaler);

            if (viewport.w > size.w) {
                viewport.w = size.w;
                (this.scaler as float) = viewport.w / screenW;
                viewport.h = Math.ceil(screenH * this.scaler);
            }
            else if (viewport.h > size.h) {
                viewport.h = size.h;
                (this.scaler as float) = viewport.h / screenH;
                viewport.w = Math.ceil(screenW * this.scaler);
            }
            else {
                (this.scaler as float) = math.lerp(viewport.w / screenW, viewport.h / screenH, this._matchFactor);
            }
        }

        public initialize(sizes: { size: Readonly<ISize>, screenSize: Readonly<ISize> }) {
            super.initialize();

            const { size, screenSize } = sizes;

            (stage as Stage) = this;
            this._size.w = size.w > 1.0 ? size.w : 1.0;
            this._size.h = size.h > 1.0 ? size.h : 1.0;
            this._screenSize.w = screenSize.w > 1.0 ? screenSize.w : 1.0;
            this._screenSize.h = screenSize.h > 1.0 ? screenSize.h : 1.0;
            this._updateViewport();
        }
        /**
         * 屏幕到舞台坐标的转换。
         * @param input 屏幕坐标。
         * @param output 舞台坐标。
         */
        public screenToStage(input: Readonly<IVector2>, output: Vector3 | null = null): Vector3 {
            if (output === null) {
                output = Vector3.create();
            }

            const screenSize = this._screenSize;
            const viewPort = this._viewport;
            const { x, y } = input;

            if (this._rotated) {
                output.y = (screenSize.w - (x - viewPort.x)) * viewPort.w / screenSize.h;
                output.x = (y - viewPort.y) * viewPort.h / screenSize.w;
            }
            else {
                output.x = (x - viewPort.x) * viewPort.w / screenSize.w;
                output.y = (y - viewPort.y) * viewPort.h / screenSize.h;
            }

            return output;
        }
        /**
         * 舞台到屏幕坐标的转换。  
         * @param input 舞台坐标。
         * @param output 屏幕坐标。
         */
        public stageToScreen(input: Readonly<IVector2>, output: Vector3 | null = null): Vector3 {
            if (output === null) {
                output = Vector3.create();
            }

            const screenSize = this._screenSize;
            const viewPort = this._viewport;
            const { x, y } = input;

            if (this._rotated) {
                output.x = screenSize.w + viewPort.x - y / viewPort.w * screenSize.h;
                output.y = x / viewPort.h * screenSize.w + viewPort.y;
            }
            else {
                output.x = x / viewPort.w * screenSize.w + viewPort.x;
                output.y = y / viewPort.h * screenSize.h + viewPort.y;
            }

            return output;
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
         * 舞台以宽或高为基准适配屏幕的系数。
         * - [`0.0` ~ `1.0`]。
         * - `0.0` 以宽适配屏幕。
         * - `1.0` 以高适配屏幕。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public get matchFactor(): float {
            return this._matchFactor;
        }
        public set matchFactor(value: float) {
            if (value < 0.0) {
                value = 0.0;
            }
            else if (value > 1.0) {
                value = 1.0;
            }

            if (this._matchFactor === value) {
                return;
            }

            this._matchFactor = value;
            this._updateViewport();
            this.onResize.dispatch();
        }
        /**
         * 程序运行使用的屏幕尺寸。
         */
        @paper.editor.property(paper.editor.EditType.SIZE)
        public get screenSize(): Readonly<ISize> {
            return this._screenSize;
        }
        public set screenSize(value: Readonly<ISize>) {
            this._screenSize.w = value.w > 1.0 ? value.w : 1.0;
            this._screenSize.h = value.h > 1.0 ? value.h : 1.0;
            this._updateViewport();
            this.onScreenResize.dispatch();
        }
        /**
         * 舞台初始尺寸。
         * - 该尺寸仅做为横屏竖屏的选择，以及最大分辨率的依据。
         */
        @paper.editor.property(paper.editor.EditType.SIZE)
        public get size(): Readonly<ISize> {
            return this._size;
        }
        public set size(value: Readonly<ISize>) {
            this._size.w = value.w > 1.0 ? value.w : 1.0;
            this._size.h = value.h > 1.0 ? value.h : 1.0;
            this._updateViewport();
            this.onResize.dispatch();
        }
        /**
         * 舞台的渲染视口。
         * - 舞台的偏移和实际尺寸。
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
