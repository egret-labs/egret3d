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
            const { x, y, w, h } = egret3d.stage.absolutePosition;
            const scaleX = egret3d.stage.screenViewport.w / w;
            const scaleY = egret3d.stage.screenViewport.h / h;
            egret3d.InputManager.touch.updateOffsetAndScale(x, y, scaleX, scaleY);
            egret3d.InputManager.mouse.updateOffsetAndScale(x, y, scaleX, scaleY);
        }
    }
}
