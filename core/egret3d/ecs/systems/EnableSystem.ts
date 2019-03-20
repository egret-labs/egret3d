namespace paper {
    /**
     * @internal
     */
    export class EnableSystem extends BaseSystem<GameObject> {

        public onAwake(config: RunOptions) {
            const globalEntity = Application.sceneManager.globalEntity;

            globalEntity.addComponent(Clock);
            globalEntity.addComponent(DisposeCollecter);

            clock.tickInterval = config.tickRate! > 0 ? 1.0 / config.tickRate! : 0;
            clock.frameInterval = config.frameRate! > 0 ? 1.0 / config.frameRate! : 0;

            console.info("Tick rate: ", config.tickRate! > 0 ? config.tickRate : "Auto");
            console.info("Frame rate: ", config.frameRate! > 0 ? config.frameRate : "Auto");
        }
    }
}