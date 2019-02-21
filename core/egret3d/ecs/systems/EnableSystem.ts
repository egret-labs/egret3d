namespace paper {
    /**
     * @internal
     */
    export class EnableSystem extends BaseSystem<GameObject> {

        public onAwake() {
            const globalEntity = Application.sceneManager.globalEntity;

            globalEntity.addComponent(Clock);
            globalEntity.addComponent(DisposeCollecter);
        }
    }
}