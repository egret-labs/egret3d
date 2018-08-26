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
    const KEY_EXTRAS: keyof GameObject = "extras";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";

    let _inline: boolean = false;
    const _serializeds: string[] = [];
    const _deserializers: { [key: string]: Deserializer } = {};
    const _ignoreKeys: string[] = ["extras"];
    const _rootIgnoreKeys: string[] = ["name", "localPosition", "localRotation", "extras"];
    let _serializeData: ISerializedData | null = null;
    let _defaultGameObject: GameObject | null = null;
    /**
     * 
     */
    export function serialize(source: Scene | GameObject | BaseComponent, inline: boolean = false): ISerializedData {
        if (_serializeData) {
            console.debug("The deserialization is not complete.");
        }

        if (!_defaultGameObject) {
            _defaultGameObject = GameObject.create(DefaultNames.NoName, DefaultTags.Untagged, Application.sceneManager.globalScene);
            _defaultGameObject.parent = Application.sceneManager.globalGameObject;
        }

        _inline = inline;
        _serializeData = { version: DATA_VERSION, assets: [], objects: [], components: [] };
        _serializeObject(source);
        _serializeds.length = 0;

        for (const k in _deserializers) {
            delete _deserializers[k];
        }

        const children = _defaultGameObject.transform.children.concat();
        for (const child of children) {
            child.gameObject.destroy();
        }

        const serializeData = _serializeData;
        _serializeData = null;

        return serializeData;
    }
    /**
     * 
     */
    export function clone(object: GameObject) {
        const data = serialize(object, true);
        const deserializer = new Deserializer();

        return deserializer.deserialize(data);
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

        if (
            source instanceof Asset ||
            source.constructor === GameObject ||
            source instanceof BaseComponent
        ) {
            return source === target;
        }

        if (source.constructor === Object) {
            for (let k of source) {
                if (!equal(source[k], target[k])) {
                    return false;
                }
            }

            return true;
        }

        if (egret.is(source, "paper.ISerializable")) { // TODO 字符串依赖。
            return equal((source as ISerializable).serialize(), (target as ISerializable).serialize());
        }

        if (source instanceof BaseObject) {
            return equal(serializeStruct(source), serializeStruct(target));
        }

        throw new Error("Unsupported data.");
    }
    /**
     * 
     */
    export function serializeAsset(source: Asset): IAssetReference {
        if (!source.name) {
            return { asset: -1 };
        }

        if (_serializeData && _serializeData!.assets) {
            let index = _serializeData!.assets!.indexOf(source.name);

            if (index < 0) {
                index = _serializeData!.assets!.length;
                _serializeData!.assets!.push(source.name);
            }

            return { asset: index };
        }

        return { asset: -1 };
    }
    /**
     * 创建指定对象的结构体。
     */
    export function serializeStruct(source: BaseObject): ISerializedStruct {
        const className = egret.getQualifiedClassName(source);
        const target = { class: _findClassCode(className) || className } as ISerializedStruct;
        _serializeChildren(source, target, null, null);

        return target;
    }

    function _getSerializedKeys(serializedClass: BaseClass, keys: string[] | null = null) {
        const serializeKeys = serializedClass.__serializeKeys;
        if (serializeKeys) {
            keys = keys || [];

            for (const key in serializeKeys) {
                keys.push(serializeKeys[key] || key);
            }
        }

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object as any) {
            _getSerializedKeys(serializedClass.prototype.__proto__.constructor, keys);
        }

        return keys;
    }

    function _findClassCode(name: string) {
        for (let key in serializeClassMap) {
            if (serializeClassMap[key] === name) {
                return key;
            }
        }

        return "";
    }

    function _serializeReference(source: BaseObject): ISerializedObject {
        const className = egret.getQualifiedClassName(source);
        return { uuid: source.uuid, class: _findClassCode(className) || className };
    }

    function _findPrefabRoot(gameObject: GameObject) {
        while (!gameObject.extras!.prefab) {
            gameObject = gameObject.parent;
        }

        return gameObject;
    }

    function _serializeObject(source: BaseObject) {
        if (_serializeds.indexOf(source.uuid) >= 0) {
            return true;
        }

        const target = _serializeReference(source);
        let temp: GameObject | BaseComponent | null = null;
        let ignoreKeys: string[] = _ignoreKeys;

        if (source instanceof GameObject) {
            if (source.isDestroyed) {
                console.warn("Missing game object.");
                return false;
            }

            if (source.extras && source.extras.linkedID) {
                const rootPrefabObject = _findPrefabRoot(source);
                const prefabName = rootPrefabObject.extras!.prefab!.name;
                if (!(prefabName in _deserializers)) {
                    const prefabGameObject = Prefab.create(prefabName, _defaultGameObject!.scene)!;
                    prefabGameObject.parent = _defaultGameObject;
                    _deserializers[prefabName] = Deserializer._lastDeserializer;
                }

                const deserializer = _deserializers[prefabName];
                temp = deserializer.objects[source.extras.linkedID] as GameObject;

                if (source.extras.prefab) {
                    ignoreKeys = _rootIgnoreKeys;
                }
            }
            else {
                temp = _defaultGameObject;
            }

            _serializeData!.objects!.push(target);
        }
        else if (source instanceof BaseComponent) {
            if (source.isDestroyed) {
                console.warn("Missing component.");
                return false;
            }

            if (source.extras && source.extras.linkedID) { // Prefab component.
                const rootPrefabObject = _findPrefabRoot(source.gameObject);
                const prefabName = rootPrefabObject.extras!.prefab!.name;
                if (!(prefabName in _deserializers)) {
                    const prefabGameObject = Prefab.create(prefabName, _defaultGameObject!.scene)!;
                    prefabGameObject.parent = _defaultGameObject;
                    _deserializers[prefabName] = Deserializer._lastDeserializer;
                }

                const deserializer = _deserializers[prefabName];
                temp = deserializer.components[source.extras.linkedID];

                if (source.gameObject.extras!.prefab) {
                    ignoreKeys = _rootIgnoreKeys;
                }
            }
            else {
                temp = _defaultGameObject!.getOrAddComponent(source.constructor as ComponentClass<BaseComponent>);
            }

            _serializeData!.components!.push(target as ISerializedObject);
        }
        else {
            _serializeData!.objects!.push(target);
        }

        _serializeds.push(source.uuid);
        _serializeChildren(source, target, temp, ignoreKeys);

        return true;
    }

    function _serializeChildren(source: BaseObject, target: ISerializedObject | ISerializedStruct, temp: GameObject | BaseComponent | null, ignoreKeys: string[] | null) {
        const serializedKeys = _getSerializedKeys(<any>source.constructor as BaseClass);
        if (!serializedKeys) {
            return;
        }

        for (const k of serializedKeys) {
            if (temp && (!ignoreKeys || ignoreKeys.indexOf(k) < 0) && equal((source as any)[k], (temp as any)[k])) {
                continue;
            }

            target[k] = _serializeChild((source as any)[k], source, k);
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
                        const result = _serializeChild(element, parent, key);
                        if (result !== undefined) { // Pass undefined.
                            target.push(result);
                        }
                    }

                    return target;
                }

                if (source.constructor === Object) { // Object map.
                    const target = {} as any;
                    for (const k in source) {
                        const result = _serializeChild(source[k], parent, key);
                        if (result !== undefined) { // Pass undefined.
                            target[k] = result;
                        }
                    }

                    return target;
                }

                if (egret.is(source, "paper.ISerializable")) { // TODO 字符串依赖。
                    return (source as paper.ISerializable).serialize();
                }

                if (source instanceof BaseObject) {
                    if (source.constructor === Scene) { // Cannot serialize scene reference.
                        return undefined; // Pass.
                    }

                    if (source instanceof Asset) {
                        return serializeAsset(source);
                    }

                    if (source instanceof GameObject || source instanceof BaseComponent) {
                        if (parent) {
                            if (parent.constructor === Scene) {
                                if (key === KEY_GAMEOBJECTS) {
                                    return _serializeObject(source) ? { uuid: source.uuid } : undefined; // Pass.
                                }
                            }
                            else if (parent.constructor === GameObject) {
                                if (key === KEY_COMPONENTS) {
                                    return _serializeObject(source) ? { uuid: source.uuid } : undefined; // Pass.
                                }
                            }
                            else if (parent.constructor === egret3d.Transform) {
                                if (key === KEY_CHILDREN) {
                                    return _serializeObject((source as egret3d.Transform).gameObject) ? { uuid: source.uuid } : undefined; // Pass.
                                }
                            }
                        }

                        return _serializeReference(source);
                    }

                    return serializeStruct(source);
                }

                console.warn("Serialize error.", source);
                return undefined; // Pass.
            }

            default:
                return source;
        }
    }
}
