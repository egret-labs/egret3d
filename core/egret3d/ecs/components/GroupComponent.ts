namespace paper {
    /**
     * @internal
     */
    export class GroupComponent extends Component {
        public readonly componentIndex: uint;
        public readonly components: IComponent[] = [];

        public initialize(componentIndex: uint): void {
            super.initialize();

            (this.componentIndex as uint) = componentIndex;
        }

        public addComponent(component: IComponent): this {
            this.components.push(component);

            return this;
        }

        public removeComponent(component: IComponent): boolean {
            const index = this.components.indexOf(component);

            if (index >= 0) {
                this.components.splice(index, 1);

                return true;
            }

            return false;
        }
    }
}
