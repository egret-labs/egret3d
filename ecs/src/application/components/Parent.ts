import { filterArray } from "../../uuid/Utility";
import { component } from "../../core/Decorators";
import Component from "../../core/Component";
import { Node } from "./Node";
/**
 * @ignore
 */
@component()
export abstract class Parent extends Component {

    protected _globalEnabledDirty: boolean = true;
    protected _globalEnabled: boolean = false;
    /**
     * @internal
     */
    public _childrenDirty: boolean = false;
    /**
     * @internal
     */
    public _childCount: uint = 0;
    /**
     * @internal
     */
    public readonly _children: (Node | null)[] = [];
    /**
     * @internal
     */
    public uninitialize(): void {
        super.uninitialize();

        this._globalEnabledDirty = true;
        this._globalEnabled = false;
        this._childrenDirty = false;
        this._childCount = 0;
        this._children.length = 0;
    }
    /**
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
}
