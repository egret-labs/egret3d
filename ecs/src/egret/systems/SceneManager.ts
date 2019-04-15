import * as signals from "signals";
import {
    System,
    Matcher,
    Group,
    Context,
    CollectorReactiveType,
} from "../../ecs";

import { NodeNames } from "../types";
import { GameEntity } from "../entities/GameEntity";
import { Scene } from "../components/Scene";
import { Node } from "../components/Node";
/**
 * 应用程序的场景管理器。
 */
export class SceneManager extends System<any> {
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

    private _isActiveScene: boolean = false;
    /**
     * @override
     * @internal
     */
    protected getMatchers() {
        return [
            Matcher.create(false, Scene, Node),
            Matcher.create(false, Node).noneOf(Scene),
        ];
    }
    /**
     * @override
     * @internal
     */
    public initialize(order: int, context: Context<any>) {
        super.initialize(order, context);
        //
        this.collectors[0].reactiveType = this.collectors[1].reactiveType =
            CollectorReactiveType.AddEntityImmediately | CollectorReactiveType.RemoveEntityImmediately;
        //
        (this.globalScene as Scene) = this.createScene(NodeNames.Global, false);
        (this.editorScene as Scene) = this.createScene(NodeNames.Editor, false);
        (this.scenes as Scene[]).length = 0;
    }
    /**
     * @internal
     */
    public onEntityRemoved(entity: GameEntity, group: Group<any>) {
        const { groups } = this;

        if (group === groups[0]) {
            const { scenes } = this;
            const scene = entity.getComponent(Scene)!;
            const index = scenes.indexOf(scene);

            if (index >= 0) {
                (scenes as Scene[]).splice(index, 1);

                if (!scene.entity.isDestroyed) {
                    scene.entity.destroy();
                }
            }
            else if (DEBUG) {
                console.error("The scene has been removed.");
            }
        }
        else if (group === groups[1]) {
            const node = entity.getComponent(Node)!;
            const parent = node.parent;

            node.removeChildren();

            if (parent !== null) {
                parent.removeChild(node);
            }

            if (!entity.isDestroyed) {
                entity.destroy();
            }
        }
    }
    /**
     * @internal
     */
    public onEntityAdded(entity: GameEntity, group: Group<any>) {
        const { groups } = this;

        if (group === groups[0]) {
            const { scenes } = this;
            const scene = entity.getComponent(Scene)!;

            if (!(scene === this.globalScene || scene === this.editorScene)) {
                const node = entity.getComponent(Node)!;
                (node.scene as Scene) = scene;
                node.name = "root"; //

                if (scenes.indexOf(scene) < 0) {
                    if (this._isActiveScene) {
                        (scenes as Scene[]).unshift(scene);
                    }
                    else {
                        (scenes as Scene[]).push(scene);
                    }
                }
                else if (DEBUG) {
                    console.error("Create scene error.");
                }
            }
        }
        else if (group === groups[1]) {
            const node = entity.getComponent(Node)!;
            this.activeScene.root.addChild(node);
        }
    }
    /**
     * @internal
     */
    public onTickCleanup() {
        // for (const scene of this.scenes) { // TODO 更新所有节点的 cache
        //     scene.children; // Remove cache.
        // }
    }
    /**
     * 创建一个空场景到该应用程序。
     * @param name 场景名称。
     * @param isActive 是否激活场景。
     */
    public createScene(name: string, isActive: boolean = true): Scene {
        this._isActiveScene = isActive;

        const entity = this.context.createEntity();
        const scene = entity.addComponent(Scene);
        scene.name = name;

        entity.addComponent(Node);

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

        if (!scene.isDestroyed) {
            scene.destroy();

            return true;
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
