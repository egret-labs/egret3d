namespace paper {
    const KEY_GAMEOBJECTS: keyof Scene = "gameObjects";
    const KEY_COMPONENTS: keyof GameObject = "components";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";
    const KEY_SERIALIZE: keyof ISerializable = "serialize";
    const KEY_DESERIALIZE: keyof ISerializable = "deserialize";

    let _sourcePath: string = "";
    const _serializeds: string[] = []; // 缓存序列化记录，提高查找效率
    let _serializeData: ISerializedData | null = null;

    /**
     * 序列化方法
     * 只有 ISerializable 参与序列化
     * 只有被标记的对象属性 参与序列化
     * 序列化后，输出 ISerializeData
     * 对象在objects中按生成顺序，root一定是第一个元素。
     * 允许依赖标记对序列化对象数据分类，以便单独处理一些对象（例如资源等等，但资源的路径这里不做处理，在方法外由开发者自行处理）
     */
    export function serialize(source: SerializableObject, sourcePath: string = ""): ISerializedData {
        _serializeData = { objects: [] };
        _sourcePath = sourcePath;

        if (!_sourcePath && source instanceof Scene) {
            const rawScene = (<Scene>source).rawScene;
            _sourcePath = rawScene ? rawScene.url : "";
        }

        _serializeObject(source);
        _serializeds.length = 0;

        const data = _serializeData;
        _serializeData = null;

        return data;
    }
    /**
     * 
     */
    export function serializeAsset(source: Asset) {
        const target = _serializeObject(source);

        if (_sourcePath && source._isLoad) {
            target.url = egret3d.utils.getRelativePath(source.url, _sourcePath);
        }

        if (!source.url) {
            return null;
        }

        return serializeR(source);
    }
    /**
     * 
     */
    export function serializeRC(source: SerializableObject): any {
        const className = egret.getQualifiedClassName(source);
        return { uuid: source.uuid, class: findClassCode(className) || className };
    }
    /**
     * 
     */
    export function serializeR(source: SerializableObject): any {
        return { uuid: source.uuid };
    }
    /**
     * 
     */
    export function serializeC(source: SerializableObject): any {
        const className = egret.getQualifiedClassName(source);
        return { class: findClassCode(className) || className };
    }
    /**
     * 
     */
    export function getTypesFromPrototype(classPrototype: any, typeKey: string, types: string[] | null = null) {
        if ((typeKey in classPrototype)) {
            types = types || [];

            for (const type of classPrototype[typeKey] as string[]) {
                types.push(type);
            }
        }

        if (classPrototype.__proto__) {
            getTypesFromPrototype(classPrototype.__proto__, typeKey, types);
        }

        return types;
    }

    function _serializeObject(source: SerializableObject, isStruct: boolean = false, parentHasCustomDeserialize: boolean = false) {
        if (_serializeds.indexOf(source.uuid) >= 0) {
            return serializeR(source);
        }

        const classPrototype = source.constructor.prototype;
        const hasCustomSerialize = classPrototype.hasOwnProperty(KEY_SERIALIZE);
        const target = hasCustomSerialize ?
            classPrototype[KEY_SERIALIZE].apply(source) :
            (parentHasCustomDeserialize ? {} : (isStruct ? serializeC(source) : serializeRC(source)));

        if (!isStruct && _serializeData) {
            _serializeds.push(source.uuid);
            // Add to custom.
            if (SerializeKey.SerializedType in source) { // TODO 原型静态依赖
                for (const type of source[SerializeKey.SerializedType] as string[]) {
                    if (type in _serializeData) {
                        _serializeData[type].push(target);
                    }
                    else {
                        _serializeData[type] = [target];
                    }
                }
            }
            else { // Add to default.
                _serializeData.objects.push(target);
            }
        }

        if (!hasCustomSerialize) {
            const serializedKeys = getTypesFromPrototype(classPrototype, SerializeKey.Serialized);
            if (serializedKeys && serializedKeys.length > 0) {
                for (const key of serializedKeys) {
                    target[key] = _serializeChild(source[key], source, key);
                }
            }
        }

        return target;
    }

    function _serializeChild(source: any, parent: any, key: string | null) {
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
                    return serializeAsset(source);
                }

                if (source instanceof Scene || source instanceof GameObject || source instanceof BaseComponent) {
                    if (parent) {
                        if (parent instanceof Scene) {
                            if (key === KEY_GAMEOBJECTS) {
                                _serializeObject(source);
                                return serializeR(source);
                            }
                        }
                        else if (parent instanceof GameObject) {
                            if (key === KEY_COMPONENTS) {
                                _serializeObject(source);
                                return serializeR(source);
                            }
                        }
                        else if (parent instanceof egret3d.Transform) {
                            if (key === KEY_CHILDREN) {
                                _serializeObject((source as egret3d.Transform).gameObject);
                                return serializeR(source);
                            }
                        }
                    }

                    return serializeRC(source);
                }

                return _serializeObject(source, true, parent && parent.constructor.prototype.hasOwnProperty(KEY_DESERIALIZE)); // Other class.
            }

            default:
                return source;
        }
    }
}
