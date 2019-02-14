namespace paper {
    /**
     * 
     */
    export class Context<TEntity extends IEntity> implements IContext<TEntity> {
        /**
         * 
         */
        public static create<TEntity extends IEntity>(): Context<TEntity> {
            const context = new Context<TEntity>();

            return context;
        }

        private readonly _entities: TEntity[] = [];
        private readonly _componentsGroups: IGroup<TEntity>[][] = [];
        private readonly _groups: { [key: string]: IGroup<TEntity> } = {};

        private _onComponentEnabled([entity, component]: [IEntity, IComponent]) {
            const componentIndex = (component.constructor as IComponentClass<IComponent>).__index;
            const groups = this._componentsGroups[componentIndex];

            if (groups) {
                for (const group of groups) {
                    group.addOrRemoveEntity(entity as TEntity, component, true);
                }
            }
        }

        private _onComponentDisabled([entity, component]: [IEntity, IComponent]) {
            const componentIndex = (component.constructor as IComponentClass<IComponent>).__index;
            const groups = this._componentsGroups[componentIndex];

            if (groups) {
                for (const group of groups) {
                    group.addOrRemoveEntity(entity as TEntity, component, false);
                }
            }
        }

        private constructor() {
            Component.onComponentEnabled.add(this._onComponentEnabled);
            Component.onComponentDisabled.add(this._onComponentDisabled);
        }

        public containsEntity(entity: TEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }

        public getGroup(matcher: IMatcher<TEntity>): IGroup<TEntity> {
            const id = matcher.id;
            const groups = this._groups;

            if (!(id in groups)) {
                const componentsGroups = this._componentsGroups;
                const group = Group.create(matcher);
                groups[id] = group;

                for (const componentClass of matcher.components) {
                    const componentIndex = componentClass.__index;

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
    /**
     * @internal
     */
    export const entityContext = Context.create<Entity>();
}
