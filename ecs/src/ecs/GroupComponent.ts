import { component } from "./Decorators";
import { Component } from "./Component";
/**
 * @ignore
 */
@component({ tag: "internal" })
export class GroupComponent extends Component {
    public componentIndex: int = -1;
    public readonly components: Component[] = [];

    public uninitialize(): void {
        super.uninitialize();

        this.componentIndex = -1;
        this.components.length = 0;
    }

    public addComponent(component: Component): boolean {
        const { components } = this;
        if (components.indexOf(component) < 0) {
            this.components.push(component);

            return true;
        }
        else if (DEBUG) {
            console.error("The component has been added to the group.");
        }

        return false;
    }

    public removeComponent(component: Component): boolean {
        const index = this.components.indexOf(component);

        if (index >= 0) {
            this.components.splice(index, 1);

            return true;
        }
        else if (DEBUG) {
            console.error("The component has been removed from the group.");
        }

        return false;
    }
}
