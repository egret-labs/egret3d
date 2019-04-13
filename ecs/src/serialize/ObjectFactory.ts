import { Entity } from "../ecs/Entity";
import { Component } from "../ecs/Component";
import { SerializeUtil } from "./SerializeUtil";

/**
 * @internal
 */
class ObjectFactory implements ObjectFactory {
    public createEntityTemplate(_className: string): Entity | null {
        return null;
    }
    public createComponentTemplate(_entityClassName: string, _componentClassName: string): Component | null {
        return null;
    }
    public createEntity(_className: string): Entity | null {
        return null;
    }
}

SerializeUtil.factory = new ObjectFactory();