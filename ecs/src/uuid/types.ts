
/**
 * 唯一识别码类接口。
 */
export interface IUUIDClass {
    /**
     * 类的唯一识别码。
     */
    readonly uuid: string;
    /**
     * 注册标识。
     */
    readonly registered: IUUIDClass | null;
    /**
     * 注册器。
     */
    register(): boolean;
}
/**
 * 唯一识别码接口。
 */
export interface IUUID {
    /**
     * 对象的唯一识别码。
     */
    readonly uuid: string;
}
