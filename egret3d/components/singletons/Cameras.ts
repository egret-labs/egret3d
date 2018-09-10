namespace egret3d {
    /**
     * 
     */
    export class CamerasAndLights extends paper.SingletonComponent {
        public readonly cameras: Camera[] = [];
        public readonly lights: BaseLight[] = [];

        private _sortCameras(a: Camera, b: Camera) {
            let aOrder = a.renderTarget ? a.order : a.order * 1000 + 1;
            let bOrder = b.renderTarget ? b.order : b.order * 1000 + 1;
            return aOrder - bOrder;
        }

        public updateCamera(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.cameras.length = 0;

            for (const gameObject of gameObjects) {
                this.cameras.push(gameObject.getComponent(Camera)!);
            }
        }

        public updateLight(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.lights.length = 0;

            for (const gameObject of gameObjects) {
                this.lights.push(gameObject.getComponent(BaseLight as any, true) as BaseLight);
            }
        }

        public sortCameras() {
            this.cameras.sort(this._sortCameras);
        }
    }
}