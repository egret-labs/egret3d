namespace paper {
    /**
     * 
     */
    export class Context<TEntity extends Entity> implements IContext<TEntity> {
        /**
         * 
         */
        public static create<TEntity extends Entity>(): Context<TEntity> {
            const context = new Context<TEntity>();

            return context;
        }

        private readonly _entities: TEntity[] = [];
        private readonly _componentsGroups: IGroup<TEntity>[][] = [];
        private readonly _groups: { [key: string]: IGroup<TEntity> } = {};

        private constructor() {
            Component.onComponentEnabled.add(this._onComponentEnabled);
            Component.onComponentDisabled.add(this._onComponentDisabled);
        }

        private _onComponentEnabled([entity, component]: [Entity, IComponent]) {
            const componentIndex = (component.constructor as IComponentClass<IComponent>).componentIndex;
            const groups = this._componentsGroups[componentIndex];

            if (groups) {
                for (const group of groups) {
                    group.handleEvent(entity as TEntity, component, true);
                }
            }
        }

        private _onComponentDisabled([entity, component]: [Entity, IComponent]) {
            const componentIndex = (component.constructor as IComponentClass<IComponent>).componentIndex;
            const groups = this._componentsGroups[componentIndex];

            if (groups) {
                for (const group of groups) {
                    group.handleEvent(entity as TEntity, component, false);
                }
            }
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
