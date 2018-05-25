namespace paper {

    /**
     * @internal
     */
    export class EndSystem extends paper.BaseSystem<paper.BaseComponent> {

        update() {
            egret3d.InputManager.update(Time.deltaTime);
            egret3d.Performance.endCounter(egret3d.PerformanceType.All);
        }
    }
}
