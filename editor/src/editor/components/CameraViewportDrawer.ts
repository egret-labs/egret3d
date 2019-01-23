namespace paper.editor {
    /**
     * @internal
     */
    export class CameraViewportDrawer extends BaseSelectedGOComponent {
        private readonly _cameraRenderTexture: egret3d.RenderTexture = egret3d.RenderTexture.create({ width: 512, height: 512 });
        private readonly _editorUICamera: egret3d.Camera = EditorMeshHelper.createGameObject("Editor UI Camera").addComponent(egret3d.Camera);
        private readonly _drawer: GameObject = EditorMeshHelper.createGameObject("Plane", egret3d.DefaultMeshes.PLANE, egret3d.DefaultMaterials.MESH_BASIC.clone());

        private _camera: egret3d.Camera | null = null;

        private _updateCamera(camera: egret3d.Camera | null) {
            if (this._camera === camera) {
                return;
            }

            if (this._camera && this._camera._previewRenderTarget === this._cameraRenderTexture) {
                this._camera._previewRenderTarget = null;
            }

            if (camera && !camera._previewRenderTarget) {
                camera._previewRenderTarget = this._cameraRenderTexture;
            }

            this._camera = camera;
        }

        private _onStageResize() {
            const editorUICamera = this._editorUICamera;
            const drawer = this._drawer;
            egret3d.stage.matchFactor;
            drawer.transform.setLocalScale(editorUICamera.pixelViewport.w * 0.1);
            // this._cameraRenderTexture.uploadTexture(egret3d.stage.viewport.w, egret3d.stage.viewport.h);
        }

        public initialize() {
            super.initialize();

            const editorUICamera = this._editorUICamera;
            const drawer = this._drawer;
            drawer.layer = Layer.EditorUI;
            drawer.parent = this.gameObject;
            drawer.renderer!.material!.setTexture(this._cameraRenderTexture);
            drawer.transform.setLocalPosition(0.0, 100.0, 100.0);

            editorUICamera.order = 1;
            editorUICamera.bufferMask = gltf.BufferMask.Depth;
            editorUICamera.cullingMask = Layer.EditorUI;
            editorUICamera.opvalue = 0.0;
            editorUICamera.size = 10.0;
            editorUICamera.viewport.set(0.0, 0.0, 0.2, 0.2).update();
            editorUICamera.gameObject.transform.setLocalPosition(0.0, 100.0, 0.0);

            egret3d.stage.onResize.add(this._onStageResize, this);
        }

        public uninitialize() {
            super.uninitialize();

            this._cameraRenderTexture.dispose();
            this._updateCamera(null);
            egret3d.stage.onResize.remove(this._onStageResize, this);
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