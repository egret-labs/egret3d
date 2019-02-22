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
        // /**
        //  * 此帧新添加的绘制信息列表。
        //  */
        // public readonly addDrawCalls: (DrawCall | null)[] = [];

        private _drawCallsDirty: boolean = false;
        private _entities: (paper.IEntity | null)[] = [];
        private _drawCalls: (DrawCall | null)[] = [];
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
            const { _entities, _drawCalls } = this;
            const entity = drawCall.entity!;

            if (_entities.indexOf(entity) < 0) {
                _entities[_entities.length] = entity;
            }

            _drawCalls[_drawCalls.length] = drawCall;
        }
        /**
         * 移除指定渲染组件的绘制信息列表。
         */
        public removeDrawCalls(entity: paper.IEntity): boolean {
            const { _entities, _drawCalls } = this;
            const index = _entities.indexOf(entity);

            if (index < 0) {
                return false;
            }

            let i = _drawCalls.length;
            while (i--) {
                const drawCall = _drawCalls[i];
                if (drawCall && drawCall.entity === entity) {
                    _drawCalls[i] = null;
                    drawCall.release();
                }
            }

            _entities[index] = null;

            this._drawCallsDirty = true;

            return true;
        }
        /**
         * 是否包含指定渲染组件的绘制信息列表。
         */
        public hasDrawCalls(entity: paper.IEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }
        /**
         * 此帧可能参与渲染的绘制信息列表。
         * - 未进行视锥剔除的。
         */
        public get drawCalls(): ReadonlyArray<DrawCall> {
            const { _entities, _drawCalls } = this;

            if (this._drawCallsDirty) {
                paper.utility.filterArray(_entities, null);
                paper.utility.filterArray(_drawCalls, null);
                this._drawCallsDirty = false;
            }

            return _drawCalls as ReadonlyArray<DrawCall>;
        }
    }
    /**
     * 全局绘制信息收集组件实例。
     */
    export const drawCallCollecter: DrawCallCollecter = null!;
}