namespace paper {
    /**
     * 资源基类。
     */
    export abstract class Asset extends BaseObject {
        /**
         * @internal
         */
        public static readonly _assets: { [key: string]: Asset } = {};
        /**
         * @private
         */
        public static register(asset: Asset) {
            if (!this._assets[asset.name]) {
                this._assets[asset.name] = asset;
            }
            else if (this._assets[asset.name] !== asset) {
                console.warn("Replace existing asset.", asset.name);
                this._assets[asset.name] = asset;
            }
        }
        /**
         * 查找已加载的指定资源。
         */
        public static find<T extends Asset>(name: string) {
            const result = this._assets[name];
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
         * @internal
         */
        public abstract caclByteLength(): number;
        /**
         * 释放资源。
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