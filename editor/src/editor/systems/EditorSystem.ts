namespace paper.editor {
    /**
     * @internal
     */
    export class EditorSystem extends BaseSystem {
        public onAwake() {
            // GameObject.globalGameObject.getOrAddComponent(EditorDefaultTexture);
            //
            if (Application.playerMode === PlayerMode.Editor) {
                Application.systemManager.getOrRegisterSystem(SceneSystem);
            }
            else {
                Application.systemManager.getOrRegisterSystem(GUISystem);
            }
        }
    }
    // 
    Application.systemManager.preRegister(EditorSystem, LateUpdateSystem);
}