namespace paper {
    /**
     * @internal
     */
    export const _executeInEditModeComponents: { new(): BaseComponent }[] = [];
    /**
     * @internal
     */
    export const _disallowMultipleComponents: { new(): BaseComponent }[] = [];
    /**
     * @internal
     */
    export const _requireComponents: { new(): BaseComponent }[] = [];
    /**
     * @internal
     */
    export const _requireComponentss: { new(): BaseComponent }[][] = [];

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
    export function executeInEditMode<T extends BaseComponent>(target: { new(): T }) {
        _executeInEditModeComponents.push(target);
    }
    /**
     * 
     */
    export function disallowMultipleComponent<T extends BaseComponent>(target: { new(): T }) {
        _disallowMultipleComponents.push(target);
    }
    /**
     * 
     */
    export function requireComponent<R extends BaseComponent>(requireTarget: { new(): R }) {
        return function (target: any) {
            // `egret.getQualifiedClassName()` cannot work here.

            let index = _requireComponents.indexOf(target);
            if (index < 0) {
                index = _requireComponents.length;
                _requireComponents.push(target);
                _requireComponentss.push([]);
            }

            const components = _requireComponentss[index];
            components.push(requireTarget);
        };
    }
}
