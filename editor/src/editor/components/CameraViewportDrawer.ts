namespace paper.editor {
    /**
     * @internal
     */
    export class CameraViewportDrawer extends BaseSelectedGOComponent {
        private readonly _editorUI: egret3d.Camera = EditorMeshHelper.createGameObject("Editor UI Camera").addComponent(egret3d.Camera);
        private readonly _drawer: GameObject = EditorMeshHelper.createGameObject("Plane", egret3d.DefaultMeshes.PLANE, egret3d.DefaultMaterials.MESH_BASIC.clone());
        private _camera: egret3d.Camera | null = null;

        private _updateCamera(camera: egret3d.Camera | null) {
            if (this._camera === camera) {
                return;
            }

            if (this._camera && this._camera.renderTarget === EditorDefaultTexture.CAMERA_TARGET) {
                this._camera.renderTarget = null;
            }

            if (camera && !camera.renderTarget) {
                camera.renderTarget = EditorDefaultTexture.CAMERA_TARGET;
            }

            this._camera = camera;
        }

        public initialize() {
            super.initialize();

            const drawer = this._drawer;
            drawer.layer = Layer.EditorUI;
            drawer.parent = this.gameObject;
            drawer.renderer!.material!.setTexture(EditorDefaultTexture.CAMERA_TARGET);
            drawer.transform.setLocalPosition(0.0, 100.0, 100.0);

            this._editorUI.order = 1;
            this._editorUI.bufferMask = gltf.BufferMask.Depth;
            this._editorUI.cullingMask = Layer.EditorUI;
            this._editorUI.opvalue = 0.0;
            this._editorUI.size = 10.0;
            this._editorUI.viewport.set(0.0, 0.0, 0.2, 0.2).update();
            this._editorUI.gameObject.transform.setLocalPosition(0.0, 100.0, 0.0);
        }

        public uninitialize() {
            super.uninitialize();

            this._updateCamera(null);
        }

        public update() {
            const selectedGameObject = super.update();
            const drawer = this._drawer;
            const camera = (selectedGameObject && selectedGameObject.scene !== paper.Scene.editorScene) ? selectedGameObject.getComponent(egret3d.Camera) : null;

            this._updateCamera(camera);

            if (camera) {
                drawer.activeSelf = true;
            }
            else {
                drawer.activeSelf = false;
            }

            return selectedGameObject;
        }
    }
}