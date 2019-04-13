import { Entity } from "../ecs/Entity";
import { Component } from "../ecs/Component";
import { ISerializedData } from "./types";
import { Serializer } from "./Serializer";
import { Deserializer } from "./Deserializer";
import { Context } from "../ecs/Context";

export { clone, deserialize, serialize };

const serializer = new Serializer();
const deserializer = new Deserializer();

function serialize(source: Entity | Component, config?: StringMap<any>): ISerializedData {
    return serializer.serialize(source, config);
}

function deserialize(
    data: ISerializedData,
    config: StringMap<any> | null = null, // keepUUID: boolean = false, makeLink: boolean = false,
    context: Context<Entity> | null = null,
    rootTarget: Entity | null = null, // 考虑只传一个 component 的情况
): Entity | Component | null {
    return deserializer.deserialize(data, config, context, rootTarget);
}

function clone(object: Entity | Component) {
    const data = serializer.serialize(object);
    return deserializer.deserialize(data);
}