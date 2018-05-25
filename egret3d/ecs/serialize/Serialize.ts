namespace paper {
    const KEY_GAMEOBJECTS: keyof Scene = "gameObjects";
    const KEY_COMPONENTS: keyof GameObject = "components";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";
    const KEY_SERIALIZE: keyof ISerializable = "serialize";

    let _sourcePath: string = "";
    const _hashCodes: number[] = []; // 缓存序列化记录，提高查找效率
    let _serializeData: ISerializedData | null = null;

    /**
     * 序列化方法
     * 只有 ISerializable (有对应hashCode属性) 参与序列化
     * 只有被标记的对象属性 参与序列化
     * 序列化后，输出 ISerializeData
     * 对象在objects中按生成顺序，root一定是第一个元素。
     * 允许依赖标记对序列化对象数据分类，以便单独处理一些对象（例如资源等等，但资源的路径这里不做处理，在方法外由开发者自行处理）
     */
    export function serialize(source: SerializableObject, sourcePath: string = ""): ISerializedData {
        _serializeData = { objects: [] };
        _sourcePath = sourcePath;

        if (!_sourcePath && source instanceof Scene) {
            const rawScene = (<Scene>source).$rawScene;
            _sourcePath = rawScene ? rawScene.url : "";
        }

        _serializeObject(source);
        _hashCodes.length = 0;

        const data = _serializeData;
        _serializeData = null;

        return data;
    }
    /**
     * 
     */
    export function serializeAsset(source: paper.Asset) {
        const target = _serializeObject(source);

        if (_sourcePath && !(source instanceof egret3d.Shader)) { // TODO 区分内置 asset
            target.url = egret3d.utils.getRelativePath(source.url, _sourcePath);
        }

        if (!source.url) {
            return null;
        }

        return _serializeR(source);
    }
    /**
     * 
     */
    export function serializeRC(source: SerializableObject): any {
        const className = egret.getQualifiedClassName(source);
        return { hashCode: source.hashCode, class: findClassCode(className) || className };
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

    function _serializeR(source: SerializableObject) {
        return { hashCode: source.hashCode };
    }

    function _serializeC(source: SerializableObject) {
        const className = egret.getQualifiedClassName(source);
        return { class: findClassCode(className) || className };
    }

    function _serializeObject(source: SerializableObject, isStruct: boolean = false) {
        if (_hashCodes.indexOf(source.hashCode) >= 0) {
            // if (!(source instanceof Asset)) {
            //     console.warn("Serialize object again.", source.hashCode);
            // }

            return _serializeR(source);
        }

        const classPrototype = source.constructor.prototype;
        const hasCustomSerialize = classPrototype.hasOwnProperty(KEY_SERIALIZE);
        const target = hasCustomSerialize ? classPrototype[KEY_SERIALIZE].apply(source) : (isStruct ? _serializeC(source) : serializeRC(source));

        if (!isStruct && _serializeData) {
            _hashCodes.push(source.hashCode);
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
                if (Array.isArray(source)) { // Array.
                    const target = [];
                    for (const element of source) {
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
                                return _serializeR(source);
                            }
                        }
                        else if (parent instanceof GameObject) {
                            if (key === KEY_COMPONENTS) {
                                _serializeObject(source);
                                return _serializeR(source);
                            }
                        }
                        else if (parent instanceof egret3d.Transform) {
                            if (key === KEY_CHILDREN) {
                                _serializeObject((source as egret3d.Transform).gameObject);
                                return _serializeR(source);
                            }
                        }
                    }

                    return serializeRC(source);
                }

                return _serializeObject(source, true); // Other class.
            }

            default:
                return source;
        }
    }
}
