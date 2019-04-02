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
         * 在移动突然反向时是否自动翻转, 避免出现尖角现象
         */
        autoFlip: boolean;
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
        /**
         * 发射状态发生改变时产生的信号
         */
        readonly onEmittingChanged: signals.Signal;
        /**
         * 发射状态: 表示拖尾是否在不断的生成新的拖尾片段
         */
        emitting: boolean;
        private _emitting;
        /**
         * 暂停状态发生改变时产生的信号
         */
        readonly onPausedChanged: signals.Signal;
        /**
         * 暂停状态
         * 处于暂停状态的拖尾不生成新的片段, 已有的片段也不衰老消失, 就像时间暂停了
         */
        paused: boolean;
        private _paused;
    }
}
declare namespace egret3d.trail {
    /**
     * 拖尾系统
     */
    class TrailSystem extends paper.BaseSystem<paper.GameObject> {
        private _batchers;
        /**
         * `GameObject` 的以下各个组件齐全时才会进入到此系统, 触发 `onEntityAdded()`
         */
        protected getMatchers(): paper.IAllOfMatcher<paper.GameObject>[];
        /**
         * TrailComponent 需要依赖 MeshFilter 等组件
         * , 在 `onEntityAdded()` 可以确保 TrailComponent 本身和它依赖的组件都添加完成了
         *
         * @param entity 进入系统的对象
         */
        onEntityAdded(entity: paper.GameObject): void;
        /**
         *
         * @param entity 离开系统的对象
         */
        onEntityRemoved(entity: paper.GameObject): void;
        /**
         * 渲染帧更新
         * @param deltaTime 帧时长(秒)
         */
        onFrame(deltaTime: float): void;
    }
    /**
     * 创建拖尾对象
     * @param name 对象名称
     */
    function createTrail(name?: string): paper.GameObject;
}
