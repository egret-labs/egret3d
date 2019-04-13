import { Component } from "../ecs/Component";
import { Entity } from "../ecs/Entity";
import { ISerializedData, ISerializedObject, IBaseClass, KEY_SERIALIZE, ISerializable, ISerializedStruct, KEY_UUID } from "./types";
import { SerializeContext } from "./SerializeContext";
import { SerializeUtil } from "./SerializeUtil";
import { IComponentClass } from "../ecs/types";
import { HideFlagsComponent, HideFlags } from "./component/HideFlagsComponent";
import { IUUID } from "../index";

export { Serializer };

interface IPropertySerialier {
    name: 'asset';
    match: (source: any, context: SerializeContext) => boolean;
    serialize: (source: any, context: SerializeContext) => any;
}

/**
 * @internal
 */
class Serializer {
    public static propertyHandlers: StringMap<IPropertySerialier> = {};
    private _context: SerializeContext = new SerializeContext();

    public serialize(source: Entity | Component, config?: StringMap<any>): ISerializedData {
        return this._serialize(source, config);
    }
    private _serialize(source: Entity | Component, config?: StringMap<any>): ISerializedData {
        if (this._context.running) {
            console.error("The deserialization is not complete.");
        }

        if (config) {
            this._context.inline = config.prefab && config.prefab.inline;
        }

        this._context.running = true;
        this._serializeObject(source);

        const serializeData = this._context.result;
        this._context.reset();

        return serializeData;
    }
    private _serializeObject(source: Entity | Component) {
        // 已经序列化过了, 忽略
        if (this._context.serializeds.indexOf(source.uuid) >= 0) {
            return true;
        }

        const target = this._serializeReference(source);
        let equalTemplate: Entity | Component | null = null;

        if (source instanceof Entity) {
            if (source.isDestroyed) {
                console.warn("Entity is destroyed");
                return false;
            }

            // 设置了不保存
            const hideFlags = source.getComponent(HideFlagsComponent);
            if (hideFlags && hideFlags.dontSave) { return false; }

            equalTemplate = this._context.getEntityTemplate(egret.getQualifiedClassName(source));
            this._context.result.objects!.push(target);
        }
        else if (source instanceof Component) {
            if (source.isDestroyed) {
                console.warn("Component is destroyed");
                return false;
            }

            // TODO: 需要写一个装饰器
            if ((source as any).hideFlags & HideFlags.DontSave) {
                return false;
            }

            if (!source.entity) {
                console.warn(`Component`, source, 'has not an entity');
                return false;
            }
            equalTemplate = source.entity!.getOrAddComponent(source.constructor as IComponentClass<Component>);
            this._context.result.components.push(target as ISerializedObject);
        }
        else {
            this._context.result.objects.push(target);
        }

        this._context.serializeds.push(source.uuid);
        this._serializeChildren(source, target, equalTemplate);

        return true;
    }
    private _serializeReference(source: IUUID): ISerializedObject {
        const className = egret.getQualifiedClassName(source);
        return { uuid: source.uuid, class: className };
    }
    private _serializeChildren(
        source: IUUID,
        target: ISerializedObject | ISerializedStruct,
        equalTemplate: Entity | Component | null,
    ) {
        const serializedKeys = this._getSerializedKeys(source.constructor as IBaseClass);

        if (serializedKeys) {
            for (const k in serializedKeys) {
                if (
                    equalTemplate &&
                    SerializeUtil.equal((source as any)[k], (equalTemplate as any)[k])
                ) {
                    continue;
                }

                target[k] = this._serializeChild((source as any)[k], source, k);
            }
        }
    }
    private _getSerializedKeys(serializedClass: IBaseClass, keys: { [key: string]: string } = {}) {
        const serializeKeys = serializedClass.__serializeKeys;
        if (serializeKeys) {
            for (const k in serializeKeys) {
                keys[k] = serializeKeys[k] || k;
            }
        }
        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object as any) {
            this._getSerializedKeys(serializedClass.prototype.__proto__.constructor, keys);
        }
        return keys;
    }
    private _serializeChild(source: any, parent: any, key: string | null): any {
        if (source === null || source === undefined) {
            return source;
        }
        switch (typeof source) {
            case "function":
                return undefined;
            case "object":
                break;
            default:
                return source;
        }
        if (Array.isArray(source) || ArrayBuffer.isView(source)) { // Array.
            const target = [];

            for (const element of source as any[]) {
                const result = this._serializeChild(element, parent, key);

                if (result !== undefined) { // Pass undefined.
                    target.push(result);
                }
            }

            return target;
        }

        if (source.constructor === Object) { // Object map.
            const target = {} as any;

            for (const k in source) {
                const result = this._serializeChild(source[k], parent, key);

                if (result !== undefined) { // Pass undefined.
                    target[k] = result;
                }
            }

            return target;
        }

        // if (source[KEY_SERIALIZE] !== null) {
        if (KEY_SERIALIZE in source) {
            return (source as ISerializable).serialize();
        }

        if (Serializer.propertyHandlers.length) {
            for (const k of Object.keys(Serializer.propertyHandlers)) {
                const handler = Serializer.propertyHandlers[k];
                if (handler.match(source, this._context)) {
                    return handler.serialize(source, this._context);
                }
            }
        }
        // 生成引用
        if (KEY_UUID in source) {
            if (source instanceof Entity || source instanceof Component) {
                return this._serializeObject(source) ? { uuid: source.uuid } : undefined; // Pass.
            } else {
                return this.serializeStruct(source);
            }
        }

        console.error("Serialize error.", source);
        return undefined; // Pass.
    }
    private serializeStruct(source: Entity | Component): ISerializedStruct {
        const className = egret.getQualifiedClassName(source);
        const target = { class: className } as ISerializedStruct;
        this._serializeChildren(source, target, null);

        return target;
    }
}