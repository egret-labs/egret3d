namespace egret3d {


    /**
     * WebGL窗口信息 
     */
    export class Stage3D {



        screenViewport: Readonly<RectData> = { x: 0, y: 0, w: 0, h: 0 };


        absolutePosition: Readonly<RectData> = { x: 0, y: 0, w: 0, h: 0 }

        private _canvas: HTMLCanvasElement;

        /**
         * @internal
         */
        public init(canvas: HTMLCanvasElement, options: RequiredRuntimeOptions) {
            this._canvas = canvas;
            window.addEventListener("resize", () => this._resizeDirty = true, false);

            const screenViewport = this.screenViewport as RectData;
            screenViewport.w = options.contentWidth;
            screenViewport.h = options.contentHeight;
            canvas.width = screenViewport.w;
            canvas.height = screenViewport.h;



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
            const displayHeight = this.screenViewport.h / this.screenViewport.w * window.innerWidth;
            let canvas = this._canvas;
            const absolutePosition = this.absolutePosition as RectData;
            absolutePosition.w = displayWidth;
            absolutePosition.h = displayHeight;

            const { x, y, w, h } = absolutePosition;
            canvas.style.left = x + "px";
            canvas.style.top = y + "px";
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            canvas.style.position = "absolute";

        }
    }


    export const stage = new Stage3D();

}
