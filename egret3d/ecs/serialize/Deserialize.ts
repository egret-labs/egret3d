namespace paper {
    const KEY_UUID: keyof IUUID = "uuid";
    const KEY_ASSET: keyof IAssetReference = "asset";
    const KEY_CLASS: keyof IClass = "class";
    const KEY_DESERIALIZE: keyof ISerializable = "deserialize";
    const KEY_COMPONENTS: keyof GameObject = "components";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";

    let _isKeepUUID: boolean = false;
    let _deserializedData: { assets: string[], objects: { [key: string]: Scene | GameObject }, components: { [key: string]: BaseComponent } } | null = null;
    /**
     * 反序列化。
     */
    export function deserialize<T extends (Scene | GameObject | BaseComponent)>(data: ISerializedData, isKeepUUID: boolean = false): T | null {
        if (_deserializedData) {
            console.debug("The deserialization is not complete.");
        }

        _isKeepUUID = isKeepUUID;
        _deserializedData = { assets: data.assets || [], objects: {}, components: {} };

        const sceneClassName = egret.getQualifiedClassName(Scene);
        const components: { [key: string]: ISerializedObject } = {};
        let root: T | null = null;

        if (data.components) {
            for (const componentSource of data.components) { // Mapping components.
                components[componentSource.uuid] = componentSource;
            }
        }

        if (data.objects) {
            for (const source of data.objects) { // 场景和实体实例化。
                const className = serializeClassMap[source.class] || source.class;
                let target: Scene | GameObject;

                if (className === sceneClassName) {
                    target = Application.sceneManager.createScene("");
                }
                else {
                    target = GameObject.create();

                    if (KEY_COMPONENTS in source) { // Mapping transfrom components.
                        for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                            const uuid = componentUUID.uuid;
                            const componentSource = components[uuid];
                            const className = serializeClassMap[componentSource.class] || componentSource.class;

                            if (className === egret.getQualifiedClassName(egret3d.Transform)) {
                                _deserializedData.components[uuid] = target.transform;
                            }
                        }
                    }
                }

                _deserializedData.objects[source.uuid] = target;
                root = root || target as T;
            }

            let i = data.objects.length;
            while (i--) { // 组件实例化。
                const source = data.objects[i];
                const target = _deserializedData.objects[source.uuid];
                _deserializeObject(source, target);

                if (target.constructor === GameObject && KEY_COMPONENTS in source) {
                    for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                        const uuid = componentUUID.uuid;
                        const componentSource = components[uuid];
                        const className = serializeClassMap[componentSource.class] || componentSource.class;
                        const clazz = egret.getDefinitionByName(className);

                        if (clazz) {
                            if (clazz === egret3d.Transform) {
                                const transform = _deserializedData.components[uuid] as egret3d.Transform;

                                if (KEY_CHILDREN in componentSource) {
                                    for (const childUUID of componentSource[KEY_CHILDREN] as IUUID[]) {
                                        const child = _deserializedData.components[childUUID.uuid] as egret3d.Transform;
                                        child._parent = transform;
                                        transform._children.push(child);
                                    }
                                }

                                root = root || transform as any;
                            }
                            else {
                                const component = (target as GameObject).addComponent(clazz);
                                _deserializedData.components[uuid] = component;

                                if (clazz === Behaviour) {
                                    (component as Behaviour)._isReseted = true;
                                }

                                root = root || component as any;
                            }
                        }
                        else {
                            const component = (target as GameObject).addComponent(MissingComponent);
                            component.missingObject = componentSource;
                            _deserializedData.components[uuid] = component;
                            root = root || component as any;

                            console.warn(`Class ${className} is not defined.`);
                        }
                    }
                }
            }
        }

        if (data.components) {
            for (const componentSource of data.components) { // 组件属性反序列化。
                const uuid = componentSource.uuid;
                const component = _deserializedData.components[uuid];

                if (component.constructor === MissingComponent) {
                    continue;
                }

                _deserializeObject(componentSource, component);
            }
        }

        _deserializedData = null;

        return root;
    }
    /**
     * 
     */
    export function getDeserializedAssetOrComponent(source: IUUID | IAssetReference): Asset | GameObject | BaseComponent {
        if (KEY_ASSET in source) {
            return Asset.find(_deserializedData!.assets[(source as IAssetReference)[KEY_ASSET]]);
        }

        const uuid = (source as IUUID)[KEY_UUID];

        return _deserializedData!.components[uuid] || _deserializedData!.objects[uuid] as GameObject;
    }

    function _deserializeObject(source: ISerializedObject, target: BaseObject) {
        for (const k in source) {
            if (k === KEY_CLASS) {
                continue;
            }

            if (!_isKeepUUID && k === KEY_UUID) {
                continue;
            }

            if (
                SerializeKey.DeserializedIgnore in target &&
                ((target as any)[SerializeKey.DeserializedIgnore] as string).indexOf(k) >= 0
            ) {
                continue;
            }

            (target as any)[k] = _deserializeChild(source[k], (target as any)[k]);
        }

        return target;
    }

    function _deserializeChild(source: any, target?: any) {
        if (source === null || source === undefined) {
            return source;
        }

        switch (typeof source) {
            case "function":
                return undefined;

            case "object": {
                if (target) {
                    if (ArrayBuffer.isView(target)) {
                        for (let i = 0, l = Math.min(source.length, (target as Uint8Array).length); i < l; ++i) {
                            (target as Uint8Array)[i] = source[i];
                        }

                        return target;
                    }
                    else if (Array.isArray(target) && target.length === 0) { // TODO 优化
                        for (let i = 0, l = source.length; i < l; ++i) {
                            target[i] = _deserializeChild(source[i]);
                        }

                        return target;
                    }
                    else if (target.constructor.prototype.hasOwnProperty(KEY_DESERIALIZE)) {
                        return (target as ISerializable).deserialize(source);
                    }
                    else {
                        // console.info("Deserialize can be optimized.");
                    }
                }

                if (Array.isArray(source)) {
                    target = [];

                    for (let i = 0, l = source.length; i < l; ++i) {
                        target[i] = _deserializeChild(source[i]);
                    }

                    return target;
                }

                const classCodeOrName = source[KEY_CLASS] as string | undefined;

                if (KEY_ASSET in source) { // Asset.
                    const index = source[KEY_ASSET] as number;
                    if (index >= 0) {
                        return Asset.find(_deserializedData!.assets[index]);
                    }

                    return null;
                }
                else if (KEY_UUID in source) { // Reference.
                    const uuid = source[KEY_UUID] as string;

                    if (uuid in _deserializedData!.objects) { // GameObject.
                        return _deserializedData!.objects[uuid];
                    }
                    else if (uuid in _deserializedData!.components) { // Component.
                        return _deserializedData!.components[uuid];
                    }
                    else if (classCodeOrName) { // Link expand objects and components.
                        if ((serializeClassMap[classCodeOrName] || classCodeOrName) === egret.getQualifiedClassName(GameObject)) { // GameObject.
                            for (const gameObject of Application.sceneManager.activeScene.gameObjects) {
                                if (gameObject.uuid === uuid) {
                                    return gameObject;
                                }
                            }
                        }
                        else { // Component.
                            for (const gameObject of Application.sceneManager.activeScene.gameObjects) {
                                for (const component of gameObject.components) {
                                    if (component && component.uuid === uuid) {
                                        return component;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (classCodeOrName) { // Struct
                    const clazz = egret.getDefinitionByName(serializeClassMap[classCodeOrName] || classCodeOrName);

                    if (clazz) {
                        target = new clazz();

                        return (target as ISerializable).deserialize(source);
                    }
                }
                else { // Map.
                    target = {};

                    for (let k in source) {
                        target[k] = _deserializeChild(source[k]);
                    }

                    return target;
                }

                console.warn("Deserialize error.", source);
                return undefined;
            }

            default:
                return source;
        }
    }


    // /**
    //  * @internal
    //  */
    // export class Compatible extends BaseObject {

    //     public deserialize(element: IClass) {
    //         switch (element.class) {
    //             case "13":
    //                 return paper.getDeserializedAssetOrComponent((element as any)._gltfAsset as IAssetReference);
    //         }
    //     }
    // }
}