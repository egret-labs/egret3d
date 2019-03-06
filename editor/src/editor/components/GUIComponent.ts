namespace paper.editor {
    /**
     * 
     */
    export type QuaryValues = {
        FPS?: 0 | 1,
        GUI?: 0 | 1,
        DEBUG?: 0 | 1,
    };
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
    export class GUIComponent extends Component {

        public showStates: ShowState = ShowState.None;
        public quaryValues: QuaryValues = {};
        public readonly hierarchy: dat.GUI;
        public readonly inspector: dat.GUI;
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
        public readonly inspectorItems: { [key: string]: dat.GUI } = {};

        public initialize() {
            super.initialize();

            if (Application.playerMode !== PlayerMode.Editor) {
                (this.hierarchy as dat.GUI) = new dat.GUI({ closeOnTop: true, width: 300 });
                (this.inspector as dat.GUI) = new dat.GUI({ closeOnTop: true, width: 300 });
                (this.stats as Stats) = new Stats();
                (this.renderPanel as Stats.Panel) = this.stats.addPanel(new Stats.Panel("MS(R)", "#ff8", "#221"));
                (this.drawCallPanel as Stats.Panel) = this.stats.addPanel(new Stats.Panel("DC", "#ff8", "#221"));
                this.stats.showPanel(0);
            }
        }
    }
}
