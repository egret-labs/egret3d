import Entity from "../ecs/Entity";
import Component from "../ecs/Component";
import { SerializeUtil } from "./SerializeUtil";

/**
 * @internal
 */
class ObjectFactory implements ObjectFactory {
    public createEntityTemplate(className: string): Entity | null {
        return null;
    }
    public createComponentTemplate(entityClassName: string, componentClassName: string): Component | null {
        return null;
    }
    public createEntity(className: string): Entity | null {
        return null;
    }
}

SerializeUtil.factory = new ObjectFactory();