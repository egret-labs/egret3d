namespace egret3d {
    /**
     * 
     */
    export class Cameras extends paper.SingletonComponent {
        public readonly cameras: Camera[] = [];

        private _sortCamera(a: Camera, b: Camera) {
            return a.order - b.order;
        }

        public update(cameras: ReadonlyArray<Camera>, gameObject: Readonly<paper.GameObject | null>) {
            const globalGameObject = paper.Application.sceneManager.globalGameObject;
            this.cameras.length = 0;

            for (const camera of cameras) {
                if (camera.gameObject === globalGameObject || camera.gameObject === gameObject) {
                    continue;
                }

                this.cameras.push(camera);
            }

            this.sort();
        }

        public sort() {
            this.cameras.sort(this._sortCamera);
        }
    }
}