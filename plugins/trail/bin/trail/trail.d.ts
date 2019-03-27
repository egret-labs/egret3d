declare namespace paper {
    /**
     * 默认标识和自定义标识。
     */
    const enum DefaultTags {
    }
    /**
     * 内置层级和自定义层级。
     */
    const enum Layer {
    }
}
declare namespace egret3d {
    /**
     * 渲染排序。
     */
    const enum RenderQueue {
    }
    /**
     *
     */
    const enum AttributeSemantics {
    }
    /**
     *
     */
    const enum UniformSemantics {
    }
}
/**
 * TODO:
 *
 * * 目前并未支持颜色参数, 因为渲染器还无法正常工作
 * * 支持除 `TrailTextureMode.stretch` 以外的 `TrailTextureMode`, 未完成
 * * 支持宽度曲线和颜色渐变以及相应的取样算法
 */
declare namespace egret3d.trail {
}
declare namespace egret3d.trail {
    /**
     * 拖尾的朝向
     */
    enum TrailAlignment {
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
    enum TrailTextureMode {
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
    class TrailComponent extends paper.BaseComponent {
        /**
         * 拖尾的存活时间 (秒)
         */
        time: number;
        /**
         * 生成下一个拖尾片段的最小距离
         */
        minVertexDistance: number;
        /**
         * 拖尾的宽度 (值 / 变化曲线)
         */
        width: number;
        /**
         * 生命期结束后是否自动销毁
         */
        autoDestruct: boolean;
        /**
         * 拖尾的朝向是始终面对摄像机还是有自己的单独设置
         * @see {TrailAlignment}
         */
        Alignment: TrailAlignment;
        /**
         * 拖尾的材质模式
         * @see {TrailTextureMode}
         */
        textureMode: TrailTextureMode;
        private _timeScale;
        private readonly _batcher;
        initialize(): void;
        uninitialize(): void;
        /**
         * 从头开始播放
         */
        play(): void;
        /**
         * (从暂停中)恢复播放, 如果未暂停, 就从头开始播放
         */
        resume(): void;
        /**
         * 暂停
         */
        pause(): void;
        /**
         * 停止播放
         */
        stop(): void;
        /**
         * 是否正在播放
         */
        readonly isPlaying: boolean;
        /**
         * 是否播放已经暂停
         */
        readonly isPaused: boolean;
        setupRenderer(): void;
    }
}
declare namespace egret3d.trail {
    /**
     * 拖尾系统
     */
    class TrailSystem extends paper.BaseSystem<paper.GameObject> {
        protected getMatchers(): paper.IAllOfMatcher<paper.GameObject>[];
        onEntityAdded(entity: paper.GameObject): void;
        onFrame(deltaTime: float): void;
    }
    function createTrail(name?: string): paper.GameObject;
}
