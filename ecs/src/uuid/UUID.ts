import {
    IUUIDClass,
    IUUID,
} from "./types";
import {
    uuid,
} from "./Decorators";

let _classCount: uint = 0;
let _instanceCount: uint = 0;
/**
 * 
 */
export let createClassUUID: () => string = (): string => {
    return (_classCount++).toString();
};
/**
 * 
 */
export let createInscanceUUID: () => string = (): string => {
    return (_instanceCount++).toString();
};
/**
 * 
 */
@uuid
export default abstract class UUID implements IUUID {
    public static readonly uuid: string = "";
    public static readonly registered: IUUIDClass | null = null;

    public static register(): boolean {
        if (this.registered === this) {
            return false;
        }

        (this.uuid as string) = createClassUUID();
        (this.registered as IUUIDClass | null) = this;

        return true;
    }

    public uuid: string = createInscanceUUID();
}
