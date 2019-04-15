import { filterArray } from "../../basic";
import { component } from "../../ecs";
import { serializedField } from "../../serialize";
import { ComponentType, NodeNames, NodeLayer, NodeTags, ConstString } from "../types";
import { BaseComponent } from "./BaseComponent";
import { Scene } from "./Scene";
/**
 * 基础节点组件。
 */
@component({ type: ComponentType.Node })
export class Node extends BaseComponent {
    /**
     * 该节点的名称。
     */
    @serializedField
    public name: string = NodeNames.Noname;
    /**
     * 该节点的标识。
     */
    @serializedField
    public tag: NodeTags | string = NodeTags.Untagged;
    /**
     * 该节点层级。
     */
    @serializedField
    public layer: NodeLayer = NodeLayer.Default;
    /**
     * 该节点所属的场景。
     */
    public readonly scene: Scene = null!;
    /**
     * 该节点的父节点。
     */
    public readonly parent: Node | null = null;

    protected _globalEnabledDirty: boolean = true;
    protected _globalEnabled: boolean = false;
    protected _childrenDirty: boolean = false;
    protected _childCount: uint = 0;
    protected readonly _children: (Node | null)[] = [];

    protected _onChangeParent(_isBefore: boolean, _worldTransformStays: boolean): void {
    }
    /**
     * @override
     * @internal
     */
    public uninitialize(): void {
        super.uninitialize();

        this.name = NodeNames.Noname;
        this.tag = "";
        (this.scene as Scene) = null!;
        (this.parent as Node | null) = null;

        this._globalEnabledDirty = true;
        this._globalEnabled = false;
        this._childrenDirty = false;
        this._childCount = 0;
        this._children.length = 0;
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
    public addChild(node: Node): Node {
        const children = this._children;

        if (children.indexOf(node) < 0) {
            children[children.length] = node;

            if (node.parent !== this) {
                node.setParent(this, false);
            }

            this._childrenDirty = true;
            this._childCount++;
        }
        else if (DEBUG) {
        }

        return node;
    }
    /**
     * 
     */
    public removeChild(node: Node): boolean {
        const children = this._children;
        const index = children.indexOf(node);

        if (index >= 0) {
            children[index] = null;

            if (!node.isDestroyed) {
                node.destroy();
            }

            this._childrenDirty = true;
            this._childCount--;

            return true;
        }
        else if (DEBUG) {
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
        if (node.parent === this) {
            return this.children.indexOf(node);
        }

        return -1;
    }
    /**
     * 
     */
    public setChildIndex(node: Node, index: uint): boolean {
        if (node.parent === this) {
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
    public setParent(node: Node, worldTransformStays: boolean = false): Node {
        if (this.contains(node)) {
            console.warn("Set the parent of the node error.");

            return this;
        }

        const prevParent = this.parent;

        if (prevParent === node) {
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

        (this.parent as Node | null) = node;
        (this.scene as Scene) = node.scene;
        node.addChild(this);

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
    /**
     * 通过指定的名称或路径获取该节点的子（孙）节点。
     * @param nameOrPath 一个名称或路径。
     * - `"xxx"` 或 `"xxx/xxx"` 。
     */
    public getChildByName(nameOrPath: string): Node | null {
        const names = nameOrPath.split(ConstString.PathSeparator);
        let ancestor = this as Node;

        for (const name of names) {
            if (name === "") {
                return ancestor;
            }

            const prevAncestor = ancestor;

            for (const child of ancestor.children) {
                if (child.name === name) {
                    ancestor = child;
                    break;
                }
            }

            if (prevAncestor === ancestor) {
                return null;
            }
        }

        return ancestor;
    }
    /**
     * 该节点是否包含指定的子（孙）节点。
     * @param node 一个节点。
     */
    public contains(node: Node): boolean {
        if (node.scene !== this.scene) {
            return false;
        }

        let ancestor: Node | null = node;

        while (ancestor !== this && ancestor !== null) {
            ancestor = ancestor.parent;
        }

        return ancestor === this;
    }
    /**
     * @override
     * @internal
     */
    public get isActiveAndEnabled(): boolean {
        if (this._globalEnabledDirty) {
            if (this.parent !== null) {
                if (this.parent.isActiveAndEnabled) {
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
     * 该节点的路径。
     */
    public get path(): string {
        let path = this.name;
        let ancestor = this.parent;

        while (ancestor !== null) {
            path = ancestor.name + ConstString.PathSeparator + path;
            ancestor = ancestor.parent;
        }

        return path;
    }
    /**
     * 该节点的全部子节点数量。
     */
    public get childCount(): uint {
        return this._childCount;
    }
    /**
     * 该节点的全部子节点。
     */
    @serializedField
    public get children(): ReadonlyArray<Node> {
        const children = this._children;

        if (this._childrenDirty) {
            filterArray(children, null);
            this._childrenDirty = false;
        }

        return children as Node[];
    }
}
