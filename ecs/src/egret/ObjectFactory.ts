import { Entity } from "../ecs/index";
import { SerializeUtil } from "../serialize/SerializeUtil";
import { Application } from "./Application";

/**
 * @internal
 */
class ObjectFactory implements ObjectFactory {
    public createEntity(className: string): Entity | null {
        const classObject = egret.getDefinitionByName(className);
        if (!classObject) { return null; }

        const context = Application.current.systemManager!.getContext(classObject);
        if (!context) { return null; }

        return context.createEntity();
    }
}

SerializeUtil.factory = new ObjectFactory();