namespace egret3d {
    /**
     * 
     */
    export class DirectLight extends BaseLight {
        public readonly type: LightType = LightType.Direction;

        public constructor() {
            super();

            this.renderTarget = new GlRenderTarget(WebGLKit.webgl, 1024, 1024, true); // TODO
        }

        public update(camera: Camera, faceIndex: number) {
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowSize;
            camera.fov = Math.PI * 0.25; //
            camera.gameObject.transform.getWorldMatrix().copy(this.gameObject.transform.getWorldMatrix()); //

            super.update(camera, faceIndex);
        }
    }
}