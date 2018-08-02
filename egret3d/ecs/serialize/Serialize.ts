namespace paper {
    /**
     * 
     */
    export const DATA_VERSION: number = 3;
    /**
     * 
     */
    export const DATA_VERSIONS = [DATA_VERSION];

    const KEY_GAMEOBJECTS: keyof Scene = "gameObjects";
    const KEY_COMPONENTS: keyof GameObject = "components";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";
    const KEY_SERIALIZE: keyof ISerializable = "serialize";

    const _serializeds: string[] = [];
    /**
     * @internal
     */
    export let _serializeData: ISerializedData | null = null;
    /**
     * 序列化场景，实体或组件。
     */
    export function serialize(source: Scene | GameObject | BaseComponent): ISerializedData {
        if (_serializeData) {
            console.debug("The deserialization is not complete.");
        }

        _serializeData = { version: DATA_VERSION, assets: [], objects: [], components: [] };
        _serializeObject(source);
        _serializeds.length = 0;

        const serializeData = _serializeData;
        _serializeData = null;

        return serializeData;
    }
    /**
     * 
     */
    export function equal(source: any, target: any): boolean {
        const typeSource = typeof source;
        const typeTarget = typeof target;

        if (typeSource !== typeTarget) {
            return false;
        }

        if (source === null && target === null) {
            return true;
        }

        if (source === null || target === null) {
            return false;
        }

        switch (typeSource) {
            case "undefined":
            case "boolean":
            case "number":
            case "string":
            case "symbol":
            case "function":
                return source === target;

            case "object":
            default:
                break;
        }

        if (
            source instanceof Asset ||
            source.constructor === GameObject ||
            source instanceof BaseComponent
        ) {
            return source === target;
        }

        if (
            (Array.isArray(source) || ArrayBuffer.isView(source)) &&
            (Array.isArray(target) || ArrayBuffer.isView(target))
        ) {
            const sl = (source as any[]).length;
            if (sl !== (target as any[]).length) {
                return false;
            }

            if (sl === 0) {
                return true;
            }

            for (let i = 0; i < sl; ++i) {
                if (!equal((source as any[])[i], (target as any[])[i])) {
                    return false;
                }
            }

            return true;
        }

        if (source.constructor !== target.constructor) {
            return false;
        }

        if (source.constructor === Object) {
            for (let k of source) {
                if (!equal(source[k], target[k])) {
                    return false;
                }
            }

            return true;
        }

        if (egret.is(source, "paper.ISerializable") && egret.is(target, "paper.ISerializable")) { // TODO 字符串依赖。
            return equal((source as ISerializable).serialize(), (target as ISerializable).serialize());
        }

        throw new Error("Unsupported data.");
    }

    function _serializeReference(source: BaseObject): ISerializedObject {
        const className = egret.getQualifiedClassName(source);
        return { uuid: source.uuid, class: findClassCode(className) || className };
    }
    /**
     * 创建指定对象的结构体。
     */
    export function serializeStruct(source: BaseObject): ISerializedStruct {
        const className = egret.getQualifiedClassName(source);
        return { class: findClassCode(className) || className };
    }

    function _getTypesFromPrototype(classPrototype: any, typeKey: string, types: string[] | null = null) {
        if (typeKey in classPrototype) {
            types = types || [];

            for (const type of classPrototype[typeKey] as string[]) {
                types.push(type);
            }
        }

        if (classPrototype.__proto__) {
            _getTypesFromPrototype(classPrototype.__proto__, typeKey, types);
        }

        return types;
    }

    function _serializeObject(source: BaseObject) {
        if (_serializeds.indexOf(source.uuid) >= 0) {
            return;
        }

        _serializeds.push(source.uuid);

        let defaultGameObject = Application.sceneManager.globalScene.find("global/default");
        if (!defaultGameObject) {
            defaultGameObject = GameObject.create("default", "", Application.sceneManager.globalScene);
            defaultGameObject.transform.parent = Application.sceneManager.globalGameObject.transform;
        }

        const target = _serializeReference(source);
        let temp: GameObject | BaseComponent | null = null;

        if (source instanceof BaseComponent) {
            _serializeData!.components!.push(target as ISerializedObject);
            temp = defaultGameObject.getOrAddComponent(source.constructor as ComponentClass<BaseComponent>);
        }
        else {
            if (source.constructor === GameObject) {
                temp = defaultGameObject;
            }

            _serializeData!.objects!.push(target as ISerializedObject);
        }

        const classPrototype = source.constructor.prototype;
        if (!classPrototype.hasOwnProperty(KEY_SERIALIZE)) {
            const serializedKeys = _getTypesFromPrototype(classPrototype, SerializeKey.Serialized);
            if (serializedKeys && serializedKeys.length > 0) {
                for (const k of serializedKeys) {
                    if (temp && equal((source as any)[k], (temp as any)[k])) {
                        continue;
                    }

                    (target as ISerializedObject)[k] = _serializeChild((source as any)[k], source, k);
                }
            }
        }
    }

    function _serializeChild(source: any, parent: any, key: string | null): any {
        if (source === null || source === undefined) {
            return source;
        }

        switch (typeof source) {
            case "function":
                return undefined;

            case "object": {
                if (Array.isArray(source) || ArrayBuffer.isView(source)) { // Array.
                    const target = [];
                    for (const element of source as any[]) {
                        target.push(_serializeChild(element, parent, key));
                    }

                    return target;
                }

                if (source.constructor === Object) { // Object map.
                    const target = {} as any;
                    for (const k in source) {
                        target[k] = _serializeChild(source[k], parent, key);
                    }

                    return target;
                }

                if (source instanceof BaseObject) {
                    if (source.constructor === Scene) { // Cannot serialize scene reference.
                        return undefined;
                    }

                    if (source instanceof Asset) {
                        return source.serialize();
                    }

                    if (parent) {
                        if (parent.constructor === Scene) {
                            if (key === KEY_GAMEOBJECTS) {
                                _serializeObject(source);
                                return { uuid: source.uuid };
                            }
                        }
                        else if (parent.constructor === GameObject) {
                            if (key === KEY_COMPONENTS) {
                                _serializeObject(source);
                                return { uuid: source.uuid };
                            }
                        }
                        else if (parent.constructor === egret3d.Transform) {
                            if (key === KEY_CHILDREN) {
                                _serializeObject((source as egret3d.Transform).gameObject);
                                return { uuid: source.uuid };
                            }
                        }
                    }

                    return _serializeReference(source);
                }

                if (egret.is(source, "paper.ISerializable")) { // TODO 字符串依赖。
                    return (source as paper.ISerializable).serialize();
                }

                console.warn("Serialize error.", source);
                return undefined;
            }

            default:
                return source;
        }
    }
}
