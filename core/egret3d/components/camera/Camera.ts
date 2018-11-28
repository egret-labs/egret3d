namespace egret3d {
    const enum DirtyMask {
        ProjectionMatrix = 0b00000001,

        TransformMatrix = 0b00000010,

        ClipToWorldMatrix = 0b00000100,
        WorldToClipMatrix = 0b00001000,

        CullingMatrix = 0b00010000,

        PixelViewport = 0b00100000,
        CullingFrustum = 0b01000000,

        ClipMatrix = ClipToWorldMatrix | WorldToClipMatrix,
        ProjectionAndClipMatrix = ProjectionMatrix | ClipMatrix,
        Culling = CullingMatrix | CullingFrustum,

        All = ProjectionAndClipMatrix | PixelViewport | Culling,
    }
    /**
     * 相机组件。
     */
    export class Camera extends paper.BaseComponent implements ITransformObserver {
        /**
         * 在渲染阶段正在执行渲染的相机。
         * - 通常在后期渲染和渲染前生命周期中使用。
         */
        public static current: Camera | null = null;
        /**
         * 当前场景的主相机。
         * - 如果没有则创建一个。
         */
        public static get main(): Camera {
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
        public static get editor(): Camera {
            let gameObject = paper.Application.sceneManager.editorScene.find(paper.DefaultNames.EditorCamera);
            if (!gameObject) {
                gameObject = paper.GameObject.create(paper.DefaultNames.EditorCamera, paper.DefaultTags.EditorOnly, paper.Application.sceneManager.editorScene);
                gameObject.transform.setLocalPosition(0.0, 10.0, -10.0);
                gameObject.transform.lookAt(Vector3.ZERO);

                const camera = gameObject.addComponent(Camera);
                camera.cullingMask &= ~paper.Layer.UI; // TODO 更明确的 UI 编辑方案。
                camera.far = 10000.0;
            }

            return gameObject.getOrAddComponent(Camera);
        }
        /**
         * 该相机的绘制缓冲掩码。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((gltf as any).BufferMask) }) // TODO
        public bufferMask: gltf.BufferMask = gltf.BufferMask.DepthAndColor;
        /**
         * 该相机的渲染剔除掩码。
         * - 用来选择性的渲染部分实体。
         * - camera.cullingMask = paper.Layer.UI;
         * - camera.cullingMask |= paper.Layer.UI;
         * - camera.cullingMask &= ~paper.Layer.UI;
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum((paper as any).Layer) }) // TODO
        public cullingMask: paper.Layer = paper.Layer.Everything;
        /**
         * 该相机渲染排序。
         * - 该值越低的相机优先绘制。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.INT)
        public order: int = 0;
        /**
         * 该相机的背景色。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.COLOR)
        public readonly backgroundColor: Color = Color.create(0.15, 0.25, 0.5, 1.0);
        /**
         * 该相机的渲染上下文。
         * @private
         */
        public readonly context: CameraRenderContext = new CameraRenderContext(this);

        private _nativeCulling: boolean = false;
        private _nativeProjection: boolean = false;
        private _nativeTransform: boolean = false;
        private _dirtyMask: DirtyMask = DirtyMask.All;
        private _opvalue: number = 1.0;
        private _fov: number = Math.PI * 0.25;
        private _near: number = 0.3;
        private _far: number = 1000.0;
        private _size: number = 1.0;
        private readonly _viewport: Rectangle = Rectangle.create(0.0, 0.0, 1.0, 1.0);
        private readonly _pixelViewport: Rectangle = Rectangle.create(0.0, 0.0, 1.0, 1.0);
        private readonly _frustum: Frustum = Frustum.create();
        private readonly _viewportMatrix: Matrix4 = Matrix4.create();
        private readonly _cullingMatrix: Matrix4 = Matrix4.create();
        private readonly _projectionMatrix: Matrix4 = Matrix4.create();
        private readonly _cameraToWorldMatrix: Matrix4 = Matrix4.create();
        private readonly _worldToCameraMatrix: Matrix4 = Matrix4.create();
        private readonly _worldToClipMatrix: Matrix4 = Matrix4.create();
        private readonly _clipToWorldMatrix: Matrix4 = Matrix4.create();
        private _renderTarget: BaseRenderTarget | null = null;

        /**
         * @internal
         */
        public _readRenderTarget: BaseRenderTarget | null = null;
        /**
         * @internal
         */
        public _writeRenderTarget: BaseRenderTarget | null = null;
        /**
         * @internal
         */
        public _update() {
            this.context._frustumCulling();

            this.context.updateCameraTransform(); // TODO
        }

        private _onStageResize(): void {
            this._dirtyMask |= DirtyMask.PixelViewport;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;
            }

            if (!this._nativeCulling) {
                this._dirtyMask |= DirtyMask.Culling;
            }
        }

        public initialize() {
            super.initialize();
            //TODO
            this._readRenderTarget = new GlRenderTarget("readRenderTarget", stage.viewport.w, stage.viewport.h, true);
            this._writeRenderTarget = new GlRenderTarget("writeRenderTarget", stage.viewport.w, stage.viewport.h, true);

            this.transform.registerObserver(this);
            stage.onScreenResize.add(this._onStageResize, this);
            stage.onResize.add(this._onStageResize, this);
        }

        public uninitialize() {
            super.uninitialize();

            if (this._readRenderTarget) {
                this._readRenderTarget.dispose();
            }
            if (this._writeRenderTarget) {
                this._writeRenderTarget.dispose();
            }

            this._readRenderTarget = null;
            this._writeRenderTarget = null;

            stage.onScreenResize.remove(this._onStageResize, this);
            stage.onResize.remove(this._onStageResize, this);
        }

        public onTransformChange() {
            if (!this._nativeTransform) {
                this._dirtyMask |= DirtyMask.ClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
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
            const cameraToWorldMatrix = this.cameraToWorldMatrix;

            worldPosition.set(
                (stagePosition.x * kX - 1.0),
                (1.0 - stagePosition.y * kY),
                0.95,
            ).applyMatrix(clipToWorldMatrix);

            const position = egret3d.Vector3.create().fromMatrixPosition(cameraToWorldMatrix).release();
            const forward = egret3d.Vector3.create().fromMatrixColumn(cameraToWorldMatrix, 2).multiplyScalar(-1.0).release();
            const distanceToPlane = worldPosition.subtract(position).dot(forward);

            if (distanceToPlane < -Const.EPSILON || Const.EPSILON < distanceToPlane) {
                if (this._opvalue === 0.0) {
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
        public worldToStage(worldPosition: Readonly<IVector3>, stagePosition?: Vector3): Vector3 {
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
        public stageToRay(stageX: number, stageY: number, ray?: Ray): Ray {
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
         * 
         */
        public resetCullingMatrix(): this {
            this._nativeCulling = false;

            return this;
        }
        /**
         * 
         */
        public resetProjectionMatrix(): this {
            this._nativeProjection = false;

            return this;
        }
        /**
         * 
         */
        public resetWorldToCameraMatrix(): this {
            this._nativeTransform = false;

            return this;
        }
        /**
         * 控制该相机从正交到透视的过渡的系数，0：正交，1：透视，中间值则在两种状态间插值。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0, maximum: 1.0, step: 0.01 })
        public get opvalue(): number {
            return this._opvalue;
        }
        public set opvalue(value: number) {
            if (this._opvalue === value) {
                return;
            }

            this._opvalue = value;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 该相机的视点到近裁剪面距离。
         * - 该值过小会引起深度冲突。
         */
        @paper.serializedField("_near")
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

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 该相机的视点到远裁剪面距离。
         */
        @paper.serializedField("_far")
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.02, maximum: 3000.0, step: 1 })
        public get far(): number {
            return this._far;
        }
        public set far(value: number) {
            if (value <= this._near) {
                value = this._near + 0.01;
            }

            if (value >= 10000.0) {
                value = 10000.0;
            }

            this._far = value;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 透视投影的视野。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.01, maximum: Math.PI - 0.01, step: 0.01 })
        public get fov(): number {
            return this._fov;
        }
        public set fov(value: number) {
            if (this._fov === value) {
                return;
            }

            this._fov = value;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 该相机的正交投影的尺寸。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public get size(): number {
            return this._size;
        }
        public set size(value: number) {
            if (this._size === value) {
                return;
            }

            this._size = value;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 该相机视口的宽高比。
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
            const renderTarget = this._renderTarget;

            if (renderTarget) {
                w = renderTarget.width;
                h = renderTarget.height;
            }
            else {
                const stageViewport = stage.viewport;
                w = stageViewport.w;
                h = stageViewport.h;
            }

            return { w, h };
        }
        /**
         * 该相机归一化的渲染视口。
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.RECT, { step: 0.01 })
        public get viewport(): Readonly<Rectangle> {
            return this._viewport;
        }
        public set viewport(value: Readonly<Rectangle>) {
            const viewport = this._viewport;
            if (viewport !== value) {
                viewport.copy(value);
            }

            viewport.w = viewport.w || 1.0;
            viewport.h = viewport.h || 1.0;

            this._dirtyMask |= DirtyMask.PixelViewport;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 该相机像素化的渲染视口。
         */
        @paper.editor.property(paper.editor.EditType.RECT, { step: 1 })
        public get pixelViewport(): Readonly<IRectangle> {
            const pixelViewport = this._pixelViewport;

            if (this._dirtyMask & DirtyMask.PixelViewport) {
                const { w, h } = this.renderTargetSize;
                const viewport = this._viewport;
                pixelViewport.x = w * viewport.x;
                pixelViewport.y = h * viewport.y;
                pixelViewport.w = w * viewport.w;
                pixelViewport.h = h * viewport.h;
                this._dirtyMask &= ~DirtyMask.PixelViewport;
            }

            return pixelViewport;
        }
        public set pixelViewport(value: Readonly<IRectangle>) {
            const pixelViewport = this._pixelViewport;
            if (pixelViewport !== value) {
                pixelViewport.copy(value);
            }

            pixelViewport.w = pixelViewport.w || 1.0;
            pixelViewport.h = pixelViewport.h || 1.0;

            const { w, h } = this.renderTargetSize;
            this._viewport.set(pixelViewport.x / w, pixelViewport.y / h, (pixelViewport.w || 1.0) / w, (pixelViewport.h || 1.0) / h);

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 
         */
        public get frustum(): Readonly<Frustum> {
            if (this._dirtyMask & DirtyMask.CullingFrustum) {
                this._frustum.fromMatrix(this.cullingMatrix);
                this._dirtyMask &= ~DirtyMask.CullingFrustum;
            }
            return this._frustum;
        }
        /**
         * 该相机在世界空间坐标系的裁切矩阵。
         */
        public get cullingMatrix(): Readonly<Matrix4> {
            if (!this._nativeCulling) {
                if (this._dirtyMask & DirtyMask.CullingMatrix) {
                    this._cullingMatrix.multiply(this.projectionMatrix, this.worldToCameraMatrix);
                    this._dirtyMask &= ~DirtyMask.CullingMatrix;
                }
            }

            return this._cullingMatrix;
        }

        public set cullingMatrix(value: Readonly<Matrix4>) {
            const cullingMatrix = this._cullingMatrix;
            if (cullingMatrix !== value) {
                cullingMatrix.copy(value);
            }

            this._nativeCulling = true;
            this._dirtyMask |= DirtyMask.CullingFrustum;
        }
        /**
         * 该相机的投影矩阵。
         */
        public get projectionMatrix(): Readonly<Matrix4> {
            if (this._nativeProjection) {
                return this._projectionMatrix;
            }

            const viewportMatrix = this._viewportMatrix;

            if (this._dirtyMask & DirtyMask.ProjectionMatrix) {
                viewportMatrix.fromProjection(
                    this._fov, this._near, this._far,
                    this._size,
                    this._opvalue,
                    this.aspect, stage.matchFactor
                );
                this._dirtyMask &= ~DirtyMask.ProjectionMatrix;
            }

            return viewportMatrix;
        }
        public set projectionMatrix(value: Readonly<Matrix4>) {
            const projectionMatrix = this._projectionMatrix;
            if (projectionMatrix !== value) {
                projectionMatrix.copy(value);
            }

            this._nativeProjection = true;

            this._dirtyMask |= DirtyMask.ClipMatrix;
            if (!this._nativeCulling) {
                this._dirtyMask |= DirtyMask.Culling;
            }
        }
        /**
         * 从该相机空间坐标系到世界空间坐标系的变换矩阵。
         */
        public get cameraToWorldMatrix(): Readonly<Matrix4> {
            if (this._nativeTransform) {
                if (this._dirtyMask & DirtyMask.TransformMatrix) {
                    this._cameraToWorldMatrix.inverse(this._worldToCameraMatrix);
                }

                return this._cameraToWorldMatrix;
            }

            return this.gameObject.transform.localToWorldMatrix;
        }
        /**
         * 从世界空间坐标系到该相机空间坐标系的变换矩阵。
         * - 当设置该矩阵时，该相机将使用设置值代替变换组件的矩阵进行渲染。
         */
        public get worldToCameraMatrix(): Readonly<Matrix4> {
            if (this._nativeTransform) {
                return this._worldToCameraMatrix;
            }

            return this.gameObject.transform.worldToLocalMatrix;
        }
        public set worldToCameraMatrix(value: Readonly<Matrix4>) {
            const worldToCameraMatrix = this._worldToCameraMatrix;
            if (worldToCameraMatrix !== value) {
                worldToCameraMatrix.copy(value);
            }

            this._nativeTransform = true;
            this._dirtyMask |= DirtyMask.TransformMatrix;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;
            }

            if (!this._nativeCulling) {
                this._dirtyMask |= DirtyMask.Culling;
            }
        }
        /**
         * 从世界变换到该相机裁切空间的矩阵。
         */
        public get worldToClipMatrix(): Readonly<Matrix4> {
            if (this._dirtyMask & DirtyMask.WorldToClipMatrix) {
                this._worldToClipMatrix.multiply(this.projectionMatrix, this.worldToCameraMatrix);
                this._dirtyMask &= ~DirtyMask.WorldToClipMatrix;
            }

            return this._worldToClipMatrix;
        }
        /**
         * 从该相机裁切空间变换到世界的矩阵。
         */
        public get clipToWorldMatrix(): Readonly<Matrix4> {
            if (this._dirtyMask & DirtyMask.ClipToWorldMatrix) {
                this._clipToWorldMatrix.inverse(this.worldToClipMatrix);
                this._dirtyMask &= ~DirtyMask.ClipToWorldMatrix;
            }

            return this._clipToWorldMatrix;
        }
        /**
         * 该相机的渲染目标。
         * - 未设置该值则直接绘制到舞台。
         */
        public get renderTarget(): BaseRenderTarget | null {
            return this._renderTarget;
        }
        public set renderTarget(value: BaseRenderTarget | null) {
            if (this._renderTarget === value) {
                return;
            }

            this._renderTarget = value;

            if (!this._nativeProjection) {
                this._dirtyMask |= DirtyMask.ProjectionAndClipMatrix;

                if (!this._nativeCulling) {
                    this._dirtyMask |= DirtyMask.Culling;
                }
            }
        }
        /**
         * 
         */
        public get postprocessingRenderTarget(): BaseRenderTarget {
            return this._readRenderTarget;
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
        /**
         * @deprecated
         */
        public get clearOption_Color() {
            return (this.bufferMask & gltf.BufferMask.Color) !== 0;
        }
        public set clearOption_Color(value: boolean) {
            this.bufferMask |= gltf.BufferMask.Color;
        }
        /**
         * @deprecated
         */
        public get clearOption_Depth() {
            return (this.bufferMask & gltf.BufferMask.Depth) !== 0;
        }
        public set clearOption_Depth(value: boolean) {
            this.bufferMask |= gltf.BufferMask.Depth;
        }
    }
}
