namespace paper {
    let _hashCount: number = 1;
    /**
     * 可序列化对象 
     */
    export abstract class SerializableObject implements IHashCode, ISerializable {
        public readonly hashCode: number = _hashCount++;

        public serialize(): any {
            console.warn("Unimplemented serialize method.");
        }

        public deserialize(element: any): void {
            console.warn("Unimplemented deserialize method.");
        }
    }
}
