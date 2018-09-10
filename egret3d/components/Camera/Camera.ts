namespace egret3d {
    const helpRectA = new Rectangle();
    /**
     * 相机组件
     */
    export class Camera extends paper.BaseComponent {
        /**
         * 当前场景的主相机。
         * - 如果没有则创建一个。
         */
        public static get main() {
            let gameObject = paper.Application.sceneManager.activeScene.findWithTag(paper.DefaultTags.MainCamera);
            if (!gameObject) {
                gameObject = paper.GameObject.create(paper.DefaultNames.MainCamera, paper.DefaultTags.MainCamera);
                gameObject.transform.setLocalPosition(0.0, 10.0, -10.0);
                gameObject.transform.lookAt(Vector3.ZERO);
            }

            return gameObject.getOrAddComponent(Camera);
        }
        /**
         * 编辑相机。
         * - 如果没有则创建一个。
         */
        public static get editor() {
            let gameObject = paper.Application.sceneManager.editorScene.find(paper.DefaultNames.EditorCamera);
            if (!gameObject) {
                gameObject = paper.GameObject.create(paper.DefaultNames.EditorCamera, paper.DefaultTags.EditorOnly, paper.Application.sceneManager.editorScene);
                gameObject.transform.setLocalPosition(0.0, 10.0, -10.0);
                gameObject.transform.lookAt(Vector3.ZERO);

                const camera = gameObject.addComponent(Camera);
                camera.cullingMask &= ~paper.CullingMask.UI;
            }

            return gameObject.getOrAddComponent(Camera);
        }

        /**
         * 是否清除颜色缓冲区
         */
        @paper.serializedField
        @paper.editor.extraProperty(paper.editor.EditType.CHECKBOX)
        public clearOption_Color: boolean = false;
        /**
         * 是否清除深度缓冲区
         */
        @paper.serializedField
        @paper.editor.extraProperty(paper.editor.EditType.CHECKBOX)
        public clearOption_Depth: boolean = true;
        /**
         * 相机的渲染剔除，对应 GameObject 的层级。
         * - camera.cullingMask = paper.CullingMask.UI;
         * - camera.cullingMask |= paper.CullingMask.UI;
         * - camera.cullingMask &= ~paper.CullingMask.UI;
         */
        @paper.serializedField
        @paper.editor.extraProperty(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum(paper.CullingMask) })
        public cullingMask: paper.CullingMask = paper.CullingMask.Everything;
        /**
         * 相机渲染排序
         */
        @paper.serializedField
        @paper.editor.extraProperty(paper.editor.EditType.NUMBER)
        public order: number = 0;
        /**
         * 透视投影的fov
         */
        @paper.serializedField
        @paper.editor.extraProperty(paper.editor.EditType.NUMBER)
        public fov: number = Math.PI * 0.25;
        /**
         * 正交投影的竖向size
         */
        @paper.serializedField
        @paper.editor.extraProperty(paper.editor.EditType.NUMBER)
        public size: number = 2.0;
        /**
         * 0=正交，1=透视 中间值可以在两种相机间过度
         */
        @paper.serializedField
        public opvalue: number = 1.0;
        /**
         * 背景色
         */
        @paper.serializedField
        @paper.editor.extraProperty(paper.editor.EditType.COLOR)
        public readonly backgroundColor: Color = Color.create(0.13, 0.28, 0.51, 1);
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
         * @internal
         */
        public context: RenderContext = null as any;
        /**
         * 渲染目标，如果为null，则为画布
         */
        public renderTarget: BaseRenderTarget | null = null;

        @paper.serializedField
        private _near: number = 0.01;
        @paper.serializedField
        private _far: number = 1000;
        private readonly _matProjP: Matrix4 = Matrix4.create();
        private readonly _matProjO: Matrix4 = Matrix4.create();
        private readonly _frameVecs: Vector3[] = [
            Vector3.create(),
            Vector3.create(),
            Vector3.create(),
            Vector3.create(),
            Vector3.create(),
            Vector3.create(),
            Vector3.create(),
            Vector3.create()
        ];
        /**
         * 计算相机视锥区域
         */
        private _calcCameraFrame() {
            const vpp = helpRectA;
            this.calcViewPortPixel(vpp);

            const farLD = this._frameVecs[0];
            const nearLD = this._frameVecs[1];
            const farRD = this._frameVecs[2];
            const nearRD = this._frameVecs[3];
            const farLT = this._frameVecs[4];
            const nearLT = this._frameVecs[5];
            const farRT = this._frameVecs[6];
            const nearRT = this._frameVecs[7];

            const near_h = this.near * Math.tan(this.fov * 0.5);
            const asp = vpp.w / vpp.h;
            const near_w = near_h * asp;

            nearLT.set(-near_w, near_h, this.near);
            nearLD.set(-near_w, -near_h, this.near);
            nearRT.set(near_w, near_h, this.near);
            nearRD.set(near_w, -near_h, this.near);

            const far_h = this.far * Math.tan(this.fov * 0.5);
            const far_w = far_h * asp;

            farLT.set(-far_w, far_h, this.far);
            farLD.set(-far_w, -far_h, this.far);
            farRT.set(far_w, far_h, this.far);
            farRD.set(far_w, -far_h, this.far);

            const matrix = this.gameObject.transform.getWorldMatrix();
            matrix.transformVector3(farLD);
            matrix.transformVector3(nearLD);
            matrix.transformVector3(farRD);
            matrix.transformVector3(nearRD);
            matrix.transformVector3(farLT);
            matrix.transformVector3(nearLT);
            matrix.transformVector3(farRT);
            matrix.transformVector3(nearRT);
        }

        public initialize() {
            super.initialize();

            this.context = new RenderContext();
        }
        /**
         * 
         */
        public update(_delta: number) {
            this._calcCameraFrame();

            this.context.updateCamera(this, this.gameObject.transform.getWorldMatrix());
        }

        /**
         * 计算相机的 project matrix（投影矩阵）
         */
        public calcProjectMatrix(asp: number, matrix: Matrix4): Matrix4 {
            if (this.opvalue > 0) {
                Matrix4.perspectiveProjectLH(this.fov, asp, this.near, this.far, this._matProjP);
            }

            if (this.opvalue < 1) {
                Matrix4.orthoProjectLH(this.size * asp, this.size, this.near, this.far, this._matProjO);
            }

            if (this.opvalue === 0.0) {
                matrix.copy(this._matProjO);
            }
            else if (this.opvalue === 1.0) {
                matrix.copy(this._matProjP);
            }
            else {
                matrix.lerp(this.opvalue, this._matProjO, this._matProjP);
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
        public createRayByScreen(screenPosX: number, screenPosY: number, ray?: Ray): Ray {
            const from = egret3d.Vector3.create(screenPosX, screenPosY, 0.0);
            const to = egret3d.Vector3.create(screenPosX, screenPosY, 1.0);

            this.calcWorldPosFromScreenPos(from, from);
            this.calcWorldPosFromScreenPos(to, to);
            to.subtract(to, from).normalize();

            ray = ray || Ray.create();
            ray.set(from, to);

            from.release();
            to.release();

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

            matrixView.inverse(this.gameObject.transform.getWorldMatrix());
            this.calcProjectMatrix(asp, matrixProject);

            helpMatrixC.multiply(matrixProject, matrixView)
                .inverse()
                .transformVector3(vppos, outWorldPos);
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
            matrixView.inverse(this.gameObject.transform.getWorldMatrix());
            this.calcProjectMatrix(asp, matrixProject);

            const matrixViewProject = helpMatrixC.multiply(matrixProject, matrixView);
            const ndcPos = helpVector3A;
            matrixViewProject.transformVector3(worldPos, ndcPos);
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

        private _intersectPlane(boundingSphere: egret3d.Sphere, v0: Vector3, v1: Vector3, v2: Vector3) {
            let subV0 = helpVector3A;
            let subV1 = helpVector3B;
            let cross = helpVector3C;
            let hitPoint = helpVector3D;
            let distVec = helpVector3E;

            let center = boundingSphere.center;

            subV0.subtract(v1, v0);
            subV1.subtract(v2, v1);
            cross.cross(subV0, subV1);

            calPlaneLineIntersectPoint(cross, v0, cross, center, hitPoint);

            distVec.subtract(hitPoint, center);

            let val = distVec.dot(cross);

            if (val <= 0) {
                return true;
            }

            let dist = hitPoint.getDistance(center);

            if (dist < boundingSphere.radius) {
                return true;
            }

            return false;
        }

        public testFrustumCulling(node: paper.BaseRenderer) {
            const boundingSphere = node.boundingSphere;
            if (!this._intersectPlane(boundingSphere, this._frameVecs[0], this._frameVecs[1], this._frameVecs[5])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVecs[1], this._frameVecs[3], this._frameVecs[7])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVecs[3], this._frameVecs[2], this._frameVecs[6])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVecs[2], this._frameVecs[0], this._frameVecs[4])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVecs[5], this._frameVecs[7], this._frameVecs[6])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVecs[0], this._frameVecs[2], this._frameVecs[3])) return false;

            return true;
        }

        /**
         * 相机到近裁剪面距离
         */
        @paper.editor.extraProperty(paper.editor.EditType.NUMBER)
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
        @paper.editor.extraProperty(paper.editor.EditType.NUMBER)
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
