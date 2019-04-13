import { ISerializedObject, IUUID } from "../../serialize/types";
import Node from "../../egret/components/Node";
import { Deserializer } from "../../serialize/Deserializer";
import { DeserializeContext } from "../../serialize/DeserializeContext";

export { ComponentTransform };

const KEY_CHILDREN = "children";
const ComponentTransform = {
    name: 'egret3d.Node', // TODO:
    deserialize: (componentSource: ISerializedObject, context: DeserializeContext) => {
        const componentTarget = context.components[componentSource.uuid] as Node;

        if (KEY_CHILDREN in componentSource) { // Link transform children.
            for (const childUUID of componentSource[KEY_CHILDREN] as IUUID[]) {
                const child = context.components[childUUID.uuid] as Node | null;

                if (child && child.parent !== componentTarget) {
                    (componentTarget as Node).addChild(child);
                }
            }
        }
        return componentTarget;
    }
}

Deserializer.componentHandlers[ComponentTransform.name] = ComponentTransform;