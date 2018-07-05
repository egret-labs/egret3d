namespace paper {
    /**
     * 
     */
    export interface IUUID {
        /**
         * 
         */
        readonly uuid: string;
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
        serialize(): any | IUUID | ISerializedObject;
        /**
         * 
         */
        deserialize(element: any): void;
    }

    /**
     * 序列化后的数据接口。
     */
    export interface ISerializedObject extends IUUID, IStruct {
        /**
         * 
         */
        [key: string]: any | IUUID;
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
