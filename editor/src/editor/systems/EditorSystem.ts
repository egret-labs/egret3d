namespace paper.debug {
    /**
     * 
     */
    export class EditorSystem extends BaseSystem {
        public onAwake() {
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