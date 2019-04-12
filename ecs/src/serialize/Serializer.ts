import Component from "../ecs/Component";
import Entity from "../ecs/Entity";
import { ISerializedData, ISerializedObject, IBaseClass, KEY_SERIALIZE, ISerializable, ISerializedStruct, KEY_UUID, IUUID } from "./types";
import { SerializeContext } from "./SerializeContext";
import { SerializeUtil } from "./SerializeUtil";
import { IComponentClass } from "../ecs/types";

export { Serializer }

// TODO:
const _ignoreKeys: string[] = ["extras"];

class Serializer {
    public context: SerializeContext = new SerializeContext();

    public serialize(source: Entity | Component, entity?: Entity, config?: StringMap<any>): ISerializedData {
        if (this.context.running) {
            console.error("The deserialization is not complete.");
        }

        if (config) {
            this.context.inline = config.prefab && config.prefab.inline;
        }

        this.context.entity = entity || null;
        this.context.running = true;
        this._serializeObject(source);

        const serializeData = this.context.result;
        this.context.reset();

        return serializeData;
    }
    private _serializeObject(source: Entity | Component) {
        // 已经序列化过了, 忽略
        if (this.context.serializeds.indexOf(source.uuid) >= 0) {
            return true;
        }

        const target = this._serializeReference(source);
        let ignoreKeys = _ignoreKeys;
        let equalTemplate: Entity | Component | null = null;

        if (source instanceof Entity) {
            if (source.isDestroyed) {
                console.warn("Entity is destroyed");
                return false;
            }
            equalTemplate = this.context.getEntityTemplate(egret.getQualifiedClassName(source));
            this.context.result.objects!.push(target);
        }
        else if (source instanceof Component) {
            if (source.isDestroyed) {
                console.warn("Component is destroyed");
                return false;
            }

            // TODO:
            {
                // if (source.hideFlags & HideFlags.DontSave) {
                //     return false;
                // }
            }

            equalTemplate = this.context.entity!.getOrAddComponent(source.constructor as IComponentClass<Component>);
            this.context.result.components.push(target as ISerializedObject);
        }
        else {
            this.context.result.objects.push(target);
        }

        this.context.serializeds.push(source.uuid);
        this._serializeChildren(source, target, equalTemplate, ignoreKeys);

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
        ignoreKeys: string[] | null,
    ) {
        const serializedKeys = this._getSerializedKeys(source.constructor as IBaseClass);

        if (serializedKeys) {
            for (const k in serializedKeys) {
                if (
                    equalTemplate &&
                    (!ignoreKeys || ignoreKeys.indexOf(k) < 0) &&
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

        // 生成引用
        if (KEY_UUID in source) {
            // TODO:
            {
                // if (source instanceof Scene) { // Cannot serialize scene reference.
                //     return undefined; // Pass.
                // }

                // if (source instanceof Asset) {
                //     return serializeAsset(source);
                // }
            }

            if (source instanceof Entity || source instanceof Component) {
                // TODO:
                {
                    // if (source instanceof Entity && ((source as Entity).hideFlags & paper.HideFlags.DontSave)) {
                    //     return undefined; // Pass.
                    // }

                    // if (source instanceof Component && ((source as Component).hideFlags & paper.HideFlags.DontSave)) {
                    //     return undefined; // Pass.
                    // }
                }
                // TODO:
                {
                    // if (parent) {
                    //     if (parent instanceof Scene) {
                    //         if (key === KEY_ENTITIES) {
                    //             return this._serializeObject(source) ? { uuid: source.uuid } : undefined; // Pass.
                    //         }
                    //     }
                    //     else if (parent instanceof Entity) {
                    //         if (key === KEY_COMPONENTS) {
                    //             return this._serializeObject(source) ? { uuid: source.uuid } : undefined; // Pass.
                    //         }
                    //     }
                    //     else if (key === KEY_CHILDREN) {
                    //         if (parent instanceof BaseTransform) {
                    //             return this._serializeObject((source as Component).entity) ? { uuid: source.uuid } : undefined; // Pass.
                    //         }
                    //     }
                    // }
                }

                return this._serializeReference(source);
            }

            return this.serializeStruct(source);
        }

        console.error("Serialize error.", source);
        return undefined; // Pass.
    }
    private serializeStruct(source: Entity | Component): ISerializedStruct {
        const className = egret.getQualifiedClassName(source);
        const target = { class: className } as ISerializedStruct;
        this._serializeChildren(source, target, null, null);

        return target;
    }
}