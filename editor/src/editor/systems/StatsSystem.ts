namespace paper.editor {
    /**
     * @internal
     */
    export class StatsSystem extends BaseSystem<GameObject> {
        private readonly _guiComponent: GUIComponent = GameObject.globalGameObject.getOrAddComponent(GUIComponent);

        public onAwake() {
            
        }
    }
}