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



            const boundingClientWidth = window.innerWidth;
            const boundingClientHeight = window.innerHeight;


            const stageSize = calculateStageSize("showAll", boundingClientWidth, boundingClientHeight, this.screenViewport.w, this.screenViewport.h)


            let canvas = this._canvas;
            const absolutePosition = this.absolutePosition as RectData;
            absolutePosition.w = stageSize.displayWidth;
            absolutePosition.h = stageSize.displayHeight;


            const isLandscape = stageSize.displayWidth > stageSize.displayHeight;
            let top = 0;
            if (isLandscape) {
                absolutePosition.y = top + (boundingClientHeight - stageSize.displayHeight) / 2;
                absolutePosition.x = (boundingClientWidth - stageSize.displayWidth) / 2;
            }
            else {
                absolutePosition.y = top + (boundingClientHeight - stageSize.displayHeight) / 2;
                absolutePosition.x = (boundingClientWidth - stageSize.displayWidth) / 2;


            }


            const { x, y, w, h } = absolutePosition;
            canvas.style.left = x + "px";
            canvas.style.top = y + "px";
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            canvas.style.position = "absolute";

        }



    }

    function calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number,
        contentWidth: number, contentHeight: number) {

        let displayWidth = screenWidth;
        let displayHeight = screenHeight;
        let stageWidth = contentWidth;
        let stageHeight = contentHeight;
        let scaleX = (screenWidth / stageWidth) || 0;
        let scaleY = (screenHeight / stageHeight) || 0;

        if (scaleX > scaleY) {
            displayWidth = Math.round(stageWidth * scaleY);
        }
        else {
            displayHeight = Math.round(stageHeight * scaleX);
        }


        // switch (scaleMode) {
        //     case StageScaleMode.EXACT_FIT:
        //         break;
        //     case StageScaleMode.FIXED_HEIGHT:
        //         stageWidth = Math.round(screenWidth / scaleY);
        //         break;
        //     case StageScaleMode.FIXED_WIDTH:
        //         stageHeight = Math.round(screenHeight / scaleX);
        //         break;
        //     case StageScaleMode.NO_BORDER:
        //         if (scaleX > scaleY) {
        //             displayHeight = Math.round(stageHeight * scaleX);
        //         }
        //         else {
        //             displayWidth = Math.round(stageWidth * scaleY);
        //         }
        //         break;
        //     case StageScaleMode.SHOW_ALL:
        //         if (scaleX > scaleY) {
        //             displayWidth = Math.round(stageWidth * scaleY);
        //         }
        //         else {
        //             displayHeight = Math.round(stageHeight * scaleX);
        //         }
        //         break;
        //     case StageScaleMode.FIXED_NARROW:
        //         if (scaleX > scaleY) {
        //             stageWidth = Math.round(screenWidth / scaleY);
        //         }
        //         else {
        //             stageHeight = Math.round(screenHeight / scaleX);
        //         }
        //         break;
        //     case StageScaleMode.FIXED_WIDE:
        //         if (scaleX > scaleY) {
        //             stageHeight = Math.round(screenHeight / scaleX);
        //         }
        //         else {
        //             stageWidth = Math.round(screenWidth / scaleY);
        //         }
        //         break;
        //     default:
        //         stageWidth = screenWidth;
        //         stageHeight = screenHeight;
        //         break;
        // }
        //宽高不是2的整数倍会导致图片绘制出现问题
        if (stageWidth % 2 != 0) {
            stageWidth += 1;
        }
        if (stageHeight % 2 != 0) {
            stageHeight += 1;
        }
        if (displayWidth % 2 != 0) {
            displayWidth += 1;
        }
        if (displayHeight % 2 != 0) {
            displayHeight += 1;
        }
        return {
            stageWidth,
            stageHeight,
            displayWidth,
            displayHeight
        };

    }


    export const stage = new Stage3D();

}
