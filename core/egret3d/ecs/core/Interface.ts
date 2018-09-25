// type int = number;
// type uint = number;

namespace paper {
    /**
     * @private
     */
    export interface IUUID {
        /**
         * 唯一标识。
         * @readonly
         */
        readonly uuid: string;
    }
    /**
     * 
     */
    export interface IAssetReference {
        /**
         * 
         */
        readonly asset: number;
    }
    /**
     * 
     */
    export interface IClass {
        /**
         * 
         */
        readonly class: string;
    }
    /**
     * 
     */
    export interface IRelease<T extends IRelease<T>> {
        /**
         * 
         */
        release(): T;
        /**
         * 
         */
        clone(): T;
        /**
         * 
         */
        copy(value: Readonly<T>): T;
        /**
         * 
         */
        set(...args: any[]): T;
    }
    /**
     * 
     */
    export interface ISerializedObject extends IUUID, IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 
     */
    export interface ISerializedStruct extends IClass {
        [key: string]: any | IUUID | IAssetReference;
    }
    /**
     * 序列化数据接口。
     */
    export interface ISerializedData {
        /**
         * 
         */
        version?: number;
        /**
         * 
         */
        compatibleVersion?: number;
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
    /**
     * 自定义序列化接口。
     */
    export interface ISerializable {
        /**
         * 
         */
        serialize(): any;
        /**
         * 
         */
        deserialize(element: any, data?: Deserializer): any;
    }
    /**
     * 
     */
    export interface BaseClass extends Function {
        /**
         * @internal
         */
        __deserializeIgnore?: string[];
        /**
         * @internal
         */
        __serializeKeys?: { [key: string]: string | null };
        /**
         * @internal
         */
        __owner?: BaseClass;
        /**
         * @internal
         */
        readonly __onRegister: () => boolean;
    }
    /**
     * 
     */
    export type GameObjectExtras = { linkedID?: string, rootID?: string, prefab?: Prefab };
    /**
     * 
     */
    export interface ComponentClass<T extends BaseComponent> extends BaseClass {
        executeInEditMode: boolean;
        allowMultiple: boolean;
        requireComponents: ComponentClass<BaseComponent>[] | null;
        /**
         * @internal
         */
        readonly __isSingleton: boolean;
        /**
         * @internal
         */
        __index: number;

        new(): T;
    }
    /**
     * 
     */
    export type ComponentClassArray = (ComponentClass<BaseComponent> | undefined)[];
    /**
     * 
     */
    export type ComponentArray = (BaseComponent | undefined)[];
    /**
     * 
     */
    export type ComponentExtras = { linkedID?: string };
}
