import { component } from "../../ecs";
import { NodeNames } from "../types";
import { Parent } from "./Parent";
import { Node } from "./Node";
/**
 * 基础场景组件。
 */
@component()
export class Scene extends Parent {

    public name: string = NodeNames.Noname;

    public addChild(node: Node): Node {
        if (node._parent !== this) {
            const children = this._children;

            if (children.indexOf(node) < 0) {
                children[children.length] = node;

                if (node._parent !== this) {
                    node.parent = this as any;
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
     * 该场景是否包含指定的子（孙）节点。
     * @param node 一个节点。
     */
    public contains(node: Node): boolean {
        return node._scene === this;
    }

    /**
     * @deprecated
     */
    public getRootGameObjects() {
        return this.children;
    }
}
