namespace egret3d.trail {
    /**
     * 拖尾的朝向
     */
    export enum TrailAlignment {
        /**
         * 始终面对摄像机
         */
        View = "View",
        /**
         * 使用自己的 Transform 设置
         */
        Local = "Local",
    }
    /**
     * 拖尾的材质模式
     */
    export enum TrailTextureMode {
        /**
         * 伸展到整个拖尾
         */
        Stretch = "Stretch",
        /**
         * 每个拖尾片段使用一个材质
         */
        PerSegment = "PerSegment",
        /**
         * 重复平铺
         */
        Tile = "Tile",
    }
    /**
     * 拖尾组件
     */
    export class TrailComponent extends paper.BaseComponent {
        /**
         * 拖尾的存活时间 (秒)
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public time: number = 3.0;
        /**
         * 生成下一个拖尾片段的最小距离 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public minVertexDistance: number = 0.1;
        /**
         * 拖尾的宽度 (值 / 变化曲线) 
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.FLOAT, { minimum: 0.0 })
        public width: number = 1.0;
        // /**
        //  * 拖尾的颜色 (值 / 变化曲线) 
        //  */
        // @paper.serializedField
        // @paper.editor.property(paper.editor.EditType.COLOR)
        // public color: Color = Color.WHITE;
        /**
         * 生命期结束后是否自动销毁
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public autoDestruct: boolean = false;
        /**
         * 拖尾的朝向是始终面对摄像机还是有自己的单独设置
         * @see {TrailAlignment}
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: TrailAlignment as any })
        public Alignment: TrailAlignment = TrailAlignment.View;
        /**
         * 拖尾的材质模式
         * @see {TrailTextureMode}
         */
        @paper.serializedField
        public textureMode: TrailTextureMode = TrailTextureMode.Stretch;
        /**
         * @internal
         */
        public _isPlaying: boolean = true;
        /**
         * @internal
         */
        public _isPaused: boolean = false;

        private _timeScale: number = 1.0;
        private readonly _batcher: TrailBatcher = new TrailBatcher();

        /**
         * @internal
         */
        private _clean() {
            this._batcher.clean();
        }

        public initialize() {
            super.initialize();
            this._batcher.init(this)
            this._clean();
        }

        public uninitialize() {
            super.uninitialize();
            this._clean();
        }
        /**
         * @internal 
         */
        public update(elapsedTime: number) {
            this._batcher.update(elapsedTime * this._timeScale);
        }
        /**
         * 从头开始播放
         */
        public play() {
            this._isPlaying = true;
            this._isPaused = false;
            this._batcher.clean();
        }
        /**
         * (从暂停中)恢复播放, 如果未暂停, 就从头开始播放
         */
        public resume() {
            if (this._isPaused) {
                this._isPaused = false;
                this._batcher.resume();
            } else {
                if (this._isPlaying) { return; }
                this.play();
            }
        }
        /**
         * 暂停
         */
        public pause(): void {
            if (!this._isPlaying) { return; }
            this._isPaused = true;
        }
        /**
         * 停止播放
         */
        public stop(): void {
            this._isPlaying = false;
            this._isPaused = false;
        }
        /**
         * 是否正在播放
         */
        public get isPlaying() {
            return this._isPlaying;
        }
        /**
         * 是否播放已经暂停
         */
        public get isPaused() {
            return this._isPaused;
        }
    }
}