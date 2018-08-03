namespace paper.editor {
    /**
     * 场景编辑器
     **/
    export class Editor {

        private static _editorModel: EditorModel;
        /**编辑模型 */
        public static get editorModel(): EditorModel {
            return this._editorModel;
        }
        private static history: History;
        /**初始化 */
        public static async init() {
            // 覆盖生成 uuid 的方式。
            createUUID = generateUuid;
            createAssetID = generateUuid;
            //启动egret3编辑环境
            this.runEgret();
            await RES.loadConfig("resource/default.res.json", "resource/");
            this.history = new History();
            //初始化编辑模型
            this._editorModel = new EditorModel();
            this._editorModel.init(this.history);
        }
        private static runEgret() {
            egret3d.runEgret({
                antialias: false,
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
                    egret3d.MeshRendererSystem,
                    egret3d.SkinnedMeshRendererSystem,
                    egret3d.particle.ParticleSystem,
                    egret3d.Egret2DRendererSystem,
                    //
                    egret3d.CameraSystem,
                    egret3d.WebGLRenderSystem,
                    //
                    paper.DisableSystem,
                    egret3d.EndSystem
                ]
            });

            // 摄像机激活场景设置为编辑场景。
            Application.sceneManager.camerasScene = Application.sceneManager.editorScene;
            // 创建编辑器的相机。
            this._createEditCamera();
            //
            Gizmo.Enabled();
        }
        /**切换场景 */
        public static switchScene(url: string) {
            Application.sceneManager.unloadAllScene();
            // Application.callLater(() => {
            this.loadEditScene(url).then(() => {
                this.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_SCENE, url));
            });
            // });
        }

        private static async loadEditScene(url: string) {
            await RES.getResAsync(url);
            this.loadScene(url, true);
        }
        //此方法是对Application.sceneManager.loadScene的一个重写，增加keepUUID参数
        private static loadScene(resourceName: string, keepUUID: boolean = false) {
            const rawScene = RES.getRes(resourceName) as RawScene;
            if (rawScene) {
                const scene = rawScene.createInstance(keepUUID);
                return scene;
            }

            return null;
        }

        private static _createEditCamera() {
            const cameraObject = GameObject.create("EditorCamera", DefaultTags.EditorOnly, Application.sceneManager.editorScene);

            {
                const camera = cameraObject.addComponent(egret3d.Camera);
                camera.near = 0.1;
                camera.far = 100.0;
                camera.backgroundColor.set(0.13, 0.28, 0.51, 1.00);
                cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
                cameraObject.transform.lookAt(egret3d.Vector3.ZERO);
            }

            {
                const script = cameraObject.addComponent(EditorCameraScript);
                script.editorModel = this.editorModel;
                script.moveSpeed = 10;
                script.rotateSpeed = 0.5;
            }

            {
                const script = cameraObject.addComponent(PickGameObjectScript);
                script.editorModel = this.editorModel;
            }
        }

        public static undo() {
            this.history.back();
        }
        public static redo() {
            this.history.forward();
        }
        public static deserializeHistory(data: any): void {
            this.history.deserialize(data);
        }
        public static serializeHistory(): string {
            const historyData = this.history.serialize();
            return JSON.stringify(historyData);
        }
    }
}