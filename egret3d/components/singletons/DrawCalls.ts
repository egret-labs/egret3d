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
        // public readonly finalDrawCalls: DrawCall[] = [];//TODO,裁切开启后，放到这里，排序会少算一些

        private _sort(a: DrawCall, b: DrawCall) {
            if (a.material.renderQueue === b.material.renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return a.material.renderQueue - b.material.renderQueue;
            }
        }
        public sortAfterFrustumCulling(camera: Camera) {
            // this.finalDrawCalls.length = 0;
            const cameraPos = camera.gameObject.transform.getPosition();
            //
            for (const drawCall of this.drawCalls) {
                drawCall.disable = (drawCall.frustumTest && !camera.testFrustumCulling(drawCall.renderer.gameObject.transform));
                if (!drawCall.disable) {
                    if (drawCall.material.renderQueue >= RenderQueue.Transparent) {
                        //透明物体需要排序
                        const objPos = drawCall.renderer.gameObject.transform.getPosition();
                        drawCall.zdist = objPos.getDistance(cameraPos);
                    }
                    // this.finalDrawCalls.push(drawCall);
                }
            }
            this.drawCalls.sort(this._sort);
            // this.finalDrawCalls.sort(this._sort);
        }
        /**
         * 
         */
        public sort() {
            this.drawCalls.sort(this._sort);
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
         * 获取指定渲染器的 draw call 列表。
         * @param renderer 
         */
        public getDrawCalls(renderer: paper.BaseRenderer): DrawCall[] | null {
            if (this.renderers.indexOf(renderer) < 0) {
                return null;
            }

            this.drawCalls.filter(drawCall => drawCall.renderer === renderer);
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