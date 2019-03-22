namespace paper.editor {
    /**
     * @internal
     */
    @executeMode(PlayerMode.Player | PlayerMode.DebugPlayer)
    export class VConsoleSystem extends BaseSystem<GameObject> {
        private _vConsole: any = null;

        private _createVconsole() {
            this._vConsole = new VConsole!();
        }

        public onAwake() {
            if (Application.isMobile) {
                if (typeof VConsole !== "undefined") {
                    this._createVconsole();
                }
                else {
                    const head = document.getElementsByTagName("head")[0];
                    const script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = "https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js";
                    script.onload = (): void => {
                        this._createVconsole();
                    };
                    head.appendChild(script);
                }
            }
        }
    }

    Application.systemManager.preRegister(VConsoleSystem, Application.gameObjectContext, SystemOrder.Begin - 1);
}

declare var VConsole: { new(): any } | null;
