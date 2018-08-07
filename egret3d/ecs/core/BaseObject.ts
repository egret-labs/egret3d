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
     * @internal
     */
    export let createAssetID = () => {
        return undefined;
    };
    /**
     * 基础对象。
     */
    export abstract class BaseObject implements IUUID {
        /**
         * 
         */
        @paper.serializedField
        public uuid: string = createUUID();
    }
}
