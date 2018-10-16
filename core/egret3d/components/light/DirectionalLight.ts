namespace egret3d {
    /**
     * 平行光组件。
     */
    export class DirectionalLight extends BaseLight {
        public renderTarget: BaseRenderTarget;

        public updateShadow(camera: Camera) {
            if (!this.renderTarget) {
                this.renderTarget = new GlRenderTarget("DirectionalLight", this.shadowSize, this.shadowSize, true); // TODO
            }
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowCameraSize;
            camera.fov = Math.PI * 0.25;
            camera.opvalue = 0.0;
            camera.renderTarget = this.renderTarget;
            this.viewPortPixel.set(0, 0, this.shadowSize, this.shadowSize);
            this._updateShadowMatrix(camera);
        }
    }
}