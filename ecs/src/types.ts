import { ISerializableClass } from "./serialize/types";
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
 * 
 */
export interface IPoolClass<TReleasable extends IReleasable> {
    readonly instances: ReadonlyArray<TReleasable>;
}
/**
 * 
 */
export interface IPoolInstance {
    /**
     * 
     */
    initialize(...args: any[]): void;
    /**
     * 
     */
    uninitialize(): void;
}
/**
 * 
 */
export interface IReleasable extends IPoolInstance {
    /**
     * 在此帧末尾释放该对象。
     * - 释放该对象后，必须清除堆上所有对该对象的引用。（该问题必须引起足够的重视）
     * - 不能在静态解释阶段执行。
     */
    release(): this;
}
/**
 * 实体类接口。
 * - 仅用于约束实体类传递。
 */
export interface IEntityClass<TEntity extends IEntity> extends ISerializableClass {
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
export interface IAbstractComponentClass extends ISerializableClass {
    /**
     * 该组件是否为抽象组件。
     */
    readonly isAbstract: IAbstractComponentClass | null;
    /**
     * 该组件是否为单例组件。
     */
    readonly isSingleton: boolean;
    /**
     * 是否允许在同一实体上添加多个该组件。
     */
    readonly allowMultiple: boolean;
    /**
     * 该组件索引。
     */
    readonly componentIndex: int;
    /**
     * 该组件依赖的其他前置组件。
     */
    readonly requireComponents: ReadonlyArray<IComponentClass<IComponent>> | null;
}
/**
 * 组件类接口。
 * - 仅用于约束组件类传递。
 */
export interface IComponentClass<TComponent extends IComponent> extends IAbstractComponentClass {
    /**
     * 禁止实例化组件。
     * @protected
     */
    new(): TComponent;
}
/**
 * 系统类接口。
 */
export interface ISystemClass<TSystem extends ISystem<IEntity>> {
    /**
     * 该系统允许运行的模式。
     */
    readonly executeMode: uint;
    /**
     * 禁止实例化系统。
     * @protected
     */
    new(): TSystem;
}
/**
 * 场景类接口。
 */
export interface ISceneClass<TScene extends IScene> extends ISerializableClass {
    /**
     * 禁止实例化场景。
     * @protected
     */
    new(): TScene;
}
/**
 * 实体接口。
 */
export interface IEntity {
    /**
     * 该实体所属的上下文。
     */
    readonly context: IContext<IEntity>;
    /**
     * 该实体所属的场景。
     */
    scene: IScene;
}
/**
 * 组件接口。
 */
export interface IComponent {
    /**
     * 该组件的实体。
     */
    readonly entity: IEntity;
}
/**
 * 系统接口。
 */
export interface ISystem<TEntity extends IEntity> {
    /**
     * 该系统关心的实体组。
     */
    readonly groups: ReadonlyArray<IGroup<TEntity>>;
    /**
     * 该系统的响应收集器。
     */
    readonly collectors: ReadonlyArray<ICollector<TEntity>>;
}
/**
 * 实体组件匹配器接口。
 */
export interface IMatcher {
    /**
     * 该匹配器的全部组件。
     */
    readonly components: ReadonlyArray<IComponentClass<IComponent>>;
}
/**
 * 
 */
export interface ICompoundMatcher extends IMatcher {
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
export interface INoneOfMatcher extends ICompoundMatcher {
    /**
     * 设置可以包含的任一组件。
     * @param componentClasses 可以包含的任一组件。
     */
    extraOf(...componentClasses: ReadonlyArray<IComponentClass<IComponent>>): INoneOfMatcher;
}
/**
 * 必须包含任一组件的匹配器接口。
 */
export interface IAnyOfMatcher extends INoneOfMatcher {
    /**
     * 设置不能包含的任一组件。
     * @param componentClasses 不能包含的任一组件。
     */
    noneOf(...componentClasses: ReadonlyArray<IComponentClass<IComponent>>): INoneOfMatcher;
}
/**
 * 必须包含全部组件的匹配器接口。
 */
export interface IAllOfMatcher extends IAnyOfMatcher {
    /**
     * 设置必须包含的任一组件。
     * @param componentClasses 必须包含的任一组件。
     */
    anyOf(...componentClasses: ReadonlyArray<IComponentClass<IComponent>>): IAnyOfMatcher;
}
/**
 * 实体组接口。
 */
export interface IGroup<TEntity extends IEntity> {
    /**
     * 该实体组的实体数量。
     */
    readonly entityCount: uint;
    /**
     * 该实体组的匹配器。
     */
    readonly matcher: Readonly<IMatcher>;
    /**
     * 该实体组匹配的全部实体。
     */
    readonly entities: ReadonlyArray<TEntity>;
    /**
     * 该实体组匹配的单例实体。
     */
    readonly singleEntity: TEntity | null;
    /**
     * 该实体组是否包含指定的实体。
     * @param entity 一个实体。
     */
    containsEntity(entity: TEntity): boolean;
}
/**
 * 响应收集器接口。
 */
export interface ICollector<TEntity extends IEntity> {
    /**
     * 该收集器响应的实体组。
     */
    readonly group: IGroup<TEntity>;
    /**
     * 缓存添加的实体。
     */
    readonly addedEntities: ReadonlyArray<TEntity | null>;
    /**
     * 缓存添加的组件。
     */
    readonly addedComponentes: ReadonlyArray<IComponent | null>;
    /**
     * 缓存移除的组件。
     */
    readonly removedComponentes: ReadonlyArray<IComponent | null>;
    /**
     * 缓存移除的实体。
     */
    readonly removedEntities: ReadonlyArray<TEntity | null>;
}
/**
 * 实体上下文。
 */
export interface IContext<TEntity extends IEntity> {
    /**
     * 该上下文的实体数量。
     */
    readonly entityCount: uint;
    /**
     * 该上下文的全部实体。
     */
    readonly entities: ReadonlyArray<TEntity>;
    /**
     * 该上下文的实体类。
     */
    readonly entityClass: IEntityClass<TEntity>;
    /**
     * 该上下文所属的应用程序。
     */
    readonly application: IApplication;
    /**
     * 该上下文是否包含指定的实体。
     * @param entity 一个实体。
     */
    containsEntity(entity: TEntity): boolean;
}
/**
 * 场景接口。
 */
export interface IScene {
    /**
     * 该场景的实体数量。
     */
    readonly entityCount: uint;
    /**
     * 该场景的全部实体。
     */
    readonly entities: ReadonlyArray<IEntity>;
    /**
     * 该场景所属的应用程序。
     */
    readonly application: IApplication;
    /**
     * 该场景是否包含指定的实体。
     * @param entity 一个实体。
     */
    containsEntity(entity: IEntity): boolean;
}
/**
 * 应用程序接口。
 */
export interface IApplication {
}
