import { SystemOrder } from "../core/types";
import Entity from "../core/Entity";
import { ISceneClass } from "./types";
import SystemManager from "./SystemManager";
import SceneManager from "./SceneManager";
import { Clock } from "./components/Clock";
import { Scene } from "./components/Scene";
/**
 * 基础应用程序。
 * - 应用程序的基类。
 */
export default class Application<TScene extends Scene> {
    /**
     * 
     */
    public static current: Application<Scene> = null!;

    public readonly globalEntity: Entity = null!;
    public readonly clock: Clock = null!;
    /**
     * 该应用程序的系统管理器。
     */
    public readonly systemManager: SystemManager = SystemManager.create();
    /**
     * 该应用程序的场景管理器。
     */
    public readonly sceneManager: SceneManager<TScene> = null!;
    /**
     * 获取该应用程序的场景实现。
     */
    protected getSceneClass(): ISceneClass<TScene> {
        return Scene as any;
    }
    /**
     * 初始化该应用程序。
     */
    public initialize(): void {
        Application.current = this as any;
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
    }
}
