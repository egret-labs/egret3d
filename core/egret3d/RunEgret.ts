namespace egret3d {

    export type RunEgretOptions = {
        antialias: boolean;
        defaultScene?: string;
        contentWidth?: number;
        contentHeight?: number;

        option?: RequiredRuntimeOptions;
        canvas?: HTMLCanvasElement;
        webgl?: WebGLRenderingContext;

        playerMode?: paper.PlayerMode;
        isPlaying?: boolean;
    };

    export type RequiredRuntimeOptions = { antialias: boolean, contentWidth: number, contentHeight: number }

    /**
     * 引擎启动入口
     */
    export function runEgret(options: RunEgretOptions = { antialias: false }) {
        console.info("Egret version:", paper.Application.version);
        console.info("Egret start.");

        egret.Sound = egret.web ? egret.web.HtmlSound : egret['wxgame']['HtmlSound']; //TODO:Sound
        egret.Capabilities["renderMode" + ""] = "webgl";

        const requiredOptions = getOptions(options);
        const canvas = getMainCanvas(options);
        //TODO
        options.canvas = canvas;
        options.option = requiredOptions;
        options.webgl = <WebGLRenderingContext>canvas.getContext('webgl', options) || <WebGLRenderingContext>canvas.getContext("experimental-webgl", options);
        WebGLCapabilities.canvas = options.canvas;
        WebGLCapabilities.webgl = options.webgl;

        InputManager.init(canvas);
        stage.init(canvas, requiredOptions);

        const systemManager = paper.Application.systemManager;
        systemManager.preRegister(BeginSystem, paper.SystemOrder.Begin);
        systemManager.preRegister(AnimationSystem, paper.SystemOrder.Animation);
        systemManager.preRegister(MeshRendererSystem, paper.SystemOrder.Renderer);
        systemManager.preRegister(SkinnedMeshRendererSystem, paper.SystemOrder.Renderer);
        systemManager.preRegister(particle.ParticleSystem, paper.SystemOrder.Renderer);
        systemManager.preRegister(Egret2DRendererSystem, paper.SystemOrder.Renderer);
        systemManager.preRegister(CameraAndLightSystem, paper.SystemOrder.Draw - 1);
        systemManager.preRegister(WebGLRenderSystem, paper.SystemOrder.Draw);
        systemManager.preRegister(EndSystem, paper.SystemOrder.End);
        paper.Application.init(options);

        console.info("Egret start complete.");
    }

    function getMainCanvas(options: RunEgretOptions) {
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

    function getOptions(options: RunEgretOptions): RequiredRuntimeOptions {
        if (window.canvas) {
            return {
                antialias: options.antialias,
                antialiasSamples: 4,
                contentWidth: options.contentWidth || 640,
                contentHeight: options.contentHeight || 1136
            } as RequiredRuntimeOptions;
        }
        else {
            const div = <HTMLDivElement>document.getElementsByClassName("egret-player")[0];
            return {
                antialias: options.antialias,
                antialiasSamples: 4,
                contentWidth: parseInt(div.getAttribute("data-content-width")),
                contentHeight: parseInt(div.getAttribute("data-content-height"))
            } as RequiredRuntimeOptions;
        }
    }
}



interface Window {

    canvas: HTMLCanvasElement;

    paper: any;

    egret3d: any;
}

window.paper = paper;
window.egret3d = egret3d;
