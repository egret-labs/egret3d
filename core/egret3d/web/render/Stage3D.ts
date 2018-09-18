namespace egret3d {


    /**
     * WebGL窗口信息 
     */
    export class Stage3D {

        screenViewport: Readonly<IRectangle> = { x: 0, y: 0, w: 0, h: 0 };

        absolutePosition: Readonly<IRectangle> = { x: 0, y: 0, w: 0, h: 0 }

        private _canvas: HTMLCanvasElement;
        /**
         * 是否为横屏，需要旋转屏幕
         */
        private isLandscape: boolean;
        private contentWidth: number;
        private contentHeight: number;

        /**
         * @internal
         */
        public init(canvas: HTMLCanvasElement, options: RequiredRuntimeOptions) {
            this._canvas = canvas;
            window.addEventListener("resize", () => this._resizeDirty = true, false);
            this.isLandscape = options.contentWidth > options.contentHeight;
            this.contentWidth = options.contentWidth;
            this.contentHeight = options.contentHeight;
        }

        private _resizeDirty: boolean = true;

        update() {
            if (this._resizeDirty) {
                this._resize();
                this._resizeDirty = false;
            }
        }

        private _resize() {
            const displayWidth = window.innerWidth;
            const displayHeight = window.innerHeight;

            const absolutePosition = this.absolutePosition as IRectangle;
            absolutePosition.w = displayWidth;
            absolutePosition.h = displayHeight;

            // 计算视口区域
            const screenViewport = this.screenViewport as IRectangle;
            let shouldRotate = (this.isLandscape && window.innerHeight > window.innerWidth)
                || (!this.isLandscape && window.innerWidth > window.innerHeight);
            if (shouldRotate) {
                screenViewport.w = this.contentWidth;
                var screenH = Math.ceil(screenViewport.w / displayHeight * displayWidth);
                screenViewport.h = screenH;
            }
            else {
                screenViewport.w = this.contentWidth;
                var screenH = Math.ceil(screenViewport.w / displayWidth * displayHeight);
                screenViewport.h = screenH;
            }

            const canvas = this._canvas;
            canvas.width = screenViewport.w;
            canvas.height = screenViewport.h;

            // 设置canvas.style
            const { x, y, w, h } = absolutePosition;
            canvas.style.top = y + "px";
            canvas.style.position = "absolute";
            canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
            if (shouldRotate) {
                // canvas.style.width = h + "px";
                // canvas.style.height = w + "px";
                canvas.style.left = window.innerWidth + "px";
                const transform = `matrix(0,${h / canvas.width},${-w / canvas.height},0,0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
            }
            else {
                // canvas.style.width = w + "px";
                // canvas.style.height = h + "px";
                // canvas.style[egret.web.getPrefixStyleName("transform")] = null;
                canvas.style.left = x + "px";
                const transform = `matrix(${w / canvas.width},0,0,${h / canvas.height},0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
            }

            // 更新触摸信息
            let touchScaleX;
            let touchScaleY;
            if (shouldRotate) {
                touchScaleX = egret3d.stage.screenViewport.w / h;
                touchScaleY = egret3d.stage.screenViewport.h / w;
            }
            else {
                touchScaleX = egret3d.stage.screenViewport.w / w;
                touchScaleY = egret3d.stage.screenViewport.h / h;
            }
            egret3d.InputManager.touch.updateOffsetAndScale(x, y, touchScaleX, touchScaleY, shouldRotate);
            egret3d.InputManager.mouse.updateOffsetAndScale(x, y, touchScaleX, touchScaleY, shouldRotate);

            //
            const webInput = paper.Application.systemManager.getSystem(egret3d.Egret2DRendererSystem).webInput;
            if (webInput) {
                webInput.$updateSize();
            }
        }
    }

    export const stage = new Stage3D();
}
