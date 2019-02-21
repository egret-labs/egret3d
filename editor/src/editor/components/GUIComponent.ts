namespace paper.editor {
    /**
     * 
     */
    @singleton
    export class GUIComponent extends BaseComponent {
        public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly stats: Stats = new Stats();
        public readonly renderPanel: Stats.Panel = this.stats.addPanel(new Stats.Panel("MS(R)", "#ff8", "#221"));
        /**
         * @internal
         */
        public readonly hierarchyItems: { [key: string]: dat.GUI } = {};
        /**
         * @internal
         */
        public readonly inspectorItems: { [key: string]: dat.GUI } = {};

        public initialize() {
            super.initialize();

            this.stats.showPanel(0);
        }

        public openComponents(...args: IComponentClass<BaseComponent>[]) {
            const modelComponent = this.gameObject.getComponent(ModelComponent)!;
            const selectedGameObject = modelComponent.selectedGameObject;
            if (!selectedGameObject) {
                return;
            }

            for (const k in this.inspectorItems) {
                this.inspectorItems[k].close();
            }

            for (const componentClass of args) {
                const component = selectedGameObject.getComponent(componentClass);
                if (component && component.uuid in this.inspectorItems) {
                    this.inspectorItems[component.uuid].open();
                }
            }
        }
    }
}