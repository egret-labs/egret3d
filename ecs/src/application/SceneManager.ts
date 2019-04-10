import { DefaultNames, ISceneClass } from "../types";
import * as signals from "signals";
import Entity from "../core/Entity";
import Scene from "../core/Scene";
import Application from "./Application";
/**
 * 应用程序的场景管理器。
 */
export default class SceneManager {
    /**
     * @internal
     */
    public static create(sceneClasss: ISceneClass<Scene>, application: Application): SceneManager {
        return new SceneManager(sceneClasss, application);
    }
    /**
     * 当该应用程序创建场景时派发事件。
     */
    public readonly onSceneCreated: signals.Signal<Scene> = new signals.Signal();
    /**
     * 当该应用程序的场景即将被移除时派发事件。
     */
    public readonly onSceneDestroy: signals.Signal<Scene> = new signals.Signal();
    /**
     * 当该应用程序的场景已经被移除时派发事件。
     */
    public readonly onSceneDestroyed: signals.Signal<Scene> = new signals.Signal();
    /**
     * 该应用程序的全部场景。
     */
    public readonly scenes: ReadonlyArray<Scene> = [];
    /**
     * 该应用程序的全局实例。
     */
    public readonly globalEntity: Entity = null!;
    /**
     * 该应用程序的全局场景。
     */
    public readonly globalScene: Scene = null!;
    /**
     * 该应用程序的全局编辑场景。
     */
    public readonly editorScene: Scene = null!;

    private _sceneClass: ISceneClass<Scene> | null = null;
    private _application: Application | null = null;

    private constructor(sceneClasss: ISceneClass<Scene>, application: Application) {
        this._sceneClass = sceneClasss;
        this._application = application;
    }
    /**
     * @internal
     */
    public cleanup(): void {
        for (const scene of this.scenes) {
            scene.entities; // Remove cache.
        }
    }
    /**
     * 创建一个空场景到该应用程序。
     * @param name 场景名称。
     * @param isActive 是否激活场景。
     */
    public createScene(name: string, isActive: boolean = true): Scene {
        const { scenes } = this;
        const scene = Scene.create(this._sceneClass!, name, this._application!);

        if (scenes.indexOf(scene) < 0) {
            if (isActive) {
                (scenes as Scene[]).unshift(scene);
            }
            else {
                (scenes as Scene[]).push(scene);
            }

            this.onSceneCreated.dispatch(scene);
        }
        else if (DEBUG) {
            console.error("Create scene error.");
        }

        return scene;
    }
    /**
     * 从该应用程序中移除一个场景。
     * @param scene 要移除的场景。
     */
    public removeScene(scene: Scene): boolean {
        if (scene === this.globalScene || scene === this.editorScene) {
            if (DEBUG) {
                console.warn("Can not remove global scene.");
            }

            return false;
        }

        const { scenes } = this;
        const index = scenes.indexOf(scene);

        if (index >= 0) {
            (scenes as Scene[]).splice(index, 1);

            if (!scene.isDestroyed) {
                scene.destroy();
            }

            return true;
        }
        else if (DEBUG) {
            console.warn("The scene has been removed.");
        }

        return false;
    }
    /**
     * 移除该应用程序的全部场景。
     * @param excludes 例外的场景数组。
     * - 未设置则没有例外。
     */
    public removeAllScene(excludes: ReadonlyArray<Scene> | null = null): void {
        const { scenes } = this;

        let i = scenes.length;
        while (i--) {
            const scene = scenes[i];

            if (scene === this.globalScene || scene === this.editorScene) {
                continue;
            }

            if (excludes !== null && excludes.indexOf(scene) >= 0) {
                continue;
            }

            scene.destroy();
        }
    }
    /**
     * 通过场景名称获取该应用程序的一个场景。
     * @param name 场景名称。
     */
    public getScene(name: string): Scene | null {
        for (const scene of this.scenes) {
            if (scene.name === name) {
                return scene;
            }
        }

        return null;
    }
    /**
     * 该应用程序的场景数量。
     */
    public get sceneCount(): uint {
        return this.scenes.length;
    }
    /**
     * 该应用程序的激活场景。
     * - 实体默认创建到激活场景。
     */
    public get activeScene(): Scene {
        const { scenes } = this;

        if (scenes.length === 0) {
            this.createScene(DefaultNames.NoName);
        }

        return scenes[0];
    }
    public set activeScene(value: Scene) {
        if (
            this.globalScene === value || // Cannot active global scene.
            this.editorScene === value // Cannot active editor scene.
        ) {
            if (DEBUG) {
                console.warn("Can not active global scene.");
            }

            return;
        }

        const { scenes } = this;

        if (
            scenes.length <= 1 ||
            scenes[0] === value
        ) {
            return;
        }

        const index = scenes.indexOf(value);

        if (index >= 0) {
            (scenes as Scene[]).splice(index, 1);
            (scenes as Scene[]).unshift(value);
        }
        else if (DEBUG) {
            console.error("Active scene error.");
        }
    }
}
