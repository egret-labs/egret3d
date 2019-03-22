namespace paper.editor {
    /**
     * @internal
     */
    @executeMode(PlayerMode.Player | PlayerMode.DebugPlayer)
    export class StatsSystem extends BaseSystem<GameObject> {
        private _fpsIndex: uint = 0;
        private readonly _inspectorComponent: InspectorComponent = Application.sceneManager.globalEntity.getOrAddComponent(InspectorComponent);
        private readonly _fpsShowQueue: boolean[] = [true, false, false, true];

        private _updateFPSShowState() {
            if (this._inspectorComponent) {
                const statsDOM = this._inspectorComponent.stats.dom;

                if (this._inspectorComponent.showStates & ShowState.FPS) {
                    statsDOM.style.display = "block";
                }
                else {
                    statsDOM.style.display = "none";
                }
            }
        }

        public onEnable() {
            const options = Application.options as egret3d.RunOptions;

            if (options.showStats!) {
                this._inspectorComponent.showStates |= ShowState.FPS;
                this._fpsIndex = 0;
            }
            else {
                this._fpsIndex = 1;
                this._updateFPSShowState();
            }
        }

        public onTick() {
            if (egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyH).isDown(false)) {
                this._fpsIndex++;

                if (this._fpsIndex >= this._fpsShowQueue.length) {
                    this._fpsIndex = 0;
                }

                if (this._fpsShowQueue[this._fpsIndex]) {
                    this._inspectorComponent.showStates |= ShowState.FPS;
                }
                else {
                    this._inspectorComponent.showStates &= ~ShowState.FPS;
                }

                this._updateFPSShowState();
            }

            // TODO tc vc

            const inspectorComponent = this._inspectorComponent!;
            inspectorComponent.stats.update(); // TODO 每个面板独立
        }

        public onFrame() {
            const inspectorComponent = this._inspectorComponent!;
            inspectorComponent.stats.onFrame();
            inspectorComponent.renderPanel.update(
                paper.Application.systemManager.getSystem((egret3d as any)["webgl"]["WebGLRenderSystem"])!.deltaTime,
                200
            );
            inspectorComponent.drawCallPanel.update(
                egret3d.drawCallCollecter.drawCallCount,
                500,
            );
        }
    }
}
