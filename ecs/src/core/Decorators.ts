import { uuid } from "../uuid/Decorators";
import { IAbstractComponentClass, IComponentClass, IComponent } from "./types";
/**
 * 
 */
export function component({
    isAbstract = false,
    allowMultiple = false,
    requireComponents = null,
}: {
    isAbstract?: boolean,
    allowMultiple?: boolean,
    requireComponents?: ReadonlyArray<IComponentClass<IComponent>> | null,
} = {}) {
    return function (componentClass: IAbstractComponentClass) {
        if (isAbstract) {
            (componentClass.isAbstract as IAbstractComponentClass) = componentClass;
        }

        if (allowMultiple) {
            (componentClass.allowMultiple as boolean) = true;
        }

        uuid(componentClass);

        if (requireComponents !== null) {
            const components = componentClass.requireComponents as IComponentClass<IComponent>[];

            for (const requireComponent of requireComponents) {
                if (components.indexOf(requireComponent) < 0) {
                    components.push(requireComponent);
                }
            }
        }
    };
}
