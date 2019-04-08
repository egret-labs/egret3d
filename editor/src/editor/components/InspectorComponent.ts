namespace paper.editor {
    /**
     * 
     */
    export const enum ShowState {
        None = 0b000,

        FPS = 0b001,
        Hierarchy = 0b010,
        Inspector = 0b100,

        HierarchyAndInspector = Hierarchy | Inspector,
        All = FPS | Hierarchy | Inspector,
    }
    /**
     * 
     */
    @singleton
    export class InspectorComponent extends Component {

        public showStates: ShowState = ShowState.None;
        public readonly hierarchy: dat.GUI;
        public readonly property: dat.GUI;
        public readonly stats: Stats;
        public readonly renderPanel: Stats.Panel;
        public readonly drawCallPanel: Stats.Panel;
        /**
         * @internal
         */
        public readonly hierarchyItems: { [key: string]: dat.GUI } = {};
        /**
         * @internal
         */
        public readonly propertyItems: { [key: string]: dat.GUI } = {};

        public initialize() {
            super.initialize();

            if ((Application.playerMode & PlayerMode.Editor) === 0) {
                (this.hierarchy as dat.GUI) = new dat.GUI({ closeOnTop: true, width: 300 });
                (this.property as dat.GUI) = new dat.GUI({ closeOnTop: true, width: 300 });
                (this.stats as Stats) = new Stats();
                (this.renderPanel as Stats.Panel) = this.stats.addPanel(new Stats.Panel("MS(R)", "#ff8", "#221"));
                (this.drawCallPanel as Stats.Panel) = this.stats.addPanel(new Stats.Panel("DC", "#ff8", "#221"));
                this.stats.showPanel(0);
            }
        }
    }
}
