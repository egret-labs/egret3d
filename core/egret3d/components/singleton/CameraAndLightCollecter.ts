namespace egret3d {
    /**
     * 激活的摄像机和灯光。
     */
    export class CameraAndLightCollecter extends paper.SingletonComponent {
        public readonly cameras: Camera[] = [];
        public readonly lights: BaseLight[] = [];

        private _sortCameras(a: Camera, b: Camera) {
            const aOrder = a.renderTarget ? a.order : a.order * 1000 + 1;
            const bOrder = b.renderTarget ? b.order : b.order * 1000 + 1;
            return aOrder - bOrder;
        }
        /**
         * 更新摄像机。
         */
        public updateCameras(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.cameras.length = 0;

            for (const gameObject of gameObjects) {
                this.cameras.push(gameObject.getComponent(Camera)!);
            }
        }

        public updateLights(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.lights.length = 0;

            for (const gameObject of gameObjects) {
                this.lights.push(gameObject.getComponent(BaseLight as any, true) as BaseLight);
            }
        }

        public sortCameras() {
            // TODO camera order event.
            this.cameras.sort(this._sortCameras);
        }
        /**
         * 摄像机计数
         */
        @paper.property(paper.EditType.UINT)
        public get cameraCount() {
            return this.cameras.length;
        }
        /**
         * 灯光计数。
         */
        @paper.property(paper.EditType.UINT)
        public get lightCount() {
            return this.lights.length;
        }
    }
}