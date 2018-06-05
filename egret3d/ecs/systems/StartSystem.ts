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
            const { x, y, w } = egret3d.stage.absolutePosition
            const scale = egret3d.stage.screenViewport.w / w;
            egret3d.InputManager.touch.updateOffsetAndScale(x, y, scale);
            egret3d.InputManager.mouse.updateOffsetAndScale(x, y, scale);
        }
    }
}
