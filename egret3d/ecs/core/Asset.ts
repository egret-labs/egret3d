namespace paper {

    /**
     * Base Class for Asset
     * @version paper 1.0
     * @platform Web
     * @language en_US
     */
    /**
     * 资源基类，扩展资源类型需要继承此抽象类
     * @version paper 1.0
     * @platform Web
     * @language zh_CN
     */
    @serializedType("assets")
    export abstract class Asset extends SerializableObject {
        private static readonly _assets: { [url: string]: Asset } = {};

        /**
         * 注册资源
         * 通过此方法注册后，引擎内部可以通过URL字典访问所有注册的资源
         * 使用外部加载器时，需要在加载完成后注册该资源
         */
        public static register(asset: Asset, isLoad: boolean = false) {
            asset._isLoad = isLoad;
            this._assets[asset.url] = asset;
        }

        /**
         * 获取资源
         * @param name 资源的url
         */
        public static find<T extends Asset>(name: string) {
            const result = this._assets[name]
            if (!result) {
                return RES.getRes(name) as T;
            }
            else {
                return result as T;
            }
        }

        /**
         * 
         * 资源的原始URL
         */
        @serializedField
        @deserializedIgnore
        public url: string = "";

        /**
         * @internal
         */
        public _isLoad: boolean = false;
        /**
         * 
         */
        constructor(url: string = "") {
            super();
            this.url = url;
        }
        /**
         * @inheritDoc
         */
        public serialize(): any {
            const target = serializeRC(this);
            target.url = this.url;

            return target;
        }
        /**
         * asset byte length
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 计算资源字节大小。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public abstract caclByteLength(): number;

        /**
         * dispose asset
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 释放资源。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public abstract dispose(): void;

        /**
         * @internal
         * TODO:临时，在 Prefab/Scene.parse处需要
         */
        hashCode: number
    }
}