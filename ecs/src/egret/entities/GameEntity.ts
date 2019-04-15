import {
    entity,
    Entity,
    Component,
    GroupComponent,
} from "../../ecs";

import { NodeNames, NodeTags } from "../types";
import { Node } from "../components/Node";
import { Scene } from "../components/Scene";
import { Behaviour } from "../components/Behaviour";
import { BaseRenderer } from "../components/BaseRenderer";
import { Application } from "../Application";
/**
 * 游戏实体。
 */
@entity()
export class GameEntity<TNode extends Node = Node> extends Entity {
    /**
     * 创建游戏实体，并添加到当前场景中。
     */
    public static create(
        name: string = NodeNames.Noname,
        tag: NodeTags | string = NodeTags.Untagged,
        scene: Scene | null = null,
    ): GameEntity {
        const context = Application.current.systemManager.getContext(this)!;
        const entity = context.createEntity();
        const node = entity.addComponent(Node);
        node.name = name;
        node.tag = tag;

        if (scene === null) {
            scene = Application.current.sceneManager.activeScene;
        }

        scene.addChild(node);

        return entity;
    }
    /**
     * 
     */
    public readonly node: TNode = null!;
    /**
     * 
     */
    public readonly renderer: BaseRenderer | null = null;
    /**
     * @internal
     */
    public _beforeRenderComponentCount: uint = 0;
    /**
     * @override
     * @internal
     */
    protected _addComponent(component: Component) {
        super._addComponent(component);

        if (component instanceof Node) {
            (this.node as TNode) = component as TNode;
            (this.transform as TNode) = component as TNode;
        }
        else if (component instanceof BaseRenderer) {
            (this.renderer as BaseRenderer) = component;
        }
        else if (component instanceof Behaviour) {
            component.onBeforeRender && this._beforeRenderComponentCount++;
        }
    }
    /**
     * @override
     * @internal
     */
    protected _removeComponent(component: Component, groupComponent: GroupComponent | null) {
        super._removeComponent(component, groupComponent);

        if (component === this.node) {
            (this.node as TNode) = null!;
            (this.transform as TNode) = null!;
        }
        else if (component === this.renderer) {
            (this.renderer as BaseRenderer | null) = null;
        }
        else if (component instanceof Behaviour) {
            component.onBeforeRender && this._beforeRenderComponentCount--;
        }
    }
    /**
     * @override
     * @internal
     */
    public get isActiveAndEnabled(): boolean {
        const { node } = this;

        if (node !== null) {
            const { parent } = node;

            if (parent !== null) {
                return this._enabled && parent.isActiveAndEnabled;
            }
        }

        return this._enabled;
    }
    /**
     * @deprecated
     */
    public readonly transform: TNode = null!;
}
