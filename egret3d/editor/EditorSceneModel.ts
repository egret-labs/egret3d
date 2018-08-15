namespace paper.editor {
    export class EditorSceneModel {
        public get editorScene(): Scene {
            return Application.sceneManager.editorScene;
        }
        public set editorModel(v: EditorModel) {
            // this.pickGameScript.clearSelected();
            // this.geoController.clearSelected();//TODO:应在controller里新增清空状态函数
            this.editorCameraScript.editorModel = v;
            this.pickGameScript.editorModel = v;
            this.geoController.editorModel = v;

            this.cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
            this.cameraObject.transform.lookAt(egret3d.Vector3.ZERO);
        }
        private editorCameraScript: EditorCameraScript;
        private pickGameScript: PickGameObjectScript;
        private geoController: Controller;
        private cameraObject: GameObject;
        public init(): void {
            this.cameraObject = GameObject.create("EditorCamera", DefaultTags.EditorOnly, Application.sceneManager.editorScene);
            const camera = this.cameraObject.addComponent(egret3d.Camera);
            camera.near = 0.1;
            camera.far = 500.0;
            camera.backgroundColor.set(0.13, 0.28, 0.51, 1.00);
            this.cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
            this.cameraObject.transform.lookAt(egret3d.Vector3.ZERO);

            this.editorCameraScript = this.cameraObject.addComponent(EditorCameraScript);
            this.editorCameraScript.moveSpeed = 10;
            this.editorCameraScript.rotateSpeed = 0.5;

            this.pickGameScript = this.cameraObject.addComponent(PickGameObjectScript);

            this.geoController = this.cameraObject.addComponent(Controller)
            Gizmo.Enabled();
        }
    }
}