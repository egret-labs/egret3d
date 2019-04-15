import { component, Component } from "../../ecs";
import { serializedField } from "../../serialize";
import { NodeNames } from "../types";
import { Node } from "./Node";
/**
 * 场景组件。
 */
@component()
export class Scene extends Component {
    /**
     * 该场景的名称。
     */
    @serializedField
    public name: string = NodeNames.Noname;
    /**
     * @override
     * @internal
     */
    public uninitialize(): void {
        super.uninitialize();

        this.name = NodeNames.Noname;
    }
    /**
     * 该场景的根节点。
     */
    public get root(): Node {
        return this.entity.getComponent(Node)!;
    }

    /**
     * @deprecated
     */
    public getRootGameObjects() {
        return this.root.children;
    }
}
