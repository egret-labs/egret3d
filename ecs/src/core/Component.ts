import {
    IAbstractComponentClass,
    IComponentClass,
    IComponent,
} from "../types";
import { component } from "../Decorators";
import Serializable from "../serialize/Serializable";
import Entity from "./Entity";
/**
 * 基础组件。
 * - 所有组件的基类。
 */
@component({ isAbstract: true })
export default abstract class Component extends Serializable<any> implements IComponent {
    public static readonly isAbstract: IAbstractComponentClass | null = null;
    public static readonly isSingleton: boolean = false;
    public static readonly allowMultiple: boolean = false;
    public static readonly componentIndex: int = -1;
    public static readonly requireComponents: ReadonlyArray<IComponentClass<Component>> | null = null;
    /**
     * @internal
     */
    public static createDefaultEnabled: boolean = true;
    /**
     * 所有已注册的单例组件类。
     * TOFIX: 污染静态域。
     */
    private static readonly _allSingletonComponents: IAbstractComponentClass[] = [];
    /**
     * 所有已注册的组件类。
     * TOFIX: 污染静态域。
     */
    private static readonly _allComponents: IAbstractComponentClass[] = [];

    public static onRegister(): boolean {
        if (!Serializable.onRegister.call(this)) { // Super.
            return false;
        }

        if (this.isAbstract === this) {
            return false;
        }

        if (this.isSingleton) {
            (this.componentIndex as int) = this._allSingletonComponents.length + 256; // This means that a maximum of 256 non-singleton components can be added.
            this._allSingletonComponents.push(this);
        }
        else {
            (this.componentIndex as int) = this._allComponents.length;
            this._allComponents.push(this);
        }

        if (this.requireComponents !== null) { // Inherited parent class require components.
            (this.requireComponents as IComponentClass<Component>[] | null) = this.requireComponents.concat();
        }
        else {
            (this.requireComponents as IComponentClass<Component>[] | null) = [];
        }

        return true;
    }
    /**
     * @internal
     */
    public static create<TComponent extends Component>(componentClass: IComponentClass<TComponent>, entity: Entity): TComponent {
        // TODO pool
        const component = new componentClass();
        component.initialize(entity);

        return component;
    }
    /**
     * 该组件是否已被销毁。
     */
    public readonly isDestroyed: boolean = true;
    public readonly entity: Entity = null!;

    protected _enabled: boolean = false;
    /**
     * 禁止实例化组件。
     * @protected
     */
    public constructor() {
        super();
    }

    protected _setEnabled(value: boolean) {
        this.dispatchEnabledEvent(value);
    }

    public initialize(entity: Entity): void {
        (this.isDestroyed as boolean) = false;
        (this.entity as Entity) = entity;

        this._enabled = Component.createDefaultEnabled;
    }

    public uninitialize(): void {
        // delete (this.entity as Entity)._removedComponents[(this.constructor as IComponentClass<IComponent>).componentIndex]; TODO
        (this.isDestroyed as boolean) = true;
        (this.entity as Entity) = null!;

        this._enabled = false;
    }

    public destroy(): boolean {
        if (this.isDestroyed) {
            if (DEBUG) {
                console.warn("The component has been destroyed.");
            }

            return false;
        }

        // TODO move to entity.
        const { entity } = this;
        const { context } = entity;
        this.enabled = false;
        context.onComponentDestroy.dispatch([entity, this]);
        (this.isDestroyed as boolean) = true;
        entity.removeComponent(this);
        context.onComponentDestroyed.dispatch([entity, this]);

        return true;
    }
    // TODO move to entity.
    public dispatchEnabledEvent(enabled: boolean): void {
        const { context } = this.entity;

        if (enabled) {
            context.onComponentEnabled.dispatch([this.entity, this]);
        }
        else {
            context.onComponentDisabled.dispatch([this.entity, this]);
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        if (this._enabled === value || this.isDestroyed) {
            return;
        }

        this._enabled = value;
        this._setEnabled(value);
    }

    public get isActiveAndEnabled(): boolean {
        return this._enabled && this.entity.enabled;
    }
}
