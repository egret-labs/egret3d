namespace paper {
    /**
     * 
     */
    export class MissingObject implements ISerializable {
        /**
         * 
         */
        public readonly missingData: { [key: string]: any } = {};

        public serialize(): any | IHashCode | ISerializedObject {
            return this.missingData;
        }

        public deserialize(element: any): void {
            for (const key in element) {
                this.missingData[key] = element[key];
            }
        }
    }
}
