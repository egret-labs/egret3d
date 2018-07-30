namespace egret3d {
    /**
     * 
     */
    export class Cameras extends paper.SingletonComponent {
        public readonly cameras: Camera[] = [];
        public readonly lights: BaseLight[] = [];

        private _sortCamera(a: Camera, b: Camera) {
            return a.order - b.order;
        }

        public update(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.cameras.length = 0;

            for (const gameObject of gameObjects) {
                this.cameras.push(gameObject.getComponent(Camera) as Camera);
            }
        }

        public updateLight(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.lights.length = 0;

            for (const gameObject of gameObjects) {
                this.lights.push(gameObject.getComponent(BaseLight as any, true) as BaseLight);
            }
        }

        public sort() {
            this.cameras.sort(this._sortCamera);
        }
    }
}