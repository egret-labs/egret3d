namespace egret3d {
    /**
     * 激活的摄像机和灯光。
     */
    export class CameraAndLightCollecter extends paper.SingletonComponent {
        /**
         * 
         */
        public lightDirty: boolean = false;
        /**
         * 
         */
        public readonly cameras: Camera[] = [];
        /**
         * 
         */
        public readonly lights: BaseLight[] = [];

        private _sortCameras(a: Camera, b: Camera) {
            const aOrder = a.renderTarget ? a.order : a.order * 1000 + 1;
            const bOrder = b.renderTarget ? b.order : b.order * 1000 + 1;
            return aOrder - bOrder;
        }
        /**
         * 更新相机。
         */
        public updateCameras(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.cameras.length = 0;

            for (const gameObject of gameObjects) {
                this.cameras.push(gameObject.getComponent(Camera)!);
            }
        }
        /**
         * 更新灯光。
         */
        public updateLights(gameObjects: ReadonlyArray<paper.GameObject>) {
            this.lightDirty = true;
            this.lights.length = 0;

            for (const gameObject of gameObjects) {
                this.lights.push(gameObject.getComponent(BaseLight as any, true) as BaseLight);
            }
        }
        /**
         * 排序相机。
         */
        public sortCameras() {
            this.cameras.sort(this._sortCameras);
        }
        /**
         * 相机计数。
         */
        @paper.editor.property(paper.editor.EditType.UINT, { readonly: true })
        public get cameraCount(): uint {
            return this.cameras.length;
        }
        /**
         * 灯光计数。
         */
        @paper.editor.property(paper.editor.EditType.UINT, { readonly: true })
        public get lightCount(): uint {
            return this.lights.length;
        }
    }
}