namespace egret3d {
    /**
     * // TODO
     * @internal
     */
    export const enum MatrixDirty {
        ALL = 0b111,
        ProjectionMatrix = 0b001,
        ClipToWorldMatrix = 0b010,
        WorldToClipMatrix = 0b100,
    }
    /**
     * 相机组件。
     */
    export class Camera extends paper.BaseComponent {
        /**
         * 在渲染阶段正在执行渲染的相机。
         */
        public static current: Camera | null = null;
        /**
         * 当前场景的主相机。
         * - 如果没有则创建一个。
         */
        public static get main() {
            const scene = paper.Application.sceneManager.activeScene;

            let gameObject = scene.findWithTag(paper.DefaultTags.MainCamera);
            if (!gameObject) { // TODO 兼容数据错误，在 2.0 移除
                gameObject = scene.findWithTag("Main Camera");
                if (gameObject) {
                    gameObject.tag = paper.DefaultTags.MainCamera;
                }
            }

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
                camera.cullingMask &= ~paper.CullingMask.UI; // TODO 更明确的 UI 编辑方案。
                camera.far = 10000.0;
            }

            return gameObject.getOrAddComponent(Camera);
        }

        /**
         * 该相机是否清除颜色缓冲区。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public clearOption_Color: boolean = true;

        /**
         * 该相机是否清除深度缓冲区。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public clearOption_Depth: boolean = true;

        /**
         * 该相机的渲染剔除掩码。
         * - 用来选择性的渲染部分实体。
         * - camera.cullingMask = paper.CullingMask.UI;
         * - camera.cullingMask |= paper.CullingMask.UI;
         * - camera.cullingMask &= ~paper.CullingMask.UI;
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((paper as any).CullingMask) }) // TODO
        public cullingMask: paper.CullingMask = paper.CullingMask.Everything;
        /**
         * 该相机渲染排序。
         * - 该值越低的相机优先绘制。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.INT)
        public order: number = 0;
        /**
         * 透视投影的视野。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01, maximum: Math.PI - 0.01, step: 0.01 })
        public fov: number = Math.PI * 0.25;
        /**
         * 控制该相机从正交到透视的过渡的系数，0：正交，1：透视，中间值则在两种状态间差值。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0, step: 0.01 })
        public opvalue: number = 1.0;
        /**
         * 正交投影的尺寸。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public size: number = 2.0;
        /**
         * 该相机的背景色。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly backgroundColor: Color = Color.create(0.15, 0.25, 0.5, 1.0);
        /**
         * 该相机归一化的渲染视口。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.RECT, { step: 0.01 })
        public readonly viewport: Rectangle = Rectangle.create(0.0, 0.0, 1.0, 1.0);
        /**
         * 相机渲染上下文
         * @private
         */
        public readonly context: CameraRenderContext = new CameraRenderContext(this);
        /**
         * TODO 功能完善后开放此接口
         */
        public readonly postQueues: ICameraPostProcessing[] = [];
        /**
         * 渲染目标，如果为null，则为画布
         */
        public renderTarget: BaseRenderTarget | null = null;

        private _viewPortDirty: boolean = false;
        /**
         * TODO transform 应拥有高性能的位置变更通知机制。
         */
        private _matrixDirty: MatrixDirty = MatrixDirty.ALL;

        @paper.serializedField
        private _near: number = 0.3;
        @paper.serializedField
        private _far: number = 1000.0;
        private readonly _pixelViewport: Rectangle = Rectangle.create(0.0, 0.0, 1.0, 1.0);
        private readonly _perspectiveMatrix: Matrix4 = Matrix4.create();
        private readonly _worldToClipMatrix: Matrix4 = Matrix4.create();
        private readonly _clipToWorldMatrix: Matrix4 = Matrix4.create();
        private readonly _frameVectors: Vector3[] = [ // TODO 需要缓存为视锥
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
         * TODO
         */
        private _calcCameraFrame() {
            const aspect = this.aspect;

            const farLD = this._frameVectors[0];
            const nearLD = this._frameVectors[1];
            const farRD = this._frameVectors[2];
            const nearRD = this._frameVectors[3];
            const farLT = this._frameVectors[4];
            const nearLT = this._frameVectors[5];
            const farRT = this._frameVectors[6];
            const nearRT = this._frameVectors[7];

            const near = this.near;
            const far = this.far;
            const matchFactor = stage.matchFactor;
            const tan = Math.tan(this.fov * 0.5);

            const nearHX = near * tan;
            const nearWX = nearHX * aspect;
            const nearWY = near * tan;
            const nearHY = nearWY / aspect;

            const farHX = far * tan;
            const farWX = farHX * aspect;
            const farWY = far * tan;
            const farHY = farWY / aspect;

            const nearWidth = math.lerp(nearWY, nearWX, matchFactor);
            const nearHeight = math.lerp(nearHY, nearHX, matchFactor);

            const farWidth = math.lerp(farWY, farWX, matchFactor);
            const farHeight = math.lerp(farHY, farHX, matchFactor);

            nearLT.set(-nearWidth, nearHeight, near);
            nearLD.set(-nearWidth, -nearHeight, near);
            nearRT.set(nearWidth, nearHeight, near);
            nearRD.set(nearWidth, -nearHeight, near);

            farLT.set(-farWidth, farHeight, far);
            farLD.set(-farWidth, -farHeight, far);
            farRT.set(farWidth, farHeight, far);
            farRD.set(farWidth, -farHeight, far);

            const worldMatrix = this.gameObject.transform.localToWorldMatrix;
            farLD.applyMatrix(worldMatrix);
            nearLD.applyMatrix(worldMatrix);
            farRD.applyMatrix(worldMatrix);
            nearRD.applyMatrix(worldMatrix);
            farLT.applyMatrix(worldMatrix);
            nearLT.applyMatrix(worldMatrix);
            farRT.applyMatrix(worldMatrix);
            nearRT.applyMatrix(worldMatrix);
        }

        private _intersectPlane(boundingSphere: Sphere, v0: Vector3, v1: Vector3, v2: Vector3) {
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

        /**
         * @internal
         */
        public _update(_delta: number) {
            this._viewPortDirty = true;
            this._matrixDirty = MatrixDirty.ALL;

            this._calcCameraFrame();
            this.context.updateCameraTransform();
        }
        /**
         * 将舞台坐标基于该相机的视角转换为世界坐标。
         * @param stagePosition 舞台坐标。
         * @param worldPosition 世界坐标。
         */
        public stageToWorld(stagePosition: Readonly<IVector3>, worldPosition?: Vector3): Vector3 {
            if (!worldPosition) {
                worldPosition = Vector3.create();
            }

            const backupZ = stagePosition.z;
            const { w, h } = this.renderTargetSize;
            const kX = 2.0 / w;
            const kY = 2.0 / h;
            const clipToWorldMatrix = this.clipToWorldMatrix;

            worldPosition.set(
                (stagePosition.x * kX - 1.0),
                (1.0 - stagePosition.y * kY),
                0.95,
            ).applyMatrix(clipToWorldMatrix);

            const transform = this.gameObject.transform;
            const position = transform.position;
            const forward = transform.getForward().multiplyScalar(-1.0).release();
            const distanceToPlane = worldPosition.subtract(position).dot(forward);

            if (distanceToPlane < -Const.EPSILON || Const.EPSILON < distanceToPlane) {
                if (this.opvalue === 0.0) {
                    // TODO
                    // worldPosition.subtract(vppos, forward.multiplyScalar(distanceToPlane - stagePosition.z));
                }
                else {
                    worldPosition.multiplyScalar(-backupZ / distanceToPlane).add(position);
                }
            }

            return worldPosition;
        }
        /**
         * 将舞台坐标基于该相机的视角转换为世界坐标。
         * @param worldPosition 世界坐标。
         * @param stagePosition 舞台坐标。
         */
        public worldToStage(worldPosition: Readonly<IVector3>, stagePosition?: Vector3) {
            if (!stagePosition) {
                stagePosition = Vector3.create();
            }

            const { w, h } = this.renderTargetSize;
            const worldToClipMatrix = this.worldToClipMatrix;

            stagePosition.applyMatrix(worldToClipMatrix, worldPosition);
            stagePosition.x = (stagePosition.x + 1.0) * w * 0.5;
            stagePosition.y = (1.0 - stagePosition.y) * h * 0.5;
            // stagePosition.z = TODO

            return stagePosition;
        }

        /**
         * 将舞台坐标基于该相机的视角转换为世界射线。
         * @param stageX 舞台水平坐标。
         * @param stageY 舞台垂直坐标。
         * @param ray 射线。
         */
        public stageToRay(stageX: number, stageY: number, ray?: Ray) {
            if (!ray) {
                ray = Ray.create();
            }

            const { w, h } = this.renderTargetSize;
            const kX = 2.0 / w;
            const kY = 2.0 / h;
            const clipToWorldMatrix = this.clipToWorldMatrix;

            ray.origin.set(
                stageX * kX - 1.0,
                1.0 - stageY * kY,
                0.0,
            ).applyMatrix(clipToWorldMatrix);
            ray.direction.set(
                stageX * kX - 1.0,
                1.0 - stageY * kY,
                1.0,
            ).applyMatrix(clipToWorldMatrix).subtract(ray.origin).normalize();

            return ray;
        }

        /**
         * TODO
         */
        public testFrustumCulling(node: paper.BaseRenderer) {
            const boundingSphere = node.boundingSphere;
            if (!this._intersectPlane(boundingSphere, this._frameVectors[0], this._frameVectors[1], this._frameVectors[5])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVectors[1], this._frameVectors[3], this._frameVectors[7])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVectors[3], this._frameVectors[2], this._frameVectors[6])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVectors[2], this._frameVectors[0], this._frameVectors[4])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVectors[5], this._frameVectors[7], this._frameVectors[6])) return false;
            if (!this._intersectPlane(boundingSphere, this._frameVectors[0], this._frameVectors[2], this._frameVectors[3])) return false;

            return true;
        }
        /**
         * 该相机的视点到近裁剪面距离。
         * - 该值过小会引起深度冲突。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01, maximum: 3000.0 - 0.01, step: 1 })
        public get near(): number {
            return this._near;
        }
        public set near(value: number) {
            if (value >= this.far) {
                value = this.far - 0.01;
            }

            if (value < 0.01) {
                value = 0.01;
            }

            this._near = value;
        }
        /**
         * 该相机的视点到远裁剪面距离。
         */
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.02, maximum: 3000.0, step: 1 })
        public get far(): number {
            return this._far;
        }
        public set far(value: number) {
            if (value <= this.near) {
                value = this.near + 0.01;
            }

            if (value >= 10000.0) {
                value = 10000.0;
            }

            this._far = value;
        }
        /**
         * 
         */
        public get aspect(): number {
            const { w, h } = this.pixelViewport;
            return w / h;
        }
        /**
         * 该相机渲染目标的尺寸。
         */
        public get renderTargetSize(): Readonly<ISize> {
            let w: number;
            let h: number;
            const renderTarget = this.renderTarget;

            if (renderTarget) {
                w = renderTarget.width;
                h = renderTarget.height;
            }
            else {
                const stageViewPort = stage.viewport;
                w = stageViewPort.w;
                h = stageViewPort.h;
            }

            return { w, h };
        }
        /**
         * 该相机像素化的渲染视口。
         */
        @paper.editor.property(paper.editor.EditType.RECT, { step: 1 })
        public get pixelViewport(): Readonly<IRectangle> {
            if (this._viewPortDirty) {
                const { w, h } = this.renderTargetSize;
                const viewport = this.viewport;
                const pixelViewport = this._pixelViewport;

                pixelViewport.x = w * viewport.x;
                pixelViewport.y = h * viewport.y;
                pixelViewport.w = w * viewport.w;
                pixelViewport.h = h * viewport.h;

                this._viewPortDirty = false;
            }

            return this._pixelViewport;
        }
        public set pixelViewport(value: Readonly<IRectangle>) {
            const { w, h } = this.renderTargetSize;
            this.viewport.set(value.x / w, value.y / h, value.w / w, value.h / h);
            this._pixelViewport.copy(value);
        }
        /**
         * 该相机的投影矩阵。
         */
        public get projectionMatrix(): Readonly<Matrix4> {
            const perspectiveMatrix = this._perspectiveMatrix;
            if (this._matrixDirty & MatrixDirty.ProjectionMatrix) {
                perspectiveMatrix.fromProjection(
                    this.fov, this._near, this._far,
                    this.size,
                    this.opvalue,
                    this.aspect, stage.matchFactor
                );
                this._matrixDirty &= ~MatrixDirty.ProjectionMatrix;
            }

            return perspectiveMatrix;
        }
        /**
         * 从世界变换到该相机裁切空间的矩阵。
         */
        public get worldToClipMatrix(): Readonly<Matrix4> {
            if (this._matrixDirty & MatrixDirty.WorldToClipMatrix) {
                this._worldToClipMatrix.multiply(this.projectionMatrix, this.gameObject.transform.worldToLocalMatrix);
                this._matrixDirty &= ~MatrixDirty.WorldToClipMatrix;
            }

            return this._worldToClipMatrix;
        }
        /**
         * 从该相机裁切空间变换到世界的矩阵。
         */
        public get clipToWorldMatrix(): Readonly<Matrix4> {
            if (this._matrixDirty & MatrixDirty.ClipToWorldMatrix) {
                this._clipToWorldMatrix.inverse(this.worldToClipMatrix);
                this._matrixDirty &= ~MatrixDirty.ClipToWorldMatrix;
            }

            return this._clipToWorldMatrix;
        }

        /**
         * @deprecated
         */
        public getPosAtXPanelInViewCoordinateByScreenPos(screenPos: Vector2, z: number, out: Vector2) {
            const { w, h } = this.renderTargetSize;

            const nearpos = helpVector3A;
            nearpos.z = -this.near;
            nearpos.x = screenPos.x - w * 0.5;
            nearpos.y = h * 0.5 - screenPos.y;

            const farpos = helpVector3B;
            farpos.z = -this.far;
            farpos.x = this.far * nearpos.x / this.near;
            farpos.y = this.far * nearpos.y / this.near;

            const rate = (nearpos.z - z) / (nearpos.z - farpos.z);
            out.x = nearpos.x - (nearpos.x - farpos.x) * rate;
            out.y = nearpos.y - (nearpos.y - farpos.y) * rate;
        }
        /**
         * @deprecated
         */
        public calcScreenPosFromWorldPos(worldPos: Vector3, outScreenPos: Vector2) {
            const { w, h } = this.renderTargetSize;
            const worldToClipMatrix = this.worldToClipMatrix;
            const ndcPos = helpVector3A;
            worldToClipMatrix.transformVector3(worldPos, ndcPos);
            outScreenPos.x = (ndcPos.x + 1.0) * w * 0.5;
            outScreenPos.y = (1.0 - ndcPos.y) * h * 0.5;
        }
        /**
         * @deprecated
         */
        public calcWorldPosFromScreenPos(screenPos: Vector3, outWorldPos: Vector3) {
            this.stageToWorld(screenPos, outWorldPos);
        }
        /**
         * @deprecated
         */
        public createRayByScreen(screenPosX: number, screenPosY: number, ray?: Ray) {
            return this.stageToRay(screenPosX, screenPosY, ray);
        }
    }
}
