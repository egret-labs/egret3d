namespace paper {
    /**
     * @internal
     */
    export const _executeInEditModeComponents: ComponentClassArray = [];
    /**
     * @internal
     */
    export const _disallowMultipleComponents: ComponentClassArray = [];
    /**
     * @internal
     */
    export const _requireComponents: (ComponentClass<BaseComponent>[] | undefined)[] = [];

    const _tagB: any[] = [];
    const _tagC: any[] = [];
    /**
     * @internal
     */
    export const enum SerializeKey {
        Serialized = "__serialized",
        DeserializedIgnore = "__deserializedIgnore",
    }

    /**
     * 标记序列化属性
     * 通过装饰器标记需要序列化的属性
     */
    export function serializedField(classPrototype: any, type: string) {
        if (_tagB.indexOf(classPrototype) >= 0) {
            const types = classPrototype[SerializeKey.Serialized] as string[];
            if (types.indexOf(type) < 0) {
                types.push(type);
            }
        }
        else {
            classPrototype[SerializeKey.Serialized] = [type];
            _tagB.push(classPrototype);
        }
    }

    /**
     * 标记反序列化时需要忽略的属性
     * 通过装饰器标记反序列化时需要被忽略的属性（但属性中引用的对象依然会被实例化）
     */
    export function deserializedIgnore(classPrototype: any, type: string) {
        if (_tagC.indexOf(classPrototype) >= 0) {
            const types = classPrototype[SerializeKey.DeserializedIgnore] as string[];
            if (types.indexOf(type) < 0) {
                types.push(type);
            }
        }
        else {
            classPrototype[SerializeKey.DeserializedIgnore] = [type];
            _tagC.push(classPrototype);
        }
    }
    /**
     * 标记脚本组件是否在编辑模式也拥有生命周期。
     */
    export function executeInEditMode(target: ComponentClass<BaseComponent>) {
        BaseComponent.register(target);
        _executeInEditModeComponents[target.index] = _executeInEditModeComponents[target.index] || target;
    }
    /**
     * 
     */
    export function disallowMultipleComponent(target: ComponentClass<BaseComponent>) {
        BaseComponent.register(target);
        _disallowMultipleComponents[target.index] = _disallowMultipleComponents[target.index] || target;
    }
    /**T
     * 
     */
    export function requireComponent(requireTarget: ComponentClass<BaseComponent>) {
        return function (target: ComponentClass<BaseComponent>) {
            // `egret.getQualifiedClassName()` cannot work here.
            BaseComponent.register(target, true);
            if (!_requireComponents[target.componentIndex]) {
                _requireComponents[target.componentIndex] = [];
            }

            const components = _requireComponents[target.componentIndex] as ComponentClassArray;
            if (components.indexOf(requireTarget) < 0) {
                components.push(requireTarget);
            }
        };
    }
}
