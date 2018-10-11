namespace egret3d {
    const _targets = [
        new Vector3(1, 0, 0), new Vector3(- 1, 0, 0), new Vector3(0, 0, 1),
        new Vector3(0, 0, - 1), new Vector3(0, 1, 0), new Vector3(0, - 1, 0)
    ];
    const _ups = [
        new Vector3(0, 1, 0), new Vector3(0, 1, 0), new Vector3(0, 1, 0),
        new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, - 1)
    ];
    const _viewPortsScale = [
        new Vector4(2, 1, 1, 1), new Vector4(0, 1, 1, 1), new Vector4(3, 1, 1, 1),
        new Vector4(1, 1, 1, 1), new Vector4(3, 0, 1, 1), new Vector4(1, 0, 1, 1)
    ];
    /**
     * 点光组件。
     */
    export class PointLight extends BaseLight {
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public decay: number = 0.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public distance: number = 10.0;

        public renderTarget: BaseRenderTarget = new GlRenderTarget("PointLight", 512 * 4, 512 * 2, true); // TODO

        protected _updateMatrix(camera: Camera) {
            const matrix = this.shadowMatrix;
            matrix.fromTranslate(this.gameObject.transform.getPosition().clone().multiplyScalar(-1).release());

            const context = camera.context;
            const temp = this.gameObject.transform.getWorldMatrix().clone().release();
            temp.rawData[14] = -temp.rawData[14];//Left-hand
            context.updateCamera(camera, temp);
            context.updateLightDepth(this);
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
            camera.size = this.shadowCameraSize;
            camera.fov = Math.PI * 0.5;
            camera.opvalue = 1.0;
            camera.gameObject.transform.setPosition(position); // TODO support copy matrix.
            camera.gameObject.transform.lookAt(helpVector3A, _ups[faceIndex]);
            this.viewPortPixel.x = _viewPortsScale[faceIndex].x / 4;
            this.viewPortPixel.y = _viewPortsScale[faceIndex].y / 2;
            this.viewPortPixel.w = _viewPortsScale[faceIndex].z / 4;
            this.viewPortPixel.h = _viewPortsScale[faceIndex].w / 2;

            super.update(camera, faceIndex);
        }
    }
}