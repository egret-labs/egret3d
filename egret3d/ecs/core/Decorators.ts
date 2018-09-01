namespace paper {
    /**
     * @internal
     */
    export function registerClass(baseClass: BaseClass) {
        baseClass.__onRegister();
    }
    /**
     * 通过装饰器标记序列化属性。
     */
    export function serializedField(classPrototype: any, key: string): void;
    export function serializedField(key: string): Function;
    export function serializedField(classPrototypeOrKey: any, key?: string): void | Function {
        if (key) {
            const baseClass = classPrototypeOrKey.constructor as BaseClass;
            registerClass(baseClass);
            baseClass.__serializeKeys![key] = null;
        }
        else {
            return function (classPrototype: any, key: string) {
                const baseClass = classPrototype.constructor as BaseClass;
                registerClass(baseClass);
                baseClass.__serializeKeys![key] = classPrototypeOrKey as string;
            };
        }
    }
    /**
     * 通过装饰器标记反序列化时需要忽略的属性。
     */
    export function deserializedIgnore(classPrototype: any, key: string) {
        const baseClass = classPrototype.constructor as BaseClass;
        registerClass(baseClass);

        const keys = baseClass.__deserializeIgnore!;
        if (keys.indexOf(key) < 0) {
            keys.push(key);
        }
    }
    /**
     * 通过装饰器标记组件是否允许在同一实体上添加多个实例。
     */
    export function allowMultiple(componentClass: ComponentClass<BaseComponent>) {
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
     */
    export function requireComponent(requireComponentClass: ComponentClass<BaseComponent>) {
        return function (componentClass: ComponentClass<BaseComponent>) {
            const requireComponents = componentClass.requireComponents!;
            if (requireComponents.indexOf(requireComponentClass) < 0) {
                requireComponents.push(requireComponentClass);
            }
        };
    }
    /**
     * 通过装饰器标记组件是否在编辑模式拥有生命周期。
     */
    export function executeInEditMode(componentClass: ComponentClass<Behaviour>) {
        registerClass(componentClass);
        componentClass.executeInEditMode = true;
    }
}
