namespace egret3d {
    /**
     * 全局绘制信息组件。
     */
    @paper.singleton
    export class DrawCallCollecter extends paper.BaseComponent {
        /**
         * 专用于天空盒渲染的绘制信息。
         */
        public readonly skyBox: DrawCall = DrawCall.create();
        /**
         * 专用于后期渲染的绘制信息。
         */
        public readonly postprocessing: DrawCall = DrawCall.create();
        /**
         * 
         */
        public readonly entities: (paper.IEntity | null)[] = [];
        /**
         * 此帧可能参与渲染的绘制信息列表。
         * - 未进行视锥剔除的。
         */
        public readonly drawCalls: (DrawCall | null)[] = [];
        // /**
        //  * 此帧新添加的绘制信息列表。
        //  */
        // public readonly addDrawCalls: (DrawCall | null)[] = [];

        private _drawCallsDirty: boolean = false;
        /**
         * @internal
         */
        public _update() {
            const { entities, drawCalls } = this;

            if (this._drawCallsDirty) {
                // Clear entities.
                let index = 0;
                let removeCount = 0;

                for (const entity of entities) {
                    if (entity) {
                        if (removeCount > 0) {
                            entities[index - removeCount] = entity;
                            entities[index] = null;
                        }
                    }
                    else {
                        removeCount++;
                    }

                    index++;
                }

                if (removeCount > 0) {
                    entities.length -= removeCount;
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
            // const { addDrawCalls } = this;
            // if (addDrawCalls.length > 0) {
            //     addDrawCalls.length = 0;
            // }
        }
        /**
         * @interal
         */
        public initialize() {
            super.initialize();

            (drawCallCollecter as DrawCallCollecter) = this;

            this.skyBox.subMeshIndex = 0;
            this.postprocessing.matrix = Matrix4.IDENTITY;
            this.postprocessing.subMeshIndex = 0;
            this.postprocessing.mesh = DefaultMeshes.FULLSCREEN_QUAD;
        }
        /**
         * 添加绘制信息。
         * @param drawCall 
         */
        public addDrawCall(drawCall: DrawCall): void {
            const { entities, drawCalls, /*addDrawCalls*/ } = this;
            const entity = drawCall.entity!;

            if (entities.indexOf(entity) < 0) {
                entities.push(entity);
            }

            drawCalls.push(drawCall);
            // addDrawCalls.push(drawCall);
        }
        /**
         * 移除指定渲染组件的绘制信息列表。
         */
        public removeDrawCalls(entity: paper.IEntity): boolean {
            const { entities, drawCalls, /*addDrawCalls*/ } = this;
            const index = entities.indexOf(entity);

            if (index < 0) {
                return false;
            }

            let i = drawCalls.length;
            while (i--) {
                const drawCall = drawCalls[i];
                if (drawCall && drawCall.entity === entity) {
                    drawCalls[i] = null;
                    drawCall.release();
                }
            }

            // i = addDrawCalls.length;
            // while (i--) {
            //     const drawCall = addDrawCalls[i];
            //     if (drawCall && drawCall.entity === entity) {
            //         addDrawCalls[i] = null;
            //     }
            // }

            entities[index] = null;

            this._drawCallsDirty = true;

            return true;
        }
        /**
         * 是否包含指定渲染组件的绘制信息列表。
         */
        public hasDrawCalls(entity: paper.IEntity): boolean {
            return this.entities.indexOf(entity) >= 0;
        }
    }
    /**
     * 全局绘制信息收集组件实例。
     */
    export const drawCallCollecter: DrawCallCollecter = null!;
}