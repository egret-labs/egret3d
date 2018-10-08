type int = number;
type uint = number;

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
    export interface ICCS<T extends ICCS<T>> {
        /**
         * 克隆。
         */
        clone(): T;
        /**
         * 拷贝。
         */
        copy(value: Readonly<T>): T;
        /**
         * 设置。
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
     * 序列化接口。
     */
    export interface ISerializable {
        /**
         * 序列化。
         */
        serialize(): any;
        /**
         * 反序列化。
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
    /**
     * 
     */
    export abstract class BaseRelease<T extends BaseRelease<T>> {
        protected _released?: boolean;
        /**
         * 在本帧末尾释放。
         */
        public release() {
            if (!this._released) {
                paper.DisposeCollecter._releases.push(this);
                this._released = true;
            }

            return this;
        }
    }
}
