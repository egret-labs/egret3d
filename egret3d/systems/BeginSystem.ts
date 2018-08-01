namespace egret3d {
    /**
     * @internal
     */
    export class BeginSystem extends paper.BaseSystem {
        public onAwake() {

            this._globalGameObject.getOrAddComponent(DefaultMeshes);
            this._globalGameObject.getOrAddComponent(DefaultMaterials);
            this._globalGameObject.getOrAddComponent(WebGLCapabilities);

            paper.Time = this._globalGameObject.getOrAddComponent(paper.Clock);
        }

        public onUpdate() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            //
            egret3d.stage.update();
        }
    }
}