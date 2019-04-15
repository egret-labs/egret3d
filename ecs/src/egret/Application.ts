import * as signals from "signals";
import { Entity } from "../ecs";

import { SystemOrder, RunningMode, ApplicationInitializeOptions } from "./types";
import { GameEntity } from "./entities/GameEntity";
import { Clock } from "./components/singleton/Clock";
import { SceneManager } from "./systems/SceneManager";
import { SystemManager } from "./systems/SystemManager";
/**
 * 基础应用程序。
 * - 应用程序的基类。
 */
export class Application {
    /**
     * 
     */
    public static current: Application = null!;
    /**
     * 当该应用程序的运行模式改变时派发事件。
     */
    public readonly onRunningModeChanged: signals.Signal<RunningMode> = new signals.Signal();
    /**
     * 该应用程序的版本。
     */
    public readonly version: string = "1.6.0.000";
    /**
     * 该应用程序的启动项。
     */
    public readonly options: ApplicationInitializeOptions = null!;
    /**
     * 
     */
    public readonly globalEntity: Entity = null!;
    /**
     * 
     */
    public readonly clock: Clock = null!;
    /**
     * 该应用程序的系统管理器。
     */
    public readonly systemManager: SystemManager = SystemManager.create();
    /**
     * 该应用程序的场景管理器。
     */
    public readonly sceneManager: SceneManager = null!;

    private _isRunning: boolean = false;
    private _runningMode: RunningMode = RunningMode.Normal;
    /**
     * 初始化该应用程序。
     */
    public initialize(options: ApplicationInitializeOptions): void {
        Application.current = this;

        console.info("Egret", this.version);
        console.info("Egret initialize.");

        (this.options as ApplicationInitializeOptions) = options;
        this._runningMode = options.playerMode!;

        const { systemManager } = this;
        systemManager.registerContext(Entity);
        systemManager.registerContext(GameEntity);
        (this.sceneManager as SceneManager) = systemManager.registerSystem(SceneManager as any, GameEntity as any, SystemOrder.Enable) as any;
        (this.globalEntity as Entity) = systemManager.getContext(Entity)!.createEntity();
        (this.clock as Clock) = this.globalEntity.addComponent(Clock);
    }
    /**
     * 启动该应用程序。
     */
    public start(): void {
        Application.current = this;
        this.systemManager.start();
        this.resume();

        console.info("Egret start.");
    }
    /**
     * 
     */
    public pause(): void {
        Application.current = this;
        this._isRunning = false;
        this.clock.reset();
    }
    /**
     * 
     */
    public resume(): void {
        Application.current = this;

        if (this._isRunning) {
            return;
        }

        this._isRunning = true;
        this.clock.reset();
    }
    /**
     * 
     */
    public get isRunning(): boolean {
        return this._isRunning;
    }
    /**
     * 该应用程序的运行模式。
     */
    public get runningMode(): RunningMode {
        return this._runningMode;
    }
    public set runningMode(value: RunningMode) {
        if (this._runningMode === value) {
            return;
        }

        this._runningMode = value;
        this.onRunningModeChanged.dispatch(this.runningMode);
    }

    /**
     * @deprecated
     */
    public static get systemManager() {
        return this.current.systemManager;
    }
    /**
     * @deprecated
     */
    public static get sceneManager() {
        return this.current.sceneManager;
    }
}
