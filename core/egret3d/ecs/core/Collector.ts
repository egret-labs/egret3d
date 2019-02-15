namespace paper {
    /**
     * 
     */
    export class Collector<TEntity extends Entity> implements ICollector<TEntity> {
        /**
         * 
         */
        public static create<TEntity extends Entity>(group: Group<TEntity>): Collector<TEntity> {
            const collector = new Collector<TEntity>(group);

            return collector;
        }

        public readonly addedEntities: (TEntity | null)[] = [];
        public readonly removedEntities: (TEntity | null)[] = [];
        public readonly addedComponentes: (IComponent | null)[] = [];
        public readonly removedComponentes: (IComponent | null)[] = [];

        private _group: Group<TEntity>;

        private constructor(group: Group<TEntity>) {
            this._group = group;

            Group.onEntityAdded.add(this._onEntityAdded);
            Group.onEntityRemoved.add(this._onEntityRemoved);
            Group.onComponentEnabled.add(this._onComponentEnabled);
            Group.onComponentDisabled.add(this._onComponentDisabled);
        }

        private _onEntityAdded([group, entity]: [IGroup<Entity>, Entity]) {
            if (this._group !== group) {
                return;
            }

            this.addedEntities.push(entity as TEntity);
        }

        private _onEntityRemoved([group, entity]: [IGroup<Entity>, Entity]) {
            if (this._group !== group) {
                return;
            }

            this.addedEntities.push(entity as TEntity);
        }

        private _onComponentEnabled([group, entity]: [IGroup<Entity>, IComponent]) {
            if (this._group !== group) {
                return;
            }
        }

        private _onComponentDisabled([group, entity]: [IGroup<Entity>, IComponent]) {
            if (this._group !== group) {
                return;
            }
        }

        public clear(): void {
            if (this.addedEntities.length > 0) {
                this.addedEntities.length = 0;
            }

            if (this.removedEntities.length > 0) {
                this.removedEntities.length = 0;
            }

            if (this.addedComponentes.length > 0) {
                this.addedComponentes.length = 0;
            }

            if (this.removedComponentes.length > 0) {
                this.removedComponentes.length = 0;
            }
        }
    }
}
