namespace egret3d.web {
    /**
     * @internal
     */
    export class BeginSystem extends paper.BaseSystem {
        private _canvas: HTMLCanvasElement = null!;

        private _updateCanvas(stage: Stage) {
            const canvas = this._canvas;
            const screenSize = stage.screenSize;
            const viewport = stage.viewport;

            // Update canvas size and rotate.
            const parentElement = canvas.parentElement;
            canvas.width = viewport.w;
            canvas.height = viewport.h;
            canvas.style.top = (parentElement ? parentElement.offsetTop : 0) + "px";
            canvas.style.position = "absolute";
            canvas.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";

            if (stage.rotated) {
                // canvas.style.width = h + "px";
                // canvas.style.height = w + "px";
                canvas.style.left = (parentElement ? parentElement.offsetLeft : 0) + screenSize.w + "px";
                const transform = `matrix(0,${screenSize.h / canvas.width},${-screenSize.w / canvas.height},0,0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
            }
            else {
                // canvas.style.width = w + "px";
                // canvas.style.height = h + "px";
                // canvas.style[egret.web.getPrefixStyleName("transform")] = null;
                canvas.style.left = (parentElement ? parentElement.offsetLeft : 0) + "px";
                const transform = `matrix(${screenSize.w / canvas.width},0,0,${screenSize.h / canvas.height},0,0)`;
                canvas.style[egret.web.getPrefixStyleName("transform")] = transform;
            }
        }

        public onAwake(config: RunEgretOptions) {
            const globalGameObject = paper.GameObject.globalGameObject;
            // Add stage, set stage, update canvas.
            this._canvas = config.canvas!;
            const isWX = egret.Capabilities.runtimeType === egret.RuntimeType.WXGAME || this._canvas.parentElement === undefined;
            const screenWidth = isWX ? window.innerWidth : this._canvas.parentElement!.clientWidth;
            const screenHeight = isWX ? window.innerHeight : this._canvas.parentElement!.clientHeight;

            globalGameObject.addComponent(Stage, {
                size: { w: config.option!.contentWidth, h: config.option!.contentHeight },
                screenSize: { w: screenWidth, h: screenHeight },
            });

            globalGameObject.getOrAddComponent(WebGLCapabilities, false, config); // TODO 下放到渲染系统初始化，但贴图对 webgl 有依赖。

            globalGameObject.getOrAddComponent(DefaultMeshes);
            globalGameObject.getOrAddComponent(DefaultShaders);
            globalGameObject.getOrAddComponent(DefaultTextures);
            globalGameObject.getOrAddComponent(DefaultMaterials);

            globalGameObject.getOrAddComponent(InputCollecter);

            // Update canvas when screen resized.
            this._updateCanvas(stage); // First update.
            stage.onScreenResize.add(() => {
                this._updateCanvas(stage);
            }, this);
            stage.onResize.add(() => {
                this._updateCanvas(stage);
            }, this);
        }

        public onUpdate() {
            // TODO 查询是否有性能问题。
            const isWX = egret.Capabilities.runtimeType === egret.RuntimeType.WXGAME || this._canvas.parentElement === undefined;
            const screenWidth = isWX ? window.innerWidth : this._canvas.parentElement!.clientWidth;
            const screenHeight = isWX ? window.innerHeight : this._canvas.parentElement!.clientHeight;
            const screenSize = stage.screenSize;

            if (screenWidth !== screenSize.w || screenHeight !== screenSize.h) {
                stage.screenSize = { w: screenWidth, h: screenHeight };
            }
        }
    }
}