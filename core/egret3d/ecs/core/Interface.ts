type int = number;
type uint = number;
type float = number;

namespace paper {
    /**
     * 
     */
    export const enum HideFlags {
        /**
         * 
         */
        None = 0b0000,
        /**
         * 
         */
        NotEditable = 0b0001,
        /**
         * 
         */
        NotTouchable = 0b0010,
        /**
         * 
         */
        DontSave = 0b0100,
        /**
         * 
         */
        Hide = 0b1000 | NotTouchable,
        /**
         * 
         */
        HideAndDontSave = Hide | DontSave,
    }
    /**
     * 
     */
    export const enum DefaultNames {
        NoName = "NoName",
        Default = "Default",
        Global = "Global",
        MainCamera = "Main Camera",
        EditorCamera = "Editor Camera",
        Editor = "Editor",
        MissingPrefab = "Missing Prefab",
    }
    /**
     * 默认标识和自定义标识。
     */
    export const enum DefaultTags {
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
     * 内置层级和自定义层级。
     */
    export const enum Layer {
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
    export type GameObjectExtras = { linkedID?: string, rootID?: string, prefab?: Prefab };
    /**
     * 
     */
    export type ComponentExtras = { linkedID?: string };
    /**
     * @private
     */
    export interface IUUID {
        /**
         * 对象的唯一标识。
         * @readonly
         */
        readonly uuid: string;
    }
    /**
     * 
     */
    export interface IAssetReference {
        /**
         * 
         */
        readonly asset: number;
    }
    /**
     * 
     */
    export interface IClass {
        /**
         * 
         */
        readonly class: string;
    }
    /**
     * 
     */
    export interface ICCS<T extends ICCS<T>> {
        /**
         * 克隆。
         */
        clone(): T;
        /**
         * 拷贝。
         */
        copy(value: Readonly<T>): T;
        /**
         * 设置。
         */
        set(...args: any[]): T;
    }
    /**
     * 
     */
    export interface ISerializedObject extends IUUID, IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 
     */
    export interface ISerializedStruct extends IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 序列化数据接口。
     */
    export interface ISerializedData {
        /**
         * 
         */
        version?: number;
        /**
         * 
         */
        compatibleVersion?: number;
        /**
         * 所有资源。
         */
        readonly assets?: string[];
        /**
         * 所有实体。（至多含一个场景）
         */
        readonly objects?: ISerializedObject[];
        /**
         * 所有组件。
         */
        readonly components?: ISerializedObject[];
    }
    /**
     * 序列化接口。
     */
    export interface ISerializable {
        /**
         * 序列化。
         * @returns 序列化后的数据。
         */
        serialize(): any;
        /**
         * 反序列化。
         * @param data 反序列化数据。
         * @param deserializer Deserializer。
         * @returns 反序列化后的数据。
         */
        deserialize(data: any, deserializer?: Deserializer): this | any;
    }
    /**
     * 基础对象类接口。
     * - 仅用于约束基础对象的装饰器。
     */
    export interface IBaseClass extends Function {
        /**
         * @internal
         */
        readonly __owner?: IBaseClass;
        /**
         * @internal
         */
        readonly __deserializeIgnore?: string[];
        /**
         * @internal
         */
        readonly __serializeKeys?: { [key: string]: string | null };
        /**
         * @internal
         */
        readonly __onRegister: () => boolean;
    }
    /**
     * 组件类接口。
     * - 仅用于约束组件类传递。
     */
    export interface IComponentClass<T extends BaseComponent> extends IBaseClass {
        /**
         * 该组件的实例是否在编辑模式拥有生命周期。
         * @internal
         */
        readonly executeInEditMode: boolean;
        /**
         * 是否允许在同一实体上添加多个该组件的实例。
         * @internal
         */
        readonly allowMultiple: boolean;
        /**
         * @internal
         */
        readonly notAllowMultiple: boolean;
        /**
         * 该组件实例依赖的其他前置组件。
         * @internal
         */
        readonly requireComponents: IComponentClass<BaseComponent>[] | null;
        /**
         * 当该组件被激活时派发事件。
         * @internal
         */
        readonly onComponentEnabled: signals.Signal;
        /**
         * 当该组件实例被禁用时派发事件。
         * @internal
         */
        readonly onComponentDisabled: signals.Signal;
        /**
         * @internal
         */
        readonly __isAbstract: any;
        /**
         * 该组件实例是否为单例组件。
         * @internal
         */
        readonly __isSingleton: boolean;
        /**
         * 该组件实例是否为单例组件。
         * @internal
         */
        readonly __isBehaviour: boolean;
        /**
         * 该组件实例索引。
         * @internal
         */
        readonly __index: int;
        /**
         * @protected
         */
        new(): T;
    }
}
