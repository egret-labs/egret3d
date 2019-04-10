import { serializable } from "./serialize/Decorators";
import {
    IAbstractComponentClass,
    IComponentClass,
    IComponent,
} from "./types";
/**
 * 
 */
export function component({
    isAbstract = false,
    isSingleton = false,
    allowMultiple = false,
    requireComponents = null,
}: {
    isAbstract?: boolean,
    isSingleton?: boolean,
    allowMultiple?: boolean,
    requireComponents?: ReadonlyArray<IComponentClass<IComponent>> | null,
} = {}) {
    return function (componentClass: IAbstractComponentClass) {
        if (isAbstract) {
            (componentClass.isAbstract as IAbstractComponentClass) = componentClass;
        }

        if (isSingleton) {
            (componentClass.isSingleton as boolean) = true;
            (componentClass.allowMultiple as boolean) = false;
        }
        else if (allowMultiple) {
            (componentClass.allowMultiple as boolean) = true;
        }

        serializable(componentClass);

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
