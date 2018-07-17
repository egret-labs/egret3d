namespace paper {
    /**
     * @internal
     */
    export class BeginSystem extends BaseSystem {
        public onUpdate() {
            //
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            //
            egret3d.stage.update();
        }
    }
}