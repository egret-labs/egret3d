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

        private _sort(a: DrawCall, b: DrawCall) {
            if (a.material.renderQueue === b.material.renderQueue) {
                // if (a.material.renderQueue >= egret3d.RenderQueue.Transparent) {
                //     a.renderer.gameObject.transform
                // }

                return b.zdist - a.zdist;
            }
            else {
                return a.material.renderQueue - b.material.renderQueue;
            }
        }
        /**
         * 
         */
        public updateZDist(camera: Camera) {
            // TODO 更新计算物体的zdist，如果是不透明物体，统一设置为 -1
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