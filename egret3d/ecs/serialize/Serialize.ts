namespace paper {
    const VERSION: number = 2;
    const VERSIONS = [VERSION];

    const KEY_GAMEOBJECTS: keyof Scene = "gameObjects";
    const KEY_COMPONENTS: keyof GameObject = "components";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";
    const KEY_SERIALIZE: keyof ISerializable = "serialize";

    const _serializeds: string[] = [];
    let _serializeData: ISerializedData = null as any;
    /**
     * 序列化场景，实体或组件。
     */
    export function serialize(source: Scene | GameObject | BaseComponent): ISerializedData {
        if (_serializeData) {
            throw new Error("The serialization is not complete.");
        }

        _serializeData = { version: VERSION, assets: [], objects: [], components: [] };
        _serializeObject(source);
        _serializeds.length = 0;

        const serializeData = _serializeData;
        _serializeData = null as any;

        return serializeData;
    }
    /**
     * 创建指定资源的引用。
     */
    export function createAssetReference(source: Asset): IAssetReference {
        if (!source.name) {
            return { asset: -1 };
        }

        let index = _serializeData.assets.indexOf(source.name);

        if (index < 0) {
            index = _serializeData.assets.length;
            _serializeData.assets.push(source.name);
        }

        return { asset: index };
    }
    /**
     * 创建指定对象的引用。
     */
    export function createReference(source: Scene | GameObject | BaseComponent, isOnlyUUID: boolean): any {
        if (isOnlyUUID) {
            return { uuid: source.uuid };
        }

        const className = egret.getQualifiedClassName(source);
        return { uuid: source.uuid, class: _findClassCode(className) || className };
    }
    /**
     * 创建指定对象的结构体。
     */
    export function createStruct(source: SerializableObject): any {
        const className = egret.getQualifiedClassName(source);
        return { class: _findClassCode(className) || className };
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

    function _findClassCode(name: string) {
        for (let key in serializeClassMap) {
            if (serializeClassMap[key] === name) {
                return key;
            }
        }

        return "";
    }

    function _serializeObject(source: SerializableObject, isStruct: boolean = false) {
        if (_serializeds.indexOf(source.uuid) >= 0) {
            return createReference(source as (Scene | GameObject | BaseComponent), true);
        }

        const classPrototype = source.constructor.prototype;
        const hasCustomSerialize = classPrototype.hasOwnProperty(KEY_SERIALIZE);
        const target = hasCustomSerialize ?
            classPrototype[KEY_SERIALIZE].apply(source) :
            (isStruct ? createStruct(source) : createReference(source as (Scene | GameObject | BaseComponent), false));

        if (!isStruct) { // Scene | GameObject | BaseComponent
            _serializeds.push(source.uuid);

            if (source instanceof BaseComponent) {
                _serializeData.components.push(target);
            }
            else {
                _serializeData.objects.push(target);
            }
        }

        if (!hasCustomSerialize) {
            const serializedKeys = _getTypesFromPrototype(classPrototype, SerializeKey.Serialized);
            if (serializedKeys && serializedKeys.length > 0) {
                for (const key of serializedKeys) {
                    target[key] = _serializeChild((source as any)[key], source, key);
                }
            }
        }

        return target;
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

                // TODO es6

                if (source instanceof Asset) {
                    return createAssetReference(source);
                }

                if (source.constructor === Scene || source.constructor === GameObject || source instanceof BaseComponent) {
                    if (parent) {
                        if (source.constructor === Scene) { // Cannot serialize scene reference.
                            return null;
                        }

                        if (parent.constructor === Scene) {
                            if (key === KEY_GAMEOBJECTS) {
                                _serializeObject(source);
                                return createReference(source, true);
                            }
                        }
                        else if (parent.constructor === GameObject) {
                            if (key === KEY_COMPONENTS) {
                                _serializeObject(source);
                                return createReference(source, true);
                            }
                        }
                        else if (parent.constructor === egret3d.Transform) {
                            if (key === KEY_CHILDREN) {
                                _serializeObject((source as egret3d.Transform).gameObject);
                                return createReference(source, true);
                            }
                        }
                    }

                    return createReference(source, false);
                }

                return _serializeObject(source, true); // Other class.
            }

            default:
                return source;
        }
    }
}
