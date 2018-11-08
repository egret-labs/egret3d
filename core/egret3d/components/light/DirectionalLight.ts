namespace egret3d {
    /**
     * 平行光组件。
     */
    export class DirectionalLight extends BaseLight {

        public initialize() {
            super.initialize();

            // this.shadow.renderTarget = new GlRenderTarget("DirectionalLightShadow", this.shadow.size, this.shadow.size, true); // TODO
            // this.shadow.update = this._updateShadow;
        }

        private _updateShadow(light: DirectionalLight, shadow: LightShadow) {
            // shadow.camera.opvalue = 0.0; // Orthographic camera.
            // shadow.camera.renderTarget = shadow.renderTarget;
            // // shadow.viewPortPixel.set(0, 0, this.shadowSize, this.shadowSize);

            // this._updateShadowMatrix(camera);
        }
    }
}