import { ICollector, CollectorReactiveType } from "./types";
import { Entity } from "./Entity";
import { Component } from "./Component";
import { Group } from "./Group";
import { System } from "./System";
/**
 * 响应收集器。
 */
export class Collector<TEntity extends Entity> implements ICollector<TEntity> {
    /**
     * @internal
     */
    public static create<TEntity extends Entity>(group: Group<TEntity>, system: System<TEntity>): Collector<TEntity> {
        const collector = new Collector<TEntity>(group, system);

        return collector;
    }
    /**
     * 该收集器响应的类型。
     */
    public reactiveType: CollectorReactiveType = CollectorReactiveType.InOrder;
    public readonly group: Group<TEntity>;
    public readonly removedComponentes: (Component | null)[] = [];
    public readonly removedEntities: (TEntity | null)[] = [];
    public readonly addedEntities: (TEntity | null)[] = [];
    public readonly addedComponentes: (Component | null)[] = [];
    private _system: System<TEntity> | null = null;

    private constructor(group: Group<TEntity>, system: System<TEntity>) {
        this.group = group;
        this._system = system;

        group.onComponentDisabled.add(this._onComponentDisabled, this);
        group.onEntityRemoved.add(this._onEntityRemoved, this);
        group.onEntityAdded.add(this._onEntityAdded, this);
        group.onComponentEnabled.add(this._onComponentEnabled, this);
    }

    private _onComponentDisabled(component: Component) {
        if ((this.reactiveType & CollectorReactiveType.DisabledComponentImmediately) !== 0) {
            const system = this._system!;
            system.onComponentRemoved && system.onComponentRemoved(component, this.group);
        }
        else {
            const { addedComponentes, removedComponentes } = this;
            const index = addedComponentes.indexOf(component);

            if (index >= 0) {
                addedComponentes[index] = null;
            }

            removedComponentes[removedComponentes.length] = component;
        }
    }

    private _onEntityRemoved(entity: TEntity) {
        if ((this.reactiveType & CollectorReactiveType.RemoveEntityImmediately) !== 0) {
            const system = this._system!;
            system.onEntityRemoved && system.onEntityRemoved(entity, this.group);
        }
        else {
            const { addedEntities, removedEntities } = this;
            const index = addedEntities.indexOf(entity);

            if (index >= 0) {
                addedEntities[index] = null;
            }

            removedEntities[removedEntities.length] = entity;
        }
    }

    private _onEntityAdded(entity: TEntity) {
        if ((this.reactiveType & CollectorReactiveType.AddEntityImmediately) !== 0) {
            const system = this._system!;
            system.onEntityAdded && system.onEntityAdded(entity, this.group);
        }
        else {
            const { addedEntities, removedEntities } = this;
            const index = removedEntities.indexOf(entity);

            if (index >= 0) {
                removedEntities[index] = null;
            }

            addedEntities[addedEntities.length] = entity;
        }
    }

    private _onComponentEnabled(component: Component) {
        if ((this.reactiveType & CollectorReactiveType.EnabledComponentImmediately) !== 0) {
            const system = this._system!;
            system.onComponentAdded && system.onComponentAdded(component, this.group);
        }
        else {
            const { addedComponentes, removedComponentes } = this;
            const index = removedComponentes.indexOf(component);

            if (index >= 0) {
                removedComponentes[index] = null;
            }

            addedComponentes[addedComponentes.length] = component;
        }
    }
    /**
     * 清除缓存。
     */
    public clear(): void {
        const { removedComponentes, removedEntities, addedEntities, addedComponentes } = this;

        if (removedComponentes.length > 0) {
            removedComponentes.length = 0;
        }

        if (removedEntities.length > 0) {
            removedEntities.length = 0;
        }

        if (addedEntities.length > 0) {
            addedEntities.length = 0;
        }

        if (addedComponentes.length > 0) {
            addedComponentes.length = 0;
        }
    }
}
