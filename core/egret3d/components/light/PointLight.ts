namespace egret3d {
    const _targets = [
        Vector3.RIGHT, Vector3.LEFT,
        Vector3.FORWARD, Vector3.BACK,
        Vector3.UP, Vector3.DOWN,
    ];
    const _ups = [
        Vector3.UP, Vector3.UP,
        Vector3.UP, Vector3.UP,
        Vector3.FORWARD, Vector3.BACK,
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
         * 该灯光组件光照强度线性衰减的速度。
         * - 0 不衰减。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public decay: number = 1.0;
        /**
         * 该灯光组件光照强度线性衰减的距离。
         * - 0 不衰减。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public distance: number = 0.0;

        public initialize() {
            super.initialize();

            this.shadow._onUpdate = this._updateShadow.bind(this);
        }

        private _updateShadow(face: uint) {
            const shadowCamera = cameraAndLightCollecter.shadowCamera;
            const shadow = this.shadow;
            const shadowMatrix = shadow._matrix;
            const mapSize = shadow.mapSize;
            const lightPosition = this.gameObject.transform.position;
            //
            shadowCamera.viewport.copy(_viewPortsScale[face]).multiplyScalar(mapSize).update();
            shadowCamera.projectionMatrix = egret3d.Matrix4.create().fromProjection(Const.PI_HALF, shadow.near, shadow.far, 0.0, 1.0, 1.0, 0.0).release();
            shadowCamera.transform
                .setLocalPosition(lightPosition)
                .lookAt(lightPosition.clone().add(_targets[face]).release(), _ups[face]);
            //
            shadowMatrix.fromTranslate(lightPosition.clone().multiplyScalar(-1.0).release());
        }
    }
}