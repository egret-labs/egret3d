namespace egret3d {
    const helpRectA = new Rectangle();

    /**
     * camera component
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 相机组件
     * @version paper 1.0
     * @platform Web
     * @language
     */
    @paper.disallowMultiple
    export class Camera extends paper.BaseComponent {
        /**
         * current main camera
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 当前主相机。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public static get main() {
            const gameObject =
                paper.Application.sceneManager.activeScene.findWithTag(paper.DefaultTags.MainCamera) ||
                paper.GameObject.create(paper.DefaultNames.MainCamera, paper.DefaultTags.MainCamera);

            return gameObject.getOrAddComponent(Camera);
        }

        /**
         * clear color option
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否清除颜色缓冲区
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public clearOption_Color: boolean = true;

        /**
         * clear depth option
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 是否清除深度缓冲区
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public clearOption_Depth: boolean = true;

        /**
         * culling mask
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机的渲染剔除，对应GameObject的层级
         * @default CullingMask.Everything
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public cullingMask: paper.CullingMask = paper.CullingMask.Everything;

        /**
         * camera render order
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机渲染排序
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public order: number = 0;

        /**
         * fov
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 透视投影的fov
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public fov: number = Math.PI * 0.25;

        /**
         * size
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 正交投影的竖向size
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public size: number = 2.0;

        /**
         * op value
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 0=正交， 1=透视 中间值可以在两种相机间过度
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public opvalue: number = 1.0;

        /**
         * back ground color
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 背景色
         * @version paper 1.0
         * @platform Web
         * @language
         */
        @paper.serializedField
        public readonly backgroundColor: Color = new Color(0.13, 0.28, 0.51, 1);

        /**
         * camera viewport
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机视窗
         * @version paper 1.0
         * @platform Web
         * @language
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
         * render target
         * @defualt null
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 渲染目标，如果为null，则为画布
         * @defualt null
         * @version paper 1.0
         * @platform Web
         * @language
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
         * 设置render target与viewport
         * @param target render target
         * @param withoutClear 强制不清除缓存
         * 
         */
        public _targetAndViewport(target: IRenderTarget | null, withoutClear: boolean) {
            let w: number;
            let h: number;
            const webgl = WebGLCapabilities.webgl;

            if (!target) {
                w = stage.screenViewport.w;
                h = stage.screenViewport.h;
                GlRenderTarget.useNull(webgl);
            }
            else {
                w = target.width;
                h = target.height;
                target.use(webgl);
            }

            webgl.viewport(w * this.viewport.x, h * this.viewport.y, w * this.viewport.w, h * this.viewport.h);
            webgl.depthRange(0, 1);

            if (withoutClear) {
                return;
            }

            // clear buffer
            if (this.clearOption_Color && this.clearOption_Depth) {
                webgl.depthMask(true);
                // webgl.depthMask(true);
                webgl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);
                webgl.clearDepth(1.0);
                webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
            }
            else if (this.clearOption_Depth) {
                webgl.depthMask(true);
                // webgl.depthMask(true);
                webgl.clearDepth(1.0);
                webgl.clear(webgl.DEPTH_BUFFER_BIT);
            }
            else if (this.clearOption_Color) {
                webgl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);
                webgl.clear(webgl.COLOR_BUFFER_BIT);
            }
            else {

            }
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
         * calcViewPortPixel
         * @param viewPortPixel output rect
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算相机视口像素rect
         * @param viewPortPixel 输出的rect
         * @version paper 1.0
         * @platform Web
         * @language
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
         * createRayByScreen
         * @param screenpos screen coords
         * @param app application
         * @return Ray ray
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由屏幕坐标发射射线
         * @param screenpos 屏幕坐标
         * @param app 主程序实例
         * @return Ray 射线
         * @version paper 1.0
         * @platform Web
         * @language
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
         * calcWorldPosFromScreenPos
         * @param app application
         * @param screenpos screen coords
         * @param outWorldPos world coords
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由屏幕坐标得到世界坐标
         * @param app 主程序
         * @param screenpos 屏幕坐标
         * @param outWorldPos 世界坐标
         * @version paper 1.0
         * @platform Web
         * @language
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
         * calcScreenPosFromWorldPos
         * @param app application
         * @param worldPos world coords
         * @param outScreenPos screen coords
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 由世界坐标得到屏幕坐标
         * @param app 主程序
         * @param worldPos 世界坐标
         * @param outScreenPos 屏幕坐标
         * @version paper 1.0
         * @platform Web
         * @language
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

        /**
         * 
         */
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
         * distance between camera and near plane
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机到近裁剪面距离
         * @version paper 1.0
         * @platform Web
         * @language
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
         * distance between camera and far plane
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 相机到远裁剪面距离
         * @version paper 1.0
         * @platform Web
         * @language
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
