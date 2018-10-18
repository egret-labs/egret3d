namespace paper.editor {
    const containerHTML = `
    <div class="egret-hierarchy" style="margin: auto;height: 100%;"></div>
    <div class="egret-inspector" style="margin: auto;height: 100%;"></div>
`;
    /**
     * @internal
     */
    export class EditorSystem extends BaseSystem {
        private readonly _guiComponent: GUIComponent = GameObject.globalGameObject.getOrAddComponent(GUIComponent);

        public onAwake() {
            GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
            //
            if (Application.playerMode === PlayerMode.Editor) {
                Application.systemManager.register(SceneSystem, SystemOrder.LaterUpdate);
            }
            else {
                if (egret.Capabilities.isMobile) {
                    this._guiComponent.hierarchy = new dat.GUI({ closeOnTop: true, width: 330 });

                    // TODO 前置组件。
                    const loadScript = (url: string, callback: any) => {
                        const script = document.createElement("script");
                        script.onload = () => callback();
                        script.src = url;
                        document.body.appendChild(script);
                    };
                    loadScript(
                        "https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js",
                        () => {
                            new VConsole();
                        }
                    );
                }
                else {
                    const container = document.createElement("div");
                    container.style.overflow = "hidden";
                    container.style.display = "flex";
                    container.style.width = "100%";
                    container.style.height = "100%";
                    container.style.height = "100%";
                    container.style.margin = "auto";
                    container.innerHTML = containerHTML;
                    document.body.appendChild(container);

                    this._guiComponent.hierarchy = new dat.GUI({ autoPlace: false, closeOnTop: true, width: 330 });
                    this._guiComponent.inspector = new dat.GUI({ autoPlace: false, closeOnTop: true, width: 330 });
                    const hierarchy = document.getElementsByClassName("egret-hierarchy");
                    const inspector = document.getElementsByClassName("egret-inspector");
                    hierarchy[0].appendChild(this._guiComponent.hierarchy.domElement);
                    inspector[0].appendChild(this._guiComponent.inspector.domElement);
                    container.insertBefore(document.getElementsByClassName("egret-player")[0], inspector[0]);

                    const sceneOptions = {
                        debug: false,
                        resources: () => {
                            // if (this._modelComponent.selectedScene) {
                            //     const sceneJSON = JSON.stringify(serialize(this._modelComponent.selectedScene));
                            //     console.info(sceneJSON);
                            // }
                            // else if (this._modelComponent.selectedGameObjects.length > 0) {
                            // }
                        },
                    };

                    this._guiComponent.hierarchy.add(sceneOptions, "debug").onChange((v: boolean) => {
                        const sceneSystem = Application.systemManager.getOrRegisterSystem(editor.SceneSystem, SystemOrder.LaterUpdate);

                        if (v) {
                            Application.playerMode = PlayerMode.DebugPlayer;
                            sceneSystem.enabled = true;
                        }
                        else {
                            Application.playerMode = PlayerMode.Player;
                            sceneSystem.enabled = false;
                        }
                    });
                    // this._guiComponent.hierarchy.add(sceneOptions, "resources");
                    // this._guiComponent.hierarchy.close();

                    Application.systemManager.register(GUISystem, SystemOrder.LaterUpdate + 1); // Make sure the GUISystem update after the SceneSystem.
                }
            }
        }
    }
    //
    Application.systemManager.preRegister(EditorSystem, SystemOrder.LaterUpdate);
}