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
        private readonly _guiComponent: GUIComponent | null = Application.playerMode === PlayerMode.Editor ? null : GameObject.globalGameObject.getOrAddComponent(GUIComponent);

        private _fpsHided: boolean = false;

        private _hideFPS() {
            const guiComponent = this._guiComponent!;
            const statsDOM = guiComponent.stats.dom;

            if (this._fpsHided) {
                statsDOM.style.display = "block";
            }
            else {
                statsDOM.style.display = "none";
            }

            this._fpsHided = !this._fpsHided;
        }

        public onAwake() {
            GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
            //
            if (Application.playerMode === PlayerMode.Editor) {
                Application.systemManager.register(SceneSystem, SystemOrder.LaterUpdate);
            }
            else {
                const guiComponent = this._guiComponent!;
                const oldContainer = guiComponent!.hierarchy.domElement.parentElement!;
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
                oldContainer.insertBefore(guiComponent.stats.dom, oldContainer.lastElementChild);
                oldContainer.insertBefore(empty, oldContainer.lastElementChild);

                guiComponent.hierarchy.onClick = () => {
                    if (guiComponent.hierarchy.closed) {
                        oldContainer.insertBefore(guiComponent.hierarchy.domElement, oldContainer.firstElementChild);
                    }
                    else {
                        hierarchy[0].appendChild(guiComponent.hierarchy.domElement);
                    }
                };

                guiComponent.inspector.onClick = () => {
                    if (guiComponent.inspector.closed) {
                        oldContainer.appendChild(guiComponent.inspector.domElement);
                    }
                    else {
                        inspector[0].appendChild(guiComponent.inspector.domElement);
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
                    guiComponent.hierarchy.close();
                    guiComponent.inspector.close();

                    if (!dat.GUI.hide) {
                        dat.GUI.toggleHide();
                    }

                    if (!this._fpsHided) {
                        this._hideFPS();
                    }
                }
                else {
                    hierarchy[0].appendChild(guiComponent.hierarchy.domElement);
                    inspector[0].appendChild(guiComponent.inspector.domElement);
                }

                Application.systemManager.register(GUISystem, SystemOrder.LaterUpdate + 1); // Make sure the GUISystem update after the SceneSystem.

                console.info("通过 H 键切换 Inspector 的显示与隐藏。");
            }
        }

        public onUpdate() {
            if (Application.playerMode === PlayerMode.Editor) {
                return;
            }

            const guiComponent = this._guiComponent!;
            guiComponent.stats.update();
            guiComponent.renderPanel.update(
                paper.Application.systemManager.getSystem((egret3d as any)["web"]["WebGLRenderSystem"])!.deltaTime,
                200
            );

            if (egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyH).isDown(false)) {
                this._hideFPS();
            }

            // TODO dc tc vc

            const isMobile = paper.Application.isMobile;
            if (this._isMobile !== isMobile) {
                if (isMobile) {
                    if (!guiComponent.hierarchy.closed) {
                        guiComponent.hierarchy.close();
                        if (guiComponent.hierarchy.onClick) {
                            guiComponent.hierarchy.onClick(guiComponent.hierarchy);
                        }
                    }

                    if (!guiComponent.inspector.closed) {
                        guiComponent.inspector.close();
                        if (guiComponent.inspector.onClick) {
                            guiComponent.inspector.onClick(guiComponent.inspector);
                        }
                    }

                    if (!dat.GUI.hide) {
                        dat.GUI.toggleHide();
                    }

                    if (!this._fpsHided) {
                        this._hideFPS();
                    }
                }
                else {
                    if (guiComponent.hierarchy.closed) {
                        guiComponent.hierarchy.open();
                        if (guiComponent.hierarchy.onClick) {
                            guiComponent.hierarchy.onClick(guiComponent.hierarchy);
                        }
                    }

                    if (guiComponent.inspector.closed) {
                        guiComponent.inspector.open();
                        if (guiComponent.inspector.onClick) {
                            guiComponent.inspector.onClick(guiComponent.inspector);
                        }
                    }

                    if (dat.GUI.hide) {
                        dat.GUI.toggleHide();
                    }

                    if (this._fpsHided) {
                        this._hideFPS();
                    }
                }

                this._isMobile = isMobile;
            }
        }
    }
    //
    Application.systemManager.preRegister(EditorSystem, SystemOrder.Begin - 10000);
}