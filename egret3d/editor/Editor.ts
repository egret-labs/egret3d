namespace paper.editor {
    /**
     * 场景编辑器
     **/
    export class Editor {
        public static get editorModel(): EditorModel {
            return this._editorModel;
        }
        private static _editorModel: EditorModel;
        /**初始化 */
        public static async init() {
            //启动egret3编辑环境
            this.runEgret({ antialias: true });
            //初始化编辑模型
            this._editorModel = new EditorModel();
            await this.editorModel.init();
        }

        private static runEgret(options: { antialias: boolean } = { antialias: false }) {
            egret3d.runEgret(options);

            Application.systemManager.disableSystem(egret3d.CameraSystem);
            Application.systemManager.disableSystem(egret3d.Audio3DListenerSystem);
            Application.systemManager.disableSystem(egret3d.AudioSource3DSystem);
            Application.systemManager.registerBefore(editor.EditorCameraSystem, DestroySystem);
            Application.systemManager.registerBefore(editor.GizmosSystem, DestroySystem);
        }
    }

}