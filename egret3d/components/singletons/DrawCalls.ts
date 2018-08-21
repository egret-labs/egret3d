namespace egret3d {
    /**
     * @private
     * draw call type
     */
    export type DrawCall = {
        renderer: paper.BaseRenderer,
        matrix?: Matrix4,

        subMeshIndex: number,
        mesh: Mesh,
        material: Material,

        frustumTest: boolean,
        zdist: number,

        boneData?: Float32Array,
    };
    /**
     * 
     */
    export class DrawCalls extends paper.SingletonComponent {
        /**
         * 参与渲染的渲染器列表。
         */
        public readonly renderers: paper.BaseRenderer[] = [];
        /**
         * 所有的 draw call 列表。
         */
        public readonly drawCalls: DrawCall[] = [];
        /**
         * 非透明列表
         */
        public readonly opaqueCalls: DrawCall[] = [];
        /**
         * 透明列表
         */
        public readonly transparentCalls: DrawCall[] = [];

        /**
         * 阴影列表
         */
        public readonly shadowCalls: DrawCall[] = [];
        /**
         * 所有非透明的, 按照从近到远排序
         * @param a 
         * @param b 
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
         * @param a 
         * @param b 
         */
        private _sortFromFarToNear(a: DrawCall, b: DrawCall) {
            if (a.material.renderQueue === b.material.renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return a.material.renderQueue - b.material.renderQueue;
            }
        }
        public shadowFrustumCulling(camera: Camera) {
            this.shadowCalls.length = 0;
            for (const drawCall of this.drawCalls) {
                const drawTarget = drawCall.renderer.gameObject;
                const visible = (camera.cullingMask & drawTarget.layer) !== 0;
                if (visible && drawCall.renderer.castShadows) {
                    if (!drawCall.frustumTest || (drawCall.frustumTest && camera.testFrustumCulling(drawTarget.renderer))) {
                        this.shadowCalls.push(drawCall);
                    }
                }
            }

            this.shadowCalls.sort(this._sortFromFarToNear);
        }
        public sortAfterFrustumCulling(camera: Camera) {
            //每次根据视锥裁切填充TODO，放到StartSystem
            this.opaqueCalls.length = 0;
            this.transparentCalls.length = 0;
            const cameraPos = camera.gameObject.transform.getPosition();
            //
            for (const drawCall of this.drawCalls) {
                const drawTarget = drawCall.renderer.gameObject;
                const visible = ((camera.cullingMask & drawTarget.layer) !== 0 && (!drawCall.frustumTest || (drawCall.frustumTest && camera.testFrustumCulling(drawTarget.renderer))));
                //裁切没通过
                if (visible) {
                    const objPos = drawTarget.transform.getPosition();
                    drawCall.zdist = objPos.getDistance(cameraPos);
                    if (drawCall.material.renderQueue >= RenderQueue.Transparent && drawCall.material.renderQueue < RenderQueue.Overlay) {
                        this.transparentCalls.push(drawCall);
                    }
                    else {
                        this.opaqueCalls.push(drawCall);
                    }
                }
            }
            //
            this.opaqueCalls.sort(this._sortOpaque);
            this.transparentCalls.sort(this._sortFromFarToNear);
        }
        /**
         * 移除指定渲染器的 draw call 列表。
         * @param renderer 
         */
        public removeDrawCalls(renderer: paper.BaseRenderer) {
            const index = this.renderers.indexOf(renderer);
            if (index < 0) {
                return;
            }

            let i = this.drawCalls.length;
            while (i--) {
                if (this.drawCalls[i].renderer === renderer) {
                    this.drawCalls.splice(i, 1);
                }
            }

            this.renderers.splice(index, 1);
        }
        /**
         * 指定渲染器是否生成了 draw call 列表。
         * @param renderer 
         */
        public hasDrawCalls(renderer: paper.BaseRenderer) {
            return this.renderers.indexOf(renderer) >= 0;
        }
    }
}