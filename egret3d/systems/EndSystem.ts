namespace egret3d {
    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem {

        public onUpdate(deltaTime: number) {
            //
            InputManager.update(deltaTime);
            //
            
            Performance.updateFPS();
            Performance.endCounter(egret3d.PerformanceType.All);
        }
    }
}
