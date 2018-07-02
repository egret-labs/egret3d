namespace paper {
    /**
     * 
     */
    export class MissingObject implements ISerializable {
        [k: string]: any;

        public serialize(): any | IUUID | ISerializedObject {
            return this;
        }

        public deserialize(element: any): void {
            for (const k in element) {
                this[k] = element[k];
            }
        }
    }
}
