namespace paper.editor {
    export class EditorSceneModel {
        public get editorScene(): Scene {
            return Application.sceneManager.editorScene;
        }
        public set editorModel(v: EditorModel) {
            this.editorCameraScript.editorModel = v;
            this.pickGameScript.editorModel = v;
            this.geoController.editorModel = v;

        }
        private editorCameraScript: EditorCameraScript;
        private pickGameScript: PickGameObjectScript;
        private geoController: Controller;
        public init(): void {
            const cameraObject = GameObject.create("EditorCamera", DefaultTags.EditorOnly, Application.sceneManager.editorScene);
            const camera = cameraObject.addComponent(egret3d.Camera);
            camera.near = 0.1;
            camera.far = 500.0;
            camera.backgroundColor.set(0.13, 0.28, 0.51, 1.00);
            cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
            cameraObject.transform.lookAt(egret3d.Vector3.ZERO);

            this.editorCameraScript = cameraObject.addComponent(EditorCameraScript);
            this.editorCameraScript.moveSpeed = 10;
            this.editorCameraScript.rotateSpeed = 0.5;

            this.pickGameScript = cameraObject.addComponent(PickGameObjectScript);

            this.geoController = cameraObject.addComponent(Controller)
            Gizmo.Enabled();
        }
    }
}