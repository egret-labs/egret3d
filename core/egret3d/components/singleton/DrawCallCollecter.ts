namespace egret3d {
    /**
     * 绘制信息。
     */
    export class DrawCall extends paper.BaseRelease<DrawCall> {
        private static _instances = [] as DrawCall[];
        /**
         * 创建一个绘制信息。
         * - 只有在扩展渲染系统时才需要使用此方法。
         */
        public static create() {
            if (this._instances.length > 0) {
                const instance = this._instances.pop()!;
                instance._released = false;
                return instance;
            }

            return new DrawCall();
        }
        /**
         * 此次绘制的渲染组件。
         */
        public renderer: paper.BaseRenderer | null = null!;
        /**
         * 此次绘制的世界矩阵，没有则使用渲染组件所属实体的变换世界矩阵。
         */
        public matrix: Matrix4 | null = null;
        /**
         * 此次绘制的子网格索引。
         */
        public subMeshIndex: number = -1;
        /**
         * 此次绘制的网格资源。
         */
        public mesh: Mesh = null!;
        /**
         * 此次绘制的材质资源。
         */
        public material: Material = null!;
        /**
         * 
         */
        public zdist: number = -1;

        private constructor() {
            super();
        }

        public onClear() {
            this.renderer = null!;
            this.matrix = null!;
            this.subMeshIndex = -1;
            this.mesh = null!;
            this.material = null!;
            this.zdist = -1;
        }
    }
    /**
     * 全局绘制信息收集组件。
     */
    export class DrawCallCollecter extends paper.SingletonComponent {
        /**
         * 此帧参与渲染的渲染组件列表。
         */
        public readonly renderers: (paper.BaseRenderer | null)[] = [];
        /**
         * 此帧的绘制信息列表。
         * - 未进行视锥剔除的。
         */
        public readonly drawCalls: (DrawCall | null)[] = [];
        /**
         * 此帧的非透明绘制信息列表。
         * - 已进行视锥剔除的。
         */
        public readonly opaqueCalls: DrawCall[] = [];
        /**
         * 此帧的透明绘制信息列表。
         * - 已进行视锥剔除的。
         */
        public readonly transparentCalls: DrawCall[] = [];
        /**
         * 此帧的阴影绘制信息列表。
         * - 已进行视锥剔除的。
         */
        public readonly shadowCalls: DrawCall[] = [];

        private _drawCallsDirty: boolean = false;
        /**
         * 所有非透明的, 按照从近到远排序
         */
        private _sortOpaque(a: DrawCall, b: DrawCall) {
            const aMat = a.material;
            const bMat = b.material;
            if (aMat.renderQueue !== bMat.renderQueue) {
                return aMat.renderQueue - bMat.renderQueue;
            }
            else if (aMat._glTFTechnique.program !== bMat._glTFTechnique.program) {
                return aMat._glTFTechnique.program! - bMat._glTFTechnique.program!;
            }
            else if (aMat._id !== bMat._id) {
                return aMat._id - bMat._id;
            }
            else {
                return a.zdist - b.zdist;
            }
        }
        /**
         * 所有透明的，按照从远到近排序
         */
        private _sortFromFarToNear(a: DrawCall, b: DrawCall) {
            if (a.material.renderQueue === b.material.renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return a.material.renderQueue - b.material.renderQueue;
            }
        }
        /**
         * @internal
         */
        public _update() {
            if (this._drawCallsDirty) {
                let index = 0;
                let removeCount = 0;
                const renderers = this.renderers;
                const drawCalls = this.drawCalls;
                this._drawCallsDirty = false;

                for (const renderer of renderers) {
                    if (renderer) {
                        if (removeCount > 0) {
                            renderers[index - removeCount] = renderer;
                            renderers[index] = null;
                        }
                    }
                    else {
                        removeCount++;
                    }

                    index++;
                }

                if (removeCount > 0) {
                    renderers.length -= removeCount;
                }

                index = 0;
                removeCount = 0;

                for (const drawCall of drawCalls) {
                    if (drawCall) {
                        if (removeCount > 0) {
                            drawCalls[index - removeCount] = drawCall;
                            drawCalls[index] = null;
                        }
                    }
                    else {
                        removeCount++;
                    }

                    index++;
                }

                if (removeCount > 0) {
                    drawCalls.length -= removeCount;
                }
            }
        }
        /**
         * TODO
         */
        public shadowFrustumCulling(camera: Camera) {
            this.shadowCalls.length = 0;

            for (const drawCall of this.drawCalls) {
                const renderer = drawCall.renderer;
                if (
                    renderer.castShadows &&
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || camera.testFrustumCulling(renderer))
                ) {
                    this.shadowCalls.push(drawCall);
                }
            }

            this.shadowCalls.sort(this._sortFromFarToNear);
        }
        /**
         * TODO
         */
        public frustumCulling(camera: Camera) {
            const cameraPosition = camera.gameObject.transform.position;
            this.opaqueCalls.length = 0;
            this.transparentCalls.length = 0;

            for (const drawCall of this.drawCalls) {
                const renderer = drawCall.renderer;
                if (
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || camera.testFrustumCulling(renderer))
                ) {
                    // if (drawCall.material.renderQueue >= paper.RenderQueue.Transparent && drawCall.material.renderQueue <= paper.RenderQueue.Overlay) {
                    if (drawCall.material.renderQueue >= paper.RenderQueue.Transparent) {
                        this.transparentCalls.push(drawCall);
                    }
                    else {
                        this.opaqueCalls.push(drawCall);
                    }

                    drawCall.zdist = renderer.gameObject.transform.position.getDistance(cameraPosition);
                }
            }

            this.opaqueCalls.sort(this._sortOpaque);
            this.transparentCalls.sort(this._sortFromFarToNear);
        }
        /**
         * 移除指定渲染组件的绘制信息列表。
         */
        public removeDrawCalls(renderer: paper.BaseRenderer) {
            const index = this.renderers.indexOf(renderer);
            if (index < 0) {
                return;
            }

            let i = this.drawCalls.length;
            while (i--) {
                const drawCall = this.drawCalls[i];
                if (drawCall && drawCall.renderer === renderer) {
                    this.drawCalls[i] = null;
                    drawCall.release();
                }
            }

            this.renderers[index] = null;
            this._drawCallsDirty = true;
        }
        /**
         * 是否包含指定渲染组件的绘制信息列表。
         */
        public hasDrawCalls(renderer: paper.BaseRenderer) {
            return this.renderers.indexOf(renderer) >= 0;
        }
    }
}