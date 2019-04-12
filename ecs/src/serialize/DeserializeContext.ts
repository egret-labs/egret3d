import Component from "../core/Component";
import Entity from "../core/Entity";
import Context from "../core/Context";

export { DeserializeContext }
class DeserializeContext {
    public keepUUID: boolean = false;
    public rootTarget: Entity | null = null;

    public readonly assets: string[] = [];
    public readonly entities: StringMap<Entity> = {};
    public readonly components: StringMap<Component> = {};
    public context: Context<Entity> | null = null;
}