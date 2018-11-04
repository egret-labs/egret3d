namespace paper.editor {
    const containerHTML = `
    <div class="egret-hierarchy" style="margin: auto;height: 100%;"></div>
    <div class="egret-inspector" style="margin: auto;height: 100%;"></div>
`;
    /**
     * @internal
     */
    export class EditorSystem extends BaseSystem {
        private _isMobile: boolean = false;
        private readonly _guiComponent: GUIComponent = GameObject.globalGameObject.getOrAddComponent(GUIComponent);

        public onAwake() {
            GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
            //
            if (Application.playerMode === PlayerMode.Editor) {
                Application.systemManager.register(SceneSystem, SystemOrder.LaterUpdate);
            }
            else {
                const oldContainer = this._guiComponent.hierarchy.domElement.parentElement!;
                const container = document.createElement("div");
                container.style.overflow = "hidden";
                container.style.display = "flex";
                container.style.width = "100%";
                container.style.height = "100%";
                container.style.height = "100%";
                container.style.margin = "auto";
                container.innerHTML = containerHTML;
                document.body.insertBefore(container, document.body.firstElementChild);

                const hierarchy = document.getElementsByClassName("egret-hierarchy");
                const inspector = document.getElementsByClassName("egret-inspector");

                container.insertBefore(document.getElementsByClassName("egret-player")[0], inspector[0]);

                const empty = document.createElement("div");
                empty.style.width = "100%";
                oldContainer.style.display = "flex";
                oldContainer.insertBefore(this._guiComponent.stats.dom, oldContainer.lastElementChild);
                oldContainer.insertBefore(empty, oldContainer.lastElementChild);

                this._guiComponent.hierarchy.onClick = () => {
                    if (this._guiComponent.hierarchy.closed) {
                        oldContainer.insertBefore(this._guiComponent.hierarchy.domElement, oldContainer.firstElementChild);
                    }
                    else {
                        hierarchy[0].appendChild(this._guiComponent.hierarchy.domElement);
                    }
                };

                this._guiComponent.inspector.onClick = () => {
                    if (this._guiComponent.inspector.closed) {
                        oldContainer.appendChild(this._guiComponent.inspector.domElement);
                    }
                    else {
                        inspector[0].appendChild(this._guiComponent.inspector.domElement);
                    }
                };

                this._isMobile = paper.Application.isMobile;

                if (this._isMobile) {
                    // TODO 前置组件。
                    // const loadScript = (url: string, callback: any) => {
                    //     const script = document.createElement("script");
                    //     script.onload = () => callback();
                    //     script.src = url;
                    //     document.body.appendChild(script);
                    // };
                    // loadScript(
                    //     "https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js",
                    //     () => {
                    //         new VConsole();
                    //     }
                    // );
                    this._guiComponent.hierarchy.close();
                    this._guiComponent.inspector.close();
                }
                else {
                    hierarchy[0].appendChild(this._guiComponent.hierarchy.domElement);
                    inspector[0].appendChild(this._guiComponent.inspector.domElement);
                }

                Application.systemManager.register(GUISystem, SystemOrder.LaterUpdate + 1); // Make sure the GUISystem update after the SceneSystem.
            }
        }

        public onUpdate() {
            this._guiComponent.stats.update();
            this._guiComponent.renderPanel.update(
                paper.Application.systemManager.getSystem((egret3d as any)["web"]["WebGLRenderSystem"])!.deltaTime,
                200
            );

            const isMobile = paper.Application.isMobile;
            if (this._isMobile !== isMobile) {
                if (isMobile) {
                    if (!this._guiComponent.hierarchy.closed) {
                        this._guiComponent.hierarchy.close();
                        if (this._guiComponent.hierarchy.onClick) {
                            this._guiComponent.hierarchy.onClick(this._guiComponent.hierarchy);
                        }
                    }

                    if (!this._guiComponent.inspector.closed) {
                        this._guiComponent.inspector.close();
                        if (this._guiComponent.inspector.onClick) {
                            this._guiComponent.inspector.onClick(this._guiComponent.inspector);
                        }
                    }
                }
                else {
                    if (this._guiComponent.hierarchy.closed) {
                        this._guiComponent.hierarchy.open();
                        if (this._guiComponent.hierarchy.onClick) {
                            this._guiComponent.hierarchy.onClick(this._guiComponent.hierarchy);
                        }
                    }

                    if (this._guiComponent.inspector.closed) {
                        this._guiComponent.inspector.open();
                        if (this._guiComponent.inspector.onClick) {
                            this._guiComponent.inspector.onClick(this._guiComponent.inspector);
                        }
                    }
                }

                this._isMobile = isMobile;
            }
        }
    }
    //
    Application.systemManager.preRegister(EditorSystem, SystemOrder.Begin - 10000);
}