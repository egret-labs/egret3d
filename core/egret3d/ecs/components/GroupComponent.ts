namespace paper {
    /**
     * @internal
     */
    export class GroupComponent extends paper.BaseComponent {
        public componentIndex: int = -1;
        public componentClass: IComponentClass<IComponent> = null!;
        public readonly components: IComponent[] = [];

        public addComponent(component: IComponent) {
            this.components.push(component);
        }

        public removeComponent(component: IComponent) {
            const index = this.components.indexOf(component);

            if (index >= 0) {
                this.components.splice(index, 1);
            }
        }
    }
}
