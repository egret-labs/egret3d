namespace paper {
    let _hashCount: number = 1;
    /**
     * 生成 uuid 的方式。 
     */
    export let createUUID = () => {
        return (_hashCount++).toString();
    };

    export let createAssetID = () => {
        return undefined;
    };
    /**
     * 可序列化对象。
     */
    export abstract class SerializableObject implements IUUID, ISerializable {
        /**
         * 
         */
        @paper.serializedField
        public uuid: string = createUUID();

        public serialize(): any {
            console.warn("Unimplemented serialize method.");

            return null;
        }
        /**
         * 
         */
        public deserialize(element: any): any {
            console.warn("Unimplemented deserialize method.");

            return null;
        }
    }
}
