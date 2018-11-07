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
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public shadowRadius: number = 0.5;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01 })
        public shadowBias: number = 0.01;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.UINT)
        public shadowSize: number = 512;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public shadowCameraNear: number = 1.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public shadowCameraFar: number = 100.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public shadowCameraSize: number = 30;

        public readonly viewPortPixel: Rectangle = Rectangle.create();
        /**
         * @internal
         */
        public readonly shadowMatrix: Matrix4 = Matrix4.create();
        public renderTarget: BaseRenderTarget;

        protected _updateShadowMatrix(camera: Camera) {
            // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
            const matrix = this.shadowMatrix;
            matrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            );

            const context = camera.context;
            context.updateCamera(camera, this.gameObject.transform.localToWorldMatrix);
            context.updateLightDepth(this);
            matrix.multiply(context.matrix_p).multiply(context.matrix_v);
        }
        public updateShadow(camera: Camera) {
        }
        /**
         * @internal
         */
        public updateFace(camera: Camera, faceIndex: number) {
        }
    }
}