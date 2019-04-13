import { IUUIDClass, IUUID } from "./types";
import { uuid } from "./Decorators";

let _instanceCount: uint = 0;
/**
 * 
 */
export let createInscanceUUID: () => string = (): string => {
    return (_instanceCount++).toString();
};
/**
 * 唯一识别码对象。
 */
@uuid
export abstract class UUID implements IUUID {
    public static readonly uuid: string = "";
    public static readonly registered: IUUIDClass | null = null;

    public uuid: string = createInscanceUUID();
}
