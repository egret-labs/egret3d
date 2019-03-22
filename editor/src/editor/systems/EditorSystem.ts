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
        private readonly _guiComponent: InspectorComponent = Application.sceneManager.globalEntity.addComponent(InspectorComponent);

        public onAwake() {
            Application.sceneManager.globalEntity.getOrAddComponent(EditorAssets); // TODO
            //
            if ((Application.playerMode & PlayerMode.Editor) === 0) {
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

                guiComponent.property.onClick = () => {
                    if (guiComponent.property.closed) {
                        oldContainer.appendChild(guiComponent.property.domElement);
                    }
                    else {
                        inspectorContainer.appendChild(guiComponent.property.domElement);
                    }
                };

                this._isMobile = paper.Application.isMobile;
                guiComponent.showStates = ShowState.None;

                const options = Application.options as egret3d.RunOptions;

                if (options.showInspector!) {
                    guiComponent.showStates |= ShowState.HierarchyAndInspector;
                    hierarchyContainer.appendChild(guiComponent.hierarchy.domElement);
                    inspectorContainer.appendChild(guiComponent.property.domElement);
                }
                else {
                    dat.GUI.toggleHide();
                    guiComponent.hierarchy.close();
                    guiComponent.property.close();
                }
            }

            Application.systemManager.register(InspectorHierarchySystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(InspectorPropertySystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(SceneSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(GizmosSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(StatsSystem, Application.gameObjectContext, SystemOrder.End);
        }

        public onStart() {
            if ((Application.playerMode & PlayerMode.Editor) !== 0) {
                return;
            }

            console.info(`小提示：通过 H 键切换 Inspector 的显示与隐藏。`);
        }

        public onFrame() {
            if ((Application.playerMode & PlayerMode.Editor) !== 0) {
                return;
            }

            const { hierarchy, property } = this._guiComponent!;
            const isMobile = paper.Application.isMobile;

            if (this._isMobile !== isMobile) {
                if (isMobile) {
                    if (!hierarchy.closed) {
                        hierarchy.close();

                        if (hierarchy.onClick) {
                            hierarchy.onClick(hierarchy);
                        }
                    }

                    if (!property.closed) {
                        property.close();

                        if (property.onClick) {
                            property.onClick(property);
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

                    if (property.closed) {
                        property.open();

                        if (property.onClick) {
                            property.onClick(property);
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
    Application.systemManager.preRegister(EditorSystem, Application.gameObjectContext, SystemOrder.End);
}
