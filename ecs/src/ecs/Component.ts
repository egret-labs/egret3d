import { UUID } from "../basic";
import { IAbstractComponentClass, IComponentClass, IComponent } from "./types";
import { component } from "./Decorators";
import { Entity } from "./Entity";
/**
 * 基础组件。
 * - 所有组件的基类。
 */
@component({ isAbstract: true })
export abstract class Component extends UUID implements IComponent {

    public static readonly isAbstract: IAbstractComponentClass<Component> | null = null;
    public static readonly allowMultiple: boolean = false;
    public static readonly componentIndex: int = -1;
    public static readonly componentType: string = "";
    public static readonly componentTag: string = "";
    public static readonly requireComponents: ReadonlyArray<IComponentClass<Component>> | null = null;
    public static readonly extensions: { [key: string]: any } | null = null;
    /**
     * @internal
     */
    public static create<TComponent extends Component>(componentClass: IComponentClass<TComponent>, defaultEnabled: boolean, config: any, entity: Entity): TComponent {
        // TODO pool
        const component = new componentClass();
        component.initialize(defaultEnabled, config, entity);

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

    protected _destroyError() {
        throw new Error("The component has been destroyed.");
    }

    protected _destroy() {
        (this.isDestroyed as boolean) = true;
    }

    public initialize(defaultEnabled: boolean, _config: any, entity: Entity): void {
        (this.isDestroyed as boolean) = false;
        (this.entity as Entity) = entity;

        this._enabled = defaultEnabled;
    }

    public uninitialize(): void {
        // delete (this.entity as Entity)._removedComponents[(this.constructor as IComponentClass<IComponent>).componentIndex]; TODO
        (this.entity as Entity) = null!;

        this._enabled = false;
    }

    public destroy(): boolean {
        if (this.isDestroyed) {
            if (DEBUG) {
                this._destroyError();
            }

            return false;
        }

        const { entity } = this;
        const { context } = entity;
        this.enabled = false;
        context.onComponentDestroy.dispatch([entity, this]);
        this._destroy();
        entity.removeComponent(this);
        context.onComponentDestroyed.dispatch([entity, this]);

        return true;
    }

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
            this.dispatchEnabledEvent(value);
        }
    }

    public get isActiveAndEnabled(): boolean {
        return this._enabled && this.entity.isActiveAndEnabled;
    }
}
