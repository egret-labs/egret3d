namespace egret3d {
    /**
     * @internal
     */
    export class BeginSystem extends paper.BaseSystem {
        public onAwake() {
            const globalGameObject = paper.GameObject.globalGameObject;
            globalGameObject.getOrAddComponent(DefaultTextures);
            globalGameObject.getOrAddComponent(DefaultMeshes);
            globalGameObject.getOrAddComponent(DefaultShaders);
            globalGameObject.getOrAddComponent(DefaultMaterials);

            paper.Time = globalGameObject.getOrAddComponent(paper.Clock);

            globalGameObject.getOrAddComponent(WebGLCapabilities);
        }

        public onUpdate() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            //
            egret3d.stage.update();
        }
    }
}