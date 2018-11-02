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
        public decay: number = 2.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public distance: number = 0.0;
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

        public renderTarget: BaseRenderTarget;

        public updateShadow(camera: Camera) {
            if (!this.renderTarget) {
                this.renderTarget = new GlRenderTarget("SpotLight", this.shadowSize, this.shadowSize); //
            }
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.fov = this.angle;
            camera.opvalue = 1.0;
            camera.renderTarget = this.renderTarget;
            camera.gameObject.transform.localToWorldMatrix.copy(this.gameObject.transform.localToWorldMatrix); //

            this.viewPortPixel.set(0, 0, this.shadowSize, this.shadowSize);
            this._updateShadowMatrix(camera);
        }
    }
}