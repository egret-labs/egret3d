namespace paper {
    const KEY_UUID: keyof IUUID = "uuid";
    const KEY_ASSET: keyof IAssetReference = "asset";
    const KEY_CLASS: keyof IClass = "class";
    const KEY_DESERIALIZE: keyof ISerializable = "deserialize";
    const KEY_COMPONENTS: keyof IEntity = "components";
    const KEY_EXTRAS: keyof IEntity = "extras";
    const KEY_CHILDREN: keyof BaseTransform = "children";
    // const KEY_MISSINGOBJECT: keyof MissingComponent = 'missingObject';

    function _getDeserializedKeys(serializedClass: IBaseClass, keys: { [key: string]: string } = {}) {
        const serializeKeys = serializedClass.__serializeKeys;

        if (serializeKeys) {
            keys = keys;

            for (const k in serializeKeys) {
                keys[k] = serializeKeys[k] || k;
            }
        }

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object) {
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

        if (serializedClass.prototype && serializedClass.prototype.__proto__.constructor !== Object) {
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
         * @param target 
         * @param propName 
         */
        public static propertyHasGetterAndSetter(target: any, propName: string): boolean {
            let prototype = Object.getPrototypeOf(target);

            while (prototype) {
                const descriptror = Object.getOwnPropertyDescriptor(prototype, propName);
                if (descriptror && descriptror.get && descriptror.set) {
                    return true;
                }

                prototype = Object.getPrototypeOf(prototype);
            }

            return false;
        }

        /**
         * 
         */
        public readonly assets: string[] = [];
        /**
         * 
         */
        public readonly objects: { [key: string]: IScene | IEntity } = {};
        /**
         * 
         */
        public readonly components: { [key: string]: IComponent } = {};

        public root: IScene | IEntity | IComponent | null = null;

        private _keepUUID: boolean;
        private _makeLink: boolean;
        private readonly _deserializers: { [key: string]: Deserializer } = {};
        private readonly _prefabRootMap: { [key: string]: { rootUUID: string, root: IEntity } } = {};
        private _rootTarget: IScene | IEntity | null = null;

        private _deserializeObject(source: ISerializedObject, target: IScene | IEntity | IComponent) {
            const deserializedKeys = _getDeserializedKeys(target.constructor as IBaseClass);
            const deserializedIgnoreKeys = _getDeserializedIgnoreKeys(target.constructor as IBaseClass);

            for (const k in source) {
                if (k === KEY_CLASS) { // 类名不需要反序列化。
                    continue;
                }

                if (k === KEY_EXTRAS) { // 不应该应用 extras 的值。
                    continue;
                }

                if (!this._keepUUID && k === KEY_UUID) { // 是否需要记忆 UUID。
                    continue;
                }

                // if (k === KEY_MISSINGOBJECT) { // 丢失的对象数据直接赋值。 TODO
                //     (target as any)[k] = source[k];
                //     continue;
                // }

                const retargetKey = (deserializedKeys && k in deserializedKeys) ? deserializedKeys[k] : k; // 重定向反序列化 key。

                if (deserializedIgnoreKeys && deserializedIgnoreKeys.indexOf(retargetKey) >= 0) { // 忽略反序列化 key。
                    continue;
                }

                const hasGetterAndSetter = Deserializer.propertyHasGetterAndSetter(target, retargetKey);
                const rawRetarget = (target as any)[retargetKey];
                const retarget = this._deserializeChild(source[k], (hasGetterAndSetter && rawRetarget && (rawRetarget.constructor === Array || rawRetarget.constructor === Object)) ? null : rawRetarget);

                if (retarget === undefined) { // 忽略反序列化后为 undefined 的属性值。
                    continue;
                }

                (target as any)[retargetKey] = retarget;
            }

            return target;
        }

        private _deserializeComponent(componentSource: ISerializedObject, source?: ISerializedObject, target?: IEntity) {
            const className = serializeClassMap[componentSource.class] || componentSource.class; // TODO 废弃 serializeClassMap。
            const clazz = egret.getDefinitionByName(className);
            let componentTarget: IComponent | undefined = undefined;

            if (clazz) {
                const hasLink = KEY_EXTRAS in componentSource && (componentSource[KEY_EXTRAS] as ComponentExtras).linkedID;

                if (clazz === egret3d.Transform) {
                    componentTarget = this.components[componentSource.uuid] as BaseTransform;

                    if (KEY_CHILDREN in componentSource) { // Link transform children.
                        for (const childUUID of componentSource[KEY_CHILDREN] as IUUID[]) {
                            const child = this.components[childUUID.uuid] as BaseTransform | null;

                            if (child && child.parent !== componentTarget) {
                                (componentTarget as BaseTransform)._addChild(child);
                            }
                        }
                    }
                }
                else {
                    if (hasLink) {
                        const componentExtras = componentSource[KEY_EXTRAS] as ComponentExtras;
                        const extras = source![KEY_EXTRAS] as EntityExtras;
                        const linkedID = componentExtras.linkedID!;
                        const prefabDeserializer = this._deserializers[extras.prefab ? source!.uuid : extras.rootID!];
                        componentTarget = prefabDeserializer.components[linkedID];
                    }
                    else {
                        Component.createDefaultEnabled = componentSource._enabled === undefined ? true : componentSource._enabled;
                        componentTarget = (target || this._rootTarget as IEntity).addComponent(clazz);
                    }

                    // if (clazz === Behaviour) { TODO
                    //     (componentTarget as Behaviour)._isReseted = true;
                    // }
                }

                if (!hasLink && this._makeLink && componentTarget) { // TODO
                    componentTarget.extras!.linkedID = componentSource.uuid;
                }
            }
            else { // Missing component.
                componentTarget = target!.addComponent(MissingComponent);
                (componentTarget as MissingComponent).missingObject = componentSource;

                if (DEBUG) {
                    console.warn(`Class ${className} is not defined.`);
                }
            }

            this.components[componentSource.uuid] = componentTarget;

            return componentTarget;
        }

        private _deserializeChild(source: any, target: any = null) {
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
                            // TODO 资源获取不到时，对应返回的资源方案
                            // 材质应返回 MISSING
                            // 纹理应返回 MISSING
                            // Shader 
                            // Mesh
                            // ...
                            return Asset.find(this.assets[assetIndex]);
                        }

                        return null;
                    }
                    else if (KEY_UUID in source) { // Reference.
                        const uuid = (source as IUUID).uuid;

                        if (uuid in this.objects) { // Entity.
                            return this.objects[uuid];
                        }
                        else if (uuid in this.components) { // Component.
                            return this.components[uuid];
                        }
                        else if (classCodeOrName) { // Link expand objects and components.
                            const scene = (this._rootTarget instanceof Entity ? this._rootTarget.scene : this._rootTarget!) as IScene;

                            if ((serializeClassMap[classCodeOrName] || classCodeOrName) === egret.getQualifiedClassName(GameObject)) { // GameObject. TODO 字符串依赖。
                                for (const entity of scene.entities) {
                                    if (entity.uuid === uuid) {
                                        return entity;
                                    }
                                }
                            }
                            else { // Component.
                                for (const entity of scene.entities) {
                                    for (const component of entity.components) {
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

                        for (const k in source) {
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

        public getAssetOrComponent(source: IUUID | IAssetReference): Asset | IEntity | IComponent | null {
            if (KEY_ASSET in source) {
                const assetIndex = (source as IAssetReference).asset;
                if (assetIndex >= 0) {
                    return Asset.find(this.assets[assetIndex]);
                }

                return null;
            }

            const uuid = (source as IUUID).uuid;

            return this.components[uuid] || this.objects[uuid] as IEntity;
        }
        /**
         * @private
         */
        public deserialize<T extends (IScene | IEntity | IComponent)>(
            data: ISerializedData,
            keepUUID: boolean = false, makeLink: boolean = false,
            rootTarget: IScene | IEntity | null = null,
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
            let root: IScene | IEntity | IComponent | null = null;

            if (data.components) {
                for (const componentSource of data.components) { // Mapping components.
                    components[componentSource.uuid] = componentSource;
                }
            }

            if (data.objects) {
                for (const source of data.objects) { // 场景和实体实例化。
                    const className = serializeClassMap[source.class] || source.class;
                    let target: IScene | IEntity | null | undefined = undefined;

                    if (className === sceneClassName) {
                        target = Scene.createEmpty((<any>source as { name: string }).name);
                        this._rootTarget = target;
                    }
                    else {
                        if (!this._rootTarget) {
                            this._rootTarget = Application.sceneManager.activeScene; // TODO
                        }

                        const hasLink = KEY_EXTRAS in source && (source[KEY_EXTRAS] as EntityExtras).linkedID;
                        if (hasLink) {
                            const extras = source[KEY_EXTRAS] as EntityExtras;
                            const linkedID = extras.linkedID!;
                            const prefab = extras.prefab;

                            if (prefab) { // Prefab root.
                                const assetIndex = ((<any>prefab) as IAssetReference).asset;

                                if (assetIndex >= 0) {
                                    const assetName = this.assets[assetIndex];
                                    target = Prefab.create(assetName, this._rootTarget as IScene);

                                    if (target) { // Cache.
                                        this._deserializers[source.uuid] = Deserializer._lastDeserializer;
                                        this._prefabRootMap[source.uuid] = { rootUUID: target.uuid, root: target };
                                    }
                                    else { // Missing prefab.
                                        target = GameObject.create(DefaultNames.MissingPrefab, DefaultTags.Untagged, this._rootTarget as Scene);
                                    }
                                }
                            }
                            else { // Prefab node.
                                const prefabDeserializer = this._deserializers[extras.rootID!];
                                target = prefabDeserializer.objects[linkedID];
                            }
                        }
                        else {
                            target = GameObject.create(DefaultNames.NoName, DefaultTags.Untagged, this._rootTarget as Scene);

                            if (this._makeLink) { // 在 editor 模式下调用 Prefab.createInstance 方法始终会走到这里。
                                target.extras!.linkedID = source.uuid;

                                if (root) {
                                    target.extras!.rootID = root.uuid;
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

                        if (target instanceof Entity && KEY_COMPONENTS in source) { // 组件实例化。
                            for (const componentUUID of source[KEY_COMPONENTS] as IUUID[]) {
                                this._deserializeComponent(components[componentUUID.uuid], source, target);
                            }
                        }
                    }
                }

                // 重新设置 rootID（只有编辑模式需要处理该内容）
                if (Application.playerMode === PlayerMode.Editor) {
                    // 重新设置rootid的值
                    for (const uuid in this._prefabRootMap) {
                        const rootDeser = this._deserializers[uuid];

                        for (const key in rootDeser.objects) {
                            const obj = rootDeser.objects[key];

                            if (obj instanceof Entity) {
                                if (obj.extras!.linkedID && obj.extras!.rootID === this._prefabRootMap[uuid].rootUUID) {
                                    obj.extras!.rootID = this._prefabRootMap[uuid].root.uuid;
                                }
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
                        if (
                            component.constructor === MissingComponent &&
                            componentSource[KEY_CLASS].indexOf((component.constructor as any).name) < 0 // TODO
                        ) {
                            continue;
                        }

                        this._deserializeObject(componentSource, component);
                    }
                    else if (rootTarget && rootTarget instanceof Entity) { // 整个反序列化过程只反序列化组件。
                        component = this._deserializeComponent(componentSource);
                        root = root || component;
                        this._deserializeObject(componentSource, component);
                    }
                }
            }

            Deserializer._lastDeserializer = this;

            this.root = root;

            return root as T;
        }
    }
}