namespace paper {
    /**
     * @internal
     */
    export class GroupComponent extends Component {
        public readonly componentIndex: int = -1;
        public readonly components: IComponent[] = [];

        public initialize(componentIndex: int) {
            super.initialize();

            (this.componentIndex as int) = componentIndex;
        }

        public uninitialize() {
            (this.componentIndex as int) = -1;
            this.components.length = 0;
            (this.entity as IEntity) = null!;

            this._lifeStates = ComponentLifeState.None;
        }

        public addComponent(component: IComponent): void {
            this.components.push(component);
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
