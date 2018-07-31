namespace paper {
    /**
     * @internal
     */
    export class GroupComponent extends paper.BaseComponent {
        public componentIndex: number = -1;
        public componentClass: ComponentClass<BaseComponent> = null as any;

        private readonly _components: BaseComponent[] = [];
        /**
         * @internal
         */
        public _addComponent(component: BaseComponent) {
            this._components.push(component);
        }
        /**
         * @internal
         */
        public _removeComponent(component: BaseComponent) {
            const index = this._components.indexOf(component);
            if (index >= 0) {
                this._components.splice(1, 0);
            }
        }

        public get components(): ReadonlyArray<BaseComponent> {
            return this._components;
        }
    }
}
