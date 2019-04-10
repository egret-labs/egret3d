import {
    ISerializableClass,
    IUUID,
    ISerializable,
} from "./types";
import {
    serializable,
    serializeField,
} from "./Decorators";

let _hashCount = 1;
/**
 * 基础可序列化对象。
 */
@serializable
export default abstract class Serializable<T> implements ISerializable<T>, IUUID {
    public static readonly owner: ISerializableClass | null = null;
    public static readonly serializeFields: { [key: string]: string } | null = null;
    public static readonly deserializeIgnore: string[] | null = null;
    public static createUUID: () => string = (): string => {
        return (_hashCount++).toString();
    }

    public static onRegister(): boolean {
        if (this.owner === this) {
            return false;
        }

        (this.owner as ISerializableClass | null) = this;
        (this.serializeFields as { [key: string]: string } | null) = {};

        if (this.serializeFields === null) {
            (this.serializeFields as { [key: string]: string } | null) = {};
        }
        else {
            const serializeFields: { [key: string]: string } = {};

            for (const k in this.serializeFields) {
                serializeFields[k] = this.serializeFields[k];
            }

            (this.serializeFields as { [key: string]: string } | null) = serializeFields;
        }

        if (this.deserializeIgnore === null) {
            (this.deserializeIgnore as string[] | null) = [];
        }
        else {
            (this.deserializeIgnore as string[] | null) = this.deserializeIgnore.concat();
        }

        return true;
    }

    @serializeField
    public uuid: string = Serializable.createUUID();

    public serialize(): T {
        throw new Error();
    }

    public deserialize(data: T): this {
        throw new Error();
    }
}
