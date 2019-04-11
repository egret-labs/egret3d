import { SystemOrder, IEntityClass, ISystemClass } from "../core/types";
import Entity from "../core/Entity";
import System from "../core/System";
import Context from "../core/Context";
import { Clock } from "./components/Clock";
import Application from "./Application";

type PreSystemPair = [
    ISystemClass<System<Entity>>,
    IEntityClass<Entity>,
    SystemOrder
];
/**
 * 应用程序的系统管理器。
 */
export default class SystemManager {
    /**
     * @internal
     */
    public static create(): SystemManager {
        return new SystemManager();
    }

    private _isStarted: boolean = false;
    private readonly _contexts: Context<Entity>[] = [];
    /**
     * 应用程序启动前临时缓存的系统。
     * - 系统不能在应用程序启动前实例化。
     */
    private readonly _preSystems: PreSystemPair[] = [];
    /**
     * 应用程序启动后临时缓存的系统。
     * - 系统不能在应用程序启动后立即初始化，但需要立即实例化。
     */
    private readonly _cacheSystems: System<Entity>[] = [];
    private readonly _systems: System<Entity>[] = [];
    private readonly _startSystems: System<Entity>[] = [];
    private readonly _reactiveSystems: System<Entity>[] = [];
    private readonly _tickSystems: System<Entity>[] = [];
    private readonly _frameSystems: System<Entity>[] = [];
    private readonly _frameCleanupSystems: System<Entity>[] = [];
    private readonly _tickCleanupSystems: System<Entity>[] = [];
    private _clock: Clock | null = null;

    private constructor() {
    }

    private _sortPreSystem(a: PreSystemPair, b: PreSystemPair) {
        return a[2] - b[2];
    }

    private _getSystemInsertIndex(systems: System<Entity>[], order: SystemOrder) {
        let index = -1;
        const systemCount = systems.length;

        if (systemCount > 0) {
            if (order < systems[0].order) {
                return 0;
            }
            else if (order >= systems[systemCount - 1].order) {
                return systemCount;
            }
        }

        for (let i = 0; i < systemCount - 1; ++i) {
            if (systems[i].order <= order && order < systems[i + 1].order) {
                index = i + 1;
                break;
            }
        }

        return index < 0 ? systems.length : index;
    }

    private _registerSystem(system: System<Entity>) {
        const order = system.order;
        const {
            _systems,
            _startSystems,
            _reactiveSystems,
            _tickSystems,
            _frameSystems,
            _frameCleanupSystems,
            _tickCleanupSystems,
            _getSystemInsertIndex,
        } = this;

        _systems.splice(_getSystemInsertIndex(_systems, order), 0, system);

        if (system.onStart) {
            _startSystems.splice(_getSystemInsertIndex(_startSystems, order), 0, system);
        }

        if (system.onEntityAdded || system.onComponentAdded || system.onComponentRemoved || system.onEntityRemoved) {
            _reactiveSystems.splice(_getSystemInsertIndex(_reactiveSystems, order), 0, system);
        }

        if (system.onTick) {
            _tickSystems.splice(_getSystemInsertIndex(_tickSystems, order), 0, system);
        }

        if (system.onFrame) {
            _frameSystems.splice(_getSystemInsertIndex(_frameSystems, order), 0, system);
        }

        if (system.onFrameCleanup) {
            _frameCleanupSystems.splice(_getSystemInsertIndex(_frameCleanupSystems, order), 0, system);
        }

        if (system.onTickCleanup) {
            _tickCleanupSystems.splice(_getSystemInsertIndex(_tickCleanupSystems, order), 0, system);
        }
    }

    private _reactive(system: System<Entity>) {
        for (const collector of system.collectors) {
            if (system.onComponentRemoved) {
                for (const component of collector.removedComponentes) {
                    if (component !== null) {
                        system.onComponentRemoved(component, collector.group);
                    }
                }
            }

            if (system.onEntityRemoved) {
                for (const entity of collector.removedEntities) {
                    if (entity !== null) {
                        system.onEntityRemoved(entity, collector.group);
                    }
                }
            }

            if (system.onEntityAdded) {
                for (const entity of collector.addedEntities) {
                    if (entity !== null) {
                        system.onEntityAdded(entity, collector.group);
                    }
                }
            }

            if (system.onComponentAdded) {
                for (const component of collector.addedComponentes) {
                    if (component !== null) {
                        system.onComponentAdded(component, collector.group);
                    }
                }
            }

            collector.clear();
        }
    }
    /**
     * @internal
     */
    public start(): void {
        const preSystems = this._preSystems;

        if (preSystems.length > 0) {
            preSystems.sort(this._sortPreSystem);

            for (const pair of preSystems) {
                this.registerSystem.apply(this, pair);
            }

            preSystems.length = 0;
        }

        this._isStarted = true;
        this._clock = Application.current.globalEntity.getComponent(Clock);
    }
    /**
     * @internal
     */
    public startup(executeMode: uint): void {
        const cacheSystems = this._cacheSystems;

        if (cacheSystems.length > 0) {
            for (const system of cacheSystems) {
                this._registerSystem(system);
            }

            cacheSystems.length = 0;
        }

        for (const system of this._systems) {
            const systemExecuteMode = (system.constructor as ISystemClass<System<Entity>>).executeMode;

            if (systemExecuteMode === 0 || (systemExecuteMode & executeMode) !== 0) {
                if (system._executeEnabled && !system.enabled) {
                    system.enabled = true;
                }
            }
            else if (system.enabled) {
                system.enabled = false;
                system._executeEnabled = true;
            }

            if (system._lastEnabled === system.enabled || !system.enabled) {
                continue;
            }

            system.onEnable && system.onEnable();

            if (DEBUG) {
                // console.debug(egret.getQualifiedClassName(system), "enabled.");
            }

            if (system.onEntityAdded) {
                for (const group of system.groups) {
                    for (const entity of group.entities) {
                        system.onEntityAdded(entity, group);
                    }
                }
            }
        }

        for (const system of this._startSystems) {
            if (!system.enabled) {
                continue;
            }

            if (system.onStart) {
                system.onStart();
                system.onStart = undefined;
            }
        }
    }
    /**
     * @internal
     */
    public execute(tickCount: uint, frameCount: uint): void {
        const reactiveSystems = this._reactiveSystems;
        const clock = this._clock!;
        let startTime = 0;

        for (let i = 0; i < tickCount; ++i) {
            for (const system of this._systems) { // this._tickSystems
                if (!system.enabled) {
                    continue;
                }

                if (DEBUG) {
                    (system.deltaTime as uint) = 0;
                    startTime = clock.timestamp();
                }

                if (i === 0 && reactiveSystems.indexOf(system) >= 0) {
                    this._reactive(system);
                }

                system.onTick && system.onTick(clock.lastTickDelta);

                if (DEBUG) {
                    (system.deltaTime as uint) += clock.timestamp() - startTime;
                }
            }
        }

        if (frameCount > 0) {
            for (const system of this._systems) { // this._frameSystems
                if (!system.enabled) {
                    continue;
                }

                if (DEBUG) {
                    startTime = clock.timestamp();
                }

                if (reactiveSystems.indexOf(system) >= 0) {
                    this._reactive(system);
                }

                system.onFrame && system.onFrame(clock.lastFrameDelta);

                if (DEBUG) {
                    (system.deltaTime as uint) += clock.timestamp() - startTime;
                }
            }
        }
    }
    /**
     * @internal
     */
    public cleanup(frameCount: uint): void {
        const clock = this._clock!;
        let startTime = 0;
        let i = 0;

        if (frameCount > 0) {
            i = this._frameCleanupSystems.length;

            while (i--) {
                const system = this._frameCleanupSystems[i];

                if (!system.enabled) {
                    continue;
                }

                if (DEBUG) {
                    startTime = clock.timestamp();
                }

                system.onFrameCleanup!(clock.lastFrameDelta);

                if (DEBUG) {
                    (system.deltaTime as uint) += clock.timestamp() - startTime;
                }
            }
        }

        i = this._tickCleanupSystems.length;

        while (i--) {
            const system = this._tickCleanupSystems[i];
            if (!system.enabled) {
                continue;
            }

            if (DEBUG) {
                startTime = clock.timestamp();
            }

            system.onTickCleanup!(clock.lastFrameDelta);

            if (DEBUG) {
                (system.deltaTime as uint) += clock.timestamp() - startTime;
            }
        }

        for (const context of this._contexts) {
            context.entities; // Remove cache.
        }
    }
    /**
     * @internal
     */
    public teardown(): void {
        for (const system of this._systems) {
            if (system._lastEnabled === system.enabled) {
                continue;
            }

            system._lastEnabled = system.enabled;

            if (system.enabled) {
                continue;
            }

            if (system.onEntityRemoved) {
                for (const group of system.groups) {
                    for (const entity of group.entities) {
                        system.onEntityRemoved(entity, group);
                    }
                }
            }

            system.onDisable && system.onDisable();

            if (DEBUG) {
                // console.debug(egret.getQualifiedClassName(system), "disabled.");
            }
        }
    }
    /**
     * 为该应用程序注册一个实体上下文。
     * @param entityClass 一个实体类。
     */
    public registerContext<TContext extends Context<Entity>>(entityClass: IEntityClass<Entity>): TContext {
        let context = this.getContext(entityClass);

        if (context !== null) {
            if (DEBUG) {
                // console.warn("The context has been registered.", egret.getQualifiedClassName(entityClass));
            }

            return context as TContext;
        }

        context = Context.create(entityClass);

        this._contexts.push(context);

        return context as TContext;
    }
    /**
     * 获取该应用程序中一个实体上下文。
     * @param entityClass 一个实体类。
     */
    public getContext<TContext extends Context<Entity>>(entityClass: IEntityClass<Entity>): TContext | null {
        for (const context of this._contexts) {
            if (context.entityClass === entityClass) {
                return <any>context as TContext;
            }
        }

        return null;
    }
    /**
     * 在该应用程序启动之前预注册一个的系统。
     * @param systemClass 一个系统类。
     * @param entityClass 一个实体类。
     */
    public preRegisterSystem<TSystem extends System<Entity>>(
        systemClass: ISystemClass<TSystem>, entityClass: IEntityClass<Entity>,
        order: SystemOrder = SystemOrder.Update
    ): SystemManager {
        if (this._isStarted) {
            this.registerSystem(systemClass, entityClass, order);
        }
        else {
            this._preSystems.push([systemClass, entityClass, order]);
        }

        return this;
    }
    /**
     * 为该应用程序注册一个的系统。
     * @param systemClass 一个系统类。
     * @param entityClass 一个实体类。
     */
    public registerSystem<TSystem extends System<Entity>>(
        systemClass: ISystemClass<TSystem>, entityClass: IEntityClass<Entity>,
        order: SystemOrder = SystemOrder.Update
    ): TSystem {
        let system = this.getSystem(systemClass);

        if (system !== null) {
            if (DEBUG) {
                // console.warn("The system has been registered.", egret.getQualifiedClassName(systemClass));
            }

            return system;
        }

        let context = this.getContext(entityClass);

        if (context === null) {
            context = this.registerContext(entityClass);
        }

        system = System.create(systemClass, order, context);

        if (this._isStarted) {
            this._cacheSystems.push(system);
        }
        else {
            this._registerSystem(system);
        }

        return system;
    }
    /**
     * 获取该应用程序中一个系统。
     * @param systemClass 一个系统类。
     */
    public getSystem<TSystem extends System<Entity>>(systemClass: ISystemClass<TSystem>): TSystem | null {
        for (const system of this._systems) {
            if (system.constructor === systemClass) {
                return system as TSystem;
            }
        }

        return null;
    }
    /**
     * 获取该应用程序已注册的全部系统。
     */
    public get systems(): ReadonlyArray<System<Entity>> {
        return this._systems;
    }
}
