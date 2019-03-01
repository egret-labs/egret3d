namespace paper.editor {
    const containerHTML = `
        <div class="egret-hierarchy" style="margin: auto;height: 100%;background: #000000;"></div>
        <div class="egret-inspector" style="margin: auto;height: 100%;background: #000000;"></div>
    `;
    /**
     * @internal
     */
    export class EditorSystem extends BaseSystem<GameObject> {
        private _isMobile: boolean = false;
        private readonly _guiComponent: GUIComponent | null = Application.playerMode === PlayerMode.Editor ? null : GameObject.globalGameObject.getOrAddComponent(GUIComponent);

        public onAwake() {
            GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture); // TODO
            //
            if (Application.playerMode === PlayerMode.Editor) {
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

                const hierarchyContainer = document.getElementsByClassName("egret-hierarchy")[0];
                const inspectorContainer = document.getElementsByClassName("egret-inspector")[0];

                container.insertBefore(document.getElementsByClassName("egret-player")[0], inspectorContainer);

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
                        hierarchyContainer.appendChild(guiComponent.hierarchy.domElement);
                    }
                };

                guiComponent.inspector.onClick = () => {
                    if (guiComponent.inspector.closed) {
                        oldContainer.appendChild(guiComponent.inspector.domElement);
                    }
                    else {
                        inspectorContainer.appendChild(guiComponent.inspector.domElement);
                    }
                };

                this._isMobile = paper.Application.isMobile;
                guiComponent.showStates = ShowState.None;
                guiComponent.quaryValues = getQueryValues(location.search) as QuaryValues;

                if (guiComponent.quaryValues.GUI === 1 || (guiComponent.quaryValues.GUI !== 0 && !this._isMobile)) {
                    guiComponent.showStates |= ShowState.HierarchyAndInspector;
                    hierarchyContainer.appendChild(guiComponent.hierarchy.domElement);
                    inspectorContainer.appendChild(guiComponent.inspector.domElement);
                }
                else {
                    dat.GUI.toggleHide();
                    guiComponent.hierarchy.close();
                    guiComponent.inspector.close();
                }
            }

            Application.systemManager.register(HierarchySystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(InspectorSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(SceneSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(GizmosSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(StatsSystem, Application.gameObjectContext, SystemOrder.End);
        }

        public onStart() {
            console.info(`小提示：通过 H 键切换 Inspector 的显示与隐藏。`);
        }

        public onFrame() {
            if (Application.playerMode === PlayerMode.Editor) {
                return;
            }

            const { hierarchy, inspector } = this._guiComponent!;
            const isMobile = paper.Application.isMobile;

            if (this._isMobile !== isMobile) {
                if (isMobile) {
                    if (!hierarchy.closed) {
                        hierarchy.close();

                        if (hierarchy.onClick) {
                            hierarchy.onClick(hierarchy);
                        }
                    }

                    if (!inspector.closed) {
                        inspector.close();

                        if (inspector.onClick) {
                            inspector.onClick(inspector);
                        }
                    }

                    if (!dat.GUI.hide) {
                        dat.GUI.toggleHide();
                    }
                }
                else {
                    if (hierarchy.closed) {
                        hierarchy.open();

                        if (hierarchy.onClick) {
                            hierarchy.onClick(hierarchy);
                        }
                    }

                    if (inspector.closed) {
                        inspector.open();

                        if (inspector.onClick) {
                            inspector.onClick(inspector);
                        }
                    }

                    if (dat.GUI.hide) {
                        dat.GUI.toggleHide();
                    }
                }

                this._isMobile = isMobile;
            }
        }
    }
    //
    Application.systemManager.preRegister(EditorSystem, Application.gameObjectContext, SystemOrder.End + 10000);
}
