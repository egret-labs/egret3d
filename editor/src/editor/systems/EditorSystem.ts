namespace paper.editor {
    /**
     * @internal
     */
    @executeMode(PlayerMode.Editor)
    export class EditorSystem extends BaseSystem<GameObject> {

        public onEnable() {
            Application.sceneManager.globalEntity.getOrAddComponent(EditorAssets);
            Application.systemManager.register(SceneSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
            Application.systemManager.register(GizmosSystem, Application.gameObjectContext, SystemOrder.LateUpdate);
        }
    }
    //
    Application.systemManager.preRegister(EditorSystem, Application.gameObjectContext, SystemOrder.End);
}
