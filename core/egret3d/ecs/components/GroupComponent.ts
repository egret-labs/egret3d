namespace paper {
    /**
     * @internal
     */
    export class GroupComponent extends paper.BaseComponent {
        public componentIndex: int = -1;
        public componentClass: IComponentClass<BaseComponent> = null!;
        public readonly components: BaseComponent[] = [];

        public addComponent(component: BaseComponent) {
            this.components.push(component);
        }

        public removeComponent(component: BaseComponent) {
            const index = this.components.indexOf(component);
            if (index >= 0) {
                this.components.splice(1, 0);
            }
        }
    }
}
