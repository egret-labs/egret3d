namespace egret3d {
    /**
     * @internal
     */
    export class CameraAndLightSystem extends paper.BaseSystem {
        public readonly interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: [DirectionalLight, PointLight, SpotLight, HemisphereLight] }
            ]
        ];

        private readonly _drawCallCollecter: egret3d.DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);
        private readonly _cameraAndLightCollecter: CameraAndLightCollecter = paper.GameObject.globalGameObject.getOrAddComponent(CameraAndLightCollecter);
        private readonly _lightCamera: Camera = paper.GameObject.globalGameObject.getOrAddComponent(Camera);

        public onAwake() {
            const lightCamera = this._lightCamera;
            lightCamera.enabled = false; // Disable camera.
            lightCamera.hideFlags = paper.HideFlags.HideAndDontSave;
        }

        public onAddGameObject(_gameObject: paper.GameObject, group: paper.GameObjectGroup) {
            const groups = this.groups;
            const cameraAndLightCollecter = this._cameraAndLightCollecter;
            if (group === groups[0]) {
                cameraAndLightCollecter.updateCameras(groups[0].gameObjects);
            }
            else if (group === groups[1]) {
                cameraAndLightCollecter.updateLights(groups[1].gameObjects);
            }
        }

        public onRemoveGameObject(_gameObject: paper.GameObject, group: paper.GameObjectGroup) {
            const groups = this.groups;
            const cameraAndLightCollecter = this._cameraAndLightCollecter;
            if (group === groups[0]) {
                cameraAndLightCollecter.updateCameras(groups[0].gameObjects);
            }
            else if (group === groups[1]) {
                cameraAndLightCollecter.updateLights(groups[1].gameObjects);
            }
        }

        public onUpdate() {
            const cameraAndLightCollecter = this._cameraAndLightCollecter;
            const { cameras } = cameraAndLightCollecter;

            this._drawCallCollecter._update();

            if (cameras.length > 0) {
                cameraAndLightCollecter.sortCameras();
            }
        }

        public onLateUpdate() {
            this._cameraAndLightCollecter.lightCountDirty = LightCountDirty.None;
        }
    }
}
