namespace egret3d {
    const helpRectA = new Rectangle();


    /**
     * 相机组件
     */
    @paper.disallowMultiple
    export class Camera extends paper.BaseComponent {

        /**
         * 当前主相机。
         */
        public static get main() {
            const gameObject =
                paper.Application.sceneManager.activeScene.findWithTag(paper.DefaultTags.MainCamera) ||
                paper.GameObject.create(paper.DefaultNames.MainCamera, paper.DefaultTags.MainCamera);

            return gameObject.getOrAddComponent(Camera);
        }


        /**
         * 是否清除颜色缓冲区
         */
        @paper.serializedField
        public clearOption_Color: boolean = true;

        /**
         * 是否清除深度缓冲区
         */
        @paper.serializedField
        public clearOption_Depth: boolean = true;

        /**
         * 相机的渲染剔除，对应GameObject的层级
         */
        @paper.serializedField
        public cullingMask: paper.CullingMask = paper.CullingMask.Everything;


        /**
         * 相机渲染排序
         */
        @paper.serializedField
        public order: number = 0;


        /**
         * 透视投影的fov
         */
        @paper.serializedField
        public fov: number = Math.PI * 0.25;


        /**
         * 正交投影的竖向size
         */
        @paper.serializedField
        public size: number = 2.0;


        /**
         * 0=正交， 1=透视 中间值可以在两种相机间过度
         */
        @paper.serializedField
        public opvalue: number = 1.0;


        /**
         * 背景色
         */
        @paper.serializedField
        public readonly backgroundColor: Color = new Color(0.13, 0.28, 0.51, 1);


        /**
         * 相机视窗
         */
        @paper.serializedField
        public readonly viewport: Rectangle = new Rectangle(0, 0, 1, 1);

        /**
         * TODO 功能完善后开放此接口
         */
        public readonly postQueues: ICameraPostQueue[] = [];

        /**
         * 相机渲染上下文
         */
        public context: RenderContext = null as any;


        /**
         * 渲染目标，如果为null，则为画布
         */
        public renderTarget: IRenderTarget | null = null;

        @paper.serializedField
        private _near: number = 0.01;

        @paper.serializedField
        private _far: number = 1000;

        private readonly matProjP: Matrix = new Matrix;
        private readonly matProjO: Matrix = new Matrix;
        private readonly frameVecs: Vector3[] = [
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3()
        ];

        /**
         * 计算相机视锥区域
         */
        private calcCameraFrame() {
            const vpp = helpRectA;
            this.calcViewPortPixel(vpp);

            const farLD = this.frameVecs[0];
            const nearLD = this.frameVecs[1];
            const farRD = this.frameVecs[2];
            const nearRD = this.frameVecs[3];
            const farLT = this.frameVecs[4];
            const nearLT = this.frameVecs[5];
            const farRT = this.frameVecs[6];
            const nearRT = this.frameVecs[7];

            const near_h = this.near * Math.tan(this.fov * 0.5);
            const asp = vpp.w / vpp.h;
            const near_w = near_h * asp;

            Vector3.set(-near_w, near_h, this.near, nearLT);
            Vector3.set(-near_w, -near_h, this.near, nearLD);
            Vector3.set(near_w, near_h, this.near, nearRT);
            Vector3.set(near_w, -near_h, this.near, nearRD);

            const far_h = this.far * Math.tan(this.fov * 0.5);
            const far_w = far_h * asp;

            Vector3.set(-far_w, far_h, this.far, farLT);
            Vector3.set(-far_w, -far_h, this.far, farLD);
            Vector3.set(far_w, far_h, this.far, farRT);
            Vector3.set(far_w, -far_h, this.far, farRD);

            const matrix = this.gameObject.transform.getWorldMatrix();
            Matrix.transformVector3(farLD, matrix, farLD);
            Matrix.transformVector3(nearLD, matrix, nearLD);
            Matrix.transformVector3(farRD, matrix, farRD);
            Matrix.transformVector3(nearRD, matrix, nearRD);
            Matrix.transformVector3(farLT, matrix, farLT);
            Matrix.transformVector3(nearLT, matrix, nearLT);
            Matrix.transformVector3(farRT, matrix, farRT);
            Matrix.transformVector3(nearRT, matrix, nearRT);
        }
        /**
         * @inheritDoc
         */
        public initialize() {
            super.initialize();

            this.context = new RenderContext();
            this.near = this._near;
            this.far = this._far;
        }
        /**
         * 
         */
        public update(_delta: number) {
            this.calcCameraFrame();

            this.context.updateCamera(this, this.gameObject.transform.getWorldMatrix());
        }

        /**
         * 计算相机的 view matrix（视图矩阵）
         */
        public calcViewMatrix(matrix: Matrix): Matrix {
            matrix.copy(this.gameObject.transform.getWorldMatrix()).inverse();

            return matrix;
        }

        /**
         * 计算相机的 project matrix（投影矩阵）
         */
        public calcProjectMatrix(asp: number, matrix: Matrix): Matrix {
            if (this.opvalue > 0) {
                Matrix.perspectiveProjectLH(this.fov, asp, this.near, this.far, this.matProjP);
            }

            if (this.opvalue < 1) {
                Matrix.orthoProjectLH(this.size * asp, this.size, this.near, this.far, this.matProjO);
            }

            if (this.opvalue === 0.0) {
                Matrix.copy(this.matProjO, matrix);
            }
            else if (this.opvalue === 1.0) {
                Matrix.copy(this.matProjP, matrix);
            }
            else {
                Matrix.lerp(this.matProjO, this.matProjP, this.opvalue, matrix);
            }

            return matrix;
        }


        /**
         * 计算相机视口像素rect
         */
        public calcViewPortPixel(viewPortPixel: IRectangle) {
            let w: number;
            let h: number;
            const renderTarget = this.renderTarget;
            const viewport = this.viewport;

            if (renderTarget) {
                w = renderTarget.width;
                h = renderTarget.height;
            }
            else {
                w = stage.screenViewport.w;
                h = stage.screenViewport.h;
            }

            viewPortPixel.x = w * viewport.x;
            viewPortPixel.y = h * viewport.y;
            viewPortPixel.w = w * viewport.w;
            viewPortPixel.h = h * viewport.h;
            //asp = this.viewPortPixel.w / this.viewPortPixel.h;
        }


        /**
         * 由屏幕坐标发射射线
         */
        public createRayByScreen(screenPosX: number, screenPosY: number): Ray {
            const src1 = helpVector3C;
            src1.x = screenPosX;
            src1.y = screenPosY;
            src1.z = 0.0;

            const src2 = helpVector3D;
            src2.x = screenPosX;
            src2.y = screenPosY;
            src2.z = 1.0;

            const dest1 = helpVector3E;
            const dest2 = helpVector3F;
            this.calcWorldPosFromScreenPos(src1, dest1);
            this.calcWorldPosFromScreenPos(src2, dest2);

            const dir = helpVector3G;
            Vector3.subtract(dest2, dest1, dir);
            Vector3.normalize(dir);
            const ray = new Ray(dest1, dir);

            return ray;
        }


        /**
         * 由屏幕坐标得到世界坐标
         */
        public calcWorldPosFromScreenPos(screenPos: Vector3, outWorldPos: Vector3) {
            const vpp = helpRectA;
            this.calcViewPortPixel(vpp);

            const vppos = helpVector3A;
            vppos.x = screenPos.x / vpp.w * 2.0 - 1.0;
            vppos.y = 1.0 - screenPos.y / vpp.h * 2.0;
            vppos.z = screenPos.z;

            const matrixView = helpMatrixA;
            const matrixProject = helpMatrixB;
            const asp = vpp.w / vpp.h;
            this.calcViewMatrix(matrixView);
            this.calcProjectMatrix(asp, matrixProject);

            const matrixViewProject = helpMatrixC;
            const matinv = helpMatrixD;
            Matrix.multiply(matrixProject, matrixView, matrixViewProject);
            Matrix.inverse(matrixViewProject, matinv);
            Matrix.transformVector3(vppos, matinv, outWorldPos);
        }


        /**
         * 由世界坐标得到屏幕坐标
         */
        public calcScreenPosFromWorldPos(worldPos: Vector3, outScreenPos: Vector2) {
            const vpp = helpRectA;
            this.calcViewPortPixel(vpp);

            const matrixView = helpMatrixA;
            const matrixProject = helpMatrixB;
            const asp = vpp.w / vpp.h;
            this.calcViewMatrix(matrixView);
            this.calcProjectMatrix(asp, matrixProject);

            const matrixViewProject = helpMatrixC;
            Matrix.multiply(matrixProject, matrixView, matrixViewProject);

            const ndcPos = helpVector3A;
            Matrix.transformVector3(worldPos, matrixViewProject, ndcPos);
            outScreenPos.x = (ndcPos.x + 1.0) * vpp.w * 0.5;
            outScreenPos.y = (1.0 - ndcPos.y) * vpp.h * 0.5;
        }

        public getPosAtXPanelInViewCoordinateByScreenPos(screenPos: Vector2, z: number, out: Vector2) {
            const vpp = helpRectA;
            this.calcViewPortPixel(vpp);

            const nearpos = helpVector3A;
            nearpos.z = -this.near;
            nearpos.x = screenPos.x - vpp.w * 0.5;
            nearpos.y = vpp.h * 0.5 - screenPos.y;

            const farpos = helpVector3B;
            farpos.z = -this.far;
            farpos.x = this.far * nearpos.x / this.near;
            farpos.y = this.far * nearpos.y / this.near;

            const rate = (nearpos.z - z) / (nearpos.z - farpos.z);
            out.x = nearpos.x - (nearpos.x - farpos.x) * rate;
            out.y = nearpos.y - (nearpos.y - farpos.y) * rate;
        }

        public testFrustumCulling(node: Transform) {
            const aabb = node.aabb;
            if (!aabb.intersectPlane(this.frameVecs[0], this.frameVecs[1], this.frameVecs[5])) return false;
            if (!aabb.intersectPlane(this.frameVecs[1], this.frameVecs[3], this.frameVecs[7])) return false;
            if (!aabb.intersectPlane(this.frameVecs[3], this.frameVecs[2], this.frameVecs[6])) return false;
            if (!aabb.intersectPlane(this.frameVecs[2], this.frameVecs[0], this.frameVecs[4])) return false;
            if (!aabb.intersectPlane(this.frameVecs[5], this.frameVecs[7], this.frameVecs[6])) return false;
            if (!aabb.intersectPlane(this.frameVecs[0], this.frameVecs[2], this.frameVecs[3])) return false;

            return true;
        }

        /**
         * 相机到近裁剪面距离
         */
        public get near(): number {
            return this._near;
        }
        public set near(value: number) {
            if (value >= this.far) {
                value = this.far - 1.0;
            }

            if (value < 0.01) {
                value = 0.01;
            }

            this._near = value;
        }

        /**
         * 相机到远裁剪面距离
         */
        public get far(): number {
            return this._far;
        }
        public set far(value: number) {
            if (value <= this.near) {
                value = this.near + 1.0;
            }

            if (value >= 1000.0) {
                value = 1000.0;
            }

            this._far = value;
        }
    }
}
