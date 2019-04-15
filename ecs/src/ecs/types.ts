import { IUUIDClass } from "../basic";
/**
 * 实体响应收集器响应类型。
 */
export const enum CollectorReactiveType {
    /**
     * 按照系统排序响应。
     */
    InOrder = 0,
    /**
     * 添加实体时立即响应。
     */
    AddEntityImmediately = 0b0001,
    /**
     * 移除实体时立即响应。
     */
    RemoveEntityImmediately = 0b0010,
    /**
     * 激活组件时立即响应。
     */
    EnabledComponentImmediately = 0b0100,
    /**
     * 禁用组件时立即响应。
     */
    DisabledComponentImmediately = 0b1000,
}
/**
 * 实体类接口。
 * - 仅用于约束实体类传递。
 */
export interface IEntityClass<TEntity extends IEntity> extends IUUIDClass {
    /**
     * 该实体的必须组件。
     */
    readonly requireComponents: ReadonlyArray<IComponentClass<IComponent>> | null;
    /**
     * 
     */
    readonly extensions: { [key: string]: any } | null;
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
export interface IAbstractComponentClass<TComponent extends IComponent> extends IUUIDClass {
    /**
     * 该组件是否为抽象组件。
     */
    readonly isAbstract: IAbstractComponentClass<TComponent> | null;
    /**
     * 是否允许在同一实体上添加多个该组件。
     */
    readonly allowMultiple: boolean;
    /**
     * 该组件索引。
     */
    readonly componentIndex: int;
    /**
     * 
     */
    readonly componentType: string;
    /**
     * 
     */
    readonly componentTag: string;
    /**
     * 该组件依赖的其他前置组件。
     */
    readonly requireComponents: ReadonlyArray<IComponentClass<IComponent>> | null;
    /**
     * 
     */
    readonly extensions: { [key: string]: any } | null;
}
/**
 * 组件类接口。
 * - 仅用于约束组件类传递。
 */
export interface IComponentClass<TComponent extends IComponent> extends IAbstractComponentClass<TComponent> {
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
 * 实体接口。
 */
export interface IEntity {
    /**
     * 该实体所属的上下文。
     */
    readonly context: IContext<IEntity>;
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
     * 
     */
    readonly context: IContext<TEntity>;
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
    readonly components: ReadonlyArray<IAbstractComponentClass<IComponent>>;
    /**
     * 必须包含的全部组件。
     */
    readonly allOfComponents: ReadonlyArray<IAbstractComponentClass<IComponent>>;
    /**
     * 必须包含的任一组件。
     */
    readonly anyOfComponents: ReadonlyArray<IAbstractComponentClass<IComponent>>;
    /**
     * 不能包含的任一组件。
     */
    readonly noneOfComponents: ReadonlyArray<IAbstractComponentClass<IComponent>>;
    /**
     * 可以包含的任一组件。
     */
    readonly extraOfComponents: ReadonlyArray<IAbstractComponentClass<IComponent>>;
}
/**
 * 不能包含任一组件的匹配器接口。
 */
export interface INoneOfMatcher extends IMatcher {
    /**
     * 设置可以包含的任一组件。
     * @param componentClasses 可以包含的任一组件。
     */
    extraOf(...componentClasses: ReadonlyArray<IAbstractComponentClass<IComponent>>): INoneOfMatcher;
}
/**
 * 必须包含任一组件的匹配器接口。
 */
export interface IAnyOfMatcher extends INoneOfMatcher {
    /**
     * 设置不能包含的任一组件。
     * @param componentClasses 不能包含的任一组件。
     */
    noneOf(...componentClasses: ReadonlyArray<IAbstractComponentClass<IComponent>>): INoneOfMatcher;
}
/**
 * 必须包含全部组件的匹配器接口。
 */
export interface IAllOfMatcher extends IAnyOfMatcher {
    /**
     * 设置必须包含的任一组件。
     * @param componentClasses 必须包含的任一组件。
     */
    anyOf(...componentClasses: ReadonlyArray<IAbstractComponentClass<IComponent>>): IAnyOfMatcher;
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
     * 缓存移除的组件。
     */
    readonly removedComponentes: ReadonlyArray<IComponent | null>;
    /**
     * 缓存移除的实体。
     */
    readonly removedEntities: ReadonlyArray<TEntity | null>;
    /**
     * 缓存添加的实体。
     */
    readonly addedEntities: ReadonlyArray<TEntity | null>;
    /**
     * 缓存添加的组件。
     */
    readonly addedComponentes: ReadonlyArray<IComponent | null>;
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
     * 该上下文是否包含指定的实体。
     * @param entity 一个实体。
     */
    containsEntity(entity: TEntity): boolean;
}
