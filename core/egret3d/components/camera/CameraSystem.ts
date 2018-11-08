namespace egret3d {
    /**
     * @internal
     */
    export class CameraAndLightSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: [DirectionalLight, PointLight, SpotLight] }
            ]
        ];

        private readonly _cameraAndLightCollecter: CameraAndLightCollecter = paper.GameObject.globalGameObject.getOrAddComponent(CameraAndLightCollecter);
        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getOrAddComponent(DrawCallCollecter);
        private readonly _lightCamera: Camera = paper.GameObject.globalGameObject.getOrAddComponent(Camera);

        public onAwake() {
            this._lightCamera.hideFlags = paper.HideFlags.HideAndDontSave;
        }

        public onAddGameObject(_gameObject: paper.GameObject, group: paper.GameObjectGroup) {
            if (group === this._groups[0]) {
                this._cameraAndLightCollecter.updateCameras(this._groups[0].gameObjects);
            }
            else if (group === this._groups[1]) {
                this._cameraAndLightCollecter.updateLights(this._groups[1].gameObjects);
            }
        }

        public onRemoveGameObject(_gameObject: paper.GameObject, group: paper.GameObjectGroup) {
            if (group === this._groups[0]) {
                this._cameraAndLightCollecter.updateCameras(this._groups[0].gameObjects);
            }
            else if (group === this._groups[1]) {
                this._cameraAndLightCollecter.updateLights(this._groups[1].gameObjects);
            }
        }

        public onUpdate(deltaTime: number) {
            const cameraAndLightCollecter = this._cameraAndLightCollecter;
            const cameras = cameraAndLightCollecter.cameras;
            cameraAndLightCollecter.lightDirty = false;

            if (cameras.length > 0) {
                cameraAndLightCollecter.sortCameras();

                for (const component of cameras) {
                    component._update(deltaTime);
                }
            }

            this._drawCallCollecter._update();
        }
    }
}
