namespace paper {
    /**
     * 
     */
    export class Collector<TEntity extends IEntity> implements ICollector<TEntity> {
        /**
         * 
         */
        public static create<TEntity extends IEntity>(group: Group<TEntity>): ICollector<TEntity> {
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

            Group.onEntityAdded.add(this._onEntityAdded, this);
            Group.onEntityRemoved.add(this._onEntityRemoved, this);
            Group.onComponentEnabled.add(this._onComponentEnabled, this);
            Group.onComponentDisabled.add(this._onComponentDisabled, this);
        }

        private _onEntityAdded([group, entity]: [Group<IEntity>, IEntity]) {
            if (this._group !== group) {
                return;
            }

            const index = this.removedEntities.indexOf(entity as TEntity);
            if (index >= 0) {
                this.removedEntities[index] = null;
            }

            this.addedEntities.push(entity as TEntity);
        }

        private _onEntityRemoved([group, entity]: [Group<IEntity>, IEntity]) {
            if (this._group !== group) {
                return;
            }

            const index = this.addedEntities.indexOf(entity as TEntity);
            if (index >= 0) {
                this.addedEntities[index] = null;
            }

            this.removedEntities.push(entity as TEntity);
        }

        private _onComponentEnabled([group, component]: [Group<IEntity>, IComponent]) {
            if (this._group !== group) {
                return;
            }

            const index = this.removedComponentes.indexOf(component);
            if (index >= 0) {
                this.removedComponentes[index] = null;
            }

            this.addedComponentes.push(component);
        }

        private _onComponentDisabled([group, component]: [Group<IEntity>, IComponent]) {
            if (this._group !== group) {
                return;
            }

            const index = this.addedComponentes.indexOf(component);
            if (index >= 0) {
                this.addedComponentes[index] = null;
            }

            this.removedComponentes.push(component);
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
