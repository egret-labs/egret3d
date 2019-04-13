import { ICollector } from "./types";
import { Entity } from "./Entity";
import { Component } from "./Component";
import { Group } from "./Group";
/**
 * 响应收集器。
 */
export class Collector<TEntity extends Entity> implements ICollector<TEntity> {
    /**
     * @internal
     */
    public static create<TEntity extends Entity>(group: Group<TEntity>): Collector<TEntity> {
        const collector = new Collector<TEntity>(group);

        return collector;
    }

    public readonly group: Group<TEntity>;
    public readonly addedEntities: (TEntity | null)[] = [];
    public readonly addedComponentes: (Component | null)[] = [];
    public readonly removedComponentes: (Component | null)[] = [];
    public readonly removedEntities: (TEntity | null)[] = [];

    private constructor(group: Group<TEntity>) {
        this.group = group;
        group.onEntityAdded.add(this._onEntityAdded, this);
        group.onEntityRemoved.add(this._onEntityRemoved, this);
        group.onComponentEnabled.add(this._onComponentEnabled, this);
        group.onComponentDisabled.add(this._onComponentDisabled, this);
    }

    private _onEntityAdded(entity: TEntity) {
        const { addedEntities, removedEntities } = this;
        const index = removedEntities.indexOf(entity);

        if (index >= 0) {
            removedEntities[index] = null;
        }

        addedEntities.push(entity);
    }

    private _onEntityRemoved(entity: TEntity) {
        const { addedEntities, removedEntities } = this;
        const index = addedEntities.indexOf(entity);

        if (index >= 0) {
            addedEntities[index] = null;
        }

        removedEntities.push(entity);
    }

    private _onComponentEnabled(component: Component) {
        const { addedComponentes, removedComponentes } = this;
        const index = removedComponentes.indexOf(component);

        if (index >= 0) {
            removedComponentes[index] = null;
        }

        addedComponentes.push(component);
    }

    private _onComponentDisabled(component: Component) {
        const { addedComponentes, removedComponentes } = this;
        const index = addedComponentes.indexOf(component);

        if (index >= 0) {
            addedComponentes[index] = null;
        }

        removedComponentes.push(component);
    }
    /**
     * 清除缓存。
     */
    public clear(): void {
        const { addedEntities, removedEntities, addedComponentes, removedComponentes } = this;

        if (addedEntities.length > 0) {
            addedEntities.length = 0;
        }

        if (removedEntities.length > 0) {
            removedEntities.length = 0;
        }

        if (addedComponentes.length > 0) {
            addedComponentes.length = 0;
        }

        if (removedComponentes.length > 0) {
            removedComponentes.length = 0;
        }
    }
}
