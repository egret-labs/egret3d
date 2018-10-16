type int = number;
type uint = number;

namespace paper {
    /**
     * 
     */
    export type GameObjectExtras = { linkedID?: string, rootID?: string, prefab?: Prefab };
    /**
     * 
     */
    export type ComponentExtras = { linkedID?: string };
    /**
     * @private
     */
    export interface IUUID {
        /**
         * 对象的唯一标识。
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
         * @returns 序列化后的数据。
         */
        serialize(): any;
        /**
         * 反序列化。
         * @param data 反序列化数据。
         * @param deserializer Deserializer。
         * @returns 反序列化后的数据。
         */
        deserialize(data: any, deserializer?: Deserializer): any;
    }
    /**
     * 基础对象类接口。
     * - 仅用于约束基础对象的装饰器。
     */
    export interface IBaseClass extends Function {
        /**
         * @internal
         */
        __isBase?: boolean;
        /**
         * @internal
         */
        __owner?: IBaseClass;
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
        readonly __onRegister: () => boolean;
    }
    /**
     * 组件类接口。
     * - 仅用于约束组件类传递。
     */
    export interface IComponentClass<T extends BaseComponent> extends IBaseClass {
        /**
         * 该组件的实例是否在编辑模式拥有生命周期。
         * @internal
         */
        executeInEditMode: boolean;
        /**
         * 是否允许在同一实体上添加多个该组件的实例。
         * @internal
         */
        allowMultiple: boolean;
        /**
         * 该组件实例依赖的其他前置组件。
         * @internal
         */
        requireComponents: IComponentClass<BaseComponent>[] | null;
        /**
         * 当该组件被激活时派发事件。
         * @internal
         */
        onComponentEnabled: signals.Signal;
        /**
         * 当该组件实例被禁用时派发事件。
         * @internal
         */
        onComponentDisabled: signals.Signal;
        /**
         * 该组件实例是否为单例组件。
         * @internal
         */
        readonly __isSingleton: boolean;
        /**
         * 该组件实例索引。
         * @internal
         */
        __index: number;
        /**
         * @protected
         */
        new(): T;
    }
}
