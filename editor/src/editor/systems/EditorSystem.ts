namespace paper.editor {
    /**
     * @internal
     */
    export class EditorSystem extends BaseSystem {
        public onAwake() {
            GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
            //
            if (Application.playerMode === PlayerMode.Editor) {
                Application.systemManager.register(SceneSystem, SystemOrder.LaterUpdate);
            }
            else {
                Application.systemManager.register(GUISystem, SystemOrder.LaterUpdate + 1); // Make sure the GUISystem update after the SceneSystem.
            }
        }
    }
    // 
    Application.systemManager.preRegister(EditorSystem, SystemOrder.LaterUpdate);
}