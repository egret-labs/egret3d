import { IUUIDClass, IUUID } from "./types";
import { uuid } from "./Decorators";

let _instanceCount: uint = 0;
/**
 * 唯一识别码对象。
 */
@uuid
export abstract class UUID implements IUUID {
    public static readonly uuid: string = "";
    public static readonly registered: IUUIDClass | null = null;
    /**
     * 创建唯一识别码。
     */
    public static createInscanceUUID: () => string = (): string => {
        return (_instanceCount++).toString();
    }

    public uuid: string = UUID.createInscanceUUID();
}
