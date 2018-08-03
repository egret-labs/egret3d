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
    export interface IAssetReference {
        /**
         * 
         */
        readonly asset: number;
    }
    /**
     * 
     */
    export interface IClass {
        /**
         * 
         */
        readonly class: string;
    }
    // /**
    //  * @internal
    //  */
    // export interface IPP extends IUUID {
    //     puuid: string;
    // }
    // /**
    //  * @internal
    //  */
    // export interface IPrefabExtras extends IAssetReference {
    //     objects?: IPP[];
    //     components?: IPP[];
    // }
    /**
     * 
     */
    export interface ISerializedObject extends IUUID, IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 
     */
    export interface ISerializedStruct extends IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 序列化数据接口。
     */
    export interface ISerializedData {
        /**
         * 
         */
        version?: number;
        /**
         * 
         */
        compatibleVersion?: number;
        /**
         * 所有资源。
         */
        readonly assets?: string[];
        /**
         * 所有实体。（至多含一个场景）
         */
        readonly objects?: ISerializedObject[];
        /**
         * 所有组件。
         */
        readonly components?: ISerializedObject[];
    }
    /**
     * 
     */
    export interface IDeserializedData {
        /**
         * @internal
         */
        isKeepUUID: boolean;
        /**
         * 
         */
        assets: string[];
        /**
         * 
         */
        objects: { [key: string]: GameObject };
        /**
         * 
         */
        components: { [key: string]: BaseComponent };
    }
    /**
     * 自定义序列化接口。
     */
    export interface ISerializable {
        /**
         * 
         */
        serialize(): any;
        /**
         * 
         */
        deserialize(element: any): any;
    }
}
