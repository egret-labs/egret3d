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

            const isWeb = !window.canvas;
            const playerDiv = isWeb ? <HTMLDivElement>document.getElementsByClassName("egret-player")[0]! : null;
            const canvas = _getMainCanvas(options, playerDiv);

            if (options.playerMode === undefined) {
                options.playerMode = _parseInt(playerDiv, "data-player-model", paper.PlayerMode.Player);
            }

            if (options.tickRate === undefined) {
                options.tickRate = _parseInt(playerDiv, "data-tick-rate", 0);
            }

            if (options.frameRate === undefined) {
                options.frameRate = _parseInt(playerDiv, "data-frame-rate", 0);
            }

            if (options.contentWidth === undefined) {
                options.contentWidth = _parseInt(playerDiv, "data-content-width", 1136);
            }

            if (options.contentHeight === undefined) {
                options.contentHeight = _parseInt(playerDiv, "data-content-height", 640);
            }

            if (options.alpha === undefined) {
                options.alpha = _parseBoolean(playerDiv, "data-alpha", false);
            }

            if (options.antialias === undefined) {
                options.alpha = _parseBoolean(playerDiv, "data-antialias", true);
            }

            if (options.antialiasSamples === undefined) {
                options.antialiasSamples = 4;
            }

            if (options.antialiasSamples === undefined) {
                options.antialiasSamples = 4;
            }

            if (options.showStats === undefined) {
                options.showStats = _parseBoolean(playerDiv, "data-show-stats", !paper.Application.isMobile);
            }

            if (options.showInspector === undefined) {
                options.showInspector = _parseBoolean(playerDiv, "data-show-inspector", !paper.Application.isMobile);
            }

            options.canvas = canvas;
            options.webgl =
                <WebGLRenderingContext>canvas.getContext("webgl", options) ||
                <WebGLRenderingContext>canvas.getContext("experimental-webgl", options);
        }

        const { version, systemManager, gameObjectContext } = paper.Application;

        console.info("Egret", version, "start.");

        paper.Application.initialize(options);
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

        paper.Application.registerSystems();
        paper.Application.start();

        console.info("Egret start complete.");
    }

    function _parseBoolean(playerDiv: HTMLDivElement | null, attributeName: string, defaultValue: boolean) {
        if (playerDiv !== null) {
            const attribute = playerDiv.getAttribute(attributeName);

            if (attribute !== null) {
                return attribute === "true";
            }
        }

        return defaultValue;
    }

    function _parseInt(playerDiv: HTMLDivElement | null, attributeName: string, defaultValue: int) {
        if (playerDiv !== null) {
            const attribute = playerDiv.getAttribute(attributeName);

            if (attribute !== null) {
                return parseInt(attribute);
            }
        }

        return defaultValue;
    }

    function _getMainCanvas(options: RunOptions, playerDiv: HTMLDivElement | null) {
        if (window.canvas) {
            return window.canvas;
        }

        if (options.canvas) {
            return options.canvas;
        }

        const canvas = document.createElement("canvas");
        playerDiv!.appendChild(canvas);

        return canvas;
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
