export * from "./uuid/index";
export * from "./ecs/index";
export * from "./egret/index";
export * from "./editor/index";

import { ApplicationInitializeOptions, RunningMode } from "./egret/types";
import { Application } from "./egret/Application";
import { Scene } from "./egret/components/Scene";

//
let _runEditor: boolean = false;
export const _application = new Application<Scene>();
//
function _loop(timestamp: number) {
    if (_application.isRunning) {
        Application.current = _application;

        const { tickCount, frameCount } = _application.clock.update(timestamp);

        if (tickCount > 0) {
            const { runningMode, systemManager } = _application;

            systemManager.startup(runningMode);
            systemManager.execute(tickCount, frameCount);
            systemManager.cleanup(frameCount);
            systemManager.teardown();
        }

        requestAnimationFrame(_loop);
    }
}

function _formatOptions(options: ApplicationInitializeOptions) {
    const isWeb = !window.canvas;
    const urlSearchParams = isWeb ? new URLSearchParams(location.search) : null;
    const playerDiv = null;
    // const canvas = _getMainCanvas(options, playerDiv);

    if (options.runningMode === undefined) {
        const param = urlSearchParams !== null ? urlSearchParams.get("player-mode") : "";

        if (param) {
            options.runningMode = parseInt(param);
        }
        else {
            options.runningMode = _parseInt(playerDiv, "data-player-mode", RunningMode.Normal);
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

        if (options.editorEntry === undefined) {
            const param = urlSearchParams !== null ? urlSearchParams.get("editor-entry") : "";

            if (param) {
                options.editorEntry = param;
            }
            else {
                options.editorEntry = _parseString(playerDiv, "data-editor-entry", "");
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
    }

    if (options.tickRate === undefined) {
        options.tickRate = _parseInt(playerDiv, "data-tick-rate", 60);
    }

    if (options.frameRate === undefined) {
        options.frameRate = _parseInt(playerDiv, "data-frame-rate", 0);
    }

    return options;
}

// function _parseBoolean(playerDiv: HTMLDivElement | null, attributeName: string, defaultValue: boolean) {
//     if (playerDiv !== null) {
//         const attribute = playerDiv.getAttribute(attributeName);

//         if (attribute !== null && attribute !== "auto") {
//             return attribute === "true";
//         }
//     }

//     return defaultValue;
// }

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

// function _getMainCanvas(options: ApplicationInitializeOptions, playerDiv: HTMLDivElement | null) {
//     if (window.canvas) {
//         return window.canvas;
//     }

//     if (options.canvas) {
//         return options.canvas;
//     }

//     const canvas = document.createElement("canvas");
//     playerDiv!.appendChild(canvas);

//     return canvas;
// }

async function _editorEntry(options: ApplicationInitializeOptions) {
    if (options.editorEntry) {
        const editorEntry = (window as any)[options.editorEntry] || null;

        if (editorEntry !== null) {
            await editorEntry();
        }
    }
}

async function _entry(options: ApplicationInitializeOptions) {
    if (options.entry) {
        const entry = (window as any)[options.entry] || null;

        if (entry !== null) {
            await entry();
        }
    }
}

async function _scene(_options: ApplicationInitializeOptions) {
    // if (options.scene) {
    //     await RES.loadConfig("resource/default.res.json", "resource/"); // TODO
    //     await RES.getResAsync(options.scene);
    //     paper.Application.sceneManager.createScene(options.scene);
    // }
}

export async function runEgret(options: ApplicationInitializeOptions | null = null) {
    if (options === null) {
        options = {};
    }

    options = _formatOptions(options);

    if (!_runEditor && options.editorEntry) { // 编辑器模式自定义初始化。
        _runEditor = true;
        await _editorEntry(options);
    }
    else {
        //
        _application.initialize(options);
        //
        _application.start();
        //
        requestAnimationFrame(_loop);

        await _entry(options);
        await _scene(options);
    }
}

(window as any).Application = Application;
(window as any).egret3d = (window as any).egret;
(window as any).paper = (window as any).egret;