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
export interface ISerializable<T> {
    /**
     * 序列化。
     * @returns 序列化后的数据。
     */
    serialize(): T;
    /**
     * 反序列化。
     * @param data 反序列化数据。
     * @returns 反序列化后的数据。
     */
    deserialize(data: T): this;
}