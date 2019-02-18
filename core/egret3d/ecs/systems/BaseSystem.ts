namespace paper {
    /**
     * 基础系统。
     * - 全部系统的基类。
     */
    export abstract class BaseSystem<TEntity extends IEntity> {
        /**
         * @internal
         */
        public static create<TEntity extends IEntity, TSystem extends BaseSystem<TEntity>>(systemClass: { new(context: Context<TEntity>, order?: SystemOrder): BaseSystem<TEntity> }, context: Context<TEntity>, order: SystemOrder): TSystem {
            return new systemClass(context, order) as TSystem;
        }
        /**
         * 该系统是否被激活。
         */
        public enabled: boolean = true;
        /**
         * 该系统的执行顺序。
         */
        public readonly order: SystemOrder = -1;
        /**
         * 该系统在调试模式时每帧消耗的时间，仅用于性能统计。（以毫秒为单位）
         */
        public readonly deltaTime: uint = 0;
        /**
         * 
         */
        public readonly groups: Group<TEntity>[] = [];
        /**
         * 
         */
        public readonly collectors: ICollector<TEntity>[] = [];
        /**
         * @internal
         */
        public _started: boolean = false;
        /**
         * @internal
         */
        public _enabled: boolean = false;
        /**
         * 禁止实例化系统。
         * @protected
         */
        public constructor(context: Context<TEntity>, order: SystemOrder = -1) {
            const matchers = this.getMatchers();
            const listeners = this.getListeners();

            if (matchers) {
                for (const matcher of matchers) {
                    const group = context.getGroup(matcher);
                    this.groups.push(group);
                    this.collectors.push(Collector.create(group));
                }
            }

            if (listeners) {
                for (const config of listeners) {
                    config.type.add(config.listener, this);
                }
            }

            if (!matchers && this.interests && this.interests.length > 0) {
                let interests: ReadonlyArray<ReadonlyArray<InterestConfig>>;

                if (Array.isArray(this.interests[0])) {
                    interests = this.interests as ReadonlyArray<ReadonlyArray<InterestConfig>>;
                }
                else {
                    interests = [this.interests as ReadonlyArray<InterestConfig>];
                }

                for (const interest of interests) {
                    const allOf = [];
                    const anyOf = [];
                    const noneOf = [];
                    const extraOf = [];

                    for (const config of interest) {
                        const isNoneOf = (config.type !== undefined) && (config.type & InterestType.Exculde) !== 0;
                        const isExtraOf = (config.type !== undefined) && (config.type & InterestType.Unessential) !== 0;

                        if (Array.isArray(config.componentClass)) {
                            for (const componentClass of config.componentClass) {
                                if (isNoneOf) {
                                    noneOf.push(componentClass);
                                }
                                else if (isExtraOf) {
                                    extraOf.push(componentClass);
                                }
                                else {
                                    anyOf.push(componentClass);
                                }
                            }
                        }
                        else if (isNoneOf) {
                            noneOf.push(config.componentClass);
                        }
                        else if (isExtraOf) {
                            extraOf.push(config.componentClass);
                        }
                        else {
                            allOf.push(config.componentClass);
                        }

                        if (config.listeners) {
                            for (const listenerConfig of config.listeners) {
                                listenerConfig.type.add(listenerConfig.listener, this);
                            }
                        }
                    }

                    const matcher = Matcher.create.apply(Matcher, allOf).anyOf.apply(Matcher, anyOf).noneOf.apply(Matcher, noneOf).extraOf.apply(Matcher, extraOf);
                    const group = context.getGroup(matcher);
                    this.groups.push(group);
                    this.collectors.push(Collector.create(group));
                }
            }

            this.order = order;
        }
        /**
         * @internal
         */
        public initialize(config?: any): void {
            this.onAwake && this.onAwake(config);
        }
        /**
         * @internal
         */
        public uninitialize(): void {
        }
        /**
         * 
         */
        public getMatchers(): ICompoundMatcher<TEntity>[] | null {
            return null;
        }
        /**
         * 
         */
        public getListeners(): { type: signals.Signal, listener: (component: BaseComponent) => void }[] | null {
            return null;
        }
        /**
         * 该系统初始化时调用。
         * @param config 该系统被注册时可以传递的初始化数据。
         */
        public onAwake?(config?: any): void;
        /**
         * 该系统被激活时调用。
         * @see paper.BaseSystem#enabled
         */
        public onEnable?(): void;
        /**
         * 该系统开始运行时调用。
         */
        public onStart?(): void;
        /**
         * 实体被添加到系统时调用。
         * - 注意，该调用并不是立即的，而是等到添加到组的下一帧才被调用。
         * @param gameObject 收集的实体。
         * @param collector 收集实体的实体组。
         * @see paper.GameObject#addComponent()
         */
        public onEntityAdded?(entity: TEntity, collector: ICollector<TEntity>): void;
        /**
         * 充分非必要组件添加到实体时调用。
         * - 注意，该调用并不是立即的，而是等到添加到实体的下一帧才被调用。
         * @param component 收集的实体组件。
         * @param collector 收集实体组件的实体组。
         * @see paper.GameObject#addComponent()
         */
        public onComponentAdded?(component: IComponent, collector: ICollector<TEntity>): void;
        /**
         * 充分非必要组件从实体移除时调用。
         * @param component 移除的实体组件。
         * @param collector 移除实体组件的实体组。
         * @see paper.GameObject#removeComponent()
         */
        public onComponentRemoved?(component: IComponent, collector: ICollector<TEntity>): void;
        /**
         * 实体从系统移除时调用。
         * @param gameObject 移除的实体。
         * @param collector 移除实体的实体组。
         * @see paper.GameObject#removeComponent()
         */
        public onEntityRemoved?(gameObject: TEntity, collector: ICollector<TEntity>): void;
        /**
         * 该系统更新时调用。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onUpdate?(deltaTime?: number): void;
        /**
         * 
         */
        public onFixedUpdate?(deltaTime?: number): void;
        /**
         * 该系统更新时调用。
         * @param deltaTime 上一帧到此帧流逝的时间。（以秒为单位）
         */
        public onLateUpdate?(deltaTime?: number): void;
        /**
         * 该系统被禁用时调用。
         * @see paper.BaseSystem#enabled
         */
        public onDisable?(): void;
        /**
         * 该系统被注销时调用。
         * @see paper.SystemManager#unregister()
         * @see paper.Application#systemManager
         */
        public onDestroy?(): void;

        /**
         * @deprecated
         */
        public readonly clock: Clock = clock;
        /**
         * @deprecated
         */
        public readonly interests: ReadonlyArray<InterestConfig | ReadonlyArray<InterestConfig>> = [];
    }
}