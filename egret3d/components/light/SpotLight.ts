namespace egret3d {
    /**
     * 
     */
    export class SpotLight extends BaseLight {
        public readonly type: LightType = LightType.Spot;

        public update(camera: Camera, faceIndex: number) {
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowSize;
            camera.fov = this.angle; //
            camera.gameObject.transform.getWorldMatrix().copy(this.gameObject.transform.getWorldMatrix()); //

            super.update(camera, faceIndex);
        }
    }
}