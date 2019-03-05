namespace paper {
    /**
     * 实体组。
     * - 根据匹配器收集指定特征的实体。
     */
    export class Group<TEntity extends IEntity> {
        /**
         * 当实体添加到组时派发事件。
         */
        public static readonly onEntityAdded: signals.Signal<[Group<IEntity>, IEntity]> = new signals.Signal();
        /**
         * 当实体从组中移除时派发事件。
         */
        public static readonly onEntityRemoved: signals.Signal<[Group<IEntity>, IEntity]> = new signals.Signal();
        /**
         * 当组中实体添加非必要组件时派发事件。
         */
        public static readonly onComponentEnabled: signals.Signal<[Group<IEntity>, IComponent]> = new signals.Signal();
        /**
         * 当组中实体移除非必要组件时派发事件。
         */
        public static readonly onComponentDisabled: signals.Signal<[Group<IEntity>, IComponent]> = new signals.Signal();
        /**
         * @internal
         */
        public static create<TEntity extends IEntity>(matcher: ICompoundMatcher<TEntity>): Group<TEntity> {
            return new Group<TEntity>(matcher);
        }
        /**
         * 标记改组是否为行为收集组，仅为兼容 Behaviour 生命周期。
         * @internal
         */
        public readonly isBehaviour: boolean = false;

        private _entitiesDirty: boolean = false;
        private _behavioursDirty: boolean = false;
        private _entityCount: uint = 0;
        private readonly _matcher: ICompoundMatcher<TEntity> = null as any;
        private readonly _entities: (TEntity | null)[] = [];
        private readonly _behaviours: (Behaviour | null)[] = [];
        private _singleEntity: TEntity | null = null;

        private constructor(matcher: ICompoundMatcher<TEntity>) {
            if (matcher.extraOfComponents.length === 1 && matcher.extraOfComponents[0] === Behaviour as any) { // 行为组的特征。
                this.isBehaviour = true;
            }

            this._matcher = matcher;

            for (const scene of Application.sceneManager.scenes) {
                for (const entity of scene.entities) {
                    this.handleEvent(entity as TEntity, null as any, true); // TODO context._entityClass
                    // TODO extra component
                }
            }
        }
        /**
         * 该组是否包含指定实体。
         * @param entity 
         */
        public containsEntity(entity: TEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }
        /**
         * @int
         * @param entity 
         * @param component 
         * @param isAdd 
         */
        public handleEvent(entity: TEntity, component: IComponent, isAdd: boolean): void {
            if (this.isBehaviour) {
                const componentClass = component.constructor as IComponentClass<IComponent>;

                if (componentClass.isBehaviour) {
                    const behaviours = this._behaviours;
                    const index = behaviours.indexOf(component as Behaviour);

                    if (isAdd) {
                        if (index < 0) {
                            behaviours[behaviours.length] = component as Behaviour;
                            Group.onComponentEnabled.dispatch([this, component]);
                        }
                    }
                    else if (index >= 0) {
                        behaviours[index] = null;
                        this._behavioursDirty = true;
                        Group.onComponentDisabled.dispatch([this, component]);
                    }
                }
            }
            else {
                const matcher = this._matcher;
                const entities = this._entities;
                const index = entities.indexOf(entity);
                const componentClass = component ? component.constructor as IComponentClass<IComponent> : null;

                switch (matcher.matches(entity, componentClass, isAdd, index >= 0)) {
                    case -2:
                        Group.onComponentDisabled.dispatch([this, component]);
                        break;

                    case -1:
                        entities[index] = null;
                        this._entitiesDirty = true;
                        this._entityCount--;
                        this._singleEntity = null;
                        Group.onEntityRemoved.dispatch([this, entity]);
                        break;

                    case 0:
                        break;

                    case 1:
                        entities[entities.length] = entity;
                        this._entityCount++;
                        this._singleEntity = entity;
                        Group.onEntityAdded.dispatch([this, entity]);
                        break;

                    case 2:
                        Group.onComponentEnabled.dispatch([this, component]);
                        break;
                }
            }
        }
        /**
         * 该组匹配的实体总数。
         */
        public get entityCount(): uint {
            return this._entities.length;
        }
        /**
         * 该组匹配的所有实体。
         */
        public get entities(): ReadonlyArray<TEntity> {
            const entities = this._entities;

            if (this._entitiesDirty) {
                utility.filterArray(entities, null);
                this._entitiesDirty = false;
            }

            return entities as ReadonlyArray<TEntity>;
        }
        /**
         * 该组匹配的所有行为组件。
         * @internal
         */
        public get behaviours(): ReadonlyArray<Behaviour | null> {
            const behaviours = this._behaviours;

            if (this._behavioursDirty) {
                utility.filterArray(behaviours, null);
                this._behavioursDirty = false;
            }

            return this._behaviours;
        }
        /**
         * 该组的匹配器。
         */
        public get matcher(): Readonly<ICompoundMatcher<TEntity>> {
            return this._matcher;
        }
        /**
         * 该组匹配的单例实体。
         */
        public get singleEntity(): TEntity | null {
            const entityCount = this._entityCount;

            if (this._entitiesDirty) {
                utility.filterArray(this._entities, null);
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

        /**
         * @deprecated
         */
        public hasGameObject(entity: TEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }
        /**
         * @deprecated
         */
        public get gameObjects(): ReadonlyArray<TEntity> {
            return this.entities;
        }
    }
}
