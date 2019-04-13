import { SystemOrder, ISystemClass, ISystem, IMatcher } from "./types";
import { Entity } from "./Entity";
import { Component } from "./Component";
import { Matcher } from "./Matcher";
import { Group } from "./Group";
import { Collector } from "./Collector";
import { Context } from "./Context";
/**
 * 基础系统。
 * - 全部系统的基类。
 */
export abstract class System<TEntity extends Entity> implements ISystem<TEntity> {

    public static readonly executeMode: uint = 0;
    /**
     * @internal
     */
    public static create<TSystem extends System<Entity>>(systemClass: ISystemClass<TSystem>, order: SystemOrder, context: Context<Entity>): TSystem {
        const system = new systemClass();
        system.initialize(order, context);

        return system;
    }
    /**
     * 该系统的激活状态。
     */
    public enabled: boolean = true;
    /**
     * 该系统的排列顺序。
     */
    public readonly order: SystemOrder = SystemOrder.Update;
    /**
     * 
     */
    public readonly deltaTime: uint = 0;
    public readonly context: Context<TEntity> = null!;
    public readonly groups: ReadonlyArray<Group<TEntity>> = [];
    public readonly collectors: ReadonlyArray<Collector<TEntity>> = [];
    /**
     * @internal
     */
    public _lastEnabled: boolean = false;
    /**
     * @internal
     */
    public _executeEnabled: boolean = false;
    /**
     * 禁止实例化系统。
     * @protected
     */
    public constructor() {
    }
    /**
     * 获取该系统需要响应的组件匹配器。
     */
    protected getMatchers(): ReadonlyArray<IMatcher> | null {
        return null;
    }
    /**
     * 
     */
    protected getListeners(): { type: signals.Signal, listener: (component: Component) => void }[] | null {
        return null;
    }

    public initialize(order: SystemOrder, context: Context<TEntity>): void {
        (this.order as SystemOrder) = order;
        (this.context as Context<TEntity>) = context;
        const matchers = this.getMatchers();
        const listeners = this.getListeners();

        if (matchers !== null) {
            for (const matcher of matchers) {
                const group = context.getGroup(matcher as Matcher);
                const collector = Collector.create(group);
                (this.groups as Group<TEntity>[]).push(group);
                (this.collectors as Collector<TEntity>[]).push(collector);
            }
        }

        if (listeners !== null) {
            for (const config of listeners) {
                config.type.add(config.listener, this);
            }
        }
    }

    public uninitialize(): void {
    }

    public onEnable?(): void;
    public onStart?(): void;
    public onComponentRemoved?(component: Component, group: Group<TEntity>): void;
    public onEntityRemoved?(entity: TEntity, group: Group<TEntity>): void;
    public onEntityAdded?(entity: TEntity, group: Group<TEntity>): void;
    public onComponentAdded?(component: Component, group: Group<TEntity>): void;
    public onTick?(deltaTime?: float): void;
    public onFrame?(deltaTime?: float): void;
    public onFrameCleanup?(deltaTime?: float): void;
    public onTickCleanup?(deltaTime?: float): void;
    public onDisable?(): void;
}
