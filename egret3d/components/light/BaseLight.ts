namespace egret3d {
    /**
     * light component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 灯光组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export abstract class BaseLight extends paper.BaseComponent {
        /**
         * TODO
         */
        @paper.serializedField
        public cullingMask: paper.CullingMask = paper.CullingMask.Everything;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public intensity: number = 1.0;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly color: Color = Color.create(1.0, 1.0, 1.0, 1.0);
        /**
         * 
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

        public readonly viewPortPixel: IRectangle = { x: 0, y: 0, w: 0, h: 0 };
        public readonly matrix: Matrix4 = Matrix4.create();
        public renderTarget: BaseRenderTarget;

        protected _updateMatrix(camera: Camera) {
            // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
            const matrix = this.matrix;
            matrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            );

            const context = camera.context;
            context.updateCamera(camera, this.gameObject.transform.getWorldMatrix());
            context.updateLightDepth(this);
            matrix.multiply(context.matrix_p).multiply(context.matrix_v);
        }
        /**
         * @internal
         */
        public update(camera: Camera, faceIndex: number) {
            camera.backgroundColor.set(1.0, 1.0, 1.0, 1.0);
            camera.clearOption_Color = true;
            camera.clearOption_Depth = true;

            this._updateMatrix(camera);
        }
        /**
         * 
         */
        public get power() {
            return this.intensity * (Math.PI * 4.0);
        }
        public set power(value: number) {
            this.intensity = value / (Math.PI * 4.0);
        }
    }
}