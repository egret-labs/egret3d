import { ISerializedObject, IUUID } from "../types";
import { Deserializer } from "../Deserializer";
import { DeserializeContext } from "../DeserializeContext";

export { ComponentTransform };

// TODO:
type BaseTransform = any;

const KEY_CHILDREN = "children";
const ComponentTransform = {
    name: 'egret3d.Transform',
    deserialize: (componentSource: ISerializedObject, context: DeserializeContext) => {
        const componentTarget = context.components[componentSource.uuid] as BaseTransform;

        if (KEY_CHILDREN in componentSource) { // Link transform children.
            for (const childUUID of componentSource[KEY_CHILDREN] as IUUID[]) {
                const child = context.components[childUUID.uuid] as BaseTransform | null;

                if (child && child.parent !== componentTarget) {
                    (componentTarget as BaseTransform)._addChild(child);
                }
            }
        }
        return componentTarget;
    }
}

Deserializer.componentHandlers[ComponentTransform.name] = ComponentTransform;