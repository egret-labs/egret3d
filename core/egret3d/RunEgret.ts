namespace egret3d {
    /**
     * 引擎启动入口。
     * @param options 
     */
    export function runEgret(options?: RunOptions) {
        if (!options) {
            options = {};
        }

        {
            // TODO
            egret.Sound = egret.web ? egret.web.HtmlSound : (egret as any)['wxgame']['HtmlSound']; //TODO:Sound
            (egret.Capabilities as any)["renderMode" + ""] = "webgl";

            const canvas = _getMainCanvas(options);

            if (options.alpha === undefined) {
                options.alpha = false;
            }

            if (options.antialias === undefined) {
                options.antialias = true;
            }

            if (options.antialiasSamples === undefined) {
                options.antialiasSamples = 4;
            }

            if (options.contentWidth === undefined) {
                const defaultWidth = 1136;

                if (window.canvas) {
                    options.contentWidth = defaultWidth;
                }
                else {
                    const div = <HTMLDivElement>document.getElementsByClassName("egret-player")[0]!;
                    options.contentWidth = parseInt(div.getAttribute("data-content-width")!) || defaultWidth;
                }
            }

            if (options.contentHeight === undefined) {
                const defaultHeight = 640;

                if (window.canvas) {
                    options.contentHeight = defaultHeight;
                }
                else {
                    const div = <HTMLDivElement>document.getElementsByClassName("egret-player")[0]!;
                    options.contentHeight = parseInt(div.getAttribute("data-content-height")!) || defaultHeight;
                }
            }

            options.canvas = canvas;
            options.webgl = <WebGLRenderingContext>canvas.getContext("webgl", options) || <WebGLRenderingContext>canvas.getContext("experimental-webgl", options);
        }

        const { version, systemManager, gameObjectContext } = paper.Application;

        console.info("Egret", version, "start.");

        systemManager
            .preRegister(webgl.BeginSystem, gameObjectContext, paper.SystemOrder.Begin, options)
            .preRegister(webgl.WebGLRenderSystem, gameObjectContext, paper.SystemOrder.Renderer, options)
            .preRegister(webgl.InputSystem, gameObjectContext, paper.SystemOrder.End, options)

            .preRegister(CollisionSystem, gameObjectContext, paper.SystemOrder.FixedUpdate)
            .preRegister(AnimationSystem, gameObjectContext, paper.SystemOrder.Animation)
            .preRegister(MeshRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
            .preRegister(SkinnedMeshRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
            .preRegister(particle.ParticleSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
            .preRegister(Egret2DRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer, options)
            .preRegister(CameraAndLightSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer);

        paper.Application.initialize(options);
        paper.Application.start();

        console.info("Egret start complete.");
    }

    function _getMainCanvas(options: RunOptions) {
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
}

declare interface Window {
    gltf: any;
    paper: any;
    egret3d: any;
    // WX
    canvas: HTMLCanvasElement;
}

window.gltf = gltf;
window.paper = paper;
window.egret3d = egret3d;
