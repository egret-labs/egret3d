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
        public static register(asset: Asset) {
            this._assets[asset.url] = asset;
        }

        /**
         * 注销资源
         * 销毁资源时，注销框架内部对资源的引用
         */
        public static unregister(asset: Asset) {
            delete this._assets[asset.url];
        }

        /**
         * 获取资源
         * @param url 资源的url
         */
        public static find<T extends Asset>(url: string) {
            return (url in this._assets) ? this._assets[url] as T : null;
        }
        /**
         * 
         */
        public static get assets(): Readonly<{ [url: string]: Asset }> {
            return this._assets;
        }
        /**
         * 
         * 资源的原始URL
         */
        @paper.serializedField
        @deserializedIgnore
        public url: string = "";

        /**
         * get asset name
         * @version paper 1.0
         * @platform Web
         * @language en_US
         */
        /**
         * 名称。
         * @version paper 1.0
         * @platform Web
         * @language zh_CN
         */
        public name: string = "";
        /**
         * 
         */
        public constructor(name: string = "", url: string = "") {
            super();

            this.name = name;
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
    }
}