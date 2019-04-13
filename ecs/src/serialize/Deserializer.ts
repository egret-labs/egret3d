import { IBaseClass, ISerializedObject, ISerializable, ISerializedData, KEY_COMPONENTS, KEY_CLASS, KEY_UUID, KEY_DESERIALIZE } from "./types";
import { SerializeUtil } from "./SerializeUtil";
import { Component } from "../ecs/Component";
import { Entity } from "../ecs/Entity";
import { MissingComponent } from "./component/MissingComponent";
import { DeserializeContext } from "./DeserializeContext";
import { Context } from "../ecs/Context";
import { IUUID } from "../index";

export { Deserializer };

interface IComponentDeserialier {
    name: string;
    deserialize: (componentSource: ISerializedObject, context: DeserializeContext) => Component | null;
}
interface IPropertyDeserializer {
    name: string;
    match: (source: any) => boolean;
    deserialize: (source: any, context: DeserializeContext) => string | null;
}

/**
 * @internal
 */
class Deserializer {
    public static componentHandlers: StringMap<IComponentDeserialier> = {};
    public static propertyHandlers: StringMap<IPropertyDeserializer> = {};

    public root: Entity | Component | null = null;
    private _context = new DeserializeContext();

    public deserialize(
        data: ISerializedData,
        config: StringMap<any> | null = null, //keepUUID: boolean = false, makeLink: boolean = false,
        context: Context<Entity> | null = null,
        rootTarget: Entity | null = null, // 考虑只传一个 component 的情况
    ): Entity | Component | null {
        if (data.assets) {
            for (const assetName of data.assets) {
                this._context.assets.push(assetName);
            }
        }
        if (config) {
            this._context.keepUUID = config.prefab && config.prefab.keepUUID;
        }
        this._context.rootTarget = rootTarget;
        this._context.context = context;

        const components: StringMap<ISerializedObject> = {};
        let root: Entity | Component | null = null;

        if (data.components) {
            data.components.map((comp) => components[comp.uuid] = comp);
        }

        if (data.objects) {
            for (const source of data.objects) {
                const className = source.class;
                const target: Entity | null = SerializeUtil.factory!.createEntity(className);

                // 对象无法生成
                if (!target) { continue; }

                for (const comp of target.components) {
                    // 新老组件的 uuid 不一样, 需要用 classname 匹配 uuid
                    if (KEY_COMPONENTS in source) {
                        for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                            const uuid = componentUUID.uuid;
                            if (components[uuid].class === egret.getQualifiedClassName(comp)) {
                                this._context.components[uuid] = comp; break;
                            }
                        }
                    }

                }
                this._context.entities[source.uuid] = target;
                root = root || target;
            }

            for (let i = data.objects.length - 1; i >= 0; i--) {
                const source = data.objects[i];
                const target = this._context.entities[source.uuid];

                if (!target) { continue; }

                // 实体属性反序列化
                this._deserializeEntity(source, components, target);

                // 组件实例化
                if (target instanceof Entity && KEY_COMPONENTS in source) {
                    for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                        this._deserializeComponent(components[componentUUID.uuid], target);
                    }
                }
            }
        }

        if (data.components) {
            for (const componentSource of data.components) { // 组件属性反序列化。
                const uuid = componentSource.uuid;
                let component: Component | null = this._context.components[uuid];

                if (component) {
                    if (component.constructor === MissingComponent) {
                        continue;
                    }
                    this._deserializeObject(componentSource, component);
                }
                // 整个反序列化过程只反序列化组件
                else if (rootTarget) {
                    component = this._deserializeComponent(componentSource);
                    root = root || component;
                    if (component) {
                        this._deserializeObject(componentSource, component);
                    }
                }
            }
        }

        this.root = root;
        return root;
    }

    private _deserializeEntity(source: ISerializedObject, components: StringMap<ISerializedObject>, target: Entity) {
        this._deserializeObject(source, target);

        if (target instanceof Entity && KEY_COMPONENTS in source) {
            for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                this._deserializeComponent(components[componentUUID.uuid], target);
            }
        }
    }
    private _deserializeObject(source: ISerializedObject, target: Entity | Component) {
        const deserializedKeys = this._getDeserializedKeys(target.constructor as IBaseClass);
        const deserializedIgnoreKeys = this._getDeserializedIgnoreKeys(target.constructor as IBaseClass);

        for (const k in source) {
            // 类名不需要反序列化
            if (k === KEY_CLASS) { continue; }

            // 是否需要记忆 UUID
            if (!this._context.keepUUID && k === KEY_UUID) { continue; }

            // 重定向反序列化 key
            const retargetKey = (deserializedKeys && k in deserializedKeys) ? deserializedKeys[k] : k;

            // 忽略反序列化 key
            if (deserializedIgnoreKeys && deserializedIgnoreKeys.indexOf(retargetKey) >= 0) {
                continue;
            }

            const hasGetterAndSetter = SerializeUtil.propertyHasGetterAndSetter(target, retargetKey);
            const rawRetarget = (target as any)[retargetKey];
            const retarget = this._deserializeProperty(source[k],
                (hasGetterAndSetter && rawRetarget && (rawRetarget.constructor === Array || rawRetarget.constructor === Object))
                    ? null
                    : rawRetarget
            );

            // 忽略反序列化后为 undefined 的属性值。
            if (retarget === undefined) {
                continue;
            }

            (target as any)[retargetKey] = retarget;
        }

        return target;
    }
    private _deserializeComponent(componentSource: ISerializedObject, target?: Entity) {
        const className = componentSource.class;
        const clazz = egret.getDefinitionByName(className);
        let componentTarget: Component | null = null;

        if (clazz) {
            // 如果有扩展的序列化器, 就使用它
            const serializer = Deserializer.componentHandlers[className];
            if (serializer) {
                componentTarget = serializer.deserialize(componentSource, this._context);
            }
            // 默认的反序列化
            else {
                const enabled = componentSource._enabled === undefined ? true : componentSource._enabled;
                componentTarget = (target || this._context.rootTarget as Entity).addComponent(clazz, enabled);
            }
        }
        else { // Missing component.
            {
                componentTarget = target!.addComponent(MissingComponent);
                (componentTarget as MissingComponent).missingObject = componentSource;
            }

            if (DEBUG) { console.warn(`Component ${className} is not defined.`); }
        }

        if (!componentTarget) { return null; }

        this._context.components[componentSource.uuid] = componentTarget;
        return componentTarget;
    }

    private _deserializeProperty(source: any, target: any = null) {
        if (source === null || source === undefined) { return source; }
        switch (typeof source) {
            case "function": return undefined;
            case "object": break;
            default: return source;
        }

        if (target) {
            // ArrayBuffer
            if (ArrayBuffer.isView(target)) {
                for (let i = 0, l = Math.min(source.length, (target as Uint8Array).length); i < l; ++i) {
                    (target as Uint8Array)[i] = source[i];
                }

                return target;
            }
            // Array
            else if (Array.isArray(target) && target.length === 0) { // TODO: 优化
                for (let i = 0, l = source.length; i < l; ++i) {
                    target[i] = this._deserializeProperty(source[i]);
                }

                return target;
            }
            // 自定义序列化
            else if (target[KEY_DESERIALIZE]) {
                return (target as ISerializable).deserialize(source);
            }
            else {
                // console.info("Deserialize can be optimized."); TODO
            }
        }

        if (Array.isArray(source)) {
            target = [];

            for (let i = 0, l = source.length; i < l; ++i) {
                target[i] = this._deserializeProperty(source[i]);
            }

            return target;
        }

        const classCodeOrName = source[KEY_CLASS] as string | undefined;

        // 插入的序列化器
        if (Deserializer.propertyHandlers.length) {
            for (const k of Object.keys(Deserializer.propertyHandlers)) {
                const serializer = Deserializer.propertyHandlers[k];
                if (serializer.match(source)) {
                    return serializer.deserialize(source, this._context);
                }
            }
        }

        // 引用
        if (KEY_UUID in source) {
            const uuid = (source as IUUID).uuid;

            if (uuid in this._context.entities) { // Entity.
                return this._context.entities[uuid];
            }
            else if (uuid in this._context.components) { // Component.
                return this._context.components[uuid];
            }
            else if (classCodeOrName) { // Link expand objects and components.
                if (this._context.context) {
                    for (const entity of this._context.context.entities) {
                        if (entity.uuid === uuid) {
                            return entity;
                        }
                        for (const component of entity.components) {
                            if (component && component.uuid === uuid) {
                                return component;
                            }
                        }
                    }
                }
            }
        }
        // 嵌套解构
        else if (classCodeOrName) {
            const clazz = egret.getDefinitionByName(classCodeOrName);

            if (clazz) {
                target = new clazz();

                return (target as ISerializable).deserialize(source);
            }
        }
        // Object
        else {
            target = {};

            for (const k in source) {
                target[k] = this._deserializeProperty(source[k]);
            }

            return target;
        }
        console.warn("Deserialize error.", source);
        return undefined;
    }
    private _getDeserializedKeys(serializedClass: IBaseClass, keys: { [key: string]: string } = {}) {
        const serializeKeys = serializedClass.__serializeKeys;

        if (serializeKeys) {
            keys = keys;

            for (const k in serializeKeys) {
                keys[k] = serializeKeys[k] || k;
            }
        }

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object) {
            this._getDeserializedKeys(serializedClass.prototype.__proto__.constructor, keys);
        }

        return keys;
    }
    /**
     * @param serializedClass 
     * @param keys 
     */
    private _getDeserializedIgnoreKeys(serializedClass: IBaseClass, keys: string[] | null = null) {
        if (serializedClass.__deserializeIgnore) {
            keys = keys || [];

            for (const key of serializedClass.__deserializeIgnore) {
                keys.push(key);
            }
        }

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object) {
            this._getDeserializedIgnoreKeys(serializedClass.prototype.__proto__.constructor, keys);
        }

        return keys;
    }
}