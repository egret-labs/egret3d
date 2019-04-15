import { filterArray } from "../../basic";
import { component, Entity, Component } from "../../ecs";
import { ComponentType, NodeNames, NodeLayer, NodeTags } from "../types";
import { Scene } from "./Scene";
import { Application } from "../Application";
/**
 * 基础节点组件。
 */
@component({ type: ComponentType.Node })
export class Node extends Component {
    public name: string = NodeNames.Noname;
    public tag: NodeTags | string = NodeTags.Untagged;
    public layer: NodeLayer = NodeLayer.Default;

    protected _globalEnabledDirty: boolean = true;
    protected _globalEnabled: boolean = false;
    protected _childrenDirty: boolean = false;
    protected _childCount: uint = 0;
    protected readonly _children: (Node | null)[] = [];
    protected _parent: Node | null = null;
    protected _scene: Scene | null = null;

    protected _destroy() {
        this.removeChildren();
        this._parent!.removeChild(this);

        super._destroy();
    }

    protected _onChangeParent(_isBefore: boolean, _worldTransformStays: boolean): void {
    }
    /**
     * @override
     * @internal
     */
    public initialize(defaultEnabled: boolean, entity: Entity): void {
        super.initialize(defaultEnabled, entity);

        Application.current.sceneManager.activeScene.addChild(this);
    }
    /**
     * @override
     * @internal
     */
    public uninitialize(): void {
        super.uninitialize();

        this.name = NodeNames.Noname;
        this.tag = "";

        this._globalEnabledDirty = true;
        this._globalEnabled = false;
        this._childrenDirty = false;
        this._childCount = 0;
        this._children.length = 0;
        this._parent = null;
        this._scene = null;
    }
    /**
     * 
     */
    public setParent(parent: Node | null, worldTransformStays: boolean = false): Node {
        if (parent !== null && this.contains(parent)) {
            console.warn("Set the parent of the node error.");

            return this;
        }

        const prevParent = this._parent;

        if (prevParent === parent) {
            return this;
        }

        this._onChangeParent(true, worldTransformStays);

        const prevEnabled = this.isActiveAndEnabled;

        if (prevParent !== null) {
            const children = prevParent._children;
            const index = children.indexOf(this);

            if (index >= 0) {
                children[index] = null;
                prevParent._childrenDirty = true;
                prevParent._childCount--;
            }
            else if (DEBUG) {
            }
        }

        if (parent !== null) {
            this._parent = parent;
            this._scene = parent._scene;
            parent.addChild(this);
        }
        else {
            this._parent = this._scene as any; // TODO
            this._scene!.addChild(this);
        }

        const currentEnabled = this.isActiveAndEnabled;

        if (prevEnabled !== currentEnabled) {
            this.dispatchEnabledEvent(currentEnabled);
        }

        this._onChangeParent(false, worldTransformStays);

        // BaseTransform.onTransformParentChanged.dispatch([this, prevParent, parent]);

        return this;
    }
    /**
     * 
     * @param node 
     */
    public addChild(node: Node): Node {
        if (node._parent !== this) {
            const children = this._children;

            if (children.indexOf(node) < 0) {
                children[children.length] = node;

                if (node._parent !== this) {
                    node.parent = this;
                }

                this._childrenDirty = true;
                this._childCount++;
            }
            else if (DEBUG) {
            }
        }

        return node;
    }
    /**
     * @override
     * @internal
     */
    public dispatchEnabledEvent(enabled: boolean): void {
        this._globalEnabledDirty = true;

        for (const child of this._children) {
            if (child !== null && child.entity.enabled) {
                for (const component of child.entity.components) {
                    if (component.enabled) {
                        component.dispatchEnabledEvent(enabled);
                    }
                }
            }
        }

        super.dispatchEnabledEvent(enabled);
    }
    /**
     * 
     */
    public removeChild(node: Node): boolean {
        if (node._parent === this) {
            const children = this._children;
            const index = children.indexOf(node);

            if (index >= 0) {
                children[index] = null;

                if (!node.entity.isDestroyed) {
                    node.entity.destroy();
                }

                this._childrenDirty = true;
                this._childCount--;

                return true;
            }
            else if (DEBUG) {
            }
        }

        return false;
    }
    /**
     * 
     */
    public removeChildren(): void {
        const children = this._children;
        let i = children.length;

        while (i--) {
            const child = children[i];

            if (child !== null) {
                this.removeChild(child);
            }
        }
    }
    /**
     * 
     */
    public getChildIndex(node: Node): int {
        if (node._parent === this) {
            return this.children.indexOf(node);
        }

        return -1;
    }
    /**
     * 
     */
    public setChildIndex(node: Node, index: uint): boolean {
        if (node._parent === this) {
            if (0 <= index && index < this._childCount) {
                const { children } = this;
                const prevIndex = children.indexOf(node);

                if (prevIndex !== index) {
                    (children as Node[]).splice(prevIndex, 1);
                    (children as Node[]).splice(index, 0, node);

                    return true;
                }
            }
        }
        else if (DEBUG) {
            console.warn("Set child index error.");
        }

        return false;
    }
    /**
     * 
     */
    public getChildren(output: Node[] | null = null, depth: uint = 0): Node[] {
        if (output === null) {
            output = [];
        }

        for (const child of this.children) {
            output[output.length] = child;

            if (depth !== 1) {
                child.getChildren(output, depth > 0 ? depth - 1 : 0);
            }
        }

        return output;
    }
    /**
     * 
     */
    public getChildAt(index: uint): Node | null {
        if (0 <= index && index < this._childCount) {
            return this.children[index];
        }

        return null;
    }
    // /**
    //  * 通过指定的名称或路径获取该节点的子（孙）节点。
    //  * @param nameOrPath 名称或路径。
    //  * - `"xxx"` 或 `"xxx/xxx"` 。
    //  */
    // public getChildByName(nameOrPath: string): Node | null {
    //     const names = nameOrPath.split("/");
    //     let ancestor = this as Node;

    //     for (const name of names) {
    //         if (name === "") {
    //             return ancestor;
    //         }

    //         const prevAncestor = ancestor;

    //         for (const child of ancestor.children) {
    //             if (child.name === name) {
    //                 ancestor = child;
    //                 break;
    //             }
    //         }

    //         if (prevAncestor === ancestor) {
    //             return null;
    //         }
    //     }

    //     return ancestor;
    // }
    /**
     * 该节点是否包含指定的子（孙）节点。
     * @param node 一个节点。
     */
    public contains(node: Node): boolean {
        if (node._scene !== this._scene) {
            return false;
        }

        let ancestor = node;

        while (ancestor !== this && ancestor !== this._scene as any) { // TODO
            ancestor = ancestor._parent as Node;
        }

        return ancestor === this;
    }
    /**
     * @override
     * @internal
     */
    public get isActiveAndEnabled(): boolean {
        if (this._globalEnabledDirty) {
            if (this._parent !== null) {
                if (this._parent.isActiveAndEnabled) {
                    this._globalEnabled = this.isActiveAndEnabled;
                }
                else {
                    this._globalEnabled = false;
                }
            }

            this._globalEnabledDirty = false;
        }

        return this._globalEnabled;
    }
    /**
     * 该实体的路径。
     */
    public get path(): string {
        let path = this.name;
        let ancestor = this._parent;

        while (ancestor !== this._scene) {
            path = (ancestor as Node).name + "/" + path;
            ancestor = (ancestor as Node).parent;
        }

        return path;
    }
    /**
     * 该场景（节点）的全部子节点数量。
     */
    public get childCount(): uint {
        return this._childCount;
    }
    /**
     * 该场景（节点）的全部子节点。
     */
    public get children(): ReadonlyArray<Node> {
        const children = this._children;

        if (this._childrenDirty) {
            filterArray(children, null);
            this._childrenDirty = false;
        }

        return children as Node[];
    }
    /**
     * 该节点的父节点。
     */
    public get parent(): Node | null {
        return this._parent;
    }
    public set parent(value: Node | null) {
        this.setParent(value, false);
    }
}
