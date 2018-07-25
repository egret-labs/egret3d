namespace paper {
    /**
     * @internal
     */
    export class BeginSystem extends BaseSystem {
        public onAwake() {
            this._globalGameObject.addComponent(egret3d.WebGLCapabilities);
        }
        public onUpdate() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            //
            egret3d.stage.update();
        }
    }
}