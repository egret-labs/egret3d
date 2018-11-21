namespace egret3d {
    /**
     * 全局绘制信息收集组件。
     */
    export class DrawCallCollecter extends paper.SingletonComponent {
        /**
         * 此帧可能参与渲染的渲染组件列表。
         */
        public readonly renderers: (paper.BaseRenderer | null)[] = [];
        /**
         * 此帧可能参与渲染的绘制信息列表。
         * - 未进行视锥剔除的。
         */
        public readonly drawCalls: (DrawCall | null)[] = [];

        private _drawCallsDirty: boolean = false;
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
                        drawCall.drawCount = 0;

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