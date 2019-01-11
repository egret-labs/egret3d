namespace paper.editor {
    /**
     * @internal
     */
    export class IconDrawer extends BaseComponent {
        private readonly _cameraAndLightCollecter: egret3d.CameraAndLightCollecter = GameObject.globalGameObject.getOrAddComponent(egret3d.CameraAndLightCollecter);
        private readonly _cameraDrawer: GameObject[] = [];
        private readonly _lightDrawer: GameObject[] = [];

        public initialize() {
            super.initialize();
        }

        public update() {
            const editorScene = paper.Scene.editorScene;
            const editorCamera = egret3d.Camera.editor;
            const cameraPosition = editorCamera.gameObject.transform.position;
            const { cameras, directionalLights, spotLights, pointLights, hemisphereLights } = this._cameraAndLightCollecter;
            const lights = ([] as egret3d.BaseLight[]).concat(directionalLights).concat(spotLights).concat(pointLights).concat(hemisphereLights);

            for (let i = 0, l = Math.max(this._cameraDrawer.length, cameras.length); i < l; ++i) {
                if (i + 1 > this._cameraDrawer.length) {
                    const gameObject = EditorMeshHelper.createIcon(`Icon ${i}`, EditorDefaultTexture.CAMERA_ICON);
                    gameObject.parent = this.gameObject;
                    this._cameraDrawer.push(gameObject);
                }

                const drawer = this._cameraDrawer[i];

                if (i + 1 > cameras.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const gameObject = cameras[i].gameObject;
                    if (gameObject.scene !== editorScene) {
                        drawer.activeSelf = true;

                        const eyeDistance = cameraPosition.getDistance(gameObject.transform.position);
                        drawer.transform.localPosition = gameObject.transform.position;
                        drawer.transform.localRotation = editorCamera.gameObject.transform.rotation; // TODO sprite
                        drawer.transform.setLocalScale(eyeDistance / 40.0);
                        drawer.getComponent(GizmoPickComponent)!.pickTarget = gameObject;
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }

            for (let i = 0, l = Math.max(this._lightDrawer.length, lights.length); i < l; ++i) {
                if (i + 1 > this._lightDrawer.length) {
                    const gameObject = EditorMeshHelper.createIcon(`Icon ${i}`, EditorDefaultTexture.LIGHT_ICON);
                    gameObject.parent = this.gameObject;
                    this._lightDrawer.push(gameObject);
                }

                const drawer = this._lightDrawer[i];

                if (i + 1 > lights.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const gameObject = lights[i].gameObject;
                    if (gameObject.scene !== editorScene) {
                        drawer.activeSelf = true;

                        const eyeDistance = cameraPosition.getDistance(gameObject.transform.position);
                        drawer.transform.localPosition = gameObject.transform.position;
                        drawer.transform.localRotation = editorCamera.gameObject.transform.rotation; // TODO sprite
                        drawer.transform.setLocalScale(eyeDistance / 40.0);
                        drawer.getComponent(GizmoPickComponent)!.pickTarget = gameObject;
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }
        }
    }
}