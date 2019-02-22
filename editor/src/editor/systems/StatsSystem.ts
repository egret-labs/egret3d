namespace paper.editor {
    /**
     * @internal
     */
    export class StatsSystem extends BaseSystem<GameObject> {
        private _fpsIndex: uint = 0;
        private readonly _guiComponent: GUIComponent = GameObject.globalGameObject.getOrAddComponent(GUIComponent);
        private readonly _fpsShowQueue: boolean[] = [true, false, false, true];

        private _updateFPSShowState() {
            if (this._guiComponent) {
                const statsDOM = this._guiComponent.stats.dom;

                if (this._guiComponent.showStates & ShowState.FPS) {
                    statsDOM.style.display = "block";
                }
                else {
                    statsDOM.style.display = "none";
                }
            }
        }

        public onAwake() {
            const quaryValues = this._guiComponent.quaryValues;

            if (quaryValues.FPS === 1 || (quaryValues.FPS !== 0 && !paper.Application.isMobile)) {
                this._guiComponent.showStates |= ShowState.FPS;
                this._fpsIndex = 0;
            }
            else {
                this._fpsIndex = 1;
                this._updateFPSShowState();
            }
        }

        public onUpdate() {
            if (egret3d.inputCollecter.getKey(egret3d.KeyCode.KeyH).isDown(false)) {
                this._fpsIndex++;

                if (this._fpsIndex >= this._fpsShowQueue.length) {
                    this._fpsIndex = 0;
                }

                if (this._fpsShowQueue[this._fpsIndex]) {
                    this._guiComponent.showStates |= ShowState.FPS;
                }
                else {
                    this._guiComponent.showStates &= ~ShowState.FPS;
                }

                this._updateFPSShowState();
            }

            // TODO dc tc vc

            const guiComponent = this._guiComponent!;
            guiComponent.stats.update();
            guiComponent.renderPanel.update(
                paper.Application.systemManager.getSystem((egret3d as any)["webgl"]["WebGLRenderSystem"])!.deltaTime,
                200
            );
        }
    }
}