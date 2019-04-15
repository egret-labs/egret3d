import { IUUIDClass } from "./types";

let _classCount: uint = 0;

function _createClassUUID() {
    return (_classCount++).toString();
};
/**
 * 唯一识别码类装饰器。
 * @param uuidClass 一个唯一识别码类。
 */
export function uuid(uuidClass: IUUIDClass) {
    if (uuidClass.registered === uuidClass) {
        return;
    }

    (uuidClass.uuid as string) = _createClassUUID();
    (uuidClass.registered as IUUIDClass | null) = uuidClass;
}
