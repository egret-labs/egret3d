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
     * 应用程序运行模式。
     */
    export const enum PlayerMode {
        Player = 0b001,
        DebugPlayer = 0b010,
        Editor = 0b100,
    }
    /**
     * 
     */
    export type EntityExtras = { linkedID?: string, rootID?: string, prefab?: Prefab };
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
        version?: string;
        /**
         * 
         */
        compatibleVersion?: string;
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
     * 实体类接口。
     * - 仅用于约束实体类传递。
     */
    export interface IEntityClass<TEntity extends IEntity> {
        /**
         * 禁止实例化实体。
         * @protected
         */
        new(): TEntity;
    }
    /**
     * 组件类接口。
     * - 仅用于约束组件类传递。
     */
    export interface IComponentClass<TComponent extends IComponent> extends IBaseClass {
        /**
         * 该组件是否在编辑模式拥有生命周期。
         */
        readonly executeInEditMode: boolean;
        /**
         * 是否允许在同一实体上添加多个该组件。
         */
        readonly allowMultiple: boolean;
        /**
         * 该组件依赖的其他前置组件。
         */
        readonly requireComponents: IComponentClass<IComponent>[] | null;
        /**
         * 该组件是否为抽象组件。
         */
        readonly isAbstract: IComponentClass<IComponent>;
        /**
         * 该组件是否为单例组件。
         */
        readonly isSingleton: boolean;
        /**
         * 该组件是否为 Behaviour 组件。
         */
        readonly isBehaviour: boolean;
        /**
         * 该组件索引。
         */
        readonly componentIndex: int;
        /**
         * 禁止实例化组件。
         * @protected
         */
        new(): TComponent;
    }
    /**
     * 系统类接口。
     */
    export interface ISystemClass<TSystem extends ISystem<TEntity>, TEntity extends IEntity> {
        /**
         * 
         */
        readonly executeMode: PlayerMode;
        /**
         * 禁止实例化系统。
         * @protected
         */
        new(...args: any[]): TSystem;
    }
    /**
     * 实体接口。
     */
    export interface IEntity extends IUUID {
        /**
         * 该实体是否已经被销毁。
         */
        readonly isDestroyed: boolean;
        /**
         * 该实体的激活状态。
         */
        enabled: boolean;
        /**
         * 该实体是否可以被销毁。
         * - 当此值为 `true` 时，将会被添加到全局场景，反之将被添加到激活场景。
         * - 设置此属性时，可能改变该实体的父级。
         */
        dontDestroy: boolean;
        /**
         * 该实体的名称。
         */
        name: string;
        /**
         * 该实体的标签。
         */
        tag: DefaultTags | string;
        /**
         * 
         */
        hideFlags: HideFlags;
        /**
         * 该实体已经添加的全部组件。
         */
        readonly components: ReadonlyArray<IComponent>;
        /**
         * 该实体所属的场景。
         */
        scene: IScene;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        extras?: EntityExtras;
        /**
         * 实体内部初始化时执行。
         * - 重写此方法时，必须调用 `super.initialize()`。
         */
        initialize(): void;
        /**
         * 实体内部卸载时执行。
         * - 重写此方法时，必须调用 `super.uninitialize()`。
         */
        uninitialize(): void;
        /**
         * 销毁该实体。
         */
        destroy(): boolean;
        /**
         * 添加一个指定组件实例。
         * @param componentClass 组件类。
         * @param config BaseComponent 组件 `initialize(config?: any)` 方法或 Behaviour 组件 `onAwake(config?: any)` 方法的可选参数。
         */
        addComponent<T extends IComponent>(componentClass: IComponentClass<T>, config?: any): T;
        /**
         * 移除一个指定组件实例。
         * @param componentInstanceOrClass 组件类或组件实例。
         * @param isExtends 是否尝试移除全部派生自此组件的实例。
         */
        removeComponent<T extends IComponent>(componentInstanceOrClass: IComponentClass<T> | T, isExtends?: boolean): boolean;
        /**
         * 移除全部指定组件的实例。
         * - 通常只有该组件类允许同一个实体添加多个组件实例时才需要此操作。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试移除全部派生自此组件的实例。
         */
        removeAllComponents<T extends IComponent>(componentClass?: IComponentClass<T>, isExtends?: boolean): boolean;
        /**
         * 从该实体已注册的全部组件中获取一个指定组件实例，如果未添加该组件，则添加该组件。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getOrAddComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T;
        /**
         * 获取一个指定组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getComponent<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T | null;
        /**
         * 获取全部指定组件实例。
         * @param componentClass 组件类。
         * @param isExtends 是否尝试获取全部派生自此组件的实例。
         */
        getComponents<T extends IComponent>(componentClass: IComponentClass<T>, isExtends?: boolean): T[];
        /**
         * 
         * @param componentClasses 
         */
        hasComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean;
        /**
         * 
         * @param componentClasses 
         */
        hasAnyComponents(componentClasses: IComponentClass<IComponent>[], componentEnabled: boolean): boolean;
    }
    /**
     * 组件接口。
     */
    export interface IComponent extends IUUID {
        /**
         * 该组件是否已经被销毁。
         */
        readonly isDestroyed: boolean;
        /**
         * 该组件自身的激活状态。
         */
        enabled: boolean;
        /**
         * 该组件全局的激活状态。
         */
        readonly isActiveAndEnabled: boolean;
        /**
         * 
         */
        hideFlags: HideFlags;
        /**
         * 该组件的实体。
         */
        readonly entity: IEntity;
        /**
         * 仅保存在编辑器环境的额外数据，项目发布该数据将被移除。
         */
        extras?: ComponentExtras;
        /**
         * @internal
         */
        _destroy(): void;
        /**
         * 组件被添加后，内部初始化时执行。
         * - 重写此方法时，必须调用 `super.initialize()`。
         * @param config 实体添加该组件时可以传递的初始化数据。（注意：如果添加该组件时，实体未处于激活状态，则该属性无效）
         */
        initialize(config?: any): void;
        /**
         * 组件被移除后，内部卸载时执行。
         * - 重写此方法时，必须调用 `super.uninitialize()`。
         */
        uninitialize(): void;
        /**
         * 
         */
        dispatchEnabledEvent(enabled: boolean): void;
    }
    /**
     * 系统接口。
     */
    export interface ISystem<TEntity extends IEntity> {
        /**
         * 该系统是否被激活。
         */
        enabled: boolean;
        /**
         * 该系统的执行顺序。
         */
        readonly order: SystemOrder;
        /**
         * 该系统在调试模式时每帧消耗的时间，仅用于性能统计。（以毫秒为单位）
         */
        readonly deltaTime: uint;
        /**
         * 
         */
        readonly groups: ReadonlyArray<Group<TEntity>>;
        /**
         * 
         */
        readonly collectors: ReadonlyArray<Collector<TEntity>>;
        /**
         * @internal
         */
        initialize(config?: any): void;
        /**
         * @internal
         */
        uninitialize(): void;
        /**
         * 该系统初始化时调用。
         * @param config 该系统被注册时可以传递的初始化数据。
         */
        onAwake?(config?: any): void;
        /**
         * 该系统被激活时调用。
         * @see paper.BaseSystem#enabled
         */
        onEnable?(): void;
        /**
         * 该系统开始运行时调用。
         */
        onStart?(): void;
        /**
         * 充分非必要组件从实体移除时调用。
         * @param component 移除的实体组件。
         * @param group 移除实体组件的实体组。
         */
        onComponentRemoved?(component: IComponent, group: Group<TEntity>): void;
        /**
         * 实体从系统移除时调用。
         * @param entity 移除的实体。
         * @param group 移除实体的实体组。
         */
        onEntityRemoved?(entity: TEntity, group: Group<TEntity>): void;
        /**
         * 实体被添加到系统时调用。
         * @param entity 收集的实体。
         * @param group 收集实体的实体组。
         */
        onEntityAdded?(entity: TEntity, group: Group<TEntity>): void;
        /**
         * 充分非必要组件添加到实体时调用。
         * @param component 收集的实体组件。
         * @param group 收集实体组件的实体组。
         */
        onComponentAdded?(component: IComponent, group: Group<TEntity>): void;
        /**
         * 生成一个新的逻辑帧时调用
         * @param deltaTime 上一逻辑帧到此帧流逝的时间。（以秒为单位）
         */
        onTick?(deltaTime?: number): void;
        /**
         * 在新的逻辑帧的清理阶段调用
         * @param deltaTime 上一逻辑帧到此帧流逝的时间。（以秒为单位）
         */
        onTickCleanup?(deltaTime?: number): void;
        /**
         * 生成一个新的渲染帧时调用
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        onFrame?(deltaTime?: number): void;
        /**
         * 在新的渲染帧的清理阶段调用
         * @param deltaTime 上一渲染帧到此帧流逝的时间。（以秒为单位）
         */
        onFrameCleanup?(deltaTime?: number): void;
        /**
         * 该系统被禁用时调用。
         * @see paper.BaseSystem#enabled
         */
        onDisable?(): void;
        /**
         * 该系统被注销时调用。
         * @see paper.SystemManager#unregister()
         * @see paper.Application#systemManager
         */
        onDestroy?(): void;
    }
    /**
     * 实体组件匹配器接口。
     */
    export interface IMatcher<TEntity extends IEntity> {
        /**
         * 该匹配器是否以组件的激活状态做为匹配条件。
         * - 默认为 `true`。
         */
        readonly componentEnabledFilter: boolean;
        /**
         * 该匹配器的唯一标识。
         */
        readonly id: string;
        /**
         * 该匹配器的全部组件。
         */
        readonly components: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 指定的实体是否与该匹配器的规则相匹配。
         * @param entity 指定的实体。
         */
        matches(entity: TEntity, component: IComponentClass<IComponent> | null, isAdd: boolean, isAdded: boolean): -2 | -1 | 0 | 1 | 2;
    }
    /**
     * 
     */
    export interface ICompoundMatcher<TEntity extends IEntity> extends IMatcher<TEntity> {
        /**
         * 必须包含的全部组件。
         */
        readonly allOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 必须包含的任一组件。
         */
        readonly anyOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 不能包含的任一组件。
         */
        readonly noneOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
        /**
         * 可以包含的任一组件。
         */
        readonly extraOfComponents: ReadonlyArray<IComponentClass<IComponent>>;
    }
    /**
     * 不能包含任一组件的匹配器接口。
     */
    export interface INoneOfMatcher<TEntity extends IEntity> extends ICompoundMatcher<TEntity> {
        /**
         * 设置可以包含的任一组件。
         * @param componentClasses 可以包含的任一组件。
         */
        extraOf(...componentClasses: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity>;
    }
    /**
     * 必须包含任一组件的匹配器接口。
     */
    export interface IAnyOfMatcher<TEntity extends IEntity> extends INoneOfMatcher<TEntity> {
        /**
         * 设置不能包含的任一组件。
         * @param componentClasses 不能包含的任一组件。
         */
        noneOf(...componentClasses: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity>;
    }
    /**
     * 必须包含全部组件的匹配器接口。
     */
    export interface IAllOfMatcher<TEntity extends IEntity> extends IAnyOfMatcher<TEntity> {
        /**
         * 设置必须包含的任一组件。
         * @param componentClasses 必须包含的任一组件。
         */
        anyOf(...componentClasses: IComponentClass<IComponent>[]): IAnyOfMatcher<TEntity>;
    }
    /**
     * 场景接口。
     */
    export interface IScene extends IUUID {
        /**
         * 该场景是否已经被销毁。
         */
        readonly isDestroyed: boolean;
        /**
         * 该场景的实体总数。
         */
        readonly entityCount: uint;
        /**
         * 该场景的名称。
         */
        name: string;
        /**
         * 该场景的全部实体。
         */
        readonly entities: ReadonlyArray<IEntity>;
        /**
         * 场景内部初始化时执行。
         */
        initialize(): void;
        /**
         * 场景内部卸载时执行。
         */
        uninitialize(): void;
        /**
         * 销毁该场景。
         */
        destroy(): boolean;
        /**
         * 该场景是否包含指定实体。
         */
        containsEntity(entity: IEntity): boolean;
        /**
         * 通过实体名称获取该场景的一个实体。
         */
        find(name: string): IEntity | null;
    }
    /**
     * 
     */
    export interface RunOptions {
        playerMode?: PlayerMode;
        /**
         * 逻辑帧时间, 单位为秒, 例如设置为 1.0 / 60.0 为每秒 60 帧
         */
        tickInterval?: number;
        /**
         * 渲染帧时间, 单位为秒, 例如设置为 1.0 / 60.0 为每秒 60 帧
         */
        frameInterval?: number;
    }
}
