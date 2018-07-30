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
                    egret3d.LightSystem,
                    EditorCameraSystem,
                    //
                    paper.DisableSystem,
                    egret3d.EndSystem
                ]
            });
        }
        /**切换场景 */
        public static switchScene(url: string) {
            Application.sceneManager.unloadAllScene();
            Application.callLater(() => {
                this.loadEditScene(url).then(() => {
                    this.editorModel.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_SCENE, url));
                });
            });
        }

        private static geoController: GeoController;
        private static async loadEditScene(url: string) {
            //由于新引擎场景加载方式存在问题，这里预先载入一下场景资源
            await RES.getResAsync(url);
            this.loadScene(url, true, true);

            let camera = this.createEditCamera();
            // 开启几何画板
            Gizmo.Enabled(camera);

            let script = camera.addComponent(EditorCameraScript);
            script.editorModel = this.editorModel;
            script.moveSpeed = 10;
            script.rotateSpeed = 0.5;

            this.geoController = new GeoController(this.editorModel);
            this.geoController.cameraScript = script;

            let pickScript = camera.addComponent(PickGameObjectScript);
            pickScript.editorModel = this.editorModel;
        }
        //此方法是对Application.sceneManager.loadScene的一个重写，增加keepUUID参数
        private static loadScene(resourceName: string, combineStaticObject: boolean = true, keepUUID: boolean = false) {
            const rawScene = RES.getRes(resourceName) as RawScene;
            if (rawScene) {
                const scene = rawScene.createInstance(keepUUID);

                if (scene) {
                    if (combineStaticObject && Application.isPlaying) {
                        egret3d.combine(scene.gameObjects);
                    }

                    return scene;
                }
            }
            return null;
        }
        private static createEditCamera(): GameObject {
            let cameraObject = new GameObject();
            cameraObject.name = "EditorCamera";
            cameraObject.tag = "EditorCamera";

            let camera = cameraObject.addComponent(egret3d.Camera);
            camera.near = 0.1;
            camera.far = 100;
            camera.backgroundColor.set(0.13, 0.28, 0.51, 1);
            cameraObject.transform.setLocalPosition(0, 10, -10);
            cameraObject.transform.lookAt(new egret3d.Vector3(0, 0, 0));
            return cameraObject;
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


        /**
         * 序列化场景
         */
        public static serializeActiveScene(): string {
            let scene = Application.sceneManager.activeScene;
            let camera = GameObject.findWithTag("EditorCamera");
            if (camera) {
                scene._removeGameObject(camera);
            }
            let len = this.geoController.controllerPool.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    scene._removeGameObject(this.geoController.controllerPool[i]);
                }
            }
            let data = serialize(scene);
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    scene._addGameObject(this.geoController.controllerPool[i]);
                }
            }
            if (camera) {
                scene._addGameObject(camera);
            }
            let jsonData = JSON.stringify(data);
            return jsonData;
        }
    }
}