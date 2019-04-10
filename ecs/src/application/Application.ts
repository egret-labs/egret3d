import { DefaultNames, ISceneClass, IApplication, } from "../types";
import Entity from "../core/Entity";
import Scene from "../core/Scene";
import SystemManager from "./SystemManager";
import SceneManager from "./SceneManager";
/**
 * 基础应用程序。
 * - 应用程序的基类。
 */
export default abstract class Application implements IApplication {
    /**
     * 
     */
    public static readonly current: Application = null!;
    /**
     * 该应用程序的系统管理器。
     */
    public readonly systemManager: SystemManager = SystemManager.create(this);
    /**
     * 该应用程序的场景管理器。
     */
    public readonly sceneManager: SceneManager = SceneManager.create(this.getSceneClass(), this);
    /**
     * 获取该应用程序的场景实现。
     */
    protected abstract getSceneClass(): ISceneClass<Scene>;
    /**
     * 初始化该应用程序。
     */
    public initialize(): void {
        const { systemManager, sceneManager } = this;
        const context = systemManager.registerContext(Entity);
        (sceneManager.editorScene as Scene) = sceneManager.createScene(DefaultNames.Editor, false);
        (sceneManager.globalScene as Scene) = sceneManager.createScene(DefaultNames.Global, false);
        (sceneManager.globalEntity as Entity) = context.createEntity(sceneManager.globalScene);
    }
    /**
     * 启动该应用程序。
     */
    public start(): void {
        this.systemManager.start();
    }

    public update(): void {
        const { systemManager, sceneManager } = this;
        (Application.current as Application) = this;

        systemManager.startup();
        systemManager.execute();
        systemManager.cleanup();
        systemManager.teardown();
        sceneManager.cleanup();
    }
}
