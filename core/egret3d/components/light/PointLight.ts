namespace egret3d {
    const _targets = [
        new Vector3(1, 0, 0), new Vector3(- 1, 0, 0), new Vector3(0, 0, 1),
        new Vector3(0, 0, - 1), new Vector3(0, 1, 0), new Vector3(0, - 1, 0)
    ];
    const _ups = [
        new Vector3(0, 1, 0), new Vector3(0, 1, 0), new Vector3(0, 1, 0),
        new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, - 1)
    ];
    //  xzXZ
    //   y Y
    //
    // X - Positive x direction
    // x - Negative x direction
    // Y - Positive y direction
    // y - Negative y direction
    // Z - Positive z direction
    // z - Negative z direction
    const _viewPortsScale = [
        new Rectangle(2, 1, 1, 1), new Rectangle(0, 1, 1, 1), new Rectangle(3, 1, 1, 1),
        new Rectangle(1, 1, 1, 1), new Rectangle(3, 0, 1, 1), new Rectangle(1, 0, 1, 1)
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
        public decay: number = 1.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public distance: number = 100.0;

        public renderTarget: RenderTexture;

        public initialize() {
            super.initialize();

            this.shadow.update = this._updateShadow.bind(this);
        }

        private _updateShadow(face: number) {
            const shadow = this.shadow;
            const shadowMatrix = shadow.matrix;
            const shadowCamera = shadow.camera;
            const transform = this.gameObject.transform;
            const shadowSize = Math.min(shadow.size, renderState.maxTextureSize);
            if (!shadow.renderTarget) {
                shadow.renderTarget = RenderTexture.create(
                    {
                        width: shadowSize * 4.0, height: shadowSize * 2.0,
                        minFilter: gltf.TextureFilter.Nearest, magFilter: gltf.TextureFilter.Nearest,
                        format: gltf.TextureFormat.RGBA
                    }
                );
            }

            const lightPosition = transform.position;
            shadowCamera.transform.position.copy(lightPosition).update();
            shadowCamera.transform.lookAt(lightPosition.clone().add(_targets[face]).release(), _ups[face]);
            shadowCamera.viewport = _viewPortsScale[face].clone().multiplyScalar(shadowSize).release();
            shadowCamera.projectionMatrix = egret3d.Matrix4.create().fromProjection(Math.PI * 0.5, shadow.near, shadow.far, 0.0, 1.0, 1.0, stage.matchFactor).release();

            shadowMatrix.fromTranslate(lightPosition.clone().multiplyScalar(-1).release());
        }

        // public updateShadow(camera: Camera) {
        // if (!this.renderTarget) {
        //     this.renderTarget = new GlRenderTarget("PointLight", this.shadowSize * 4, this.shadowSize * 2); //   4x2  cube
        // }

        // camera.fov = Math.PI * 0.5;
        // camera.opvalue = 1.0;
        // camera.renderTarget = this.renderTarget;
        // const context = camera.context;
        // camera.calcProjectMatrix(1.0, context.matrix_p);
        // const shadowMatrix = this.shadowMatrix;
        // shadowMatrix.fromTranslate(this.gameObject.transform.position.clone().multiplyScalar(-1).release());
        // }

        // public updateFace(camera: Camera, faceIndex: number) {
        // TODO
        // const position = this.gameObject.transform.position.clone().release();
        // helpVector3A.set(
        //     position.x + _targets[faceIndex].x,
        //     position.y + _targets[faceIndex].y,
        //     position.z + _targets[faceIndex].z,
        // );
        // this.viewPortPixel.x = _viewPortsScale[faceIndex].x * this.shadowSize;
        // this.viewPortPixel.y = _viewPortsScale[faceIndex].y * this.shadowSize;
        // this.viewPortPixel.w = _viewPortsScale[faceIndex].z * this.shadowSize;
        // this.viewPortPixel.h = _viewPortsScale[faceIndex].w * this.shadowSize;

        // const cameraTransform = camera.gameObject.transform;
        // cameraTransform.setPosition(position); // TODO support copy matrix.
        // cameraTransform.lookAt(helpVector3A, _ups[faceIndex]);

        // // const temp = cameraTransform.getWorldMatrix().clone().release();
        // // temp.rawData[12] = -temp.rawData[12];//Left-hand
        // const context = camera.context;
        // context.matrix_v.copy(cameraTransform.worldToLocalMatrix);
        // context.matrix_vp.multiply(context.matrix_p, context.matrix_v);
        // context.updateLightDepth(this);
        // }
    }
}