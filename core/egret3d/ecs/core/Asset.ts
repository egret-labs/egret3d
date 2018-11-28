namespace paper {
    /**
     * 资源基类。
     */
    export abstract class Asset extends BaseObject {
        /**
         * TODO RES 需要有注册的功能，并拥有查询所有指定类型资源的功能。
         * Asset 类型需要引擎枚举，paper 空间还是引擎空间。
         * 空间结构
         * 引擎、res、ecs、2d、3d，其他
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
         * 资源名称。
         * @readonly
         */
        public name: string = "";
        /**
         * @internal
         */
        public _isBuiltin: boolean = false;
        /**
         * TODO
         * remove
         * @param name 
         */
        public constructor(name: string = "") {
            super();

            this.name = name;
        }
        /**
         * @internal
         */
        public abstract caclByteLength(): number;
        /**
         * 该资源内部初始化。
         */
        public initialize(): void {
        }
        /**
         * 释放资源。
         */
        public dispose(disposeChildren?: boolean): boolean {
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