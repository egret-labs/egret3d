import { uuid } from "../uuid/Decorators";
import { IEntityClass, IAbstractComponentClass, IComponentClass, IEntity, IComponent } from "./types";

let _componentClassCount = 0;
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
    tag = "",
    requireComponents = null,
    extensions = null,
}: {
    isAbstract?: boolean,
    allowMultiple?: boolean,
    tag?: string,
    requireComponents?: ReadonlyArray<IComponentClass<IComponent>> | null,
    extensions?: { [key: string]: any } | null,
} = {}) {
    return function (componentClass: IAbstractComponentClass) {
        if (componentClass.registered === componentClass) {
            return;
        }

        uuid(componentClass);

        (componentClass.allowMultiple as boolean) = allowMultiple;

        if (isAbstract) {
            (componentClass.isAbstract as IAbstractComponentClass | null) = componentClass;
        }
        else {
            (componentClass.isAbstract as IAbstractComponentClass | null) = null;
            (componentClass.componentIndex as int) = _componentClassCount++;
        }

        (componentClass.tag as string) = tag;

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
