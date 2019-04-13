import * as signals from "signals";
import { SystemOrder, Entity } from "../ecs/index";

import { ISceneClass, RunningMode, ApplicationInitializeOptions } from "./types";
import { SystemManager } from "./SystemManager";
import { SceneManager } from "./systems/SceneManager";
import { Clock } from "./components/Clock";
import { Scene } from "./components/Scene";
/**
 * 基础应用程序。
 * - 应用程序的基类。
 */
export class Application<TScene extends Scene> {
    /**
     * 
     */
    public static current: Application<Scene> = null!;
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
    public readonly sceneManager: SceneManager<TScene> = null!;

    private _isRunning: boolean = false;
    private _runningMode: RunningMode = RunningMode.Normal;
    /**
     * 获取该应用程序的场景实现。
     */
    protected getSceneClass(): ISceneClass<TScene> {
        return Scene as any;
    }
    /**
     * 初始化该应用程序。
     */
    public initialize(options: ApplicationInitializeOptions): void {
        Application.current = this as any;

        console.info("Egret", this.version);
        console.info("Egret initialize.");

        (this.options as ApplicationInitializeOptions) = options;
        this._runningMode = options.playerMode!;

        const { systemManager } = this;
        (this.sceneManager as SceneManager<TScene>) = systemManager.registerSystem<SceneManager<TScene>>(SceneManager, Entity, SystemOrder.Enable);
        (this.globalEntity as Entity) = systemManager.getContext(Entity)!.createEntity();
        (this.clock as Clock) = this.globalEntity.addComponent(Clock);
    }
    /**
     * 启动该应用程序。
     */
    public start(): void {
        Application.current = this as any;
        this.systemManager.start();
        this.resume();

        console.info("Egret start.");
    }
    /**
     * 
     */
    public pause(): void {
        this._isRunning = false;
        this.clock.reset();
    }
    /**
     * 
     */
    public resume(): void {
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
}
