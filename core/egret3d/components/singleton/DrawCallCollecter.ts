namespace egret3d {
    /**
     * 全局绘制信息收集组件。
     */
    export class DrawCallCollecter extends paper.SingletonComponent {
        /**
         * 此帧可能参与渲染的渲染组件列表。
         * - 未进行视锥剔除的。
         */
        public readonly renderers: (paper.BaseRenderer | null)[] = [];
        /**
         * 此帧可能参与渲染的绘制信息列表。
         * - 未进行视锥剔除的。
         */
        public readonly drawCalls: (DrawCall | null)[] = [];
        /**
         * 此帧新添加的绘制信息列表。
         */
        public readonly addDrawCalls: (DrawCall | null)[] = [];

        private _drawCallsDirty: boolean = false;
        /**
         * @internal
         */
        public _update() {
            const { renderers, drawCalls } = this;

            if (this._drawCallsDirty) {
                // Clear renderers.
                let index = 0;
                let removeCount = 0;

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
                // Clear drawCalls.
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

                this._drawCallsDirty = false;
            }

            if (DEBUG) {
                for (const drawCall of drawCalls) {
                    drawCall!.drawCount = 0;
                }
            }
        }
        /**
         * @internal
         */
        public _lateUpdate() {
            const { addDrawCalls } = this;
            if (addDrawCalls.length > 0) {
                addDrawCalls.length = 0;
            }
        }
        /**
         * 添加绘制信息。
         * @param drawCall 
         */
        public addDrawCall(drawCall: DrawCall): void {
            const { renderers, drawCalls, addDrawCalls } = this;
            const renderer = drawCall.renderer;

            if (renderers.indexOf(renderer) < 0) {
                renderers.push(renderer);
            }

            drawCalls.push(drawCall);
            addDrawCalls.push(drawCall);
        }
        /**
         * 移除指定渲染组件的绘制信息列表。
         */
        public removeDrawCalls(renderer: paper.BaseRenderer): void {
            const { renderers, drawCalls, addDrawCalls } = this;
            const index = renderers.indexOf(renderer);

            if (index < 0) {
                return;
            }

            let i = drawCalls.length;
            while (i--) {
                const drawCall = drawCalls[i];
                if (drawCall && drawCall.renderer === renderer) {
                    drawCalls[i] = null;
                    drawCall.release();
                }
            }

            i = addDrawCalls.length;
            while (i--) {
                const drawCall = addDrawCalls[i];
                if (drawCall && drawCall.renderer === renderer) {
                    addDrawCalls[i] = null;
                }
            }

            renderers[index] = null;
            this._drawCallsDirty = true;
        }
        /**
         * 是否包含指定渲染组件的绘制信息列表。
         */
        public hasDrawCalls(renderer: paper.BaseRenderer): boolean {
            return this.renderers.indexOf(renderer) >= 0;
        }
    }
}