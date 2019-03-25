namespace egret3d {
    let _runEditor: boolean = false;
    /**
     * 引擎启动入口。
     * @param options 
     */
    export async function runEgret(options?: RunOptions) {
        if (!options) {
            options = {};
        }

        _formatOptions(options);

        {
            // TODO
            egret.Sound = egret.web ? egret.web.HtmlSound : (egret as any)['wxgame']['HtmlSound']; //TODO:Sound
            (egret.Capabilities as any)["renderMode" + ""] = "webgl";
        }

        if (!_runEditor && options.editorEntry) {
            _runEditor = true;
            await _editorEntry(options);
        }
        else {
            const { systemManager, gameObjectContext } = paper.Application;

            paper.Application.initialize(options);
            systemManager
                .preRegister(webgl.BeginSystem, gameObjectContext, paper.SystemOrder.Begin)
                .preRegister(webgl.WebGLRenderSystem, gameObjectContext, paper.SystemOrder.Renderer)
                .preRegister(webgl.InputSystem, gameObjectContext, paper.SystemOrder.End)

                .preRegister(CollisionSystem, gameObjectContext, paper.SystemOrder.FixedUpdate)
                .preRegister(AnimationSystem, gameObjectContext, paper.SystemOrder.Animation)
                .preRegister(MeshRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
                .preRegister(SkinnedMeshRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
                .preRegister(particle.ParticleSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
                .preRegister(Egret2DRendererSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer)
                .preRegister(CameraAndLightSystem, gameObjectContext, paper.SystemOrder.BeforeRenderer);

            paper.Application.registerSystems();
            paper.Application.start();

            await _entry(options);
            await _scene(options);
        }
    }

    function _formatOptions(options: RunOptions) {
        const isWeb = !window.canvas;
        const urlSearchParams = isWeb ? new URLSearchParams(location.search) : null;
        const playerDiv = isWeb ? <HTMLDivElement>document.getElementsByClassName("egret-player")[0]! : null;
        const canvas = _getMainCanvas(options, playerDiv);

        if (options.playerMode === undefined) {
            const param = urlSearchParams !== null ? urlSearchParams.get("player-mode") : "";

            if (param) {
                options.playerMode = parseInt(param);
            }
            else {
                options.playerMode = _parseInt(playerDiv, "data-player-mode", paper.PlayerMode.Player);
            }
        }

        if (options.editorEntry === undefined) {
            const param = urlSearchParams !== null ? urlSearchParams.get("editor-entry") : "";

            if (param) {
                options.editorEntry = param;
            }
            else {
                options.editorEntry = _parseString(playerDiv, "data-editor-entry", "");
            }
        }

        if (options.entry === undefined) {
            const param = urlSearchParams !== null ? urlSearchParams.get("entry") : "";

            if (param) {
                options.entry = param;
            }
            else {
                options.entry = _parseString(playerDiv, "data-entry", "");
            }
        }

        if (options.scene === undefined) {
            const param = urlSearchParams !== null ? urlSearchParams.get("scene") : "";

            if (param) {
                options.scene = param.split("\\").join('/');
            }
            else {
                options.scene = _parseString(playerDiv, "data-scene", "");
            }
        }

        if (options.tickRate === undefined) {
            options.tickRate = _parseInt(playerDiv, "data-tick-rate", 0);
        }

        if (options.frameRate === undefined) {
            options.frameRate = _parseInt(playerDiv, "data-frame-rate", 0);
        }

        if (options.contentWidth === undefined) {
            const param = urlSearchParams !== null ? urlSearchParams.get("content-width") : "";

            if (param) {
                options.contentWidth = parseInt(param);
            }
            else {
                options.contentWidth = _parseInt(playerDiv, "data-content-width", 1280);
            }
        }

        if (options.contentHeight === undefined) {
            const param = urlSearchParams !== null ? urlSearchParams.get("content-height") : "";

            if (param) {
                options.contentHeight = parseInt(param);
            }
            else {
                options.contentHeight = _parseInt(playerDiv, "data-content-height", 640);
            }
        }

        if (options.alpha === undefined) {
            options.alpha = _parseBoolean(playerDiv, "data-alpha", false);
        }

        if (options.antialias === undefined) {
            options.antialias = _parseBoolean(playerDiv, "data-antialias", true);
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

    function _parseBoolean(playerDiv: HTMLDivElement | null, attributeName: string, defaultValue: boolean) {
        if (playerDiv !== null) {
            const attribute = playerDiv.getAttribute(attributeName);

            if (attribute !== null && attribute !== "auto") {
                return attribute === "true";
            }
        }

        return defaultValue;
    }

    function _parseInt(playerDiv: HTMLDivElement | null, attributeName: string, defaultValue: int) {
        if (playerDiv !== null) {
            const attribute = playerDiv.getAttribute(attributeName);

            if (attribute !== null && attribute !== "auto") {
                return parseInt(attribute);
            }
        }

        return defaultValue;
    }

    function _parseString(playerDiv: HTMLDivElement | null, attributeName: string, defaultValue: string) {
        if (playerDiv !== null) {
            const attribute = playerDiv.getAttribute(attributeName);

            if (attribute !== null && attribute !== "auto") {
                return attribute;
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

    async function _editorEntry(options: RunOptions) {
        if (options.editorEntry) {
            const entry = global[options.editorEntry] || (window as any)[options.editorEntry] || null;

            if (entry !== null) {
                await entry();
            }
        }
    }

    async function _entry(options: RunOptions) {
        if (options.entry) {
            const entry = global[options.entry] || (window as any)[options.entry] || null;

            if (entry !== null) {
                await entry();
            }
        }
    }

    async function _scene(options: RunOptions) {
        if (options.scene) {
            await RES.loadConfig("resource/default.res.json", "resource/"); // TODO
            await RES.getResAsync(options.scene);
            paper.Application.sceneManager.createScene(options.scene);
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
