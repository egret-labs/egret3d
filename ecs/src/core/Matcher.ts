import {
    IComponentClass,
    IAllOfMatcher,
    IAnyOfMatcher,
    INoneOfMatcher,
} from "../types";
import Releasable from "../Releasable";
import Entity from "./Entity";
import Component from "./Component";

const _indices: uint[] = [];
/**
 * 实体组件匹配器。
 */
export default class Matcher extends Releasable implements IAllOfMatcher {
    /**
     * @internal
     */
    public static readonly instances: ReadonlyArray<Matcher> = [];
    /**
     * 创建一个匹配器。
     * @param componentClasses 必须包含的全部组件。
     */
    public static create(...componentClasses: ReadonlyArray<IComponentClass<Component>>): IAllOfMatcher;
    /**
     * 创建一个匹配器。
     * @param componentEnabledFilter 是否以组件的激活状态做为匹配条件。
     * @param componentClasses 必须包含的全部组件。
     */
    public static create(componentEnabledFilter: false, ...componentClasses: ReadonlyArray<IComponentClass<Component>>): IAllOfMatcher;
    public static create(...args: any[]): IAllOfMatcher {
        let instance: Matcher;

        if (this.instances.length > 0) {
            instance = (this.instances as Matcher[]).pop()!;
        }
        else {
            instance = new Matcher();
        }

        const componentEnabledFilter = args[0] !== false;
        if (!componentEnabledFilter) {
            args.shift();
        }

        instance.initialize(componentEnabledFilter, args);

        return instance;
    }
    /**
     * 该匹配器是否以组件的激活状态为匹配规则。
     */
    public readonly componentEnabledFilter: boolean = true;

    private _id: string = "";
    private readonly _components: IComponentClass<Component>[] = [];
    private readonly _allOfComponents: IComponentClass<Component>[] = [];
    private readonly _anyOfComponents: IComponentClass<Component>[] = [];
    private readonly _noneOfComponents: IComponentClass<Component>[] = [];
    private readonly _extraOfComponents: IComponentClass<Component>[] = [];

    private constructor() {
        super();
    }

    private _sortComponents(a: IComponentClass<Component>, b: IComponentClass<Component>) {
        return a.componentIndex - b.componentIndex;
    }

    private _distinct(source: ReadonlyArray<IComponentClass<Component>>, target: IComponentClass<Component>[]) {
        if (source.length === 0) {
            return;
        }

        let index = 0;

        for (const component of source) {
            if (target.indexOf(component) < 0) {
                target[index++] = component;
            }
        }

        if (target.length !== index) {
            target.length = index;
        }

        target.sort(this._sortComponents);
    }

    private _merge() {
        const {
            _components,
            _allOfComponents,
            _anyOfComponents,
            _noneOfComponents,
            _extraOfComponents,
        } = this;

        if (_allOfComponents.length > 0) {
            for (const component of _allOfComponents) {
                _components.push(component);
            }
        }

        if (_anyOfComponents.length > 0) {
            for (const component of _anyOfComponents) {
                _components.push(component);
            }
        }

        if (_noneOfComponents.length > 0) {
            for (const component of _noneOfComponents) {
                _components.push(component);
            }
        }

        if (_extraOfComponents.length > 0) {
            for (const component of _extraOfComponents) {
                _components.push(component);
            }
        }
    }
    /**
     * @internal
     */
    public initialize(componentEnabledFilter: boolean = true, components: ReadonlyArray<IComponentClass<Component>> | null = null): void {
        super.initialize();

        (this.componentEnabledFilter as boolean) = componentEnabledFilter;

        if (components !== null) {
            this._distinct(components, this._allOfComponents);
        }
    }
    /**
     * @internal
     */
    public uninitialize(): void {
        super.uninitialize();

        this._id = "";
        this._components.length = 0;
        this._allOfComponents.length = 0;
        this._anyOfComponents.length = 0;
        this._noneOfComponents.length = 0;
        this._extraOfComponents.length = 0;
    }

    public anyOf(...components: ReadonlyArray<IComponentClass<Component>>): IAnyOfMatcher {
        if (this._id !== "") {
            return this;
        }

        this._distinct(components, this._anyOfComponents);

        return this;
    }

    public noneOf(...components: ReadonlyArray<IComponentClass<Component>>): INoneOfMatcher {
        if (this._id !== "") {
            return this;
        }

        this._distinct(components, this._noneOfComponents);

        return this;
    }

    public extraOf(...components: ReadonlyArray<IComponentClass<Component>>): INoneOfMatcher {
        if (this._id !== "") {
            return this;
        }

        this._distinct(components, this._extraOfComponents);

        return this;
    }

    public matches(entity: Entity, component: IComponentClass<Component> | null, isAdd: boolean, isAdded: boolean): -2 | -1 | 0 | 1 | 2 {
        const { componentEnabledFilter, _allOfComponents, _anyOfComponents, _noneOfComponents, _extraOfComponents } = this;

        if (component) {
            const isNoneOf = _noneOfComponents.length > 0 && _noneOfComponents.indexOf(component) >= 0;

            if (isNoneOf) {
                if (isAdd === isAdded) {
                    if (isAdd) {
                        // remove
                        return -1;
                    }
                    else if (
                        (_allOfComponents.length === 0 || entity.hasComponents(_allOfComponents, componentEnabledFilter)) &&
                        (_anyOfComponents.length === 0 || entity.hasAnyComponents(_anyOfComponents, componentEnabledFilter)) &&
                        !entity.hasAnyComponents(_noneOfComponents, componentEnabledFilter)
                    ) {
                        // add
                        return 1;
                    }
                }
            }
            else if (isAdd) {
                if (isAdded) {
                    if (_extraOfComponents.length > 0 && _extraOfComponents.indexOf(component) >= 0) {
                        // add extra
                        return 2;
                    }
                }
                else if (
                    (_allOfComponents.length === 0 || entity.hasComponents(_allOfComponents, componentEnabledFilter)) &&
                    (_anyOfComponents.length === 0 || entity.hasAnyComponents(_anyOfComponents, componentEnabledFilter))
                ) {
                    // add
                    return 1;
                }
            }
            else if (isAdded) {
                if (_extraOfComponents.length > 0 && _extraOfComponents.indexOf(component) >= 0) {
                    // remove extra
                    return -2;
                }
                else if (
                    (_allOfComponents.length === 0 || entity.hasComponents(_allOfComponents, componentEnabledFilter)) &&
                    (_anyOfComponents.length === 0 || entity.hasAnyComponents(_anyOfComponents, componentEnabledFilter))
                ) {
                }
                else {
                    // remove
                    return -1;
                }
            }
        }
        else if (!isAdded) {
            if (
                (_allOfComponents.length === 0 || entity.hasComponents(_allOfComponents, componentEnabledFilter)) &&
                (_anyOfComponents.length === 0 || entity.hasAnyComponents(_anyOfComponents, componentEnabledFilter)) &&
                (_noneOfComponents.length === 0 || !entity.hasAnyComponents(_noneOfComponents, componentEnabledFilter))
            ) {
                if (isAdd) {
                    // add
                    return 1;
                }
                else {
                    // remove
                    return -1;
                }
            }
        }

        return 0;
    }

    public get id(): string {
        let id = this._id;

        if (id === "") {
            const {
                componentEnabledFilter,
                _allOfComponents,
                _anyOfComponents,
                _noneOfComponents,
                _extraOfComponents,
            } = this;

            id = (componentEnabledFilter ? "E" : "C");

            if (_allOfComponents.length > 0) {
                for (const component of _allOfComponents) {
                    _indices.push(component.componentIndex);
                }

                id += " All " + _indices.join(",");
                _indices.length = 0;
            }

            if (_anyOfComponents.length > 0) {
                for (const component of _anyOfComponents) {
                    _indices.push(component.componentIndex);
                }

                id += " Any " + _indices.join(",");
                _indices.length = 0;
            }

            if (_noneOfComponents.length > 0) {
                for (const component of _noneOfComponents) {
                    _indices.push(component.componentIndex);
                }

                id += " None " + _indices.join(",");
                _indices.length = 0;
            }

            if (_extraOfComponents.length > 0) {
                for (const component of _extraOfComponents) {
                    _indices.push(component.componentIndex);
                }

                id += " Extra " + _indices.join(",");
                _indices.length = 0;
            }

            this._id = id;
        }

        return id;
    }

    public get components(): ReadonlyArray<IComponentClass<Component>> {
        const { _components } = this;

        if (_components.length === 0) {
            this._merge();
        }

        return _components;
    }

    public get allOfComponents(): ReadonlyArray<IComponentClass<Component>> {
        return this._allOfComponents;
    }

    public get anyOfComponents(): ReadonlyArray<IComponentClass<Component>> {
        return this._anyOfComponents;
    }

    public get noneOfComponents(): ReadonlyArray<IComponentClass<Component>> {
        return this._noneOfComponents;
    }

    public get extraOfComponents(): ReadonlyArray<IComponentClass<Component>> {
        return this._extraOfComponents;
    }
}
