namespace paper {
    /**
     * @internal
     */
    export class StartSystem extends paper.BaseSystem<paper.BaseComponent> {
        /**
         * @inheritDoc
         */
        public update() {
            egret3d.Performance.startCounter(egret3d.PerformanceType.All);
            egret3d.stage.update();
        }
    }
}
