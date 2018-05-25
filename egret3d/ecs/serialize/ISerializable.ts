namespace paper {
    /**
     * 
     */
    export interface IHashCode {
        /**
         * 
         */
        readonly hashCode: number;
    }
    /**
     * 
     */
    export interface IStruct {
        /**
         * 
         */
        readonly class: string;
    }
    /**
     * 自定义序列化接口。
     */
    export interface ISerializable {
        /**
         * 
         */
        serialize(): any | IHashCode | ISerializedObject;
        /**
         * 
         */
        deserialize(element: any): void;
    }

    /**
     * 序列化后的数据接口。
     */
    export interface ISerializedObject extends IHashCode, IStruct {
        /**
         * 
         */
        [key: string]: any | IHashCode;
    }

    /**
     * 序列化数据接口
     */
    export interface ISerializedData {
        /**
         * 
         */
        readonly objects: ISerializedObject[];
        /**
         * 
         */
        [key: string]: ISerializedObject[];
    }
}
