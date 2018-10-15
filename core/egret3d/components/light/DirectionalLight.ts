namespace egret3d {
    /**
     * 平行光组件。
     */
    export class DirectionalLight extends BaseLight {
        public renderTarget: BaseRenderTarget;

        public updateShadow(camera: Camera) {
            camera.near = this.shadowCameraNear;
            camera.far = this.shadowCameraFar;
            camera.size = this.shadowCameraSize;
            camera.fov = Math.PI * 0.25;
            camera.opvalue = 0.0;
            if (!this.renderTarget) {
                this.renderTarget = new GlRenderTarget("DirectionalLight", this.shadowSize, this.shadowSize, true); // TODO
            }
            this.viewPortPixel.set(0, 0, this.shadowSize, this.shadowSize);
            this._updateMatrix(camera);
        }
    }
}