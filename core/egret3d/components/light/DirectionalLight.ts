namespace egret3d {
    /**
     * 平行光组件。
     */
    export class DirectionalLight extends BaseLight {

        public initialize() {
            super.initialize();

            this.shadow._onUpdate = this._updateShadow.bind(this);
        }

        private _updateShadow() {
            const shadowCamera = cameraAndLightCollecter.shadowCamera;
            const shadow = this.shadow;
            const shadowMatrix = shadow._matrix;
            const mapSize = shadow.mapSize;
            const transform = this.gameObject.transform;
            //
            shadowCamera.viewport.set(0.0, 0.0, mapSize, mapSize).update();
            shadowCamera.projectionMatrix = egret3d.Matrix4.create().fromProjection(0.0, shadow.near, shadow.far, shadow.size, 0.0, 1.0, 0.0).release();
            shadowCamera.transform
                .setLocalPosition(transform.position)
                .setLocalRotation(transform.rotation); // TODO
            // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
            shadowMatrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            ).multiply(shadowCamera.projectionMatrix).multiply(shadowCamera.worldToCameraMatrix);
        }
    }
}
