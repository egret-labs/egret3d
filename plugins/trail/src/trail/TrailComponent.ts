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
    }

    /**
     * 拖尾组件
     */
    @paper.requireComponent(egret3d.MeshFilter)
    @paper.requireComponent(egret3d.MeshRenderer)
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
         * 在移动突然反向时是否自动翻转, 避免出现尖角现象
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public autoFlip: boolean = false;

        /**
         * 拖尾的朝向是始终面对摄像机还是有自己的单独设置
         * @see {TrailAlignment}
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum(egret3d.trail.TrailAlignment) })
        public Alignment: TrailAlignment = TrailAlignment.View;

        /**
         * 拖尾的材质模式
         * @see {TrailTextureMode}
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.LIST, { listItems: paper.editor.getItemsFromEnum(egret3d.trail.TrailTextureMode) })
        public textureMode: TrailTextureMode = TrailTextureMode.Stretch;

        /**
         * 发射状态发生改变时产生的信号
         */
        public readonly onEmittingChanged: signals.Signal = new signals.Signal();
        /**
         * 发射状态: 表示拖尾是否在不断的生成新的拖尾片段
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get emitting(): boolean {
            return this._emitting;
        }
        public set emitting(isPlaying: boolean) {
            if (this._emitting === isPlaying) { return; }
            this._emitting = isPlaying;
            this.onEmittingChanged.dispatch(isPlaying);
        }
        private _emitting: boolean = true;

        /**
         * 暂停状态发生改变时产生的信号
         */
        public readonly onPausedChanged: signals.Signal = new signals.Signal();
        /**
         * 暂停状态
         * 处于暂停状态的拖尾不生成新的片段, 已有的片段也不衰老消失, 就像时间暂停了
         */
        @paper.serializedField
        @paper.editor.property(paper.editor.EditType.CHECKBOX)
        public get paused(): boolean {
            return this._paused;
        }
        public set paused(isPaused: boolean) {
            if (this._paused === isPaused) { return; }
            this._paused = isPaused;
            this.onPausedChanged.dispatch(isPaused);
        }
        private _paused: boolean = false;
    }
}