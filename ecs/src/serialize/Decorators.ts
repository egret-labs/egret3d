import { ISerializableClass } from "./types";
/**
 * 
 */
export function serializable(serializableClass: ISerializableClass) {
    serializableClass.onRegister();
}
/**
 * 通过装饰器标记序列化属性。
 * @param classPrototype 类原型。
 * @param key 键值。
 */
export function serializeField(classPrototype: any, key: string): void;
/**
 * 通过装饰器标记序列化属性。
 * @param oldKey 兼容旧序列化键值。
 */
export function serializeField(oldKey: string): Function;
export function serializeField(classPrototypeOrOldKey: any, key: string = ""): void | Function {
    if (key !== "") {
        const serializableClass = classPrototypeOrOldKey.constructor as ISerializableClass;
        serializableClass.serializeFields![key] = "";
    }
    else {
        return function (classPrototype: any, key: string) {
            const serializableClass = classPrototype.constructor as ISerializableClass;
            serializableClass.serializeFields![key] = classPrototypeOrOldKey as string;
        };
    }
}
/**
 * 通过装饰器标记反序列化时需要忽略的属性。
 * @param classPrototype 类原型。
 * @param key 键值。
 */
export function deserializeIgnore(classPrototype: any, key: string) {
    const serializableClass = classPrototype.constructor as ISerializableClass;
    const { deserializeIgnore } = serializableClass;

    if (deserializeIgnore!.indexOf(key) < 0) {
        deserializeIgnore!.push(key);
    }
}