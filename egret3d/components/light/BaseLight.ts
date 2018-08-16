namespace egret3d {
    /**
     * Light Type Enum
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 灯光类型的枚举。
     * @version paper 1.0
     * @platform Web
     * @language
     */
    export const enum LightType {
        /**
         * direction light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 直射光
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Direction = 1,
        /**
         * point light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 点光源
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Point = 2,
        /**
         * point light
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 聚光灯
         * @version paper 1.0
         * @platform Web
         * @language
         */
        Spot = 3,
    }
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
         * 
         */
        public readonly type: LightType;
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
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public intensity: number = 2;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public distance: number = 50;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public decay: number = 2;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public angle: number = Math.PI / 6;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public penumbra: number = 0;
        /**
         * spot angel cos
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 聚光灯的开合角度cos值
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public spotAngelCos: number = 0.9;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowBias: number = 0.0003;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowRadius: number = 2;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowSize: number = 16;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowCameraNear: number = 0.1;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.NUMBER)
        public shadowCameraFar: number = 200;
        /**
         * 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly color: Color = new Color(1.0, 1.0, 1.0, 1.0);
        public readonly matrix: Matrix = new Matrix();
        public renderTarget: IRenderTarget;

        protected _updateMatrix(camera: Camera) {
            // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
            const matrix = this.matrix;
            matrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            );

            camera.calcProjectMatrix(512 / 512, helpMatrixA);
            // camera.context.matrix_p;
            helpMatrixB.copy(this.gameObject.transform.getWorldMatrix()).inverse();
            Matrix.multiply(matrix, helpMatrixA, matrix);
            Matrix.multiply(matrix, helpMatrixB, matrix);

            // let viewMatrix = camera.calcViewMatrix(helpMatrixA);
            // let projectionMatrix = camera.calcProjectMatrix(512 / 512, helpMatrixB);
            // Matrix.multiply(matrix, projectionMatrix, matrix);
            // Matrix.multiply(matrix, viewMatrix, matrix);
        }
        /**
         * @internal
         */
        public update(camera: Camera, faceIndex: number) {
            camera.opvalue = 1.0;
            camera.backgroundColor.set(1.0, 1.0, 1.0, 1.0);
            camera.clearOption_Color = true;
            camera.clearOption_Depth = true;

            this._updateMatrix(camera);
        }
    }
}