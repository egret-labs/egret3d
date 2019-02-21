namespace egret3d.webgl {
    /**
     * @internal
     */
    export class BeginSystem extends paper.BaseSystem<paper.GameObject> {
        private _canvas: HTMLCanvasElement = null!;

        private _updateCanvas(stage: Stage) {
            const canvas = this._canvas;
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

        private _getMainCanvas(options: RunOptions) {
            if (window.canvas) {
                return window.canvas;
            }
            else if (options.canvas) {
                return options.canvas;
            }
            else {
                const div = <HTMLDivElement>document.getElementsByClassName("egret-player")[0];
                const canvas = document.createElement("canvas");
                div.appendChild(canvas);

                return canvas;
            }
        }

        public onAwake(config: RunOptions) {
            {
                // TODO
                egret.Sound = egret.web ? egret.web.HtmlSound : (egret as any)['wxgame']['HtmlSound']; //TODO:Sound
                (egret.Capabilities as any)["renderMode" + ""] = "webgl";

                const canvas = this._getMainCanvas(config);

                if (config.alpha === undefined) {
                    config.alpha = false;
                }

                if (config.antialias === undefined) {
                    config.antialias = true;
                }

                if (config.antialiasSamples === undefined) {
                    config.antialiasSamples = 4;
                }

                if (config.contentWidth === undefined) {
                    const defaultWidth = 1136;
                    if (window.canvas) {
                        config.contentWidth = defaultWidth;
                    }
                    else {
                        const div = <HTMLDivElement>document.getElementsByClassName("egret-player")[0]!;
                        config.contentWidth = parseInt(div.getAttribute("data-content-width")!) || defaultWidth;
                    }
                }

                if (config.contentHeight === undefined) {
                    const defaultHeight = 640;
                    if (window.canvas) {
                        config.contentHeight = defaultHeight;
                    }
                    else {
                        const div = <HTMLDivElement>document.getElementsByClassName("egret-player")[0]!;
                        config.contentHeight = parseInt(div.getAttribute("data-content-height")!) || defaultHeight;
                    }
                }

                config.canvas = canvas;
                config.webgl = <WebGLRenderingContext>canvas.getContext("webgl", config) || <WebGLRenderingContext>canvas.getContext("experimental-webgl", config);
            }

            const globalEntity = paper.Application.sceneManager.globalEntity;
            // Add stage, set stage, update canvas.
            this._canvas = config.canvas!;
            const isWX = egret.Capabilities.runtimeType === egret.RuntimeType.WXGAME || this._canvas.parentElement === undefined;
            const screenWidth = isWX ? window.innerWidth : this._canvas.parentElement!.clientWidth;
            const screenHeight = isWX ? window.innerHeight : this._canvas.parentElement!.clientHeight;

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
            const screenSize = stage.screenSize;
            // 
            const parentElement = this._canvas.parentElement;
            const isWX = egret.Capabilities.runtimeType === egret.RuntimeType.WXGAME || parentElement === undefined;
            const screenWidth = isWX ? window.innerWidth : parentElement!.clientWidth;
            const screenHeight = isWX ? window.innerHeight : parentElement!.clientHeight;

            if (screenSize.w !== screenWidth || screenSize.h !== screenHeight) {
                stage.screenSize = { w: screenWidth, h: screenHeight };
            }
        }
    }
}

declare interface Window {
    canvas: HTMLCanvasElement;
    gltf: any;
    paper: any;
    egret3d: any;
}

window.gltf = gltf;
window.paper = paper;
window.egret3d = egret3d;