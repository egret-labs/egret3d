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
    export abstract class Asset extends BaseObject {
        /**
         * @internal
         */
        public static readonly _assets: { [key: string]: Asset } = {};
        /**
         * @internal
         */
        public static register(asset: Asset) {
            if (!this._assets[asset.name]) {
                this._assets[asset.name] = asset;
            }
            else if (this._assets[asset.name] !== asset) {
                console.debug("Replace existing asset.", asset.name);
                this._assets[asset.name] = asset;
            }
        }
        /**
         * 
         */
        public static find<T extends Asset>(name: string) {
            const result = this._assets[name]
            if (!result) {
                return RES.getRes(name) as T;
            }

            return result as T;
        }
        /**
         * @readonly
         */
        public name: string = "";
        /**
         * @internal
         */
        public _isBuiltin: boolean = false;

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
        public dispose(disposeChildren?: boolean) {
            if (this._isBuiltin) {
                console.warn("Cannot dispose builtin asset.", this.name);
                return false;
            }

            delete Asset._assets[this.name];
            this.name = "";

            return true;
        }
    }
}