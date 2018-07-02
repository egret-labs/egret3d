namespace paper {
    let _isClone: boolean = false;
    let _deserializedObjects: { [key: string]: ISerializable };
    /**
     * 反序列化
     * @param data 反序列化数据
     * @param expandMap 扩展的对象映射，此映射中存在的对象不需要重新序列化，直接使用即可（例如已经加载完成的资源文件）。
     */
    export function deserialize<T extends ISerializable>(data: ISerializedData, expandMap: { [k: string]: ISerializable }, isClone: boolean = false): T | null {
        _isClone = isClone;
        _deserializedObjects = {};
        for (const k in expandMap) {
            _deserializedObjects[k] = expandMap[k];
        }

        let root: ISerializable | null = null;

        for (const source of data.objects) { // 实例化。
            const k = source.hashCode || source.uuid; // hashCode 兼容。
            let target: ISerializable;

            if (k in _deserializedObjects) {
                target = _deserializedObjects[k];
            }
            else {
                const className = serializeClassMap[source.class] || source.class;
                const clazz = egret.getDefinitionByName(className);

                if (clazz) {
                    target = new clazz();
                    _deserializedObjects[k] = target;
                }
                else {
                    target = new MissingObject();
                    _deserializedObjects[k] = target;
                    console.error(`Class ${source.class} not defined.`);
                }
            }

            root = root || target;
        }

        for (const source of data.objects) { // 属性赋值。
            const k = source.hashCode || source.uuid; // hashCode 兼容。
            if (k in expandMap) { // 跳过外部插入对象。
                continue;
            }

            const target = _deserializedObjects[k];
            _deserializeObject(source, target);

            if (target instanceof GameObject) {
                for (const component of target.components) {
                    (component as any).gameObject = target; // TODO
                }
            }
        }

        for (const source of data.objects) { // 组件初始化。 TODO
            const k = source.hashCode || source.uuid; // hashCode 兼容。
            const target = _deserializedObjects[k];
            if (target instanceof BaseComponent) {
                target.initialize();
                if (target.isActiveAndEnabled) {
                    paper.EventPool.dispatchEvent(paper.EventPool.EventType.Enabled, target);
                }
            }
        }

        _deserializedObjects = null as any;

        return root as any;
    }
    /**
     * 
     */
    export function getDeserializedObject<T extends ISerializable>(source: ISerializedObject): T {
        const k = source.hashCode || source.uuid; // hashCode 兼容。
        return _deserializedObjects[k] as T;
    }

    function _deserializeObject(source: any, target: ISerializable) {
        if (target.constructor.prototype.hasOwnProperty("deserialize")) { // TODO 字符串依赖。
            (target as ISerializable).deserialize(source);
        }
        else {
            for (const k in source) {
                if (k === "hashCode" || k === "class") { // TODO 字符串依赖。
                    continue;
                }

                if (_isClone && k === "uuid") { // TODO 字符串依赖。
                    continue;
                }

                if (
                    SerializeKey.DeserializedIgnore in target &&
                    (target[SerializeKey.DeserializedIgnore] as string).indexOf(k) >= 0
                ) {
                    continue;
                }

                target[k] = _deserializeChild(source[k], target[k]);
            }
        }
    }

    function _deserializeChild(source: any, target?: any) {
        if (source === null || source === undefined) {
            return source;
        }

        switch (typeof source) {
            case "function":
                return undefined;

            case "object": {
                if (target && target.constructor.prototype.hasOwnProperty("deserialize")) { // TODO 字符串依赖。
                    (target as ISerializable).deserialize(source);
                    return target;
                }

                if (Array.isArray(source)) {
                    target = [];

                    for (let i = 0, l = source.length; i < l; ++i) {
                        target[i] = _deserializeChild(source[i]);
                    }

                    return target;
                }

                const uuid = (source.hashCode || source.uuid) as string; // TODO 字符串依赖， hashCode 兼容。
                let classCodeOrName = source.class as string; // TODO 字符串依赖。

                if (uuid) {
                    if (uuid in _deserializedObjects) {
                        return _deserializedObjects[uuid];
                    }
                    else if (classCodeOrName) {
                        if (classCodeOrName === findClassCodeFrom(Scene)) {
                            // TODO
                        }
                        else if (classCodeOrName === findClassCodeFrom(GameObject)) {
                            for (const gameObject of Application.sceneManager.activeScene.gameObjects) {
                                if (gameObject.uuid === uuid) {
                                    return gameObject;
                                }
                            }
                        }
                        else { // Component
                            for (const gameObject of Application.sceneManager.activeScene.gameObjects) {
                                for (const component of gameObject.components) {
                                    if (component.uuid === uuid) {
                                        return component;
                                    }
                                }
                            }
                        }
                    }
                }
                else if (classCodeOrName) {
                    classCodeOrName = serializeClassMap[classCodeOrName] || classCodeOrName;
                    const clazz = egret.getDefinitionByName(classCodeOrName);
                    if (clazz) {
                        target = new clazz();
                        _deserializeObject(source, target);

                        return target;
                    }
                }
                else {
                    target = {};

                    for (let k in source) {
                        target[k] = _deserializeChild(source[k]);
                    }

                    return target;
                }

                console.warn("Deserialize error.", source);
                return null;
            }

            default:
                return source;
        }
    }
}