namespace paper.editor {
    export class EditorSceneModel {
        private viewCache:any = {};
        public get editorScene(): Scene {
            return Application.sceneManager.editorScene;
        }
        private currentModel: EditorModel;
        public set editorModel(v: EditorModel) {
            if (this.currentModel) {
                this.viewCache[this.currentModel.contentUrl] = {
                    position: this.cameraObject.transform.getPosition().clone(),
                    rotation: this.cameraObject.transform.getRotation().clone()
                }
            }
            // this.pickGameScript.clearSelected();
            // this.geoController.clearSelected();//TODO:应在controller里新增清空状态函数
            // this.editorCameraScript.editorModel = v;
            // this.pickGameScript.editorModel = v;
            // this.geoController.editorModel = v;
            this.currentModel = v;
            if (v && this.viewCache[v.contentUrl]) {
                this.cameraObject.transform.setPosition(this.viewCache[v.contentUrl].position);
                this.cameraObject.transform.setRotation(this.viewCache[v.contentUrl].rotation);
            }
            else {
                this.cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
                this.cameraObject.transform.lookAt(egret3d.Vector3.ZERO);
            }
        }
        // private editorCameraScript: EditorCameraScript;
        // private pickGameScript: PickGameObjectScript;
        // private geoController: Controller;
        private cameraObject: GameObject;
        public init(): void {
            this.cameraObject = egret3d.Camera.editor.gameObject;
            // this.cameraObject = GameObject.create("EditorCamera", DefaultTags.EditorOnly, Application.sceneManager.editorScene);
            const camera = this.cameraObject.getOrAddComponent(egret3d.Camera);
            camera.near = 0.1;
            camera.far = 500.0;
            camera.backgroundColor.set(0.13, 0.28, 0.51, 1.00);
            this.cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
            this.cameraObject.transform.lookAt(egret3d.Vector3.ZERO);
            paper.GameObject.globalGameObject.sendMessage("bootstrap");

            // this.editorCameraScript = this.cameraObject.addComponent(EditorCameraScript);
            // this.editorCameraScript.moveSpeed = 10;
            // this.editorCameraScript.rotateSpeed = 0.5;

            // this.pickGameScript = this.cameraObject.addComponent(PickGameObjectScript);

            // this.geoController = this.cameraObject.addComponent(Controller)
        }
    }
}