namespace paper {
    let _hashCount: number = 1;
    /**
     * 生成 uuid 的方式。 
     */
    export let createUUID = () => {
        return (_hashCount++).toString();
    }   
    export let createAssetID = () => {
        return null;
    }
    /**
     * 可序列化对象。
     */
    export abstract class SerializableObject implements IUUID, ISerializable {
        /**
         * 
         */
        @paper.serializedField
        public uuid: string = createUUID();

        @paper.serializedField
        public assetUUid: string = createAssetID();

        public serialize(): any {
            console.warn("Unimplemented serialize method.");
        }
        /**
         * 
         */
        public deserialize(element: any): void {
            console.warn("Unimplemented deserialize method.");
        }
    }
}
