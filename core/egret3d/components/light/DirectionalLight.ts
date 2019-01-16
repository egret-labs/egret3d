namespace egret3d {
    /**
     * 平行光组件。
     */
    export class DirectionalLight extends BaseLight {

        public initialize() {
            super.initialize();

            this.shadow.update = this._updateShadow.bind(this);
        }

        private _updateShadow() {
            const shadow = this.shadow;
            const shadowMatrix = shadow.matrix;
            const shadowCamera = shadow.camera;
            const transform = this.gameObject.transform;
            const shadowSize = Math.min(shadow.size, renderState.maxTextureSize);
            if (!shadow.renderTarget) {
                shadow.renderTarget = RenderTexture.create({ width: shadowSize, height: shadowSize });
            }
            //
            shadowCamera.viewport.set(0, 0, shadowSize, shadowSize);
            shadowCamera.transform.position.copy(transform.position).update();
            shadowCamera.transform.rotation.copy(transform.rotation).update();
            shadowCamera.projectionMatrix = egret3d.Matrix4.create().fromProjection(0.0, shadow.near, shadow.far, 30.0, 0.0, 1.0, stage.matchFactor).release();
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
    }
}