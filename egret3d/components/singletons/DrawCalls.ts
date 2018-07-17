namespace egret3d {
    /**
     * @private
     * draw call type
     */
    export type DrawCall = {
        renderer: paper.BaseRenderer,
        matrix?: Matrix,

        subMeshIndex: number,
        mesh: Mesh,
        material: Material,

        frustumTest: boolean,
        zdist: number,

        boneData?: Float32Array,

        disable: boolean;
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
         * 所有非透明的, 按照从近到远排序
         */
        public readonly opaqueCalls: DrawCall[] = [];
        /**
         * 所有透明的,按照从远到近排序
         */
        public readonly transparentCalls: DrawCall[] = [];
        /**
         * 所有非透明的, 按照从近到远排序
         * @param a 
         * @param b 
         */
        private _sortOpaque(a: DrawCall, b: DrawCall) {
            if (a.material.renderQueue === b.material.renderQueue) {
                return a.zdist - b.zdist;
            }
            else {
                return a.material.renderQueue - b.material.renderQueue;
            }
        }
        /**
         * 所有透明的，按照从远到近排序
         * @param a 
         * @param b 
         */
        private _sortTransparent(a: DrawCall, b: DrawCall) {
            if (a.material.renderQueue === b.material.renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return a.material.renderQueue - b.material.renderQueue;
            }
        }
        public sortAfterFrustumCulling(camera: Camera) {
            //每次根据视锥裁切填充TODO，放到StartSystem
            this.opaqueCalls.length = 0;
            this.transparentCalls.length = 0;
            const cameraPos = camera.gameObject.transform.getPosition();
            //
            for (const drawCall of this.drawCalls) {
                drawCall.disable = (drawCall.frustumTest && !camera.testFrustumCulling(drawCall.renderer.gameObject.transform));
                //裁切没通过
                if (!drawCall.disable) {
                    const objPos = drawCall.renderer.gameObject.transform.getPosition();
                    drawCall.zdist = objPos.getDistance(cameraPos);
                    if (drawCall.material.renderQueue >= RenderQueue.Transparent) {
                        //透明物体需要排序
                        this.transparentCalls.push(drawCall);
                    }
                    else {
                        this.opaqueCalls.push(drawCall);
                    }
                }
            }
            //
            this.opaqueCalls.sort(this._sortOpaque);
            this.transparentCalls.sort(this._sortTransparent);
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