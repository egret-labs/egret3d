namespace egret3d {

    let helpMat4_1:Matrix = new Matrix();
    let helpMat4_2:Matrix = new Matrix();

    export class DirectLightShadow implements ILightShadow {
        public renderTarget: GlRenderTarget;
        public map: WebGLTexture;
        public bias:number = 0.0003;
	    public radius:number = 2;
        public matrix: Matrix;
        public windowSize:number = 16;

        public camera: Camera;

        constructor() {
            this.renderTarget = new GlRenderTarget(WebGLKit.webgl, 1024, 1024, true);
            this.map = this.renderTarget.texture;
            this.matrix = new Matrix();
            this.camera = new Camera(); // TODO 不要这样
            this.camera.opvalue = 0; 
            this.camera.backgroundColor.r = 1.0;
            this.camera.backgroundColor.g = 1.0;
            this.camera.backgroundColor.b = 1.0;
            this.camera.backgroundColor.a = 1.0;
            this.camera.clearOption_Color = true;
            this.camera.clearOption_Depth = true;
            this.camera.near = 0.1;
            this.camera.far = 1000;
            this.camera.renderTarget = this.renderTarget;
            this.camera.initialize();
        }

        public update(light:Light):void {
            this.bias = light.shadowBias;
            this.radius = light.shadowRadius;
            this.windowSize = light.shadowSize;
            this._updateCamera(light);
            this._updateMatrix();
        }

        private _updateCamera(light:Light):void {
            (this.camera as any).gameObject = light.gameObject; // for calcViewMatrix // TODO 不要这样
            this.camera.near = light.shadowCameraNear;
            this.camera.far = light.shadowCameraFar;

            this.camera.size = this.windowSize;
        }

        private _updateMatrix():void {
            var matrix = this.matrix;
            var camera = this.camera;

            // matrix * 0.5 + 0.5, after identity, range is 0 ~ 1 instead of -1 ~ 1
            Matrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            , matrix);
            
            let viewMatrix = camera.calcViewMatrix(helpMat4_1);
            let projectionMatrix = camera.calcProjectMatrix(512 / 512, helpMat4_2);

            Matrix.multiply(matrix, projectionMatrix, matrix);
            Matrix.multiply(matrix, viewMatrix, matrix);
        }
    }
}