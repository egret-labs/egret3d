import { component } from "../../Decorators";
import Component from "../Component";
import { serializeField, deserializeIgnore } from "../../serialize/Decorators";
/**
 * 节点组件。
 */
@component()
export class Node extends Component {

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
     * 更改该组件的父级变换组件。
     * @param parent 父级变换组件。
     * @param worldTransformStays 是否保留当前世界空间变换。
     */
    public setParent(parent: this | null, worldTransformStays: boolean = false) {
        if (this === parent || (parent && this.contains(parent))) {
            console.error("Set the parent error.");
            return this;
        }

        if (parent && this.entity.scene !== parent.entity.scene) {
            console.error("Cannot change the parent to a different scene.");
            return this;
        }

        if (this.entity === Application.sceneManager._globalEntity) {
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
     * 销毁该组件所有子（孙）级变换组件和其实体。
     */
    public destroyChildren(): void {
        const children = this._children;
        let i = children.length;

        while (i--) {
            children[i].entity.destroy();
        }

        children.length > 0 && (children.length = 0);
    }
    /**
     * 
     */
    public getChildren(out: this[] | { [key: string]: BaseTransform | (BaseTransform[]) } = [], depth: uint = 0) {
        for (const child of this._children) {
            if (Array.isArray(out)) {
                out.push(child);
            }
            else {
                const childName = child.entity.name;

                if (childName in out) {
                    const transformOrTransforms = out[childName];

                    if (Array.isArray(transformOrTransforms)) {
                        transformOrTransforms.push(child as any);
                    }
                    else {
                        out[childName] = [transformOrTransforms, child as any];
                    }
                }
                else {
                    out[childName] = child as any;
                }
            }

            if (depth !== 1) {
                child.getChildren(out, depth > 0 ? depth - 1 : 0);
            }
        }

        return out;
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
    public setChildIndex(value: this, index: uint): boolean {
        if (value._parent === this) {
            const children = this._children;
            const prevIndex = children.indexOf(value);

            if (prevIndex !== index) {
                children.splice(prevIndex, 1);
                children.splice(index, 0, value);

                return true;
            }
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
     * 通过指定的名称或路径获取该组件的子（孙）级变换组件。
     * @param nameOrPath 名称或路径。
     */
    public find(nameOrPath: string): this | null {
        const names = nameOrPath.split("/");
        let ancestor = this;

        for (const name of names) {
            if (!name) {
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
     * 该组件是否包含某个子（孙）级变换组件。
     */
    public contains(child: this): boolean {
        if (child === this) {
            return false;
        }

        let ancestor: this | null = child;

        while (ancestor !== this && ancestor) {
            ancestor = ancestor._parent;
        }

        return ancestor === this;
    }
    /**
     * 
     */
    public get isActiveAndEnabled(): boolean {
        if (this._globalEnabledDirty) {
            const parent = this._parent;

            if (!parent || parent.isActiveAndEnabled) {
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
     * 
     */
    public get childCount(): uint {
        return this._children.length;
    }
    /**
     * 
     */
    @serializeField
    @deserializeIgnore
    public get children(): ReadonlyArray<this> {
        return this._children;
    }
    /**
     * 该节点组件的父级变换组件。
     */
    public get parent(): this | null {
        return this._parent;
    }
    public set parent(value: this | null) {
        this.setParent(value, false);
    }
}
