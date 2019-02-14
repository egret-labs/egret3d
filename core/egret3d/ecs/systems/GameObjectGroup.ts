namespace paper {
    /**
     * 实体组。
     * - 根据匹配器收集指定特征的实体。
     */
    export class Group<TEntity extends IEntity> implements IGroup<TEntity> {
        /**
         * 
         */
        public static readonly onEntityAdded: signals.Signal<[IGroup<IEntity>, IEntity, IComponent]> = new signals.Signal();
        /**
         * 
         */
        public static readonly onEntityRemoved: signals.Signal<[IGroup<IEntity>, IEntity, IComponent]> = new signals.Signal();
        /**
         * @internal
         */
        public static create<TEntity extends IEntity>(matcher: IMatcher<TEntity>): IGroup<TEntity> {
            return new Group(matcher);
        }

        private readonly _matcher: IMatcher<TEntity>;
        private readonly _entities: TEntity[] = [];

        private constructor(matcher: IMatcher<TEntity>) {
            this._matcher = matcher;
        }
        /**
         * 
         */
        public containsEntity(entity: TEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }
        /**
         * 
         */
        public addOrRemoveEntity(entity: TEntity, component: IComponent, isAdded: boolean): void {
            const entities = this._entities;

            if (isAdded) {
                if (this._matcher.matches(entity)) {
                    if (entities.indexOf(entity) < 0) { // TODO
                        entities.push(entity);
                        Group.onEntityAdded.dispatch([this, entity, component]);
                    }
                }
            }
            else {
                const index = entities.indexOf(entity);
                if (index >= 0) {
                    entities.splice(index, 1);
                    Group.onEntityAdded.dispatch([this, entity, component]);
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
