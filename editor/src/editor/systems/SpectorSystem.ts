namespace paper.editor {
    /**
     * @internal
     */
    @executeMode(PlayerMode.Player | PlayerMode.DebugPlayer)
    export class SpectorSystem extends BaseSystem<GameObject> {
        private _showed: boolean = false;
        private _spector: any = null;

        private _createSpector() {
            this._spector = new SPECTOR.Spector();
        }

        public onAwake() {
            if (!Application.isMobile) {
                if (typeof SPECTOR !== "undefined") {
                    this._createSpector();
                }
                else {
                    const head = document.getElementsByTagName("head")[0];
                    const script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = "https://spectorcdn.babylonjs.com/spector.bundle.js";
                    script.onload = (): void => {
                        this._createSpector();
                    };
                    head.appendChild(script);
                }
            }

            this.enabled = false;
        }

        public onEnable() {
        }

        public onDisable() {
        }

        public onFrame() {
            if (this._spector !== null && !this._showed) {
                const canvas = (Application.options as egret3d.RunOptions).canvas;
                this._spector.displayUI();
                this._spector.spyCanvas(canvas);
                this._spector.captureCanvas(canvas);
                this._showed = true;
            }
        }
    }

    Application.systemManager.preRegister(SpectorSystem, Application.gameObjectContext, SystemOrder.Begin - 1);
}

declare namespace SPECTOR {
    class Spector {
        displayUI(): void;
        captureCanvas(canvas: HTMLCanvasElement, commandCount: uint, quickCapture: boolean): void;
        spyCanvas(canvas: HTMLCanvasElement): void;
    }
}
