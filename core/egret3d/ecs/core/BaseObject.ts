namespace paper {
    let _hashCount: number = 1;
    /**
     * 生成 uuid 的方式。
     * @private
     */
    export let createUUID = () => {
        return (_hashCount++).toString();
    };
    /**
     * 可以被 paper.DisposeCollecter 收集，并在此帧末尾释放的基础对象。
     */
    export abstract class BaseRelease<T extends BaseRelease<T>> {
        /**
         * 
         */
        public onUpdateTarget?: any;
        /**
         * 是否已被释放。
         * - 将对象从对象池取出时，需要设置此值为 `false`。
         */
        protected _released?: boolean;
        /**
         * 更新该对象，使得该对象的 `onUpdate` 被执行。
         */
        public update() {
            if (this.onUpdate) {
                this.onUpdate.call(this.onUpdateTarget || this, this);
            }

            return this;
        }
        /**
         * 在此帧末尾释放该对象。
         * - 释放该对象后，必须清除所有对该对象的显示引用。（该问题必须引起足够的重视）
         * - 不能在静态解释阶段执行。
         */
        public release() {
            if (this._released) {
                if (DEBUG) {
                    console.warn("The object has been released.");
                }

                return this;
            }

            disposeCollecter.releases.push(this);
            this._released = true;

            return this;
        }
        /**
         * 
         */
        public onUpdate?(object: T): void;
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
