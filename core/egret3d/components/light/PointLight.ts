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

    const _pointLightFov = Math.PI * 0.5;
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
                shadow.renderTarget = RenderTexture.create({ width: shadowSize * 4.0, height: shadowSize * 2.0 });
            }

            const lightPosition = transform.position;
            shadowCamera.transform.position.copy(lightPosition).update();
            shadowCamera.transform.lookAt(lightPosition.clone().add(_targets[face]).release(), _ups[face]);
            shadowCamera.viewport.copy(_viewPortsScale[face]).multiplyScalar(shadowSize);
            shadowCamera.projectionMatrix = egret3d.Matrix4.create().fromProjection(_pointLightFov, shadow.near, shadow.far, 0.0, 1.0, 1.0, stage.matchFactor).release();

            shadowMatrix.fromTranslate(lightPosition.clone().multiplyScalar(-1).release());
        }
    }
}