namespace paper {
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
        const types = (classPrototype[SerializeKey.Serialized] = classPrototype[SerializeKey.Serialized] || [type]) as string[];
        if (types.indexOf(type) < 0) {
            types.push(type);
        }
    }
    /**
     * 标记反序列化时需要忽略的属性
     * 通过装饰器标记反序列化时需要被忽略的属性（但属性中引用的对象依然会被实例化）
     */
    export function deserializedIgnore(classPrototype: any, type: string) {
        const types = (classPrototype[SerializeKey.DeserializedIgnore] = classPrototype[SerializeKey.DeserializedIgnore] || [type]) as string[];
        if (types.indexOf(type) < 0) {
            types.push(type);
        }
    }
    /**
     * 标记组件是否在编辑模式拥有生命周期。
     */
    export function executeInEditMode(target: ComponentClass<BaseComponent>) {
        BaseComponent.register(target);
        target.executeInEditMode = true;
    }
    /**
     * 标记组件是否禁止在同一实体上添加多个实例。
     */
    export function disallowMultiple(target: ComponentClass<BaseComponent>) {
        BaseComponent.register(target);
        target.disallowMultiple = true;
    }
    /**
     * 标记组件依赖的其他组件。
     */
    export function requireComponent(requireTarget: ComponentClass<BaseComponent>) {
        return function (target: ComponentClass<BaseComponent>) {
            const parentRequireComponents = (target.prototype.__proto__.constructor as ComponentClass<BaseComponent>).requireComponents;
            if (
                !target.requireComponents ||
                target.requireComponents === parentRequireComponents
            ) {
                target.requireComponents = !parentRequireComponents ? [] : parentRequireComponents.concat();
            }

            if (target.requireComponents.indexOf(requireTarget) < 0) {
                target.requireComponents.push(requireTarget);
            }
        };
    }
}
