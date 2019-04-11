import { IUUIDClass } from "./types";
/**
 * 唯一识别码类装饰器。
 * @param uuidClass 一个唯一识别码类。
 */
export function uuid(uuidClass: IUUIDClass) {
    uuidClass.register();
}