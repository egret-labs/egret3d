namespace egret3d {
    /**
     * 聚光组件。
     */
    export class SpotLight extends BaseLight {
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
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT)
        public angle: number = Math.PI / 3.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01 })
        public penumbra: number = 1.0;

        public initialize() {
            super.initialize();

            this.shadow.update = this._updateShadow.bind(this);
        }

        private _updateShadow() {
            const shadow = this.shadow;
            const shadowMatrix = shadow.matrix;
            const shadowCamera = shadow.camera;
            const transform = this.gameObject.transform;
            if (!shadow.renderTarget) {
                const shadowSize = Math.min(shadow.size, renderState.maxTextureSize);
                shadow.renderTarget = RenderTexture.create(
                    {
                        width: shadowSize, height: shadowSize,
                        minFilter: gltf.TextureFilter.Nearest, magFilter: gltf.TextureFilter.Nearest,
                        format: gltf.TextureFormat.RGBA
                    }
                );
            }
            //
            shadowCamera.transform.position.copy(transform.position).update();
            shadowCamera.transform.lookAt(Vector3.ZERO);

            shadowCamera.projectionMatrix = egret3d.Matrix4.create().fromProjection(this.angle * 2.0, shadow.near, shadow.far, 0.0, 1.0, 1.0, stage.matchFactor).release();
            // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
            shadowMatrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            );

            shadowMatrix.multiply(shadowCamera.projectionMatrix);
            shadowMatrix.multiply(shadowCamera.worldToCameraMatrix);
        }

        // public updateShadow(camera: Camera) {
            // if (!this.renderTarget) {
            //     this.renderTarget = new GlRenderTarget("SpotLight", this.shadowSize, this.shadowSize); //
            // }

            // camera.fov = this.angle;
            // camera.opvalue = 1.0;
            // camera.renderTarget = this.renderTarget;
            // camera.gameObject.transform.localToWorldMatrix.copy(this.gameObject.transform.localToWorldMatrix); //

            // this.viewPortPixel.set(0, 0, this.shadowSize, this.shadowSize);
            // this._updateShadowMatrix(camera,);
        // }
    }
}