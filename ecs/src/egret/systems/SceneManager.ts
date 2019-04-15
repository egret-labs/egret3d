import * as signals from "signals";
import {
    SystemOrder,
    Entity,
    System,
    Matcher,
    Group,
    Context,
} from "../../ecs";

import { NodeNames } from "../types";
import { Scene } from "../components/Scene";
import { Node } from "../components/Node";
/**
 * 应用程序的场景管理器。
 */
export class SceneManager extends System<Entity> {
    /**
     * 
     */
    public readonly onNodeSceneChanged: signals.Signal<[Node, Scene, Scene]> = new signals.Signal();
    /**
     * 
     */
    public readonly onNodeParentChanged: signals.Signal<[Node, Node | null, Node | null]> = new signals.Signal();
    /**
     * 该应用程序的全部场景。
     */
    public readonly scenes: ReadonlyArray<Scene> = [];
    /**
     * 该应用程序的全局场景。
     */
    public readonly globalScene: Scene = null!;
    /**
     * 该应用程序的全局编辑场景。
     */
    public readonly editorScene: Scene = null!;
    /**
     * @override
     * @internal
     */
    protected getMatchers() {
        return [
            Matcher.create(false, Scene),
            Matcher.create(false, Node),
        ];
    }
    /**
     * @override
     * @internal
     */
    public initialize(order: SystemOrder, context: Context<Entity>) {
        super.initialize(order, context);

        (this.editorScene as Scene) = this.createScene(NodeNames.Editor, false);
        (this.globalScene as Scene) = this.createScene(NodeNames.Global, false);
        (this.scenes as Scene[]).length = 0;
    }
    /**
     * @internal
     */
    public onEntityRemoved(_entity: Entity, _group: Group<Entity>) {
    }
    /**
     * @internal
     */
    public onEntityAdded(_entity: Entity, _group: Group<Entity>) {
    }
    /**
     * @internal
     */
    public onTickCleanup() {
        for (const scene of this.scenes) {
            scene.children; // Remove cache.
        }
    }
    /**
     * 创建一个空场景到该应用程序。
     * @param name 场景名称。
     * @param isActive 是否激活场景。
     */
    public createScene(name: string, isActive: boolean = true): Scene {
        const { scenes } = this;
        const scene = this.context.createEntity().addComponent(Scene);
        scene.name = name;

        if (scenes.indexOf(scene) < 0) {
            if (isActive) {
                (scenes as Scene[]).unshift(scene);
            }
            else {
                (scenes as Scene[]).push(scene);
            }
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
                console.warn("Cannot remove the global scene.");
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
    public getSceneByName(name: string): Scene | null {
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
            this.createScene(NodeNames.Noname);
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

        if (scenes.length === 0) {
            throw new Error();
        }

        if (
            scenes.length === 1 ||
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
