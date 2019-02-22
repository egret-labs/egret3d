namespace paper {
    /**
     * 
     */
    export class Context<TEntity extends IEntity> {
        /**
         * 
         */
        public static create<TEntity extends IEntity>(entityClass: IEntityClass<TEntity>): Context<TEntity> {
            return new Context<TEntity>(entityClass);
        }

        private readonly _entityClass: IEntityClass<TEntity>;
        private readonly _entities: TEntity[] = [];
        private readonly _componentsGroups: Group<TEntity>[][] = [];
        private readonly _componentsGroupsB: Group<TEntity>[][] = [];
        private readonly _groups: { [key: string]: Group<TEntity> } = {};

        private constructor(entityClass: IEntityClass<TEntity>) {
            this._entityClass = entityClass;
            Component.onComponentCreated.add(this._onComponentCreated, this);
            Component.onComponentEnabled.add(this._onComponentEnabled, this);
            Component.onComponentDisabled.add(this._onComponentDisabled, this);
            Component.onComponentDestroyed.add(this._onComponentDestroyed, this);
        }

        private _onComponentCreated([entity, component]: [IEntity, IComponent]) {
            if (entity.constructor !== this._entityClass) {
                return;
            }

            const componentClass = component.constructor as IComponentClass<IComponent>;
            const groups = this._componentsGroupsB[componentClass.componentIndex];

            if (groups) {
                for (const group of groups) {
                    group.handleEvent(entity as TEntity, component, true);
                }
            }
        }

        private _onComponentEnabled([entity, component]: [IEntity, IComponent]) {
            if (entity.constructor !== this._entityClass) {
                return;
            }

            const componentClass = component.constructor as IComponentClass<IComponent>;
            const groups = this._componentsGroups[componentClass.componentIndex];

            if (groups) {
                for (const group of groups) {
                    if (!group.matcher.componentEnabledFilter){
                        debugger;
                    }
                    group.handleEvent(entity as TEntity, component, true);
                }
            }

            if (componentClass.isBehaviour) {
                const groups = this._componentsGroups[Behaviour.componentIndex];

                for (const group of groups) {
                    group.handleEvent(entity as TEntity, component, true);
                }
            }
        }

        private _onComponentDisabled([entity, component]: [IEntity, IComponent]) {
            if (entity.constructor !== this._entityClass) {
                return;
            }

            const componentClass = component.constructor as IComponentClass<IComponent>;
            const groups = this._componentsGroups[componentClass.componentIndex];

            if (groups) {
                for (const group of groups) {
                    group.handleEvent(entity as TEntity, component, false);
                }
            }

            if (componentClass.isBehaviour) {
                const groups = this._componentsGroups[Behaviour.componentIndex];

                for (const group of groups) {
                    group.handleEvent(entity as TEntity, component, false);
                }
            }
        }

        private _onComponentDestroyed([entity, component]: [IEntity, IComponent]) {
            if (entity.constructor !== this._entityClass) {
                return;
            }

            const componentClass = component.constructor as IComponentClass<IComponent>;
            const groups = this._componentsGroupsB[componentClass.componentIndex];

            if (groups) {
                for (const group of groups) {
                    group.handleEvent(entity as TEntity, component, false);
                }
            }
        }

        public containsEntity(entity: TEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }

        public getGroup(matcher: ICompoundMatcher<TEntity>): Group<TEntity> {
            const id = matcher.id;
            const groups = this._groups;

            if (!(id in groups)) {
                const componentsGroups = matcher.componentEnabledFilter ? this._componentsGroups : this._componentsGroupsB;
                const group = Group.create(matcher);
                groups[id] = group;

                for (const componentClass of matcher.components) {
                    const componentIndex = componentClass.componentIndex;

                    if (!componentsGroups[componentIndex]) {
                        componentsGroups[componentIndex] = [];
                    }

                    componentsGroups[componentIndex].push(group);
                }
            }

            return groups[id];
        }

        public get entityCount(): uint {
            return this._entities.length;
        }

        public get entities(): ReadonlyArray<TEntity> {
            return this._entities;
        }
    }
}
