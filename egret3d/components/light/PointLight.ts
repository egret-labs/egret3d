namespace egret3d {
    const _targets = [
        new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0),
        new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)
    ];
    const _ups = [
        new Vector3(0, -1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1),
        new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(0, -1, 0)
    ];
    /**
     * 
     */
    export class PointLight extends BaseLight {
        public readonly type: LightType = LightType.Point;

        public constructor() {
            super();

            this.renderTarget = new GlRenderTargetCube(WebGLCapabilities.webgl, 1024, 1024, true); // TODO
        }

        public update(camera: Camera, faceIndex: number) {
            const position = this.gameObject.transform.getPosition();
            helpVector3A.set(
                position.x + _targets[faceIndex].x,
                position.y + _targets[faceIndex].y,
                position.z + _targets[faceIndex].z,
            );

            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowSize;
            camera.fov = Math.PI * 0.5;
            camera.gameObject.transform.setPosition(position); // TODO support copy matrix.
            camera.gameObject.transform.setRotation(this.gameObject.transform.getRotation());
            camera.gameObject.transform.lookAt(helpVector3A, _ups[faceIndex]);

            super.update(camera, faceIndex);
        }
    }
}