namespace egret3d.webgl {
    /**
     * @internal
     */
    export class BeginSystem extends paper.BaseSystem<paper.GameObject> {
        private _canvasSizeDirty: boolean = true;
        private _canvas: HTMLCanvasElement | null = null;

        private _updateCanvas() {
            const canvas = this._canvas!;
            const screenSize = stage.screenSize;
            const viewport = stage.viewport;

            // Update canvas size and rotate.
            const parentElement = canvas.parentElement;
            canvas.width = viewport.w;
            canvas.height = viewport.h;
            // canvas.width = viewport.w * window.devicePixelRatio;
            // canvas.height = viewport.h * window.devicePixelRatio;
            canvas.style.top = (parentElement ? parentElement.offsetTop : 0) + "px";
            canvas.style.position = "absolute";
            canvas.style[egret.web.getPrefixStyleName("transformOrigin") as any] = "0% 0% 0px";
            // canvas.scale(window.devicePixelRatio, window.devicePixelRatio);

            if (stage.rotated) {
                // canvas.style.width = h + "px";
                // canvas.style.height = w + "px";
                canvas.style.left = (parentElement ? parentElement.offsetLeft : 0) + screenSize.w + "px";
                const transform = `matrix(0,${screenSize.h / canvas.width},${-screenSize.w / canvas.height},0,0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform") as any] = transform;
            }
            else {
                // canvas.style.width = w + "px";
                // canvas.style.height = h + "px";
                // canvas.style[egret.web.getPrefixStyleName("transform")] = null;
                canvas.style.left = (parentElement ? parentElement.offsetLeft : 0) + "px";
                const transform = `matrix(${screenSize.w / canvas.width},0,0,${screenSize.h / canvas.height},0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform") as any] = transform;
            }
        }

        public onAwake(config: RunOptions) {
            const globalEntity = paper.Application.sceneManager.globalEntity;
            const parentElement = config.canvas!.parentElement;
            const screenWidth = parentElement ? parentElement.clientWidth : window.innerWidth;
            const screenHeight = parentElement ? parentElement.clientHeight : window.innerHeight;
            this._canvas = config.canvas!;

            globalEntity.addComponent(RenderState, config);
            globalEntity.addComponent(Stage, {
                size: { w: config.contentWidth!, h: config.contentHeight! },
                screenSize: { w: screenWidth, h: screenHeight },
            });
            globalEntity.addComponent(DefaultMeshes);
            globalEntity.addComponent(DefaultShaders);
            globalEntity.addComponent(DefaultTextures);
            globalEntity.addComponent(DefaultMaterials);
            globalEntity.addComponent(DrawCallCollecter);
            globalEntity.addComponent(CameraAndLightCollecter);
            globalEntity.addComponent(ContactCollecter);
            globalEntity.addComponent(InputCollecter);

            // Update canvas when screen resized.
            stage.onScreenResize.add(() => {
                this._canvasSizeDirty = true;
            }, this);
            stage.onResize.add(() => {
                this._canvasSizeDirty = true;
            }, this);
        }

        public onFrame() {
            const screenSize = stage.screenSize;
            const parentElement = this._canvas!.parentElement;
            const screenWidth = parentElement ? parentElement.clientWidth : window.innerWidth;
            const screenHeight = parentElement ? parentElement.clientHeight : window.innerHeight;

            if (screenSize.w !== screenWidth || screenSize.h !== screenHeight) {
                stage.screenSize = { w: screenWidth, h: screenHeight };
            }

            if (this._canvasSizeDirty) {
                this._updateCanvas();
                this._canvasSizeDirty = false;
            }
        }
    }
}
