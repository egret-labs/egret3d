namespace egret3d {
    /**
     * Camera系统
     */
    export class CameraSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ],
            [
                { componentClass: [DirectionalLight, PointLight, SpotLight] }
            ]
        ];
        protected readonly _camerasAndLights: CamerasAndLights = paper.GameObject.globalGameObject.getOrAddComponent(CamerasAndLights);

        public onAddGameObject(_gameObject: paper.GameObject, group: paper.ComponentGroup) {
            if (group === this._groups[0]) {
                this._camerasAndLights.updateCamera(this._groups[0].gameObjects);
            }
            else if (group === this._groups[1]) {
                this._camerasAndLights.updateLight(this._groups[1].gameObjects);
            }
        }

        public onRemoveGameObject(_gameObject: paper.GameObject, group: paper.ComponentGroup) {
            if (group === this._groups[0]) {
                this._camerasAndLights.updateCamera(this._groups[0].gameObjects);
            }
            else if (group === this._groups[1]) {
                this._camerasAndLights.updateLight(this._groups[1].gameObjects);
            }
        }

        public onUpdate(deltaTime: number) {
            const cameras = this._camerasAndLights.cameras;
            if (cameras.length > 0) {
                this._camerasAndLights.sortCameras();

                for (const component of cameras) {
                    component.update(deltaTime);
                }
            }
        }
    }
}
