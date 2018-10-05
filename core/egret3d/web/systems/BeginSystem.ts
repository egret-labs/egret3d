namespace egret3d.web {
    /**
     * @internal
     */
    export class BeginSystem extends paper.BaseSystem {
        private _updateCanvas(canvas: HTMLCanvasElement, stage: Stage) {
            const screenSize = stage.screenSize;
            const viewport = stage.viewport;
            canvas.width = viewport.w;
            canvas.height = viewport.h;
            canvas.style.top = 0 + "px";
            canvas.style.position = "absolute";
            canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";

            if (stage.rotated) {
                // canvas.style.width = h + "px";
                // canvas.style.height = w + "px";
                canvas.style.left = screenSize.w + "px";
                const transform = `matrix(0,${screenSize.h / canvas.width},${-screenSize.w / canvas.height},0,0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
            }
            else {
                // canvas.style.width = w + "px";
                // canvas.style.height = h + "px";
                // canvas.style[egret.web.getPrefixStyleName("transform")] = null;
                canvas.style.left = 0 + "px";
                const transform = `matrix(${screenSize.w / canvas.width},0,0,${screenSize.h / canvas.height},0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
            }

            
            let touchScaleX;
            let touchScaleY;
            if (stage.rotated) {
                touchScaleX = viewport.w / screenSize.h;
                touchScaleY = viewport.h / screenSize.w;
            }
            else {
                touchScaleX = viewport.w / screenSize.w;
                touchScaleY = viewport.h / screenSize.h;
            }
            egret3d.InputManager.touch.updateOffsetAndScale(0, 0, touchScaleX, touchScaleY, stage.rotated);
            egret3d.InputManager.mouse.updateOffsetAndScale(0, 0, touchScaleX, touchScaleY, stage.rotated);

            // TODO
            // const webInput = paper.Application.systemManager.getSystem(egret3d.Egret2DRendererSystem).webInput;
            // if (webInput) {
            //     webInput.$updateSize();
            // }
        }

        public onAwake(config: RunEgretOptions) {
            const globalGameObject = paper.GameObject.globalGameObject;

            const stage = globalGameObject.getOrAddComponent(Stage);
            { // Update screen size.
                const canvas = config.canvas!;
                stage.screenSize = { w: canvas.parentElement!.clientWidth, h: canvas.parentElement!.clientHeight };
                stage.size = { w: config.option!.contentWidth, h: config.option!.contentHeight };
                this._updateCanvas(canvas, stage);

                window.addEventListener("resize", () => {
                    stage.screenSize = { w: canvas.parentElement!.clientWidth, h: canvas.parentElement!.clientHeight };
                    this._updateCanvas(canvas, stage);
                }, false);
            }

            paper.Time = globalGameObject.getOrAddComponent(paper.Clock);
            globalGameObject.getOrAddComponent(paper.DisposeCollecter);

            globalGameObject.getOrAddComponent(DefaultTextures);
            globalGameObject.getOrAddComponent(DefaultMeshes);
            globalGameObject.getOrAddComponent(DefaultShaders);
            globalGameObject.getOrAddComponent(DefaultMaterials);

            globalGameObject.getOrAddComponent(InputCollecter);
            globalGameObject.getOrAddComponent(ContactCollecter);
            globalGameObject.getOrAddComponent(WebGLCapabilities);
        }

        public onUpdate() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
        }
    }
}