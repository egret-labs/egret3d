namespace paper {
    /**
     * 实体组。
     * - 根据匹配器收集指定特征的实体。
     */
    export class Group<TEntity extends Entity> implements IGroup<TEntity> {
        /**
         * 当实体添加到组时派发事件。
         */
        public static readonly onEntityAdded: signals.Signal<[IGroup<Entity>, Entity]> = new signals.Signal();
        /**
         * 当实体从组中移除时派发事件。
         */
        public static readonly onEntityRemoved: signals.Signal<[IGroup<Entity>, Entity]> = new signals.Signal();
        /**
         * 当组中实体添加非必要组件时派发事件。
         */
        public static readonly onComponentEnabled: signals.Signal<[IGroup<Entity>, IComponent]> = new signals.Signal();
        /**
         * 当组中实体移除非必要组件时派发事件。
         */
        public static readonly onComponentDisabled: signals.Signal<[IGroup<Entity>, IComponent]> = new signals.Signal();
        /**
         * @internal
         */
        public static create<TEntity extends Entity>(matcher: IMatcher<TEntity>): IGroup<TEntity> {
            return new Group(matcher);
        }

        private readonly _matcher: IMatcher<TEntity>;
        private readonly _entities: TEntity[] = [];

        private constructor(matcher: IMatcher<TEntity>) {
            this._matcher = matcher;
        }

        public containsEntity(entity: TEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }

        public handleEvent(entity: TEntity, component: IComponent, isAdded: boolean): void {
            const matcher = this._matcher;
            const entities = this._entities;
            const index = entities.indexOf(entity);

            if (isAdded) {
                if (index >= 0) {
                    if (matcher.matchesExtra(component.constructor as IComponentClass<IComponent>)) {
                        Group.onComponentEnabled.dispatch([this, component]);
                    }
                }
                else if (matcher.matches(entity)) {
                    entities.push(entity);
                    Group.onEntityAdded.dispatch([this, entity]);
                }
            }
            else if (index >= 0) {
                if (matcher.matchesExtra(component.constructor as IComponentClass<IComponent>)) {
                    Group.onComponentDisabled.dispatch([this, component]);
                }
                else {
                    entities.splice(index, 1);
                    Group.onEntityRemoved.dispatch([this, entity]);
                }
            }
        }

        public get entityCount(): uint {
            return this._entities.length;
        }

        public get matcher(): Readonly<IMatcher<TEntity>> {
            return this._matcher;
        }

        public get entity(): TEntity {
            return this._entities[0];
        }

        public get entities(): ReadonlyArray<TEntity> {
            return this._entities;
        }
    }
}
