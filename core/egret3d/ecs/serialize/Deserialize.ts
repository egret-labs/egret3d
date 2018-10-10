namespace paper {
    const KEY_UUID: keyof IUUID = "uuid";
    const KEY_ASSET: keyof IAssetReference = "asset";
    const KEY_CLASS: keyof IClass = "class";
    const KEY_DESERIALIZE: keyof ISerializable = "deserialize";
    const KEY_COMPONENTS: keyof GameObject = "components";
    const KEY_EXTRAS: keyof GameObject = "extras";
    const KEY_CHILDREN: keyof egret3d.Transform = "children";

    function _getDeserializedKeys(serializedClass: IBaseClass, keys: { [key: string]: string } | null = null) {
        const serializeKeys = serializedClass.__serializeKeys;
        if (serializeKeys) {
            keys = keys || {};

            for (const key in serializeKeys) {
                const retargetKey = serializeKeys[key];
                if (retargetKey) {
                    keys[retargetKey] = key;
                }
            }
        }

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object as any) {
            _getDeserializedKeys(serializedClass.prototype.__proto__.constructor, keys);
        }

        return keys;
    }

    function _getDeserializedIgnoreKeys(serializedClass: IBaseClass, keys: string[] | null = null) {
        if (serializedClass.__deserializeIgnore) {
            keys = keys || [];

            for (const key of serializedClass.__deserializeIgnore) {
                keys.push(key);
            }
        }

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object as any) {
            _getDeserializedIgnoreKeys(serializedClass.prototype.__proto__.constructor, keys);
        }

        return keys;
    }
    /**
     * 
     */
    export class Deserializer {
        /**
         * @internal
         */
        public static _lastDeserializer: Deserializer;
        /**
         * 
         */
        public readonly assets: string[] = [];
        /**
         * 
         */
        public readonly objects: { [key: string]: Scene | GameObject } = {};
        /**
         * 
         */
        public readonly components: { [key: string]: BaseComponent } = {};

        private _keepUUID: boolean;
        private _makeLink: boolean;
        private readonly _deserializers: { [key: string]: Deserializer } = {};
        private _rootTarget: Scene | GameObject | null = null;

        private _deserializeObject(source: ISerializedObject, target: BaseObject) {
            const deserializedKeys = _getDeserializedKeys(<any>target.constructor as IBaseClass);
            const deserializedIgnoreKeys = _getDeserializedIgnoreKeys(<any>target.constructor as IBaseClass);

            for (const k in source) {
                if (k === KEY_CLASS) {
                    continue;
                }

                if (!this._keepUUID && k === KEY_UUID) {
                    continue;
                }

                const kk = (deserializedKeys && k in deserializedKeys) ? deserializedKeys[k] : k;

                if (
                    deserializedIgnoreKeys &&
                    deserializedIgnoreKeys.indexOf(kk) >= 0
                ) {
                    continue;
                }

                (target as any)[kk] = this._deserializeChild(source[k], (target as any)[kk]);
            }

            return target;
        }

        private _createComponent(componentSource: ISerializedObject, source?: ISerializedObject, target?: GameObject) {
            const className = serializeClassMap[componentSource.class] || componentSource.class;
            const clazz = egret.getDefinitionByName(className);
            let componentTarget: BaseComponent | undefined = undefined;

            if (clazz) {
                const hasLink = KEY_EXTRAS in componentSource && (componentSource[KEY_EXTRAS] as ComponentExtras).linkedID;

                if (clazz === egret3d.Transform) {
                    componentTarget = this.components[componentSource.uuid] as egret3d.Transform;

                    if (KEY_CHILDREN in componentSource) { // Link transform children.
                        for (const childUUID of componentSource[KEY_CHILDREN] as IUUID[]) {
                            const child = this.components[childUUID.uuid] as egret3d.Transform | null;
                            if (child && child._parent !== componentTarget) {
                                child._parent = componentTarget as egret3d.Transform;
                                (componentTarget as egret3d.Transform)._children.push(child);
                            }
                        }
                    }
                }
                else {
                    if (hasLink) {
                        const componentExtras = componentSource[KEY_EXTRAS] as ComponentExtras;
                        const extras = source![KEY_EXTRAS] as GameObjectExtras;
                        const linkedID = componentExtras.linkedID!;
                        const prefabDeserializer = this._deserializers[extras.prefab ? source!.uuid : extras.rootID!];
                        componentTarget = prefabDeserializer.components[linkedID];
                    }
                    else {
                        componentTarget = (target || this._rootTarget as GameObject).addComponent(clazz);
                    }

                    // if (clazz === Behaviour) { TODO
                    //     (componentTarget as Behaviour)._isReseted = true;
                    // }
                }

                if (!hasLink && this._makeLink && componentTarget) { // TODO
                    componentTarget.extras!.linkedID = componentSource.uuid;
                }
            }
            else {
                componentTarget = (target || this._rootTarget as GameObject).addComponent(MissingComponent);
                (componentTarget as MissingComponent).missingObject = componentSource;

                console.warn(`Class ${className} is not defined.`);
            }

            this.components[componentSource.uuid] = componentTarget;

            return componentTarget;
        }

        private _deserializeChild(source: any, target?: any) {
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
                                target[i] = this._deserializeChild(source[i]);
                            }

                            return target;
                        }
                        else if (target[KEY_DESERIALIZE]) {
                            return (target as ISerializable).deserialize(source, this);
                        }
                        else {
                            // console.info("Deserialize can be optimized."); TODO
                        }
                    }

                    if (Array.isArray(source)) {
                        target = [];

                        for (let i = 0, l = source.length; i < l; ++i) {
                            target[i] = this._deserializeChild(source[i]);
                        }

                        return target;
                    }

                    const classCodeOrName = source[KEY_CLASS] as string | undefined;

                    if (KEY_ASSET in source) { // Asset.
                        const assetIndex = (source as IAssetReference).asset;
                        if (assetIndex >= 0) {
                            return Asset.find(this.assets[assetIndex]);
                        }

                        return null;
                    }
                    else if (KEY_UUID in source) { // Reference.
                        const uuid = (source as IUUID).uuid;

                        if (uuid in this.objects) { // GameObject.
                            return this.objects[uuid];
                        }
                        else if (uuid in this.components) { // Component.
                            return this.components[uuid];
                        }
                        else if (classCodeOrName) { // Link expand objects and components.
                            const scene = this._rootTarget instanceof GameObject ? this._rootTarget.scene : this._rootTarget!;

                            if ((serializeClassMap[classCodeOrName] || classCodeOrName) === egret.getQualifiedClassName(GameObject)) { // GameObject.
                                for (const gameObject of scene.gameObjects) {
                                    if (gameObject.uuid === uuid) {
                                        return gameObject;
                                    }
                                }
                            }
                            else { // Component.
                                for (const gameObject of scene.gameObjects) {
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

                            return (target as ISerializable).deserialize(source, this);
                        }
                    }
                    else { // Map.
                        target = {};

                        for (let k in source) {
                            target[k] = this._deserializeChild(source[k]);
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

        public getAssetOrComponent(source: IUUID | IAssetReference): Asset | GameObject | BaseComponent | null {
            if (KEY_ASSET in source) {
                const assetIndex = (source as IAssetReference).asset;
                if (assetIndex >= 0) {
                    return Asset.find(this.assets[assetIndex]);
                }

                return null;
            }

            const uuid = (source as IUUID).uuid;

            return this.components[uuid] || this.objects[uuid] as GameObject;
        }
        /**
         * @internal
         */
        public deserialize<T extends (Scene | GameObject | BaseComponent)>(
            data: ISerializedData,
            keepUUID: boolean = false, makeLink: boolean = false,
            rootTarget: Scene | GameObject | null = null,
        ): T | null {
            if (data.assets) {
                for (const assetName of data.assets) {
                    this.assets.push(assetName);
                }
            }

            this._keepUUID = keepUUID;
            this._makeLink = makeLink;
            this._rootTarget = rootTarget;

            const sceneClassName = egret.getQualifiedClassName(Scene);
            const transformClassName = egret.getQualifiedClassName(egret3d.Transform);
            const components: { [key: string]: ISerializedObject } = {};
            let root: Scene | GameObject | BaseComponent | null = null;

            if (data.components) {
                for (const componentSource of data.components) { // Mapping components.
                    components[componentSource.uuid] = componentSource;
                }
            }

            if (data.objects) {
                for (const source of data.objects) { // 场景和实体实例化。
                    const className = serializeClassMap[source.class] || source.class;
                    let target: Scene | GameObject | null | undefined = undefined;

                    if (className === sceneClassName) {
                        target = Scene.createEmpty((<any>source as { name: string }).name);
                        this._rootTarget = target;
                    }
                    else {
                        if (!this._rootTarget) {
                            this._rootTarget = paper.Application.sceneManager.activeScene; // TODO
                        }

                        const hasLink = KEY_EXTRAS in source && (source[KEY_EXTRAS] as GameObjectExtras).linkedID;
                        if (hasLink) {
                            const extras = source[KEY_EXTRAS] as GameObjectExtras;
                            const linkedID = extras.linkedID!;
                            const prefab = extras.prefab;

                            if (prefab) { // Prefab root.
                                const assetIndex = ((<any>prefab) as IAssetReference).asset;
                                if (assetIndex >= 0) {
                                    const assetName = this.assets[assetIndex];
                                    target = Prefab.create(assetName, this._rootTarget as Scene);

                                    if (target) { // Cache.
                                        this._deserializers[source.uuid] = Deserializer._lastDeserializer;
                                    }
                                    else { // Missing prefab.
                                        target = GameObject.create(DefaultNames.MissingPrefab, DefaultTags.Untagged, this._rootTarget as Scene);
                                    }
                                }
                            }
                            else { // Prefab node.
                                const prefabDeserializer = this._deserializers[extras.rootID!];
                                target = prefabDeserializer.objects[linkedID];
                                if (!target) {
                                    // Delete node.
                                }
                            }
                        }
                        else {
                            target = GameObject.create(DefaultNames.NoName, DefaultTags.Untagged, this._rootTarget as Scene);

                            if (this._makeLink) { // TODO
                                (target as GameObject).extras!.linkedID = source.uuid;
                                if (root) {
                                    (target as GameObject).extras!.rootID = (root as GameObject).uuid;
                                }
                            }
                        }

                        if (target && KEY_COMPONENTS in source) { // Mapping transfrom components.
                            for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                                const uuid = componentUUID.uuid;
                                const componentSource = components[uuid];

                                if ((serializeClassMap[componentSource.class] || componentSource.class) === transformClassName) {
                                    this.components[uuid] = (target as GameObject).transform;
                                }
                            }
                        }
                    }

                    if (target) {
                        this.objects[source.uuid] = target;
                        root = root || target;
                    }
                }

                let i = data.objects.length;
                while (i--) {
                    const source = data.objects[i];
                    const target = this.objects[source.uuid];

                    if (target) {
                        this._deserializeObject(source, target); // 场景或实体属性反序列化。

                        if (target.constructor === GameObject && KEY_COMPONENTS in source) { // 组件实例化。
                            for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                                this._createComponent(components[componentUUID.uuid], source, target as GameObject);
                            }
                        }
                    }
                }
            }

            if (data.components) {
                for (const componentSource of data.components) { // 组件属性反序列化。
                    const uuid = componentSource.uuid;
                    let component = this.components[uuid];

                    if (component) {
                        if (component.constructor === MissingComponent) {
                            continue;
                        }

                        this._deserializeObject(componentSource, component);
                    }
                    else if (rootTarget && rootTarget.constructor === GameObject) { // 整个反序列化过程只反序列化组件。
                        component = this._createComponent(componentSource);
                        root = root || component;
                        this._deserializeObject(componentSource, component);
                    }
                }
            }

            Deserializer._lastDeserializer = this;

            return root as T;
        }
    }
}