export const DATA_VERSION: string = "5";
/**
 * @private
 */
export const DATA_VERSIONS = [DATA_VERSION];
export const KEY_SERIALIZE: keyof ISerializable = "serialize";
export const KEY_UUID: keyof IUUID = "uuid";
export const KEY_CLASS = "class";
export const KEY_DESERIALIZE = "deserialize";
export const KEY_COMPONENTS = "components";
export const KEY_ENTITIES = "entities";
export const KEY_CHILDREN = "children";

/**
 * 
 */
export interface IUUID {
    /**
     * 对象的唯一标识。
     */
    readonly uuid: string;
}
/**
 * 
 */
export interface ISerializableClass {
    /**
     * 
     */
    readonly owner: ISerializableClass | null;
    /**
     * 
     */
    readonly serializeFields: { [key: string]: string } | null;
    /**
     * 
     */
    readonly deserializeIgnore: string[] | null;
    /**
     * 
     */
    onRegister(): boolean;
}
/**
 * 自定义序列化接口。
 */
export interface ISerializable {
    /**
     * 序列化。
     * @returns 序列化后的数据。
     */
    serialize(): any;
    /**
     * 反序列化。
     * @param data 反序列化数据。
     * @returns 反序列化后的数据。
     */
    deserialize(data: any): this;
}

/**
 * 序列化数据接口。
 */
export interface ISerializedData {
    /**
     * 
     */
    version?: string;
    /**
     * 
     */
    compatibleVersion?: string;
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
export interface ISerializedObject extends IUUID, IClass {
    [key: string]: any;
}

export interface ISerializedStruct extends IClass {
    [key: string]: any;
}
export interface IClass {
    /**
     * 
     */
    readonly class: string;
}

/**
 * 基础对象类接口。
 * - 仅用于约束基础对象的装饰器。
 */
export interface IBaseClass extends Function {
    /**
     * @internal
     */
    __deserializeIgnore?: string[];
    /**
     * @internal
     */
    __serializeKeys?: { [key: string]: string | null };
    // /**
    //  * @internal
    //  */
    // readonly __onRegister: () => boolean;
}
