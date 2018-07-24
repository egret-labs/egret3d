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
            // 覆盖生成 uuid 的方式。
            createUUID = generateUuid;
            createAssetID = generateUuid;
            //启动egret3编辑环境
            this.runEgret();
            await RES.loadConfig("resource/default.res.json", "resource/");
            //初始化编辑模型
            this._editorModel = new EditorModel();
        }
        private static runEgret() {
            egret3d.runEgret({
                antialias: true, isEditor: true, isPlaying: false,
                systems: [
                    egret3d.BeginSystem,
                    paper.EnableSystem,
                    paper.StartSystem,
                    //
                    paper.UpdateSystem,
                    //
                    egret3d.AnimationSystem,
                    //
                    paper.LateUpdateSystem,
                    //
                    egret3d.TrailRendererSystem,
                    egret3d.MeshRendererSystem,
                    egret3d.SkinnedMeshRendererSystem,
                    egret3d.particle.ParticleSystem,
                    egret3d.Egret2DRendererSystem,
                    egret3d.LightSystem,
                    EditorCameraSystem,
                    //
                    paper.DisableSystem,
                    paper.EndSystem
                ]
            });
        }
    }
}