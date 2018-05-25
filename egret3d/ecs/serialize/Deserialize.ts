namespace paper {
    let _deserializedObjects: { [key: string]: ISerializable };
    /**
     * 反序列化
     * @param data 反序列化数据
     * @param expandMap 扩展的对象映射，此映射中存在的对象不需要重新序列化，直接使用即可（例如已经加载完成的资源文件）。
     */
    export function deserialize<T extends ISerializable>(data: ISerializedData, expandMap: { [hashCode: number]: ISerializable }): T | null {
        _deserializedObjects = {};
        for (const k in expandMap) {
            _deserializedObjects[k] = expandMap[k];
        }

        let root: ISerializable | null = null;

        for (const source of data.objects) {
            let target: ISerializable | null = null;

            if (source.hashCode in _deserializedObjects) {
                target = _deserializedObjects[source.hashCode];
            }
            else {
                const className = serializeClassMap[source.class] || source.class;
                const clazz = egret.getDefinitionByName(className);

                if (clazz) {
                    target = new clazz();
                    _deserializedObjects[source.hashCode] = target;
                }
                else {
                    console.error(`Class ${source.class} not defined.`);
                }
            }

            root = root || target;
        }

        for (const source of data.objects) {
            if (source.hashCode in expandMap) { // 如果是外部插入的对象，则跳过属性赋值操作
                continue;
            }

            const target = _deserializedObjects[source.hashCode];
            if (target) {
                _deserializeObject(source, target);

                if (target instanceof GameObject) {
                    for (const component of target.components) {
                        (component as any).gameObject = target; // TODO
                    }
                }
            }
            else {
                console.warn("Deserialize error.", source.hashCode);
            }
        }

        for (const element of data.objects) { // TODO
            const object = _deserializedObjects[element.hashCode];
            if (object instanceof GameObject) {
                for (const component of object.components) {
                    component.initialize();
                    EventPool.dispatchEvent(EventPool.EventType.Create, component);
                }
            }
        }

        _deserializedObjects = null as any;

        return root as any;
    }
    /**
     * 
     */
    export function getDeserializedObject<T extends ISerializable>(source: IHashCode): T {
        return _deserializedObjects[source.hashCode] as T;
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

                const hashCode = source.hashCode as number; // TODO 字符串依赖。
                let classCodeOrName = source.class as string; // TODO 字符串依赖。

                if (hashCode) {
                    if (hashCode in _deserializedObjects) {
                        return _deserializedObjects[hashCode];
                    }
                    else if (classCodeOrName) {
                        if (classCodeOrName === findClassCodeFrom(Scene)) {
                            // TODO
                        }
                        else if (classCodeOrName === findClassCodeFrom(GameObject)) {
                            for (const gameObject of Application.sceneManager.getActiveScene().gameObjects) { // TODO 暂时是搜索当前场景。
                                if (gameObject.hashCode === hashCode) {
                                    return gameObject;
                                }
                            }
                        }
                        else {
                            for (const gameObject of Application.sceneManager.getActiveScene().gameObjects) { // TODO 暂时是搜索当前场景。
                                for (const component of gameObject.components) {
                                    if (component.hashCode === hashCode) {
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