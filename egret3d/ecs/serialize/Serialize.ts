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
    const KEY_PREFAB: keyof GameObject = "prefab";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";

    const _serializeds: string[] = [];
    const _serializedPrefabs: { [key: string]: GameObject } = {};
    let _serializeData: ISerializedData | null = null;
    let _defaultGameObject: GameObject | null = null;
    /**
     * 序列化场景，实体或组件。
     * @internal
     */
    export function serialize(source: Scene | GameObject | BaseComponent): ISerializedData {
        if (_serializeData) {
            console.debug("The deserialization is not complete.");
        }

        if (!_defaultGameObject) {
            _defaultGameObject = GameObject.create(DefaultNames.NoName, DefaultTags.Untagged, Application.sceneManager.globalScene);
            _defaultGameObject.parent = Application.sceneManager.globalGameObject;
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
        return { class: _findClassCode(className) || className };
    }

    function _findClassCode(name: string) {
        for (let key in serializeClassMap) {
            if (serializeClassMap[key] === name) {
                return key;
            }
        }

        return "";
    }

    function _getSerializedKeys(serializedClass: SerializedClass, keys: string[] | null = null) {
        if (serializedClass.__serializeInfo) {
            keys = keys || [];

            for (const key of serializedClass.__serializeInfo.keys!) {
                keys.push(key);
            }
        }

        if (serializedClass.prototype) {
            _getSerializedKeys(serializedClass.prototype.__proto__, keys);
        }

        return keys;
    }

    function _serializeReference(source: BaseObject): ISerializedObject {
        const className = egret.getQualifiedClassName(source);
        return { uuid: source.uuid, class: _findClassCode(className) || className };
    }

    function _serializeObject(source: BaseObject) {
        if (_serializeds.indexOf(source.uuid) >= 0) {
            return true;
        }

        const target = _serializeReference(source);
        let temp: GameObject | BaseComponent | null = null;

        if (source instanceof BaseComponent) {
            if (source.isDestroyed) {
                console.warn("Missing component.");
                return false;
            }

            if (source.assetID) { // Prefab component.
                const prefabObjectUUID = source.gameObject.prefab ? source.gameObject.uuid : source.gameObject.extras!.prefabRootId!;
                if (!(prefabObjectUUID in _serializedPrefabs)) {
                    _serializedPrefabs[prefabObjectUUID] = Prefab.load((source.gameObject.prefab || (source.gameObject.scene.find(prefabObjectUUID)!.prefab))!.name)!;
                }

                const prefabObject = _serializedPrefabs[prefabObjectUUID];
                for (const child of prefabObject.transform.getAllChildren()) {
                    for (const childComponent of child.gameObject.components) {
                        if (childComponent.assetID === source.assetID) {
                            temp = childComponent;
                        }
                    }
                }
            }
            else {
                temp = _defaultGameObject!.getOrAddComponent(source.constructor as ComponentClass<BaseComponent>);
            }

            _serializeData!.components!.push(target as ISerializedObject);
        }
        else if (source instanceof GameObject) {
            if (source.isDestroyed) {
                console.warn("Missing game object.");
                return false;
            }

            if (source.assetID) { // Prefab leaf.
                const prefabObjectUUID = source.prefab ? source.uuid : source.extras!.prefabRootId!;
                if (!(prefabObjectUUID in _serializedPrefabs)) {
                    _serializedPrefabs[prefabObjectUUID] = Prefab.load((source.prefab || (source.scene.find(prefabObjectUUID)!.prefab))!.name)!;
                }

                const prefabObject = _serializedPrefabs[prefabObjectUUID];
                for (const child of prefabObject.transform.getAllChildren()) {
                    if (child.gameObject.assetID === source.assetID) {
                        temp = child;
                    }
                }
            }
            else {
                temp = _defaultGameObject;
            }

            _serializeData!.objects!.push(target);
        }

        _serializeds.push(source.uuid);
        _serializeChildren(source, target, temp);

        return true;
    }

    function _serializeChildren(source: BaseObject, target: ISerializedObject, temp: GameObject | BaseComponent | null) {
        const serializedKeys = _getSerializedKeys(<any>source.constructor as SerializedClass);
        if (!serializedKeys) {
            return;
        }

        for (const k of serializedKeys) {
            if (temp && equal((source as any)[k], (temp as any)[k])) {
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

                if (source instanceof BaseObject) {
                    if (source.constructor === Scene) { // Cannot serialize scene reference.
                        return undefined;
                    }

                    if (source instanceof Asset) {
                        return serializeAsset(source);
                    }

                    if (parent) {
                        if (parent.constructor === Scene) {
                            if (key === KEY_GAMEOBJECTS) {
                                return _serializeObject(source) ? { uuid: source.uuid } : undefined;
                            }
                        }
                        else if (parent.constructor === GameObject) {
                            if (key === KEY_COMPONENTS) {
                                return _serializeObject(source) ? { uuid: source.uuid } : undefined;
                            }
                        }
                        else if (parent.constructor === egret3d.Transform) {
                            if (key === KEY_CHILDREN) {
                                return _serializeObject((source as egret3d.Transform).gameObject) ? { uuid: source.uuid } : undefined;
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
