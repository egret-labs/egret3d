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
    export class GUIComponent extends BaseComponent {

        public showStates: ShowState = ShowState.None;
        public quaryValues: QuaryValues = {};
        public readonly hierarchy: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly inspector: dat.GUI = new dat.GUI({ closeOnTop: true, width: 300 });
        public readonly stats: Stats = new Stats();
        public readonly renderPanel: Stats.Panel = this.stats.addPanel(new Stats.Panel("MS(R)", "#ff8", "#221"));
        public readonly drawCallPanel: Stats.Panel = this.stats.addPanel(new Stats.Panel("DC", "#ff8", "#221"));
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
    }
}
