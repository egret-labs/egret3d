namespace egret3d {

    export type RunEgretOptions = {
        antialias: boolean;
        defaultScene?: string;
        contentWidth?: number;
        contentHeight?: number;

        option?: RequiredRuntimeOptions;
        canvas?: HTMLCanvasElement;
        webgl?: WebGLRenderingContext;

        isEditor?: boolean;
        isPlaying?: boolean;
        systems?: any[];
    }

    export type RequiredRuntimeOptions = { antialias: boolean, contentWidth: number, contentHeight: number }

    /**
     * 引擎启动入口
     */
    export function runEgret(options: RunEgretOptions = { antialias: false }) {
        // TODO WebAssembly load
        egret.Sound = egret.web ? egret.web.HtmlSound : egret['wxgame']['HtmlSound'] //TODO:Sound
        egret.Capabilities["renderMode" + ""] = "webgl";
        const requiredOptions = getOptions(options);
        const canvas = getMainCanvas();
        //TODO
        options.canvas = canvas;
        options.option = requiredOptions;
        options.webgl = <WebGLRenderingContext>canvas.getContext('webgl', options) || <WebGLRenderingContext>canvas.getContext("experimental-webgl", options);
        WebGLCapabilities.webgl = options.webgl;
        InputManager.init(canvas);
        // DefaultTechnique.init();
        stage.init(canvas, requiredOptions);

        if (!options.systems) {
            options.systems = [
                BeginSystem,
                paper.EnableSystem,
                paper.StartSystem,
                //
                // oimo.PhysicsSystem,
                //
                paper.UpdateSystem,
                //
                AnimationSystem,
                //
                paper.LateUpdateSystem,
                //
                MeshRendererSystem,
                SkinnedMeshRendererSystem,
                particle.ParticleSystem,
                Egret2DRendererSystem,
                //
                CameraSystem,
                WebGLRenderSystem,
                //
                paper.DisableSystem,
                EndSystem,
            ];
        }

        paper.Application.init(options);
    }

    function getMainCanvas() {
        if (window.canvas) {
            return window.canvas;
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
            } as RequiredRuntimeOptions;;
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
