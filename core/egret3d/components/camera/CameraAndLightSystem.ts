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
            this._drawCallCollecter._update();

            const cameraAndLightCollecter = this._cameraAndLightCollecter;
            if (cameraAndLightCollecter.cameras.length > 0) {
                cameraAndLightCollecter.sortCameras();
            }
        }

        public onLateUpdate() {
            this._drawCallCollecter._lateUpdate();
            this._cameraAndLightCollecter.lightCountDirty = LightCountDirty.None;
        }
    }
}
