import { DefaultNames } from "../types";
import { component } from "../../core/Decorators";
import { Parent } from "./Parent";
import { Scene } from "./Scene";
/**
 * 基础节点组件。
 */
@component()
export class Node extends Parent {
    public name: string = DefaultNames.Noname;
    public tag: string = "";
    /**
     * @internal
     */
    public _parent: Parent | null = null;
    /**
     * @internal
     */
    public _scene: Scene | null = null;

    protected _destroy() {
        this.removeChildren();
        this._parent!.removeChild(this);

        super._destroy();
    }

    protected _onChangeParent(isBefore: boolean, worldTransformStays: boolean): void {
    }
    /**
     * @internal
     */
    public uninitialize(): void {
        super.uninitialize();

        this.name = DefaultNames.Noname;
        this.tag = "";

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
            this._parent = this._scene;
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

        while (ancestor !== this && ancestor !== this._scene) {
            ancestor = ancestor._parent as Node;
        }

        return ancestor === this;
    }
    /**
     * @internal
     */
    public get isActiveAndEnabled(): boolean {
        if (this._globalEnabledDirty) {
            if (this._parent!.isActiveAndEnabled) {
                this._globalEnabled = this._enabled && this.entity.enabled;
            }
            else {
                this._globalEnabled = false;
            }

            this._globalEnabledDirty = false;
        }

        return this._globalEnabled;
    }
    /**
     * 该节点的父节点。
     */
    public get parent(): Node | null {
        const parent = this._parent;
        return parent !== this._scene ? parent as Node : null;
    }
    public set parent(value: Node | null) {
        this.setParent(value, false);
    }
}
