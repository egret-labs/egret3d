namespace egret3d {
    /**
     * 平行光组件。
     */
    export class DirectionalLight extends BaseLight {
        public renderTarget: BaseRenderTarget = new GlRenderTarget("DirectionalLight", 1024, 1024, true); // TODO

        public update(camera: Camera, faceIndex: number) {
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowCameraSize;
            camera.fov = Math.PI * 0.25;
            camera.opvalue = 0.0;
            this.viewPortPixel.copy(camera.viewport);
            super.update(camera, faceIndex);
        }
    }
}