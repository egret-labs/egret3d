namespace egret3d {
    /**
     * 
     */
    export type RunEgretOptions = {
        defaultScene?: string;

        contentWidth?: number;
        contentHeight?: number;
        /**
         * 是否允许屏幕旋转，默认允许。
         */
        rotateEnabled?: boolean;
        /**
         * 是否开启抗锯齿，默认关闭。
         */
        antialias: boolean;
        /**
         * 是否与画布背景色混合，默认不混合。
         */
        alpha: boolean;

        option?: RequiredRuntimeOptions;
        canvas?: HTMLCanvasElement;
        webgl?: WebGLRenderingContext;

        playerMode?: paper.PlayerMode;
    };

    export type RequiredRuntimeOptions = { antialias: boolean, contentWidth: number, contentHeight: number };

    /**
     * 引擎启动入口
     */
    export function runEgret(options: RunEgretOptions = { antialias: false, alpha: false }) {
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

        paper.Application.initialize(options);
        const systemManager = paper.Application.systemManager;
        systemManager.register(web.BeginSystem, paper.SystemOrder.Begin, options);

        systemManager.register(AnimationSystem, paper.SystemOrder.Animation);
        systemManager.register(MeshRendererSystem, paper.SystemOrder.Renderer);
        systemManager.register(SkinnedMeshRendererSystem, paper.SystemOrder.Renderer);
        systemManager.register(particle.ParticleSystem, paper.SystemOrder.Renderer);
        systemManager.register(Egret2DRendererSystem, paper.SystemOrder.Renderer, options);
        systemManager.register(CameraAndLightSystem, paper.SystemOrder.Draw);

        systemManager.register(web.WebGLRenderSystem, paper.SystemOrder.Draw, options);
        systemManager.register(web.InputSystem, paper.SystemOrder.End, options);
        systemManager.register(web.EndSystem, paper.SystemOrder.End, options);
        systemManager._preRegisterSystems();

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
