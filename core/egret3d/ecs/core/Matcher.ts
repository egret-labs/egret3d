namespace paper {

    const _indices: uint[] = [];
    /**
     * 实体组件匹配器。
     */
    export class Matcher<TEntity extends IEntity> extends BaseRelease<Matcher<TEntity>> implements IAllOfMatcher<TEntity>  {
        private static readonly _instances: Matcher<IEntity>[] = [];

        /**
         * 创建匹配器。
         * @param componentClasses 必须包含的全部组件。
         */
        public static create<TEntity extends IEntity>(...componentClasses: IComponentClass<IComponent>[]): IAllOfMatcher<TEntity>;
        /**
         * 创建匹配器。
         * @param componentEnabledFilter 是否以组件的激活状态做为匹配条件。
         * @param componentClasses 必须包含的全部组件。
         */
        public static create<TEntity extends IEntity>(componentEnabledFilter: false, ...componentClasses: IComponentClass<IComponent>[]): IAllOfMatcher<TEntity>;
        public static create<TEntity extends IEntity>(...args: any[]): IAllOfMatcher<TEntity> {
            let instance: Matcher<TEntity>;

            if (this._instances.length > 0) {
                instance = this._instances.pop()!;
                instance._released = false;
            }
            else {
                instance = new Matcher<TEntity>();
            }

            (instance.componentEnabledFilter as boolean) = args[0] !== false;

            if (!instance.componentEnabledFilter) {
                args.shift();
            }

            instance._distinct(args, instance._allOfComponents);

            return instance;
        }

        public readonly componentEnabledFilter: boolean = true;

        private _id: string = "";
        private readonly _components: IComponentClass<IComponent>[] = [];
        private readonly _allOfComponents: IComponentClass<IComponent>[] = [];
        private readonly _anyOfComponents: IComponentClass<IComponent>[] = [];
        private readonly _noneOfComponents: IComponentClass<IComponent>[] = [];
        private readonly _extraOfComponents: IComponentClass<IComponent>[] = [];

        private constructor() {
            super();
        }

        private _sortComponents(a: IComponentClass<IComponent>, b: IComponentClass<IComponent>) {
            return a.componentIndex - b.componentIndex;
        }

        private _distinct(source: ReadonlyArray<IComponentClass<IComponent>>, target: IComponentClass<IComponent>[]) {
            if (source.length === 0) {
                return;
            }

            let index = 0;

            for (const component of source) {
                registerClass(component); // TODO

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
            if (this._allOfComponents.length > 0) {
                for (const component of this._allOfComponents) {
                    this._components.push(component);
                }
            }

            if (this._anyOfComponents.length > 0) {
                for (const component of this._anyOfComponents) {
                    this._components.push(component);
                }
            }

            if (this._noneOfComponents.length > 0) {
                for (const component of this._noneOfComponents) {
                    this._components.push(component);
                }
            }

            if (this._extraOfComponents.length > 0) {
                for (const component of this._extraOfComponents) {
                    this._components.push(component);
                }
            }
        }

        public onClear() {
            this._id = "";
            this._components.length = 0;
            this._allOfComponents.length = 0;
            this._anyOfComponents.length = 0;
            this._noneOfComponents.length = 0;
            this._extraOfComponents.length = 0;
        }

        public anyOf(...components: IComponentClass<IComponent>[]): IAnyOfMatcher<TEntity> {
            if (this._id) {
                return this;
            }

            this._distinct(components, this._anyOfComponents);

            return this;
        }

        public noneOf(...components: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity> {
            if (this._id) {
                return this;
            }

            this._distinct(components, this._noneOfComponents);

            return this;
        }

        public extraOf(...components: IComponentClass<IComponent>[]): INoneOfMatcher<TEntity> {
            if (this._id) {
                return this;
            }

            this._distinct(components, this._extraOfComponents);

            return this;
        }

        public matches(entity: TEntity, component: IComponentClass<IComponent> | null, isAdd: boolean, isAdded: boolean): -2 | -1 | 0 | 1 | 2 {
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
                        return 2;
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
            if (!this._id) {
                this._id = (this.componentEnabledFilter ? "E" : "C");

                if (this._allOfComponents.length > 0) {
                    for (const component of this._allOfComponents) {
                        _indices.push(component.componentIndex);
                    }

                    this._id += " All " + _indices.join(",");
                    _indices.length = 0;
                }

                if (this._anyOfComponents.length > 0) {
                    for (const component of this._anyOfComponents) {
                        _indices.push(component.componentIndex);
                    }

                    this._id += " Any " + _indices.join(",");
                    _indices.length = 0;
                }

                if (this._noneOfComponents.length > 0) {
                    for (const component of this._noneOfComponents) {
                        _indices.push(component.componentIndex);
                    }

                    this._id += " None " + _indices.join(",");
                    _indices.length = 0;
                }

                if (this._extraOfComponents.length > 0) {
                    for (const component of this._extraOfComponents) {
                        _indices.push(component.componentIndex);
                    }

                    this._id += " Extra " + _indices.join(",");
                    _indices.length = 0;
                }
            }

            return this._id;
        }

        public get components(): ReadonlyArray<IComponentClass<IComponent>> {
            if (this._components.length === 0) {
                this._merge();
            }

            return this._components;
        }

        public get allOfComponents(): ReadonlyArray<IComponentClass<IComponent>> {
            return this._allOfComponents;
        }

        public get anyOfComponents(): ReadonlyArray<IComponentClass<IComponent>> {
            return this._anyOfComponents;
        }

        public get noneOfComponents(): ReadonlyArray<IComponentClass<IComponent>> {
            return this._noneOfComponents;
        }

        public get extraOfComponents(): ReadonlyArray<IComponentClass<IComponent>> {
            return this._extraOfComponents;
        }
    }
}
