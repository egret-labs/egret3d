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
