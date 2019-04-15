import {
    entity,
    Entity,
    Component,
    GroupComponent,
    IComponentClass,
} from "../../ecs";

import { NodeNames, NodeTags } from "../types";
import { Node } from "../components/Node";
import { Scene } from "../components/Scene";
import { Behaviour } from "../components/Behaviour";
import { BaseRenderer } from "../components/BaseRenderer";
import { Application } from "../Application";
import { BaseComponent } from "../components/BaseComponent";
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

        if (scene !== null) {
            scene.root.addChild(node);
        }

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
     * 获取一个自己或父级中指定的组件实例。
     * - 仅查找处于激活状态的父级实体。
     * @param componentClass 组件类。
     */
    public getComponentInParent<T extends BaseComponent>(componentClass: IComponentClass<T>, includeInactive: boolean = false): T | null {
        let component = this.getComponent(componentClass);

        if (component === null) {
            const { enabled, parent } = this.node;

            if (parent !== null && (includeInactive || (enabled && parent.entity.enabled))) {
                component = parent.gameEntity.getComponentInParent(componentClass, includeInactive);
            }
        }

        return component;
    }
    /**
     * 获取一个自己或子（孙）级中指定的组件实例。
     * - 仅查找处于激活状态的子（孙）级实体。
     * @param componentClass 组件类。
     */
    public getComponentInChildren<T extends BaseComponent>(componentClass: IComponentClass<T>, includeInactive: boolean = false): T | null {
        let component = this.getComponent(componentClass);

        const { enabled, children } = this.node;

        if (component === null && (includeInactive || enabled)) {
            for (const child of children) {
                if (includeInactive || child.entity.enabled) {
                    component = child.gameObject.getComponentInChildren(componentClass, includeInactive);

                    if (component !== null) {
                        break;
                    }
                }
            }
        }

        return component;
    }
    /**
     * 
     * @param componentClass 
     * @param includeInactive 
     * @param output 
     */
    public getComponentsInParent<T extends BaseComponent>(componentClass: IComponentClass<T>, includeInactive: boolean = false, output: T[] | null = null): T[] {
        output = this.getComponents(componentClass, output);

        const { enabled, parent } = this.node;

        if (parent !== null && (includeInactive || (enabled && parent.entity.enabled))) {
            parent.gameEntity.getComponentsInParent(componentClass, includeInactive, output);
        }

        return output;
    }
    /**
     * 获取全部自己和子（孙）级中指定的组件实例。
     * @param componentClass 组件类。
     * @param includeInactive 是否尝试查找处于未激活状态的子（孙）级实体。（默认 `false`）
     * @param output
     */
    public getComponentsInChildren<T extends BaseComponent>(componentClass: IComponentClass<T>, includeInactive: boolean = false, output: T[] | null = null): T[] {
        output = this.getComponents(componentClass, output);

        const { enabled, children } = this.node;

        if (includeInactive || enabled) {
            for (const child of children) {
                if (includeInactive || child.entity.enabled) {
                    child.gameEntity.getComponentsInChildren(componentClass, includeInactive, output);
                }
            }
        }

        return output;
    }
    /**
     * 向该实体已激活的全部 Behaviour 组件发送消息。
     * @param methodName 
     * @param parameter
     */
    public sendMessage<T extends Behaviour>(methodName: keyof T, parameter: any = null, requireReceiver: boolean = true): this {
        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return this;
        }

        for (const component of this._components) {
            if (component !== undefined && component.enabled && component instanceof Behaviour) {
                if (methodName in component) {
                    (component as any)[methodName](parameter);
                }
                else if (requireReceiver && DEBUG) {
                    console.warn(methodName); // TODO
                }
            }
        }

        return this;
    }
    /**
     * 向该实体和其父级的 Behaviour 组件发送消息。
     * @param methodName 
     * @param parameter 
     */
    public sendMessageUpwards<T extends Behaviour>(methodName: keyof T, parameter: any = null, requireReceiver: boolean = true): this {
        this.sendMessage(methodName as any, parameter, requireReceiver);

        const { enabled, parent } = this.node;

        if (enabled && parent !== null && parent.entity.enabled) {
            parent.gameEntity.sendMessageUpwards(methodName, parameter, requireReceiver);
        }

        return this;
    }
    /**
     * 向该实体和的其子（孙）级的 Behaviour 组件发送消息。
     * @param methodName 
     * @param parameter 
     */
    public broadcastMessage<T extends Behaviour>(methodName: keyof T, parameter?: any, requireReceiver: boolean = true): this {
        this.sendMessage(methodName, parameter, requireReceiver);

        if (this.node.enabled) {
            for (const child of this.node.children) {
                if (child.enabled) {
                    child.gameObject.broadcastMessage(methodName, parameter, requireReceiver);
                }
            }
        }

        return this;
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
