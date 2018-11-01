namespace paper {
    /**
     * @internal
     */
    export function registerClass(baseClass: IBaseClass) {
        baseClass.__onRegister();
    }

    /**
     * 通过装饰器标记序列化属性。
     * @param classPrototype 类原型。
     * @param key 键值。
     */
    export function serializedField(classPrototype: any, key: string): void;
    /**
     * @param oldKey 兼容旧序列化键值。
     */
    export function serializedField(oldKey: string): Function;
    export function serializedField(classPrototypeOrOldKey: any, key?: string): void | Function {
        if (key) {
            const baseClass = classPrototypeOrOldKey.constructor as IBaseClass;
            registerClass(baseClass);
            baseClass.__serializeKeys![key] = null;
        }
        else {
            return function (classPrototype: any, key: string) {
                const baseClass = classPrototype.constructor as IBaseClass;
                registerClass(baseClass);
                baseClass.__serializeKeys![key] = classPrototypeOrOldKey as string;
            };
        }
    }

    /**
     * 通过装饰器标记反序列化时需要忽略的属性。
     * @param classPrototype 类原型。
     * @param key 键值。
     */
    export function deserializedIgnore(classPrototype: any, key: string) {
        const baseClass = classPrototype.constructor as IBaseClass;
        registerClass(baseClass);

        const keys = baseClass.__deserializeIgnore!;
        if (keys.indexOf(key) < 0) {
            keys.push(key);
        }
    }

    /**
     * 通过装饰器标记组件是否允许在同一实体上添加多个实例。
     * @param componentClass 组件类。
     */
    export function allowMultiple(componentClass: IComponentClass<BaseComponent>) {
        registerClass(componentClass);

        if (!componentClass.__isSingleton) {
            componentClass.allowMultiple = true;
        }
        else {
            console.warn("Singleton component cannot allow multiple.");
        }
    }

    /**
     * 通过装饰器标记组件依赖的其他组件。
     * @param requireComponentClass 依赖的组件类。
     */
    export function requireComponent(requireComponentClass: IComponentClass<BaseComponent>) {
        return function (componentClass: IComponentClass<BaseComponent>) {
            const requireComponents = componentClass.requireComponents!;
            if (requireComponents.indexOf(requireComponentClass) < 0) {
                requireComponents.push(requireComponentClass);
            }
        };
    }

    // executionOrder: number; TODO
    // /**
    //  * 通过装饰器标记脚本组件的生命周期优先级。（默认：0）
    //  */
    // export function executionOrder(order: number = 0) {
    //     return function (componentClass: ComponentClass<Behaviour>) {
    //         registerClass(componentClass);
    //         componentClass.executionOrder = order;
    //     }
    // }
    /**
     * 通过装饰器标记脚本组件是否在编辑模式也拥有生命周期。
     * @param componentClass 组件类。
     */
    export function executeInEditMode(componentClass: IComponentClass<Behaviour>) {
        registerClass(componentClass);
        componentClass.executeInEditMode = true;
    }

    /**
     * 通过装饰器标记 API 已被废弃。
     * @param version 废弃的版本。
     */
    export function deprecated(version: string) {
        return (target: any, key: string, descriptor: PropertyDescriptor) => {
            const method = descriptor.value as Function;
            descriptor.value = (...arg) => {
                console.warn(`${target.name}.${key}在${version}版本中已被废弃`);
                return method.apply(this, arg);
            };
        };
    }
}
namespace paper {
    /**属性信息 */
    export class PropertyInfo {
        /**属性名称 */
        public name: string;
        /**编辑类型 */
        public editType: EditType;
        /**属性配置 */
        public option: PropertyOption | undefined;
        constructor(name: string, editType: EditType, option?: PropertyOption) {
            this.name = name;
            this.editType = editType;
            this.option = option;
        }
    }
    /**属性配置 */
    export type PropertyOption = {
        readonly?: boolean;
        minimum?: number;
        maximum?: number;
        step?: number;
        /**赋值函数*/
        set?: string;
        /**下拉项*/
        listItems?: { label: string, value: any }[];
    };
    /**
     * 编辑类型
     */
    export const enum EditType {
        /**数字输入 */
        UINT = "UINT",
        INT = "INT",
        FLOAT = "FLOAT",
        /**文本输入 */
        TEXT = "TEXT",
        /**选中框 */
        CHECKBOX = "CHECKBOX",
        /** Size.*/
        SIZE = "SIZE",
        /**vertor2 */
        VECTOR2 = "VECTOR2",
        /**vertor3 */
        VECTOR3 = "VECTOR3",
        /**vertor4 */
        VECTOR4 = "VECTOR4",
        /**Quaternion */
        QUATERNION = "QUATERNION",
        /**颜色选择器 */
        COLOR = "COLOR",
        /**下拉 */
        LIST = "LIST",
        /**Rect */
        RECT = "RECT",
        /**材质 */
        MATERIAL = "MATERIAL",
        /**材质数组 */
        MATERIAL_ARRAY = "MATERIAL_ARRAY",
        /**游戏对象 */
        GAMEOBJECT = "GAMEOBJECT",
        /**变换 TODO 不需要*/
        TRANSFROM = "TRANSFROM",
        /**组件 */
        COMPONENT = "COMPONENT",
        /**声音 */
        SOUND = "SOUND",
        /**Mesh */
        MESH = "MESH",
        /**shader */
        SHADER = "SHADER",
        /**数组 */
        ARRAY = "ARRAY",
        /***/
        BUTTON = "BUTTON",
        /***/
        NESTED = "NESTED",
        /**贴图 */
        TEXTUREDESC = "TEXTUREDESC",
        /**矩阵 */
        MAT3 = "MAT3"
    }
    /**
     * 装饰器:自定义
     */
    export function custom() {
        return function (target: any) {
            target['__custom__'] = true;
        };
    }
    /**
     * 装饰器:属性
     * @param editType 编辑类型
     */
    export function property(editType?: EditType, option?: PropertyOption) {
        return function (target: any, property: string) {
            if (!target.hasOwnProperty('__props__')) {
                target['__props__'] = [];
            }
            if (editType !== undefined) {
                target['__props__'].push(new PropertyInfo(property, editType, option));
            }
            else {
                //TODO:自动分析编辑类型
            }
        };
    }

    /**
     * 从枚举中生成装饰器列表项。
     */
    export function getItemsFromEnum(enumObject: any) {
        const items = [];
        for (const k in enumObject) {
            if (!isNaN(Number(k))) {
                continue;
            }

            items.push({ label: k, value: enumObject[k] });
        }

        return items;
    }
}
