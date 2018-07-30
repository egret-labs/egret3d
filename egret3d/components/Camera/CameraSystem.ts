namespace egret3d {
    /**
     * Camera系统
     */
    export class CameraSystem extends paper.BaseSystem {
        protected readonly _interests = [
            [
                { componentClass: Camera }
            ]
        ];
        protected readonly _cameras: Cameras = this._globalGameObject.getOrAddComponent(Cameras);

        public onAddGameObject(gameObject: paper.GameObject, group: paper.Group) {
            if (group === this._groups[0]) {
                this._cameras.updateCamera(this._groups[0].gameObjects);
            }
            else if (group === this._groups[1]) {
                this._cameras.updateLight(this._groups[1].gameObjects);
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject, group: paper.Group) {
            if (group === this._groups[0]) {
                this._cameras.updateCamera(this._groups[0].gameObjects);
            }
            else if (group === this._groups[1]) {
                this._cameras.updateLight(this._groups[1].gameObjects);
            }
        }

        public onUpdate(deltaTime: number) {
            const cameras = this._cameras.cameras;
            if (cameras.length > 0) {
                this._cameras.sort();

                for (const component of cameras) {
                    component.update(deltaTime);
                }
            }
        }
    }
}
