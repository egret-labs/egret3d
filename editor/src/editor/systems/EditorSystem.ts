namespace paper.editor {
    /**
     * @internal
     */
    export class EditorSystem extends BaseSystem {
        public onAwake() {
            // GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
            //
            if (Application.playerMode === PlayerMode.Editor) {
                Application.systemManager.register(SceneSystem, SystemOrder.LaterUpdate);
            }
            else {
                Application.systemManager.register(GUISystem, SystemOrder.LaterUpdate);
            }
        }
    }
    // 
    Application.systemManager.preRegister(EditorSystem, SystemOrder.LaterUpdate);
}