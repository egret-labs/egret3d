import { component } from "../../Decorators";
import { serializeField, deserializeIgnore } from "../../serialize/Decorators";
import Component from "../../core/Component";
/**
 * 节点组件。
 */
@component()
export class Node extends Component {
    public name: string = "";
    public tag: string = "";

    private _globalEnabledDirty: boolean = true;
    private _globalEnabled: boolean = false;
    protected readonly _children: this[] = [];
    protected _parent: this | null = null;

    protected abstract _onChangeParent(isBefore: boolean, worldTransformStays: boolean): void;
    /**
     * @internal
     */
    public _destroy() {
        this.destroyChildren();

        if (this._parent) {
            this._parent._removeChild(this);
        }

        super._destroy();
    }
    /**
     * @internal
     */
    public _addChild(child: this) {
        const children = this._children;

        if (children.indexOf(child) < 0) {
            children.push(child);
            (child.entity.scene as Scene)._rootEntitiesDirty = true;
            child._parent = this;

            return true;
        }

        return false;
    }
    /**
     * @internal
     */
    public _removeChild(child: this) {
        const children = this._children;
        const index = children.indexOf(child);

        if (index >= 0) {
            children.splice(index, 1);
            (child.entity.scene as Scene)._rootEntitiesDirty = true;
            child._parent = null;

            return true;
        }

        return false;
    }

    public dispatchEnabledEvent(enabled: boolean): void {
        this._globalEnabledDirty = true;

        for (const child of this._children) {
            if (child.entity.enabled) {
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
    public setParent(parent: this | null, worldTransformStays: boolean = false) {
        const scene = this.entity.scene;

        if (this.entity === scene.application.sceneManager.globalEntity) {
            console.warn("Cannot changed the parent of a node on the global entity.");

            return this;
        }

        if (this === parent || (parent !== null && this.contains(parent))) {
            console.warn("Set the parent of the node error.");

            return this;
        }

        const prevParent = this._parent;

        if (prevParent === parent) {
            return this;
        }

        this._onChangeParent(true, worldTransformStays);

        const prevEnabled = this.isActiveAndEnabled;

        if (prevParent) {
            prevParent._removeChild(this);
        }

        if (parent) {
            parent._addChild(this);
        }

        this._globalEnabledDirty = true;

        const currentEnabled = this.isActiveAndEnabled;

        if (prevEnabled !== currentEnabled) {
            this.dispatchEnabledEvent(currentEnabled);
        }

        this._onChangeParent(false, worldTransformStays);

        BaseTransform.onTransformParentChanged.dispatch([this, prevParent, parent]);

        return this;
    }
    /**
     * 
     */
    public destroyChildren(): void {
        const children = this._children;
        let i = children.length;

        while (i--) {
            children[i].entity.destroy();
        }
    }
    /**
     * 
     */
    public getChildren(output: this[] | null = null, depth: uint = 0): this[] {
        if (output === null) {
            output = [];
        }

        for (const child of this._children) {
            output.push(child);

            if (depth !== 1) {
                child.getChildren(output, depth > 0 ? depth - 1 : 0);
            }
        }

        return output;
    }
    /**
     * 
     */
    public getChildIndex(value: this): int {
        if (value._parent === this) {
            return this._children.indexOf(value);
        }

        return -1;
    }
    /**
     * 
     */
    public setChildIndex(child: this, index: uint): boolean {
        if (child._parent === this) {
            const children = this._children;
            const prevIndex = children.indexOf(child);

            if (prevIndex !== index) {
                children.splice(prevIndex, 1);
                children.splice(index, 0, child);

                return true;
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
    public getChildAt(index: uint): this | null {
        const children = this._children;

        return 0 <= index && index < children.length ? children[index] : null;
    }
    /**
     * 通过指定的名称或路径获取该节点的子（孙）级节点。
     * @param nameOrPath 名称或路径。
     * - `"xxx"` 或 `"xxx/xxx"` 。
     */
    public find(nameOrPath: string): this | null {
        const names = nameOrPath.split("/");
        let ancestor = this;

        for (const name of names) {
            if (name === "") {
                return ancestor;
            }

            const prevAncestor = ancestor;

            for (const child of ancestor._children) {
                if (child.entity.name === name) {
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
     * 该节点是否包含指定的子（孙）级节点。
     * @param child 一个节点。
     */
    public contains(child: this): boolean {
        if (child === this) {
            return false;
        }

        let ancestor: this | null = child;

        while (ancestor !== this && ancestor !== null) {
            ancestor = ancestor._parent;
        }

        return ancestor === this;
    }
    /**
     * @internal
     */
    public get isActiveAndEnabled(): boolean {
        if (this._globalEnabledDirty) {
            const parent = this._parent;

            if (parent === null || parent.isActiveAndEnabled) {
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
     * 该节点的全部子级节点数量。
     * - 不包含孙级节点。
     */
    public get childCount(): uint {
        return this._children.length;
    }
    /**
     * 该节点的全部子级节点。
     * - 不包含孙级节点。
     */
    @serializeField
    @deserializeIgnore
    public get children(): ReadonlyArray<this> {
        return this._children;
    }
    /**
     * 该节点的父级节点。
     */
    public get parent(): this | null {
        return this._parent;
    }
    public set parent(value: this | null) {
        this.setParent(value, false);
    }
}
