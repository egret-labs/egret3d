namespace paper {
    /**
     * @internal
     */
    export class GroupComponent<T extends paper.BaseComponent> extends paper.BaseComponent {
        public componentIndex: number = -1;
        public componentClass: { new(): T } = null as any;

        private readonly _components: T[] = [];
        /**
         * @internal
         */
        public _addComponent(component: T) {
            this._components.push(component);
        }
        /**
         * @internal
         */
        public _removeComponent(component: T) {
            const index = this._components.indexOf(component);


            if (index >= 0) {
                this._components.splice(1, 0);
            }
        }

        public get components(): ReadonlyArray<T> {
            return this._components;
        }
    }
}
