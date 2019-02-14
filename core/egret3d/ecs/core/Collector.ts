namespace paper {
    /**
     * 
     */
    export class Collector<TEntity extends IEntity> implements ICollector<TEntity> {
        /**
         * @internal
         */
        public static create<TEntity extends IEntity>(): Collector<TEntity> {
            const collector = new Collector<TEntity>();

            return collector;
        }

        public readonly addedEntities: TEntity[] = [];
        public readonly removedEntities: TEntity[] = [];
        public readonly addedComponentes: IComponent[] = [];
        public readonly removedComponentes: IComponent[] = [];

        private constructor() {
        }
    }
}
