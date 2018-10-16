namespace egret3d.web {
    /**
     * @internal
     */
    export class BeginSystem extends paper.BaseSystem {
        private _updateCanvas(canvas: HTMLCanvasElement, stage: Stage) {
            const screenSize = stage.screenSize;
            const viewport = stage.viewport;

            // Update canvas size and rotate.
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
        }

        public onAwake(config: RunEgretOptions) {
            const globalGameObject = paper.GameObject.globalGameObject;
            // Add stage, set stage, update canvas.
            const canvas = config.canvas!;
            const isWX = egret.Capabilities.runtimeType === egret.RuntimeType.WXGAME || canvas.parentElement === undefined;
            const stage = globalGameObject.addComponent(Stage, {
                rotateEnabled: !(config.rotateEnabled === false),
                size: { w: config.option!.contentWidth, h: config.option!.contentHeight },
                screenSize: isWX ? { w: window.innerWidth, h: window.innerHeight } : { w: canvas.parentElement!.clientWidth, h: canvas.parentElement!.clientHeight },
            });

            globalGameObject.getOrAddComponent(DefaultTextures);
            globalGameObject.getOrAddComponent(DefaultMeshes);
            globalGameObject.getOrAddComponent(DefaultShaders);
            globalGameObject.getOrAddComponent(DefaultMaterials);

            globalGameObject.getOrAddComponent(InputCollecter);
            globalGameObject.getOrAddComponent(ContactCollecter);
            globalGameObject.getOrAddComponent(WebGLCapabilities);

            this._updateCanvas(canvas, stage);
            // Update canvas when stage resized.
            Stage.onResize.add(() => {
                this._updateCanvas(canvas, stage);
            }, this);
            // Update stage when window resized.
            window.addEventListener("resize", () => {
                stage.screenSize = isWX ? { w: window.innerWidth, h: window.innerHeight } : { w: canvas.parentElement!.clientWidth, h: canvas.parentElement!.clientHeight };
            }, false);
        }

        public onUpdate() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
        }
    }
}