import { Component } from "../ecs/Component";
import { Entity } from "../ecs/Entity";
import { Context } from "../ecs/Context";

export { DeserializeContext };
class DeserializeContext {
    public keepUUID: boolean = false;
    public rootTarget: Entity | null = null;

    public readonly assets: string[] = [];
    public readonly entities: StringMap<Entity> = {};
    public readonly components: StringMap<Component> = {};
    public context: Context<Entity> | null = null;
}