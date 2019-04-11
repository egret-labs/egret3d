import * as signals from "signals";
import { DefaultNames, ISceneClass } from "./types";
import Entity from "../core/Entity";
import System from "../core/System";
import { Scene } from "./components/Scene";
import { Node } from "./components/Node";
import Matcher from "../core/Matcher";
import Group from "../core/Group";
import { SystemOrder } from "../core/types";
import Context from "../core/Context";
/**
 * 应用程序的场景管理器。
 */
export default class SceneManager<TScene extends Scene> extends System<Entity> {
    public readonly onNodeSceneChanged: signals.Signal<[Node, TScene, TScene]> = new signals.Signal();
    public readonly onNodeParentChanged: signals.Signal<[Node, Node | null, Node | null]> = new signals.Signal();
    /**
     * 该应用程序的全部场景。
     */
    public readonly scenes: ReadonlyArray<TScene> = [];
    /**
     * 该应用程序的全局场景。
     */
    public readonly globalScene: TScene = null!;
    /**
     * 该应用程序的全局编辑场景。
     */
    public readonly editorScene: TScene = null!;
    /**
     * 该应用程序的全局编辑场景。
     */
    public sceneClass: ISceneClass<TScene> | null = null;

    protected getMatchers() {
        return [
            Matcher.create(false, Scene),
            Matcher.create(false, Node),
        ];
    }

    public initialize(order: SystemOrder, context: Context<Entity>) {
        super.initialize(order, context);

        (this.editorScene as TScene) = this.createScene(DefaultNames.Editor, false);
        (this.globalScene as TScene) = this.createScene(DefaultNames.Global, false);
        (this.scenes as TScene[]).length = 0;
    }

    public onEntityRemoved(entity: Entity, group: Group<Entity>) {
        const { groups } = this;

        if (group === groups[0]) {
        }
        else {
            const node = entity.getRemovedComponent(Node)!;

            if (node.parent === null) {
                this.activeScene.removeChild(node);
            }
        }
    }

    public onEntityAdded(entity: Entity, group: Group<Entity>) {
        const { groups } = this;

        if (group === groups[0]) {
        }
        else {
            this.activeScene.addChild(entity.getComponent(Node)!);
        }
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
    public createScene(name: string, isActive: boolean = true): TScene {
        const { scenes } = this;
        const scene = this.context.createEntity().addComponent(this.sceneClass!);
        scene.name = name;

        if (scenes.indexOf(scene) < 0) {
            if (isActive) {
                (scenes as TScene[]).unshift(scene);
            }
            else {
                (scenes as TScene[]).push(scene);
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
    public removeScene(scene: TScene): boolean {
        if (scene === this.globalScene || scene === this.editorScene) {
            if (DEBUG) {
                console.warn("Cannot remove the global scene.");
            }

            return false;
        }

        const { scenes } = this;
        const index = scenes.indexOf(scene);

        if (index >= 0) {
            (scenes as TScene[]).splice(index, 1);

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
    public get activeScene(): TScene {
        const { scenes } = this;

        if (scenes.length === 0) {
            this.createScene(DefaultNames.Noname);
        }

        return scenes[0];
    }
    public set activeScene(value: TScene) {
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
            (scenes as TScene[]).splice(index, 1);
            (scenes as TScene[]).unshift(value);
        }
        else if (DEBUG) {
            console.error("Active scene error.");
        }
    }
}
