namespace paper {
    /**
     * 
     */
    export interface BaseClass extends Function {
        /**
         * @internal
         */
        __serializeKeys?: string[];
        /**
         * @internal
         */
        __deserializeIgnore?: string[];
        /**
         * @internal
         */
        __owner?: BaseClass;
        /**
         * @internal
         */
        readonly __onRegister: (baseClass: BaseClass) => void;
    }

    let _hashCount: number = 1;
    /**
     * 生成 uuid 的方式。
     * @internal
     */
    export let createUUID = () => {
        return (_hashCount++).toString();
    };
    /**
     * @internal
     */
    export function registerClass(baseClass: BaseClass) {
        if (!baseClass.__owner || baseClass.__owner !== baseClass) {
            baseClass.__onRegister(baseClass);
        }
    }
    /**
     * 基础对象。
     */
    export abstract class BaseObject implements IUUID {
        /**
         * @internal
         */
        public static __serializeKeys?: string[];
        /**
         * @internal
         */
        public static __deserializeIgnore?: string[];
        /**
         * @internal
         */
        public static __owner?: BaseClass;
        /**
         * @internal
         */
        public static __onRegister(baseClass: BaseClass) {
            baseClass.__serializeKeys = [];
            baseClass.__deserializeIgnore = [];
            baseClass.__owner = baseClass;
        }
        /**
         * 
         */
        @paper.serializedField
        public uuid: string = createUUID();
    }
}
