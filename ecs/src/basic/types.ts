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
}
/**
 * 
 */
export interface IPoolClass<TReleasable extends IReleasable> {
    readonly instances: ReadonlyArray<TReleasable>;
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
/**
 * 
 */
export interface IPoolInstance {
    /**
     * 
     */
    initialize(...args: any[]): void;
    /**
     * 
     */
    uninitialize(): void;
}
/**
 * 
 */
export interface IReleasable extends IPoolInstance {
    /**
     * 在此帧末尾释放该对象。
     * - 释放该对象后，必须清除堆上所有对该对象的引用。（该问题必须引起足够的重视）
     * - 不能在静态解释阶段执行。
     */
    release(): this;
}