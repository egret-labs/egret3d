namespace egret3d {
    /**
     * 
     */
    export class DirectionalLight extends BaseLight {
        public renderTarget: IRenderTarget = new GlRenderTarget(1024, 1024, true); // TODO

        public update(camera: Camera, faceIndex: number) {
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowCameraSize;
            camera.fov = Math.PI * 0.25;
            camera.opvalue = 0.0;
            // camera.gameObject.transform.getWorldMatrix().copy(this.gameObject.transform.getWorldMatrix()); //

            super.update(camera, faceIndex);
        }
    }
}