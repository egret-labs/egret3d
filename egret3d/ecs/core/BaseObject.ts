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
     * 基础对象。
     */
    export abstract class BaseObject implements IUUID {
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
        public static __owner?: BaseClass;
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
        /**
         * 
         */
        @paper.serializedField
        public uuid: string = createUUID();
    }
}
