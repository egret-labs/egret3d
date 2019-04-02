namespace paper.editor {
    const containerHTML = `
        <div class="egret-hierarchy" style="margin: auto;height: 100%;background: #000000;"></div>
        <div class="egret-inspector" style="margin: auto;height: 100%;background: #000000;"></div>
    `;
    /**
     * @internal
     */
    @executeMode(PlayerMode.Player | PlayerMode.DebugPlayer)
    export class InspectorSystem extends BaseSystem<GameObject> {
        private _isMobile: boolean = false;
        private readonly _inspectorComponent: InspectorComponent = Application.sceneManager.globalEntity.addComponent(InspectorComponent);

        public onEnable() {
            Application.sceneManager.globalEntity.getOrAddComponent(EditorAssets);

            const inspectorComponent = this._inspectorComponent!;
            const oldContainer = inspectorComponent!.hierarchy.domElement.parentElement!;
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
            oldContainer.insertBefore(inspectorComponent.stats.dom, oldContainer.lastElementChild);
            oldContainer.insertBefore(empty, oldContainer.lastElementChild);

            inspectorComponent.hierarchy.onClick = () => {
                if (inspectorComponent.hierarchy.closed) {
                    oldContainer.insertBefore(inspectorComponent.hierarchy.domElement, oldContainer.firstElementChild);
                }
                else {
                    hierarchyContainer.appendChild(inspectorComponent.hierarchy.domElement);
                }
            };

            inspectorComponent.property.onClick = () => {
                if (inspectorComponent.property.closed) {
                    oldContainer.appendChild(inspectorComponent.property.domElement);
                }
                else {
                    inspectorContainer.appendChild(inspectorComponent.property.domElement);
                }
            };

            this._isMobile = paper.Application.isMobile;
            inspectorComponent.showStates = ShowState.None;

            const options = Application.options as egret3d.RunOptions;

            if (options.showInspector!) {
                inspectorComponent.showStates |= ShowState.HierarchyAndInspector;

                if (this._isMobile) {
                    inspectorComponent.hierarchy.close();
                    inspectorComponent.property.close();
                }
                else {
                    hierarchyContainer.appendChild(inspectorComponent.hierarchy.domElement);
                    inspectorContainer.appendChild(inspectorComponent.property.domElement);
                }
            }
            else {
                dat.GUI.toggleHide();
                inspectorComponent.hierarchy.close();
                inspectorComponent.property.close();
            }

            Application.systemManager.register(InspectorHierarchySystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(InspectorPropertySystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(SceneSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(GizmosSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(SpectorSystem, Application.gameObjectContext, SystemOrder.End);
            Application.systemManager.register(StatsSystem, Application.gameObjectContext, SystemOrder.End);
        }

        public onStart() {
            console.info(`小提示：通过 H 键切换 Inspector 的显示与隐藏。`);
        }

        public onFrame() {
            const { hierarchy, property } = this._inspectorComponent!;
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
    Application.systemManager.preRegister(InspectorSystem, Application.gameObjectContext, SystemOrder.End);
}
