/**
 * 组件类型。
 */
export const enum ComponentType {
    Node = "Node",
    Renderer = "Renderer",
}
/**
 * 节点名称。
 */
export const enum NodeNames {
    Noname = "Noname",
    Global = "Global",
    Root = "Root",
    MainCamera = "Main Camera",
    EditorCamera = "Editor Camera",
    Editor = "Editor",
    MissingPrefab = "Missing Prefab",
}
/**
 * 节点的标识。
 */
export const enum NodeTags {
    Untagged = "Untagged",
    Respawn = "Respawn",
    Finish = "Finish",
    EditorOnly = "EditorOnly",
    MainCamera = "MainCamera",
    Player = "Player",
    GameController = "GameController",
    Global = "Global",
}
/**
 * 节点的层级。
 */
export const enum NodeLayer {
    Nothing = 0x00000000,
    Everything = 0xFFFFFFFF,

    BuiltinLayer0 = 0x0000001,
    BuiltinLayer1 = 0x0000002,
    BuiltinLayer2 = 0x0000004,
    BuiltinLayer3 = 0x0000008,
    BuiltinLayer4 = 0x0000010,
    BuiltinLayer5 = 0x0000020,
    BuiltinLayer6 = 0x0000040,
    BuiltinLayer7 = 0x0000080,

    UserLayer8 = 0x00000100,
    UserLayer9 = 0x00000200,
    UserLayer10 = 0x00000400,
    UserLayer11 = 0x00000800,
    UserLayer12 = 0x00001000,
    UserLayer13 = 0x00002000,
    UserLayer14 = 0x00004000,
    UserLayer15 = 0x00008000,
    UserLayer16 = 0x00010000,
    UserLayer17 = 0x00020000,
    UserLayer18 = 0x00040000,
    UserLayer19 = 0x00080000,
    UserLayer20 = 0x00100000,
    UserLayer21 = 0x00200000,
    UserLayer22 = 0x00400000,
    UserLayer23 = 0x00800000,
    UserLayer24 = 0x01000000,
    UserLayer25 = 0x02000000,
    UserLayer26 = 0x04000000,
    UserLayer27 = 0x08000000,
    UserLayer28 = 0x10000000,
    UserLayer29 = 0x20000000,
    UserLayer30 = 0x40000000,
    UserLayer31 = 0x80000000,

    Default = BuiltinLayer0,
    TransparentFX = BuiltinLayer1,
    IgnoreRayCast = BuiltinLayer2,
    Water = BuiltinLayer4,
    UI = BuiltinLayer5,
    Editor = BuiltinLayer6,
    EditorUI = BuiltinLayer7,

    Postprocessing = UserLayer8,
}
/**
 * 系统排序。
 */
export const enum SystemOrder {
    Begin = 0,
    Enable = 1000,
    Start = 2000,
    FixedUpdate = 3000,
    Update = 4000,
    Animation = 5000,
    LateUpdate = 6000,
    BeforeRenderer = 7000,
    Renderer = 8000,
    Disable = 9000,
    End = 10000,
}
/**
 * 
 */
export const enum ConstString {
    PathSeparator = "/",
}
/**
 * 应用程序的运行模式。
 */
export const enum RunningMode {
    /**
     * 正常模式。
     */
    Normal = 0b1,
    /**
     * 调试模式。
     */
    Debug = 0b10,
    /**
     * 编辑器模式。
     */
    Editor = 0b100,
    /**
     * 移动设备模式。
     */
    Mobile = 0b1000,
    /**
     * 标准 WebView 模式。
     */
    WebView = 0b10000,
}
/**
 * 
 */
export interface IComponentClassExtensions {
    executeMode?: RunningMode;
}
/**
 * 
 */
export interface ApplicationInitializeOptions {
    /**
     * 应用程序的运行模式。
     */
    runningMode?: RunningMode;
    /**
     * 应用程序启动后需要显式调用的入口函数。
     */
    entry?: string;
    /**
     * 编辑器覆盖整个应用程序的入口函数。
     */
    editorEntry?: string;
    /**
     * 应用程序启动后加载并创建的场景。
     */
    scene?: string;
    /**
     * 逻辑帧频率。
     * - 单位为(帧/秒), 例如设置为 60 为每秒 60 帧。
     */
    tickRate?: uint;
    /**
     * 渲染帧频率。
     * - 单位为(帧/秒), 例如设置为 60 为每秒 60 帧。
     */
    frameRate?: uint;
    /**
     * 是否显示状态面板。
     * - 未设置则默认为 PC 模式显示，手机模式不显示。
     * - 包含 FPS、TPS、内存消耗、渲染耗时、DrawCall 等。
     */
    showStats?: boolean;
    /**
     * 是否显示 Inspector 面板。
     * - 未设置则默认为 PC 模式显示，手机模式不显示。
     */
    showInspector?: boolean;
    /**
     * 可扩展的。
     */
    [key: string]: any;
}