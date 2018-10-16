namespace paper {
    let _hashCount: number = 1;
    /**
     * 生成 uuid 的方式。
     * @internal
     */
    export let createUUID = () => {
        return (_hashCount++).toString();
    };
    /**
     * 可以被 paper.DisposeCollecter 收集，并在此帧末尾释放的基础对象。
     */
    export abstract class BaseRelease<T extends BaseRelease<T>> {
        /**
         * 是否已被释放。
         * - 将对象从对象池取出时，需要设置此值为 `false`。
         */
        protected _released?: boolean;
        /**
         * 在此帧末尾释放该对象。
         * - 不能在静态解释阶段执行。
         */
        public release() {
            if (this._released) {
                console.warn("The object has been released.");
                return this;
            }

            disposeCollecter.releases.push(this);
            this._released = true;

            return this;
        }
        /**
         * 在此帧末尾释放时调用。
         */
        public onClear?(): void;
    }
    /**
     * 基础对象。
     */
    export abstract class BaseObject implements IUUID {
        /**
         * @internal
         */
        public static __isBase?: boolean;
        /**
         * @internal
         */
        public static __owner?: IBaseClass;
        /**
         * @internal
         */
        public static __deserializeIgnore?: string[];
        /**
         * @internal
         */
        public static __serializeKeys?: { [key: string]: string | null };
        /**
         * @internal
         */
        public static __onRegister() {
            if (this.__owner && this.__owner === this) {
                return false;
            }

            this.__deserializeIgnore = [];
            this.__serializeKeys = {};
            this.__owner = this;

            return true;
        }

        @serializedField
        public uuid: string = createUUID();
    }
}
