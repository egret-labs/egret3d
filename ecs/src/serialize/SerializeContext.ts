import Entity from "../ecs/Entity";
import { ISerializedData, DATA_VERSION } from "./types";
import { ObjectFactory } from "./ObjectFactory";

export { SerializeContext }

/**
 * @internal
 */
class SerializeContext {
    public serializeds: string[] = [];
    // TODO: repeat literal
    public result: Required<ISerializedData> = { version: DATA_VERSION, compatibleVersion: DATA_VERSION, assets: [], objects: [], components: [] };
    public running: boolean = false;
    public inline: boolean = false;
    public entity: Entity | null = null;

    private _defaultGameObjects: StringMap<Entity> = {};

    public getEntityTemplate(className: string) {
        let entity: Entity | null = this._defaultGameObjects[className]
        if (!entity) {
            entity = ObjectFactory.instance().createEntityTemplate(className);
            if (!entity) { return null; }
            this._defaultGameObjects[className] = entity;
        }
        return entity;
    }

    public reset() {
        this.running = false;
        this.result = { version: DATA_VERSION, compatibleVersion: DATA_VERSION, assets: [], objects: [], components: [] };
        this.serializeds.length = 0;
        this.entity = null;

        for (const k of Object.keys(this._defaultGameObjects)) {
            const entity = this._defaultGameObjects[k];
            if (entity) { entity.destroy(); }
        }
        this._defaultGameObjects = {};
    }
}