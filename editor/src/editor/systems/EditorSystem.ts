namespace paper.editor {
    const containerHTML = `
        <div class="egret-hierarchy" style="margin: auto;height: 100%;background: #000000;"></div>
        <div class="egret-inspector" style="margin: auto;height: 100%;background: #000000;"></div>
    `;

    type QuaryValues = {
        FPS?: 0 | 1,
        GUI?: 0 | 1,
        DEBUG?: 0 | 1,
    };

    const enum ShowState {
        None = 0b000,

        FPS = 0b001,
        Hierarchy = 0b010,
        Inspector = 0b100,

        HierarchyAndInspector = Hierarchy | Inspector,
        All = FPS | Hierarchy | Inspector,
    }
    /**
     * @internal
     */
    export class EditorSystem extends BaseSystem<GameObject> {
        private _isMobile: boolean = false;
        private _showStates: ShowState = ShowState.None;
        private _fpsIndex: uint = 0;
        private readonly _guiComponent: GUIComponent | null = Application.playerMode === PlayerMode.Editor ? null : GameObject.globalGameObject.getOrAddComponent(GUIComponent);
        private readonly _fpsShowQueue: boolean[] = [true, false, false, true];

        private _updateFPSShowState() {
            if (this._guiComponent) {
                const statsDOM = this._guiComponent.stats.dom;

                if (this._showStates & ShowState.FPS) {
                    statsDOM.style.display = "block";
                }
                else {
                    statsDOM.style.display = "none";
                }
            }
        }

        public onAwake() {
            GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture); // TODO
            //
            if (Application.playerMode === PlayerMode.Editor) {
                this._showStates = ShowState.None;
                Application.systemManager.register(SceneSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
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

                const quaryValues = getQueryValues(location.search) as QuaryValues;
                this._isMobile = paper.Application.isMobile;
                this._showStates = ShowState.None;

                if (quaryValues.FPS === 1 || (quaryValues.FPS !== 0 && !this._isMobile)) {
                    this._showStates |= ShowState.FPS;
                    this._fpsIndex = 0;
                }
                else {
                    this._fpsIndex = 1;
                    this._updateFPSShowState();
                }

                if (quaryValues.GUI === 1 || (quaryValues.GUI !== 0 && !this._isMobile)) {
                    this._showStates |= ShowState.HierarchyAndInspector;
                    hierarchy[0].appendChild(guiComponent.hierarchy.domElement);
                    inspector[0].appendChild(guiComponent.inspector.domElement);
                }
                else {
                    dat.GUI.toggleHide();
                    guiComponent.hierarchy.close();
                    guiComponent.inspector.close();
                }

                Application.systemManager.register(GUISystem, Application.gameObjectContext, SystemOrder.LateUpdate + 1); // Make sure the GUISystem update after the SceneSystem.
            }
        }

        public onStart() {
            console.info(`小提示：通过 H 键切换 Inspector 的显示与隐藏。`);
        }

        public onFrame() {
            if (Application.playerMode === PlayerMode.Editor) {
                return;
            }

            const guiComponent = this._guiComponent!;
            guiComponent.stats.onFrame();
        }
        public onTick() {
            if (Application.playerMode === PlayerMode.Editor) {
                return;
            }

            const guiComponent = this._guiComponent!;
            guiComponent.stats.update();
            guiComponent.renderPanel.update(
                paper.Application.systemManager.getSystem((egret3d as any)["webgl"]["WebGLRenderSystem"])!.deltaTime,
                200
            );

            if (egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyH).isDown(false)) {
                this._fpsIndex++;

                if (this._fpsIndex >= this._fpsShowQueue.length) {
                    this._fpsIndex = 0;
                }

                if (this._fpsShowQueue[this._fpsIndex]) {
                    this._showStates |= ShowState.FPS;
                }
                else {
                    this._showStates &= ~ShowState.FPS;
                }

                this._updateFPSShowState();
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
                }

                this._isMobile = isMobile;
            }
        }
    }
    //
    Application.systemManager.preRegister(EditorSystem, Application.gameObjectContext, SystemOrder.Begin - 10000);
}
