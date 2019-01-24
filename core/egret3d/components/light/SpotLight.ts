namespace egret3d {
    /**
     * 聚光组件。
     */
    export class SpotLight extends BaseLight {
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
        /**
         * 该聚光灯产生的光锥夹角范围。（弧度制）
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01, maximum: Math.PI - 0.01 })
        public angle: number = Math.PI / 0.3;
        /**
         * 该聚光灯产生的光锥半影。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0 })
        public penumbra: number = 0.0;

        public initialize() {
            super.initialize();

            this.shadow._onUpdate = this._updateShadow.bind(this);
        }

        private _updateShadow() {
            const shadowCamera = cameraAndLightCollecter.shadowCamera;
            const shadow = this.shadow;
            const shadowMatrix = shadow._matrix;
            const transform = this.gameObject.transform;
            //
            shadowCamera.viewport.set(0.0, 0.0, 1, 1);
            shadowCamera.projectionMatrix = Matrix4.create().fromProjection(this.angle * 2.0, shadow.near, shadow.far, 0.0, 1.0, 1.0, 0.0).release();
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
