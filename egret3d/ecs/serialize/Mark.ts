namespace paper {
    const _tagA: any[] = [];
    const _tagB: any[] = [];
    const _tagC: any[] = [];

    /**
     * @internal
     */
    export const enum SerializeKey {
        Serialized = "__serialized",
        SerializedType = "__serializedType",
        DeserializedIgnore = "__deserializedIgnore",
    }

    /**
     * 标记序列化分类
     * 如果没有标记序列化分类，序列化后的对象只会收集在objects中
     * 如果被标记了某种序列化分类，序列化后的对象还会被单独收集到一个新的数组中，key即为类名
     * TODO 不能发布给开发者使用。
     */
    export function serializedType(type: string) {
        return function (clazz: Function) {
            const classPrototype = clazz.prototype;
            if (_tagA.indexOf(classPrototype) >= 0) {
                const types = classPrototype[SerializeKey.SerializedType] as string[];
                if (types.indexOf(type) < 0) {
                    types.push(type);
                }
            }
            else {
                classPrototype[SerializeKey.SerializedType] = [type];
                _tagA.push(classPrototype);
            }
        }
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
}
