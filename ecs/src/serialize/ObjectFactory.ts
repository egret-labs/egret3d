import Entity from "../core/Entity";
import Component from "../core/Component";

export { ObjectFactory };

class ObjectFactory {
    public static instance() {
        this._instance = this._instance || new ObjectFactory();
        return this._instance;
    }
    private static _instance: ObjectFactory | null = null;

    // singleton
    private constructor() {}

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