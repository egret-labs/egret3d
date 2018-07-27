namespace egret3d {
    /**
     * 
     */
    export class Cameras extends paper.SingletonComponent {
        public readonly cameras: Camera[] = [];

        private _sortCamera(a: Camera, b: Camera) {
            return a.order - b.order;
        }

        public update(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.cameras.length = 0;

            for (const gameObject of gameObjects) {
                this.cameras.push(gameObject.getComponent(Camera) as Camera);
            }
        }

        public sort() {
            this.cameras.sort(this._sortCamera);
        }
    }
}