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
                { componentClass: [DirectLight, PointLight, SpotLight] }
            ]
        ];
        protected readonly _camerasAndLights: CamerasAndLights = this._globalGameObject.getOrAddComponent(CamerasAndLights);

        public onAddGameObject(gameObject: paper.GameObject, group: paper.Group) {
            if (group === this._groups[0]) {
                this._camerasAndLights.updateCamera(this._groups[0].gameObjects);
            }
            else if (group === this._groups[1]) {
                this._camerasAndLights.updateLight(this._groups[1].gameObjects);
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject, group: paper.Group) {
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
                const camerasScene = paper.Application.sceneManager.activeScene;
                this._camerasAndLights.sort();

                for (const component of cameras) {
                    if (component.gameObject.scene !== camerasScene) {
                        continue;
                    }

                    component.update(deltaTime);
                }
            }
        }
    }
}
