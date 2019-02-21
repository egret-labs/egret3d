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

        public readonly isBehaviour: boolean = false;

        private readonly _matcher: IMatcher<TEntity>;
        private readonly _entities: TEntity[] = [];
        private readonly _behaviours: (Behaviour | null)[] = [];

        private constructor(matcher: ICompoundMatcher<TEntity>) {
            if (matcher.extraOfComponents.length === 1 && matcher.extraOfComponents[0] === Behaviour as any) { // TODO
                this.isBehaviour = true;
            }

            this._matcher = matcher;

            for (const scene of Application.sceneManager.scenes) {
                for (const entity of scene.entities) {
                    this.handleEvent(entity as TEntity, null as any, true); // TODO context._entityClass
                }
            }
        }

        public containsEntity(entity: TEntity): boolean {
            return this._entities.indexOf(entity) >= 0;
        }

        public handleEvent(entity: TEntity, component: IComponent, isAdd: boolean): void {
            if (this.isBehaviour) {
                if ((component.constructor as IComponentClass<IComponent>).isBehaviour) {
                    const behaviours = this._behaviours;
                    const index = behaviours.indexOf(component as Behaviour);

                    if (isAdd) {
                        if (index < 0) {
                            behaviours.push(component as Behaviour);
                            Group.onComponentEnabled.dispatch([this, component]);
                        }
                    }
                    else if (index >= 0) {
                        Group.onComponentDisabled.dispatch([this, component]);
                        behaviours[index] = null;
                    }
                }
            }
            else {
                const matcher = this._matcher;
                const entities = this._entities;
                const index = entities.indexOf(entity);

                if (isAdd) {
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
                        Group.onEntityRemoved.dispatch([this, entity]);
                        entities.splice(index, 1);
                    }
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

        public get behaviours(): ReadonlyArray<Behaviour | null> {
            return this._behaviours;
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
            return this._entities;
        }
    }
}
