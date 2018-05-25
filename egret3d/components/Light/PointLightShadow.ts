namespace egret3d {

    let helpMat4_1:Matrix = new Matrix();
    let helpMat4_2:Matrix = new Matrix();

    let helpVec3_1:Vector3 = new Vector3();

    export class PointLightShadow implements ILightShadow {
        public renderTarget: GlRenderTargetCube;
        public map: WebGLTexture;
        public bias:number = 0.0003;
	    public radius:number = 2;
        public matrix: Matrix;
        public windowSize:number = 16;

        public camera: Camera;

        private _targets = [
            new Vector3(-1, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0),
            new Vector3(0, -1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, -1)
        ];

        private _ups = [
            new Vector3(0, -1, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1),
            new Vector3(0, 0, -1), new Vector3(0, -1, 0), new Vector3(0, -1, 0)
        ];

        constructor() {
            this.renderTarget = new GlRenderTargetCube(WebGLKit.webgl, 1024, 1024, true);
            this.map = this.renderTarget.texture;
            this.matrix = new Matrix();
            this.camera = new Camera(); // TODO 不要这样
            this.camera.opvalue = 1; 
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

        public update(light:Light, face:number):void {
            this.bias = light.shadowBias;
            this.radius = light.shadowRadius;
            this.windowSize = light.shadowSize;
            this._updateCamera(light, face);
            this._updateMatrix();
        }

        private _updateCamera(light:Light, face:number):void {
            (this.camera as any).gameObject = light.gameObject; // for calcViewMatrix // TODO 不要这样
            this.camera.near = light.shadowCameraNear;
            this.camera.far = light.shadowCameraFar;

            let pos = light.gameObject.transform.getPosition();
            let target = Vector3.set(
                pos.x + this._targets[face].x,
                pos.y + this._targets[face].y,
                pos.z + this._targets[face].z,
                helpVec3_1
            );

            this.camera.gameObject.transform.lookAt(target, this._ups[face]); // TODO copy a transform to protect light rotate

            this.camera.size = this.windowSize;
            this.camera.fov = Math.PI / 2;
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