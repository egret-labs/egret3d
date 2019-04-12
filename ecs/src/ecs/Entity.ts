import UUID from "../uuid/UUID";
import { IComponentClass, IEntity } from "./types";
import { entity } from "./Decorators";
import Component from "./Component";
import GroupComponent from "./GroupComponent";
import Context from "./Context";
/**
 * 基础实体。
 */
@entity()
export default class Entity extends UUID implements IEntity {

    public static readonly requireComponents: ReadonlyArray<IComponentClass<Component>> | null = null;
    public static readonly extensions: { [key: string]: any } | null = null;
    /**
     * @internal
     */
    public static reactiveRemoveEnabled: boolean = false;
    /**
     * 该实体是否已被销毁。
     */
    public readonly isDestroyed: boolean = true;
    public readonly context: Context<this> = null!;

    protected _componentsDirty: boolean = false;
    protected _enabled: boolean = false;
    protected readonly _components: (Component | undefined)[] = [];
    protected readonly _cachedComponents: Component[] = [];
    /**
     * @internal
     */
    public readonly _removedComponents: (Component | undefined)[] = [];
    /**
     * 禁止实例化实体。
     * @protected
     */
    public constructor() {
        super();
    }

    protected _destroyError() {
        throw new Error("The entity has been destroyed.");
    }

    protected _setEnabled(value: boolean) {
        for (const component of this._components) {
            if (component === undefined) { // TODO remove undefined
                continue;
            }

            if (component.constructor === GroupComponent) {
                for (const componentInGroup of (component as GroupComponent).components) {
                    if (componentInGroup.enabled) {
                        componentInGroup.dispatchEnabledEvent(value);
                    }
                }
            }
            else if (component.enabled) {
                component.dispatchEnabledEvent(value);
            }
        }
    }

    protected _addComponent(_component: Component) {

    }

    protected _removeComponent(component: Component, groupComponent: GroupComponent | null): void {
        const componentClass = component.constructor as IComponentClass<Component>;

        if (groupComponent !== null) {
            groupComponent.removeComponent(component);

            if (groupComponent.components.length === 0) {
                this._removeComponent(groupComponent, null);
            }
        }
        else {
            this._removedComponents[componentClass.componentIndex] = component;
            delete this._components[componentClass.componentIndex]; // TODO remove undefined
        }

        if (!component.isDestroyed) {
            component.destroy();
        }

        this._componentsDirty = true;
    }

    protected _isRequireComponent(componentClass: IComponentClass<Component>) {
        for (const component of this._components) {
            if (component !== undefined) { // TODO remove undefined
                const requireComponents = ((
                    (component.constructor === GroupComponent) ?
                        (component as GroupComponent).components[0] :
                        component
                ).constructor as IComponentClass<Component>).requireComponents;

                if (requireComponents !== null && requireComponents.indexOf(componentClass) >= 0) {
                    // TODO
                    return true;
                }
            }
        }

        return false;
    }

    public initialize(defaultEnabled: boolean, context: Context<this>): void {
        (this.isDestroyed as boolean) = false;
        (this.context as Context<this>) = context;

        this._enabled = defaultEnabled;
    }

    public uninitialize(): void {
        this._componentsDirty = false;
        this._enabled = false;
        this._components.length = 0;
        this._cachedComponents.length = 0;
        this._removedComponents.length = 0;
    }

    public destroy(): boolean {
        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return false;
        }

        const { context } = this;
        context.onEntityDestroy.dispatch(this);
        this.removeAllComponent();
        (this.isDestroyed as boolean) = true;
        context!.removeEntity(this);
        context.onEntityDestroyed.dispatch(this);

        return true;
    }

    public addComponent<T extends Component>(componentClass: IComponentClass<T>, defaultEnabled: boolean = true): T {
        if (!componentClass) {
            throw new Error();
        }

        if (this.isDestroyed) {
            this._destroyError();
        }

        const { allowMultiple, componentIndex, requireComponents } = componentClass;
        const components = this._components;
        const existedComponent = components[componentIndex] || null;

        // Check multiple component.
        if (!allowMultiple && existedComponent !== null) {
            if (DEBUG) {
                // console.warn(`Cannot add the ${egret.getQualifiedClassName(componentClass)} component to the entity again.`, this.uuid);
            }

            return existedComponent as T;
        }

        // Require components.
        if (requireComponents !== null) {
            for (const requireComponentClass of requireComponents!) {
                if (this.getComponent(requireComponentClass as IComponentClass<Component>) === null) {
                    this.addComponent(requireComponentClass as IComponentClass<Component>, defaultEnabled);
                }
            }
        }

        // Create and add component.
        const component = Component.create(componentClass, defaultEnabled, this);

        if (existedComponent !== null) {
            if (existedComponent.constructor === GroupComponent) {
                (existedComponent as GroupComponent).addComponent(component);
            }
            else {
                const groupComponent = Component.create(GroupComponent, true, this);
                groupComponent.componentIndex = componentIndex;
                groupComponent.addComponent(existedComponent);
                groupComponent.addComponent(component);
                components[componentIndex] = groupComponent;
            }
        }
        else {
            components[componentIndex] = component;
        }

        this._componentsDirty = true;
        this._addComponent(component);
        this.context.onComponentCreated.dispatch([this, component]);

        if (component.isActiveAndEnabled) {
            component.dispatchEnabledEvent(true);
        }

        return component;
    }

    public removeComponent<T extends Component>(componentInstanceOrClass: IComponentClass<T> | T): boolean {
        if (!componentInstanceOrClass) {
            if (DEBUG) {
                throw new Error();
            }

            return false;
        }

        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return false;
        }

        let result = false;
        let componentIndex: int;
        let componentClass: IComponentClass<T>;
        let component: T | null = null;
        let groupComponent: GroupComponent | null = null;

        if (componentInstanceOrClass instanceof Component) { // Remove component by instance.
            componentClass = componentInstanceOrClass.constructor as IComponentClass<T>;
            componentIndex = componentClass.componentIndex;
            const temp = this._components[componentIndex] || null;

            if (temp !== null) {
                component = componentInstanceOrClass as T;

                if (temp.constructor === GroupComponent) {
                    groupComponent = temp as GroupComponent;
                }
            }
        }
        else { // Remove component by class.
            componentClass = componentInstanceOrClass as IComponentClass<T>;
            componentIndex = componentClass.componentIndex;

            if (componentIndex >= 0) {
                const temp = this._components[componentIndex] || null;

                if (temp !== null) {
                    if (temp.constructor === GroupComponent) {
                        groupComponent = temp as GroupComponent;
                        component = groupComponent.components[0] as T;
                    }
                }
            }
        }

        if (componentIndex >= 0 && component !== null) {
            if (
                (groupComponent !== null && groupComponent.components.length > 1) || // 多组件实例时，不用检查依赖。
                !this._isRequireComponent(componentClass)
            ) {
                this._removeComponent(component, groupComponent);
                result = true;
            }
        }

        return result;
    }

    public removeAllComponent(excludes: ReadonlyArray<IComponentClass<Component>> | null = null): void {
        const components = this._components;
        let i = components.length;

        while (i--) {
            const component = components[i] || null;

            if (component !== null) {
                const componentClass = component.constructor as IComponentClass<Component>;

                if (componentClass === GroupComponent) {
                    if (excludes === null || excludes.indexOf((component as GroupComponent).components[0].constructor as IComponentClass<Component>) >= 0) {
                        for (const componentInGroup of (component as GroupComponent).components) {
                            this._removeComponent(componentInGroup, component as GroupComponent);
                        }
                    }
                }
                else if (excludes === null || excludes.indexOf(componentClass) >= 0) {
                    this._removeComponent(component, null);
                }
            }
        }
    }

    public getComponent<T extends Component>(componentClass: IComponentClass<T>): T | null {
        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return null;
        }

        const component = this._components[componentClass.componentIndex] || null;

        if (component !== null) {
            if (component.constructor === GroupComponent) {
                return (component as GroupComponent).components[0] as T;
            }

            return component as T;
        }

        return null;
    }

    public getRemovedComponent<T extends Component>(componentClass: IComponentClass<T>): T | null {
        const componentIndex = componentClass.componentIndex;
        const component = this._removedComponents[componentIndex] || null;

        if (component !== null) {
            return component as T;
        }

        return null;
    }

    public getComponents<T extends Component>(componentClass: IComponentClass<T>, output: T[] | null): T[] {
        if (output === null) {
            output = [];
        }

        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return output;
        }

        const component = this._components[componentClass.componentIndex] || null;

        if (component !== null) { // TODO remove undefined
            if (component.constructor === GroupComponent) {
                for (const componentInGroup of (component as GroupComponent).components) {
                    output.push(componentInGroup as T);
                }
            }
            else {
                output.push(component as T);
            }
        }

        return output;
    }

    public getOrAddComponent<T extends Component>(componentClass: IComponentClass<T>): T {
        const component = this.getComponent(componentClass);

        if (component === null) {
            return this.addComponent(componentClass);
        }

        return component;
    }

    public hasComponents(componentClasses: IComponentClass<Component>[], componentEnabled: boolean): boolean {
        const components = this._components;

        for (let i = 0, l = componentClasses.length; i < l; ++i) {
            const component = components[componentClasses[i].componentIndex] || null;

            if (component === null) {
                return false;
            }

            if (componentEnabled) {
                if (component.constructor === GroupComponent) {
                    let flag = false;

                    for (const childComponent of (component as GroupComponent).components) {
                        if (childComponent.isActiveAndEnabled) { // TODO 匹配性能优化
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        return false;
                    }
                }
                else if (!component.isActiveAndEnabled) { // TODO 匹配性能优化
                    return false;
                }
            }
        }

        return true;
    }

    public hasAnyComponents(componentClasses: IComponentClass<Component>[], componentEnabled: boolean): boolean {
        const components = this._components;

        for (let i = 0, l = componentClasses.length; i < l; ++i) {
            const component = components[componentClasses[i].componentIndex] || null;

            if (component !== null) {
                if (componentEnabled) {
                    if (component.constructor === GroupComponent) {
                        for (const childComponent of (component as GroupComponent).components) {
                            if (childComponent.isActiveAndEnabled) { // TODO 匹配性能优化
                                return true;
                            }
                        }
                    }
                    else if (component.isActiveAndEnabled) { // TODO 匹配性能优化
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
        }

        return false;
    }

    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return;
        }

        if (this._enabled === value) {
            return;
        }

        const prevEnabled = this.isActiveAndEnabled;
        this._enabled = value;

        if (prevEnabled !== this.isActiveAndEnabled) {
            this._setEnabled(value);
        }
    }

    public get isActiveAndEnabled(): boolean {
        return this._enabled;
    }

    public get components(): ReadonlyArray<Component> {
        const cachedComponents = this._cachedComponents;

        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return cachedComponents;
        }

        if (this._componentsDirty) {
            let index = 0;

            for (const component of this._components) {
                if (component !== undefined) { // TODO remove undefined
                    if (component.constructor === GroupComponent) {
                        for (const componentInGroup of (component as GroupComponent).components) {
                            cachedComponents[index++] = componentInGroup;
                        }
                    }
                    else {
                        cachedComponents[index++] = component;
                    }
                }
            }

            if (cachedComponents.length !== index) {
                cachedComponents.length = index;
            }

            this._componentsDirty = false;
        }

        return cachedComponents;
    }
}
