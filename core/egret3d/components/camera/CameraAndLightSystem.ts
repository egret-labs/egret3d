namespace egret3d {
    /**
     * @internal
     */
    export class CameraAndLightSystem extends paper.BaseSystem<paper.GameObject> {

        private readonly _drawCallCollecter: DrawCallCollecter = paper.Application.sceneManager.globalEntity.getComponent(DrawCallCollecter)!;
        private readonly _cameraAndLightCollecter: CameraAndLightCollecter = paper.Application.sceneManager.globalEntity.getComponent(CameraAndLightCollecter)!;

        protected getMatchers() {
            return [
                paper.Matcher.create<paper.GameObject>(Transform, Camera),
                paper.Matcher.create<paper.GameObject>(Transform).anyOf(DirectionalLight, SpotLight, PointLight, HemisphereLight),
            ];
        }

        public onEntityAdded(_entity: paper.GameObject, group: paper.Group<paper.GameObject>) {
            const groups = this.groups;
            const cameraAndLightCollecter = this._cameraAndLightCollecter;

            if (group === groups[0]) {
                cameraAndLightCollecter.updateCameras(groups[0].entities);
            }
            else if (group === groups[1]) {
                cameraAndLightCollecter.updateLights(groups[1].entities);
            }
        }

        public onEntityRemoved(_entity: paper.GameObject, group: paper.Group<paper.GameObject>) {
            const groups = this.groups;
            const cameraAndLightCollecter = this._cameraAndLightCollecter;

            if (group === groups[0]) {
                cameraAndLightCollecter.updateCameras(groups[0].entities);
            }
            else if (group === groups[1]) {
                cameraAndLightCollecter.updateLights(groups[1].entities);
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
