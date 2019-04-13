import { IBaseClass } from "./types";
    /**
     * 通过装饰器标记序列化属性。
     * @param classPrototype 类原型。
     * @param key 键值。
     */
    export function serializedField(classPrototype: any, key: string): void;
    /**
     * 通过装饰器标记序列化属性。
     * @param oldKey 兼容旧序列化键值。
     */
    export function serializedField(oldKey: string): Function;
    export function serializedField(classPrototypeOrOldKey: any, key?: string): void | Function {
        if (key) {
            const baseClass = classPrototypeOrOldKey.constructor as IBaseClass;
            baseClass.__serializeKeys = baseClass.__serializeKeys || {};
            baseClass.__serializeKeys[key] = null;
        }
        else {
            return function (classPrototype: any, key: string) {
                const baseClass = classPrototype.constructor as IBaseClass;
                baseClass.__serializeKeys = baseClass.__serializeKeys || {};
                baseClass.__serializeKeys[key] = classPrototypeOrOldKey as string;
            };
        }
    }