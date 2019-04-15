import { uuid } from "../basic";
import { IEntityClass, IAbstractComponentClass, IComponentClass, IEntity, IComponent } from "./types";

let _componentClassCount = 0;
const _componentIndices: { [key: string]: uint } = {};
/**
 * 实体装饰器。
 */
export function entity({
    requireComponents = null,
    extensions = null,
}: {
    requireComponents?: ReadonlyArray<IComponentClass<IComponent>> | null,
    extensions?: { [key: string]: any } | null,
} = {}) {
    return function (entityClass: IEntityClass<IEntity>) {
        if (entityClass.registered === entityClass) {
            return;
        }

        uuid(entityClass);

        if (requireComponents !== null) {
            if (entityClass.requireComponents !== null) { // Inherited parent class require components.
                (entityClass.requireComponents as IComponentClass<IComponent>[] | null) = entityClass.requireComponents.concat();
            }
            else {
                (entityClass.requireComponents as IComponentClass<IComponent>[] | null) = [];
            }

            const components = entityClass.requireComponents as IComponentClass<IComponent>[];

            for (const requireComponent of requireComponents) {
                if (components.indexOf(requireComponent) < 0) {
                    components.push(requireComponent);
                }
            }
        }

        (entityClass.extensions as { [key: string]: any } | null) = extensions;
    };
}
/**
 * 组件装饰器。
 */
export function component({
    isAbstract = false,
    allowMultiple = false,
    type = "",
    tag = "",
    requireComponents = null,
    extensions = null,
}: {
    isAbstract?: boolean,
    allowMultiple?: boolean,
    type?: string,
    tag?: string,
    requireComponents?: ReadonlyArray<IComponentClass<IComponent>> | null,
    extensions?: { [key: string]: any } | null,
} = {}) {
    return function (componentClass: IAbstractComponentClass<IComponent>) {
        if (componentClass.registered === componentClass) {
            return;
        }

        uuid(componentClass);

        (componentClass.allowMultiple as boolean) = allowMultiple;

        if (isAbstract) {
            (componentClass.isAbstract as IAbstractComponentClass<IComponent> | null) = componentClass;
        }
        else {
            (componentClass.isAbstract as IAbstractComponentClass<IComponent> | null) = null;
        }

        if (type !== "") {
            (componentClass.componentType as string) = type;

            if (type in _componentIndices) {
                (componentClass.componentIndex as int) = _componentIndices[type];
            }
            else {
                (componentClass.componentIndex as int) = _componentIndices[type] = _componentClassCount++;
            }
        }
        else if (!isAbstract) {
            (componentClass.componentIndex as int) = _componentClassCount++;
        }

        (componentClass.componentTag as string) = tag;

        if (requireComponents !== null) {
            if (componentClass.requireComponents !== null) { // Inherited parent class require components.
                (componentClass.requireComponents as IComponentClass<IComponent>[] | null) = componentClass.requireComponents.concat();
            }
            else {
                (componentClass.requireComponents as IComponentClass<IComponent>[] | null) = [];
            }

            const components = componentClass.requireComponents as IComponentClass<IComponent>[];

            for (const requireComponent of requireComponents) {
                if (components.indexOf(requireComponent) < 0) {
                    components.push(requireComponent);
                }
            }
        }

        (componentClass.extensions as { [key: string]: any } | null) = extensions;
    };
}
