import * as signals from "signals";
import { IComponentClass, IGroup } from "./types";
import { filterArray } from "../uuid/Utility";
import Entity from "./Entity";
import Component from "./Component";
import Matcher from "./Matcher";
/**
 * 实体组。
 */
export default class Group<TEntity extends Entity> implements IGroup<Entity> {
    /**
     * @internal
     */
    public static create<TEntity extends Entity>(matcher: Matcher, entities: ReadonlyArray<TEntity>): Group<TEntity> {
        const group = new Group<TEntity>(matcher, entities);

        return group;
    }
    /**
     * 
     */
    public readonly onEntityAdded: signals.Signal<TEntity> = new signals.Signal();
    /**
     * 
     */
    public readonly onEntityRemoved: signals.Signal<TEntity> = new signals.Signal();
    /**
     * 
     */
    public readonly onComponentEnabled: signals.Signal<Component> = new signals.Signal();
    /**
     * 
     */
    public readonly onComponentDisabled: signals.Signal<Component> = new signals.Signal();
    public readonly matcher: Matcher;

    private _entitiesDirty: boolean = false;
    private _entityCount: uint = 0;
    private readonly _entities: (TEntity | null)[] = [];
    private _singleEntity: TEntity | null = null;

    private constructor(matcher: Matcher, entities: ReadonlyArray<TEntity>) {
        this.matcher = matcher;

        for (const entity of entities) {
            this.handleEvent(entity, null as any, true);
            // TODO extra component
        }
    }
    /**
     * @internal
     */
    public handleEvent(entity: TEntity, component: Component, isAdd: boolean): void {
        const { matcher } = this;
        const entities = this._entities;
        const index = entities.indexOf(entity);
        const componentClass = component ? component.constructor as IComponentClass<Component> : null;

        switch (matcher.matches(entity, componentClass, isAdd, index >= 0)) {
            case -2:
                this.onComponentDisabled.dispatch(component);
                break;

            case -1:
                entities[index] = null;
                this._entitiesDirty = true;
                this._entityCount--;
                this._singleEntity = null;
                this.onEntityRemoved.dispatch(entity);
                break;

            case 0:
                break;

            case 1:
                entities[entities.length] = entity;
                this._entityCount++;
                this._singleEntity = entity;
                this.onEntityAdded.dispatch(entity);
                break;

            case 2:
                this.onComponentEnabled.dispatch(component);
                break;
        }
    }

    public containsEntity(entity: TEntity): boolean {
        return this._entities.indexOf(entity) >= 0;
    }

    public get entityCount(): uint {
        return this._entityCount;
    }

    public get entities(): ReadonlyArray<TEntity> {
        const entities = this._entities;

        if (this._entitiesDirty) {
            filterArray(entities, null);
            this._entitiesDirty = false;
        }

        return entities as ReadonlyArray<TEntity>;
    }

    public get singleEntity(): TEntity | null {
        const entityCount = this._entityCount;

        if (this._entitiesDirty) {
            filterArray(this._entities, null);
            this._entitiesDirty = false;
        }

        if (entityCount === 0) {
            return null;
        }
        else if (entityCount > 1) {
            throw new Error();
        }

        return this._singleEntity;
    }
}
