namespace paper {
    /**
     * 克隆
     */
    export function clone<T extends SerializableObject>(object: T): T {

        let cacheParent: any = null;

        // TODO 太多的字符串依赖。
        // 将parent设置为空，避免向上引用 // TODO 这并不能根本解决问题，自定义组件依然可能会引用这些，导致错误的序列化和反序列化
        if (object instanceof GameObject) {
            cacheParent = object.transform.parent;
            (object.transform as any)._parent = null; // TODO
        }
        else if (object instanceof egret3d.Transform) {
            cacheParent = object.parent;
            (object as any)._parent = null; // TODO
        }

        const data = serialize(object);

        if (object instanceof GameObject) {
            (object.transform as any)._parent = cacheParent; // TODO
        }
        else if (object instanceof egret3d.Transform) {
            (object as any)._parent = cacheParent; // TODO
        }

        const assets: any = {};
        if ("assets" in data) { // 认为此时所有资源已经正确加载
            for (const asset of data["assets"]) {
                assets[asset.uuid] = Asset.find((<any>asset as Asset).url); // 获取资源引用
            }
        }

        return deserialize<T>(data, assets, true);
    }
}