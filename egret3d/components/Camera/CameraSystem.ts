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
                this._cameras.update(this._groups[0].components as ReadonlyArray<Camera>, null);
            }
        }

        public onRemoveGameObject(gameObject: paper.GameObject, group: paper.Group) {
            if (group === this._groups[0]) {
                this._cameras.update(this._groups[0].components as ReadonlyArray<Camera>, gameObject);
            }
        }

        public onUpdate(deltaTime: number) {
            Performance.startCounter("render");

            const cameras = this._cameras.cameras;
            if (cameras.length > 0) {
                this._cameras.sort(); // TODO

                for (const component of cameras) {
                    component.update(deltaTime);  
                }
            }

            Performance.endCounter("render");
            Performance.updateFPS();
        }
    }
}
