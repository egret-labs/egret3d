namespace paper {
    /**
     * @private
     */
    export const DATA_VERSION: number = 5;
    /**
     * @private
     */
    export const DATA_VERSIONS = [DATA_VERSION];

    const KEY_SERIALIZE: keyof ISerializable = "serialize";
    const KEY_ENTITIES: keyof IScene = "entities";
    const KEY_COMPONENTS: keyof IEntity = "components";
    // const KEY_EXTRAS: keyof GameObject = "extras";
    const KEY_CHILDREN: keyof BaseTransform = "children";

    let _inline: boolean = false;
    const _serializeds: string[] = [];
    const _deserializers: { [key: string]: Deserializer } = {};
    const _ignoreKeys: string[] = ["extras"];
    const _rootIgnoreKeys: string[] = ["name", "localPosition", "localRotation", "extras"];
    let _serializeData: ISerializedData | null = null;
    let _defaultGameObject: GameObject | null = null;
    /**
     * @private
     */
    export function serialize(source: IScene | IEntity | IComponent, inline: boolean = false): ISerializedData {
        if (_serializeData) {
            console.error("The deserialization is not complete.");
        }

        if (!_defaultGameObject) {
            _defaultGameObject = GameObject.create(DefaultNames.NoName, DefaultTags.Untagged, Application.sceneManager.globalScene);
            _defaultGameObject.enabled = false;
        }

        _inline = inline;
        _serializeData = { version: DATA_VERSION, assets: [], objects: [], components: [] };
        _serializeObject(source);
        _serializeds.length = 0;

        for (const k in _deserializers) {
            delete _deserializers[k];
        }

        _defaultGameObject.destroy();
        _defaultGameObject = null;

        const serializeData = _serializeData;
        _serializeData = null;

        return serializeData;
    }
    /**
     * @private
     */
    export function clone(object: IEntity) {
        const data = serialize(object, true);
        const deserializer = new Deserializer();

        return deserializer.deserialize(data);
    }
    /**
     * @private
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
            source instanceof Entity ||
            source instanceof Component
        ) {
            return source === target;
        }

        if (source.constructor === Object) {
            for (const k in source) {
                if (!equal(source[k], target[k])) {
                    return false;
                }
            }

            return true;
        }

        if (egret.is(source, "paper.ISerializable")) {
            return equal((source as ISerializable).serialize(), (target as ISerializable).serialize());
        }

        if (source instanceof BaseObject) {
            return equal(serializeStruct(source), serializeStruct(target));
        }

        throw new Error("Unsupported data.");
    }
    /**
     * @private
     */
    export function serializeAsset(source: Asset): IAssetReference {
        if (!source.name) { // Pass unnamed asset.
            return { asset: -1 };
        }

        if (_serializeData) {
            const assets = _serializeData.assets!;
            let index = assets.indexOf(source.name);

            if (index < 0) {
                index = assets.length;
                assets.push(source.name);
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
        const target = { class: className } as ISerializedStruct;
        _serializeChildren(source, target, null, null);

        return target;
    }

    function _getSerializedKeys(serializedClass: IBaseClass, keys: { [key: string]: string } = {}) {
        const serializeKeys = serializedClass.__serializeKeys;

        if (serializeKeys) {
            for (const k in serializeKeys) {
                keys[k] = serializeKeys[k] || k;
            }
        }

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object as any) {
            _getSerializedKeys(serializedClass.prototype.__proto__.constructor, keys);
        }

        return keys;
    }

    function _serializeReference(source: IUUID): ISerializedObject {
        const className = egret.getQualifiedClassName(source);
        return { uuid: source.uuid, class: className };
    }

    function _getPrefabRoot(gameObject: GameObject) {
        while (!gameObject.extras!.prefab) {
            gameObject = gameObject.parent!;
        }

        return gameObject;
    }

    function _serializeObject(source: IUUID) {
        if (_serializeds.indexOf(source.uuid) >= 0) {
            return true;
        }

        const target = _serializeReference(source);
        let ignoreKeys = _ignoreKeys;
        let equalTemplate: IEntity | IComponent | null = null;

        if (source instanceof Entity) {
            if (source.isDestroyed) {
                console.warn("Missing game object.");
                return false;
            }

            if (source.extras && source.extras.linkedID) {
                const rootPrefabObject = source instanceof GameObject ? _getPrefabRoot(source) : source;
                const prefabName = rootPrefabObject.extras!.prefab!.name;

                if (!(prefabName in _deserializers)) {
                    const prefabGameObject = Prefab.create(prefabName, _defaultGameObject!.scene!)!;
                    prefabGameObject.parent = _defaultGameObject;
                    _deserializers[prefabName] = Deserializer._lastDeserializer;
                }

                const deserializer = _deserializers[prefabName];
                equalTemplate = deserializer.objects[source.extras!.linkedID!] as IEntity;

                if (source.extras!.prefab) {
                    ignoreKeys = _rootIgnoreKeys;
                }
            }
            else {
                equalTemplate = _defaultGameObject;
            }

            _serializeData!.objects!.push(target);
        }
        else if (source instanceof Component) {
            if (source.isDestroyed) {
                console.warn("Missing component.");

                return false;
            }

            if (source.hideFlags & HideFlags.DontSave) {
                return false;
            }

            if (source.extras && source.extras.linkedID) { // Prefab component.
                const rootPrefabObject = source.entity instanceof GameObject ? _getPrefabRoot(source.entity) : source.entity;
                const prefabName = rootPrefabObject.extras!.prefab!.name;

                if (!(prefabName in _deserializers)) {
                    const prefabGameObject = Prefab.create(prefabName, _defaultGameObject!.scene!)!;
                    prefabGameObject.parent = _defaultGameObject;
                    _deserializers[prefabName] = Deserializer._lastDeserializer;
                }

                const deserializer = _deserializers[prefabName];
                equalTemplate = deserializer.components[source.extras.linkedID];

                if (source.entity.extras!.prefab) {
                    ignoreKeys = _rootIgnoreKeys;
                }
            }
            else {
                equalTemplate = _defaultGameObject!.getOrAddComponent(source.constructor as IComponentClass<IComponent>);
            }

            _serializeData!.components!.push(target as ISerializedObject);
        }
        else {
            _serializeData!.objects!.push(target);
        }

        _serializeds.push(source.uuid);
        _serializeChildren(source, target, equalTemplate, ignoreKeys);

        return true;
    }

    function _serializeChildren(source: IUUID, target: ISerializedObject | ISerializedStruct, equalTemplate: IEntity | IComponent | null, ignoreKeys: string[] | null) {
        const serializedKeys = _getSerializedKeys(source.constructor as IBaseClass);

        if (serializedKeys) {
            for (const k in serializedKeys) {
                if (
                    equalTemplate &&
                    (!ignoreKeys || ignoreKeys.indexOf(k) < 0) &&
                    equal((source as any)[k], (equalTemplate as any)[k])
                ) {
                    continue;
                }

                target[k] = _serializeChild((source as any)[k], source, k);
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

                if (egret.is(source, "paper.ISerializable")) {
                    return (source as paper.ISerializable).serialize();
                }

                if (source instanceof BaseObject) {
                    if (source instanceof Scene) { // Cannot serialize scene reference.
                        return undefined; // Pass.
                    }

                    if (source instanceof Asset) {
                        return serializeAsset(source);
                    }

                    if (source instanceof Entity || source instanceof Component) {
                        if (source instanceof Entity && ((source as IEntity).hideFlags & paper.HideFlags.DontSave)) {
                            return undefined; // Pass.
                        }

                        if (source instanceof Component && ((source as IComponent).hideFlags & paper.HideFlags.DontSave)) {
                            return undefined; // Pass.
                        }

                        if (parent) {
                            if (parent instanceof Scene) {
                                if (key === KEY_ENTITIES) {
                                    return _serializeObject(source) ? { uuid: source.uuid } : undefined; // Pass.
                                }
                            }
                            else if (parent instanceof Entity) {
                                if (key === KEY_COMPONENTS) {
                                    return _serializeObject(source) ? { uuid: source.uuid } : undefined; // Pass.
                                }
                            }
                            else if (parent instanceof BaseTransform) {
                                if (key === KEY_CHILDREN) {
                                    return _serializeObject((source as IComponent).entity) ? { uuid: source.uuid } : undefined; // Pass.
                                }
                            }
                        }

                        return _serializeReference(source);
                    }

                    return serializeStruct(source);
                }

                console.error("Serialize error.", source);

                return undefined; // Pass.
            }

            default:
                return source;
        }
    }
}
