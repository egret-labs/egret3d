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
    export abstract class Asset extends SerializableObject {
        /**
         * @deprecated
         */
        private static readonly _assets: Asset[] = [];
        /**
         * @deprecated
         */
        public static register(asset: Asset) {
            this._assets[asset.name] = asset;
        }
        /**
         * @deprecated
         */
        public static find<T extends Asset>(name: string) {
            const result = this._assets[name]
            if (!result) {
                return RES.getRes(name) as T;
            }

            return result as T;
        }

        /**
         * 
         */
        public name: string = "";
        /**
         * @internal
         */
        public _isBuiltin: boolean = false;
        /**
         * 
         */
        public constructor(name: string = "") {
            super();

            this.name = name;
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