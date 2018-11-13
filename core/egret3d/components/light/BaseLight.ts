namespace egret3d {
    /**
     * 灯光组件。
     */
    export abstract class BaseLight extends paper.BaseComponent {
        /**
         * TODO
         */
        @paper.serializedField
        public cullingMask: paper.CullingMask = paper.CullingMask.Everything;
        /**
         * 该灯光的强度。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public intensity: number = 1.0;
        /**
         * 该灯光的颜色。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly color: Color = Color.create(1.0, 1.0, 1.0, 1.0);
        /**
         * 该灯光是否投射阴影。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public castShadows: boolean = false;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NESTED)
        public readonly shadow: LightShadow = LightShadow.create();

        // protected _updateShadowMatrix(camera: Camera) {
        //     // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
        //     const matrix = this.shadowMatrix;
        //     matrix.set(
        //         0.5, 0.0, 0.0, 0.5,
        //         0.0, 0.5, 0.0, 0.5,
        //         0.0, 0.0, 0.5, 0.5,
        //         0.0, 0.0, 0.0, 1.0
        //     );

        //     const context = camera.context;
        //     context.updateCameraTransform(camera, this.gameObject.transform.localToWorldMatrix);
        //     context.updateLightDepth(this);

        //     helpMatrixA.fromProjection(
        //         camera.fov, this.shadowCameraNear, this.shadowCameraFar,
        //         this.shadowSize, camera.opvalue,
        //         camera.aspect, stage.matchFactor
        //     );

        //     matrix.multiply(helpMatrixA).multiply(this.gameObject.transform.worldToLocalMatrix);
        // }
        // public updateShadow(camera: Camera) {
        // }
        // /**
        //  * @internal
        //  */
        // public updateFace(camera: Camera, faceIndex: number) {
        // }
    }
}